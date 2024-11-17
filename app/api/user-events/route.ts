import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { events: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ events: user.events.map(event => event.id) })
  } catch (error) {
    console.error('Error fetching user events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}