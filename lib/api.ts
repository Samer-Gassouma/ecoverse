export async function fetchEvents() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
    cache: 'no-store' // or use appropriate caching strategy
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch events')
  }
  
  return response.json()
} 