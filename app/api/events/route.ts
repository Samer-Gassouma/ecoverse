import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { name, description, date, location, coordinates, creatorId } = body

    if (user.id !== creatorId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        date,
        location,
        coordinates,
        creatorId,
        participants: 0
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc'
      }
    })
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 