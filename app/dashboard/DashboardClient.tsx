'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Clock, Menu, X } from 'lucide-react'
import Map from '@/components/Map'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import AddEventModal from './components/AddEventModal'

interface Event {
  id: number
  name: string
  description: string
  date: Date
  location: string
  participants: number
  coordinates: number[]
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function CountdownDisplay({ date }: { date: Date }) {
  const timeLeft = useCountdown(date);

  if (timeLeft.isExpired) {
    return <span className="text-red-500">Event Ended</span>;
  }

  return (
    <div className="flex items-center text-sm">
      <Clock className="mr-2" size={16} />
      <span>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
}

export default function DashboardClient({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [userEventHistory, setUserEventHistory] = useState<{[key: number]: boolean}>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    async function fetchUserEventHistory() {
      if (!user) return;

      try {
        const response = await fetch(`/api/user-events?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch user events');
        const data = await response.json();
        const historyMap = data.events.reduce((acc: {[key: number]: boolean}, eventId: number) => {
          acc[eventId] = true;
          return acc;
        }, {});
        setUserEventHistory(historyMap);
      } catch (error) {
        console.error('Error fetching user event history:', error);
      }
    }

    fetchUserEventHistory();
  }, [user]);

  const markers = selectedEvent ? [{
    coordinates: selectedEvent.coordinates as [number, number],
    color: '#2563eb',
    popup: `
      <div class="p-2">
        <h3 class="font-bold">${selectedEvent.name}</h3>
        <p>${selectedEvent.location}</p>
        <p>${selectedEvent.date.toLocaleString()}</p>
      </div>
    `
  }] : []

  const handleLocationSelect = (coordinates: [number, number]) => {
    console.log('Selected coordinates:', coordinates)
  }

  const handleEventSelect = (event: Event) => {
    const isExpired = new Date(event.date) <= new Date();
    if (!isExpired) {
      setSelectedEvent(event);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  }

  const isEventExpired = (date: Date) => {
    return new Date(date) <= new Date();
  }

  const [loadingJoin, setLoadingJoin] = useState(false)
  const handleJoinEvent = async (event: Event) => {
    if (!user) {
      return;
    }

    setLoadingJoin(true)
    setAuthError(null)
    
    try {
      const response = await fetch('/api/join-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, eventId: event.id }),
      });

      if (!response.ok) throw new Error('Failed to join event');

      setUserEventHistory(prev => ({
        ...prev,
        [event.id]: true
      }))
      
      router.push(`/dashboard/events/${event.id}`)
    } catch (error) {
      console.error('Error joining event:', error)
      setAuthError('Failed to join event. Please try again.')
    } finally {
      setLoadingJoin(false)
    }
  }

  const handleEventAdded = async () => {
    // Refresh the events list
    try {
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error refreshing events:', error)
    }
  }

  return (
    <div className="relative flex flex-col md:flex-row h-screen">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside 
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300
          fixed md:relative
          w-full md:w-1/3 lg:w-1/4
          h-screen
          bg-white
          p-4
          overflow-y-auto
          z-40
          md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold mb-4 mt-12 md:mt-0">Events in Tunisia</h2>
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((event) => {
            const expired = isEventExpired(new Date(event.date));
            return (
              <Card 
                key={event.id} 
                className={`mb-4 cursor-pointer transition-colors ${
                  expired ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'
                } ${
                  selectedEvent?.id === event.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => !expired && handleEventSelect(event)}
              >
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center">
                    <Calendar className="mr-2" size={16} /> 
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <Users className="mr-2" size={16} /> 
                    {event.participants} participants
                  </p>
                  <CountdownDisplay date={new Date(event.date)} />
                </CardContent>
              </Card>
            );
          })
        )}
      </aside>

      <main className="flex-1 relative h-screen">
        <Map
          initialCoordinates={selectedEvent?.coordinates as [number, number] || [10.1815, 36.8065]}
          zoom={selectedEvent ? 13 : 8}
          markers={markers}
          onLocationSelect={handleLocationSelect}
          className="w-full h-full"
        />
        {selectedEvent && !isEventExpired(new Date(selectedEvent.date)) && (
          <div className="absolute top-4 right-4 left-4 md:left-auto bg-white p-4 rounded-lg shadow-lg md:max-w-sm mx-auto md:mx-0">
            <h3 className="text-xl font-bold mb-2">{selectedEvent.name}</h3>
            <p className="mb-2">{selectedEvent.description}</p>
            <p className="flex items-center mb-1"><Calendar className="mr-2" size={16} /> {new Date(selectedEvent.date).toLocaleString()}</p>
            <p className="flex items-center mb-1"><MapPin className="mr-2" size={16} /> {selectedEvent.location}</p>
            <p className="flex items-center mb-2"><Users className="mr-2" size={16} /> {selectedEvent.participants} participants</p>
            <CountdownDisplay date={new Date(selectedEvent.date)} />
            {authError && (
              <p className="text-red-500 text-sm mb-2">{authError}</p>
            )}
            <Button 
              className={`w-full mt-4 ${
                userEventHistory[selectedEvent.id] 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={() => handleJoinEvent(selectedEvent)}
              disabled={loadingJoin || !!authError}
            >
              {loadingJoin 
                ? 'Loading...' 
                : userEventHistory[selectedEvent.id]
                  ? 'Open Event'
                  : 'Join Event'
              }
            </Button>
          </div>
        )}
      </main>
      <AddEventModal onEventAdded={handleEventAdded} />
    </div>
  )
}