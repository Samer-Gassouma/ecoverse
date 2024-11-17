'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { mockEvents, mockLeaderboard, mockCurrentUser } from '@/app/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Upload, Trophy, ArrowLeft, Camera, Image, Check, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Participant {
  id: string
  email: string
  coins: number
}

interface EventDetails {
  id: number
  name: string
  description: string
  date: Date
  location: string
  participants: number
  coinsReward: number
}

type SubmissionStatus = 'idle' | 'uploading' | 'processing' | 'accepted' | 'rejected'

interface SubmissionResult {
  status: 'accepted' | 'rejected'
  earnings?: number
  message: string
}

export default function EventPage() {
  const params = useParams()
  const [eventData, setEventData] = useState<EventDetails | null>(null)
  const [leaderboard, setLeaderboard] = useState<Participant[]>([])
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
  const [workDescription, setWorkDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    const fetchEventAndLeaderboard = async () => {
      try {
        // Use mock data instead of prisma calls
        const eventData = mockEvents.find(event => event.id === parseInt(params.id as string))
        setEventData(eventData as EventDetails)
        setLeaderboard(mockLeaderboard)
        setCurrentUser({ id: mockCurrentUser.id })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchEventAndLeaderboard()
  }, [params.id])

  const updateUserCoins = async (coinsToAdd: number) => {
    if (!currentUser) return
    try {
      // Simulate updating user coins
      const updatedLeaderboard = [...mockLeaderboard]
      const userIndex = updatedLeaderboard.findIndex(user => user.id === currentUser.id)
      
      if (userIndex !== -1) {
        updatedLeaderboard[userIndex].coins += coinsToAdd
        updatedLeaderboard.sort((a, b) => b.coins - a.coins)
        setLeaderboard(updatedLeaderboard)
      }
    } catch (error) {
      console.error('Error updating coins:', error)
      throw error
    }
  }

  const handleCapture = async (type: 'camera' | 'gallery') => {
    try {
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*,video/*'
      
      if (type === 'camera') {
        input.capture = 'environment'
      }
      
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement
        if (target.files) {
          setFile(target.files[0])
          setSubmissionStatus('idle')
          setSubmissionResult(null)
        }
      }
      
      input.click()
    } catch (error) {
      console.error('Error accessing camera/gallery:', error)
    }
  }

  const simulateUpload = () => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })
  }

  const simulateProcessing = async () => {
    try {
      const isAccepted = true // Math.random() > 0.3
      const earnings = isAccepted ? eventData?.coinsReward || 10 : 0
      
      await updateUserCoins(earnings)
      
      return {
        status: isAccepted ? 'accepted' : 'rejected',
        earnings,
        message: isAccepted 
          ? 'Great work! Your submission has been verified.'
          : 'Unfortunately, your submission did not meet our criteria.'
      }
    } catch (error) {
      console.error('Processing error:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setSubmissionStatus('uploading')
      await simulateUpload()

      setSubmissionStatus('processing')
      const result = await simulateProcessing()
      
      setSubmissionStatus(result.status as SubmissionStatus)
      setSubmissionResult(result as SubmissionResult)

    } catch (error) {
      console.error('Error submitting work:', error)
      setSubmissionStatus('rejected')
      setSubmissionResult({
        status: 'rejected',
        message: 'An error occurred while submitting your work.'
      })
    }
  }

  const renderSubmissionStatus = () => {
    if (submissionStatus === 'uploading') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )
    }

    if (submissionStatus === 'processing') {
      return (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verifying submission...</span>
        </div>
      )
    }

    if (submissionResult) {
      return (
        <Alert className={submissionResult.status === 'accepted' ? 'border-green-500' : 'border-red-500'}>
          {submissionResult.status === 'accepted' ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
          <AlertTitle>
            {submissionResult.status === 'accepted' ? 'Submission Accepted!' : 'Submission Rejected'}
          </AlertTitle>
          <AlertDescription>
            {submissionResult.message}
            {submissionResult.earnings && (
              <div className="mt-2 font-semibold text-green-600">
                You earned {submissionResult.earnings} points!
              </div>
            )}
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Link>

      {eventData && (
        <Card className="relative overflow-hidden border-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <CardHeader className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{eventData.name}</CardTitle>
                <CardDescription className="text-gray-100 text-base md:text-lg">{eventData.description}</CardDescription>
              </div>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 w-full md:w-auto">
                Join Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-6 mt-4">
              <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base">
                <Calendar className="mr-2 h-4 w-4 md:h-[18px] md:w-[18px]" />
                {new Date(eventData.date).toLocaleDateString('ar-TN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base">
                <MapPin className="mr-2 h-4 w-4 md:h-[18px] md:w-[18px]" />
                {eventData.location}
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base">
                <Users className="mr-2 h-4 w-4 md:h-[18px] md:w-[18px]" />
                {eventData.participants} participants
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="border-2 border-yellow-100">
          <CardHeader className="border-b bg-yellow-50 p-4 md:p-6">
            <CardTitle className="flex items-center text-yellow-800 text-lg md:text-xl">
              <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ul className="space-y-3">
              {leaderboard.map((participant, index) => (
                <li 
                  key={participant.id} 
                  className={`flex items-center justify-between p-2 md:p-3 rounded-lg transition-colors
                    ${index === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full mr-2 md:mr-4 text-sm 
                      ${index === 0 ? 'bg-yellow-400 text-white' : 
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>
                      {index + 1}
                    </span>
                    <Avatar className="w-8 h-8 md:w-10 md:h-10 mr-2 border-2 border-white shadow-sm">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm md:text-base">{participant.name}</span>
                      <span className="text-xs text-gray-500">{participant.email}</span>
                    </div>
                  </div>
                  <span className="font-bold text-yellow-600 text-sm md:text-base">{participant.coins} coins</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardHeader className="border-b bg-blue-50 p-4 md:p-6">
            <CardTitle className="flex items-center text-blue-800 text-lg md:text-xl">
              <Upload className="mr-2 h-5 w-5 text-blue-600" />
              Submit Your Work
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload proof (image or video)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-sm"
                    onClick={() => handleCapture('camera')}
                    disabled={submissionStatus !== 'idle'}
                  >
                    <Camera className="h-4 w-4" />
                    Take Photo/Video
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-sm"
                    onClick={() => handleCapture('gallery')}
                    disabled={submissionStatus !== 'idle'}
                  >
                    <Image className="h-4 w-4" />
                    Choose from Gallery
                  </Button>
                </div>
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {file.name}
                  </div>
                )}
              </div>

              {renderSubmissionStatus()}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-10 md:h-11 text-sm md:text-base"
                disabled={!file || submissionStatus !== 'idle'}
              >
                {submissionStatus === 'idle' ? (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Submit Work
                  </>
                ) : (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}