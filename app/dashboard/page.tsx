import { Suspense } from 'react'
import DashboardClient from './DashboardClient'
import { mockEvents } from '../lib/mock-data'

async function getEvents() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockEvents
}

export default async function DashboardPage() {
  const events = await getEvents()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClient initialEvents={events} />
    </Suspense>
  )
}