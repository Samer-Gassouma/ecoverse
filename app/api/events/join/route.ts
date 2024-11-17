"use server"

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth,currentUser } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
	const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await request.json()
    
    const result = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        events: {
          connect: { id: eventId }
        }
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error joining event:', error)
    return NextResponse.json({ error: 'Failed to join event' }, { status: 500 })
  }
} 