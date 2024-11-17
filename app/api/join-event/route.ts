import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { userId, eventId } = await request.json()

  if (!userId || !eventId) {
    return NextResponse.json({ error: 'User ID and Event ID are required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        events: {
          connect: { id: eventId }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error joining event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}