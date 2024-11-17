const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        name: 'Tunis Beach Cleanup',
        description: 'Join us for a day of cleaning up the beautiful beaches of Tunis!',
        date: new Date('2024-06-15T09:00:00Z'),
        location: 'La Marsa Beach, Tunis',
        participants: 50,
        coinsReward: 100,
        coordinates: [10.3242, 36.8892],
      },
    }),
    prisma.event.create({
      data: {
        name: 'Sousse Tree Planting',
        description: 'Help us green the city of Sousse by planting trees in urban areas.',
        date: new Date('2024-07-01T10:00:00Z'),
        location: 'Boujaffar, Sousse',
        participants: 30,
        coinsReward: 80,
        coordinates: [10.6412, 35.8245],
      },
    }),
    prisma.event.create({
      data: {
        name: 'Sfax Recycling Workshop',
        description: 'Learn about recycling and help sort recyclables at this educational event.',
        date: new Date('2024-07-20T14:00:00Z'),
        location: 'Sfax City Center',
        participants: 40,
        coinsReward: 60,
        coordinates: [10.7600, 34.7406],
      },
    }),
    prisma.event.create({
      data: {
        name: 'Bizerte Coastal Cleanup',
        description: 'Help preserve the beauty of Bizerte\'s coastline in this cleanup event.',
        date: new Date('2024-08-05T08:30:00Z'),
        location: 'Bizerte Beach',
        participants: 25,
        coinsReward: 90,
        coordinates: [9.8642, 37.2768],
      },
    }),
    prisma.event.create({
      data: {
        name: 'Kairouan Water Conservation',
        description: 'Join us in implementing water-saving techniques in this historic city.',
        date: new Date('2024-08-25T11:00:00Z'),
        location: 'Kairouan Medina',
        participants: 35,
        coinsReward: 70,
        coordinates: [10.0963, 35.6781],
      },
    }),
  ]);

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ahmed.ben@example.com',
        coins: 250,
        clerkId: 'user_mock_1',  // Added clerkId
      },
    }),
    prisma.user.create({
      data: {
        email: 'fatima.zahr@example.com',
        coins: 180,
        clerkId: 'user_mock_2',  // Added clerkId
      },
    }),
    prisma.user.create({
      data: {
        email: 'youssef.tm@example.com',
        coins: 320,
        clerkId: 'user_mock_3',  // Added clerkId
      },
    }),
    prisma.user.create({
      data: {
        email: 'leila.sfax@example.com',
        coins: 150,
        clerkId: 'user_mock_4',  // Added clerkId
      },
    }),
    prisma.user.create({
      data: {
        email: 'karim.biz@example.com',
        coins: 200,
        clerkId: 'user_mock_5',  // Added clerkId
      },
    }),
  ]);
  
  // Create event participations
  await Promise.all([
    prisma.user.update({
      where: { id: users[0].id },
      data: { events: { connect: [{ id: events[0].id }, { id: events[2].id }] } },
    }),
    prisma.user.update({
      where: { id: users[1].id },
      data: { events: { connect: [{ id: events[1].id }, { id: events[3].id }] } },
    }),
    prisma.user.update({
      where: { id: users[2].id },
      data: { events: { connect: [{ id: events[0].id }, { id: events[4].id }] } },
    }),
    prisma.user.update({
      where: { id: users[3].id },
      data: { events: { connect: [{ id: events[2].id }, { id: events[4].id }] } },
    }),
    prisma.user.update({
      where: { id: users[4].id },
      data: { events: { connect: [{ id: events[1].id }, { id: events[3].id }] } },
    }),
  ]);

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });