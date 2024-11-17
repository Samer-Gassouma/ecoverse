'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import Map from '@/components/Map'

interface AddEventModalProps {
  onEventAdded: () => void
}

export default function AddEventModal({ onEventAdded }: AddEventModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    coordinates: [10.1815, 36.8065] as [number, number]
  })

  const handleLocationSelect = (coordinates: [number, number]) => {
    setFormData(prev => ({ ...prev, coordinates }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to create an event')
      return
    }

    setLoading(true)
    setError(null)

    const dateTime = new Date(`${formData.date}T${formData.time}`)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          date: dateTime.toISOString(),
          location: formData.location,
          coordinates: formData.coordinates,
          creatorId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      setIsOpen(false)
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        coordinates: [10.1815, 36.8065]
      })
      onEventAdded()
    } catch (err) {
      setError('Failed to create event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full shadow-lg">
          <Plus className="mr-2" size={16} />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Event Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Location Name"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div className="h-[200px] rounded-md overflow-hidden">
            <Map
              initialCoordinates={formData.coordinates}
              zoom={8}
              markers={[{
                coordinates: formData.coordinates,
                color: '#2563eb'
              }]}
              onLocationSelect={handleLocationSelect}
              className="w-full h-full"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Event'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 