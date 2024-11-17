export const mockEvents = [
  {
    id: 1,
    name: "Clean Sidi Bou Said Beach",
    description: "Join us for a community beach cleanup in the beautiful Sidi Bou Said. Help preserve our coastal heritage while earning eco-coins!",
    date: new Date("2024-04-15T09:00:00"),
    location: "Sidi Bou Said, Tunis",
    participants: 45,
    coinsReward: 50,
    imageUrl: "/images/sidi-bou-said.jpg"
  },
  {
    id: 2,
    name: "Medina Waste Reduction Campaign",
    description: "Help reduce waste in the historic Medina of Tunis. Focus on plastic reduction and recycling awareness.",
    date: new Date("2024-04-20T10:00:00"),
    location: "Medina of Tunis",
    participants: 30,
    coinsReward: 40,
    imageUrl: "/images/medina.jpg"
  },
  {
    id: 3,
    name: "Plant Trees in Carthage",
    description: "Environmental initiative to plant native trees around the historic sites of Carthage.",
    date: new Date("2024-04-25T08:30:00"),
    location: "Carthage Archaeological Site",
    participants: 60,
    coinsReward: 45,
    imageUrl: "/images/carthage.jpg"
  }
]

export const mockLeaderboard = [
  {
    id: "1",
    email: "ahmed.ben.ali@gmail.com",
    name: "Ahmed Ben Ali",
    coins: 450,
    avatar: "/avatars/ahmed.jpg"
  },
  {
    id: "2",
    email: "erika.Hitler@gmail.com",
    name: "Erika Göring",
    coins: 380,
    avatar: "/avatars/erika.jpg"
  },
  {
    id: "3",
    email: "mohamed.slim@gmail.com",
    name: "Mohamed Slim",
    coins: 320,
    avatar: "/avatars/mohamed.jpg"
  },
  {
    id: "4",
    email: "fatma.chabbi@gmail.com",
    name: "Fatma Chabbi",
    coins: 290,
    avatar: "/avatars/fatma.jpg"
  },
  {
    id: "5",
    email: "youssef.gharbi@gmail.com",
    name: "Youssef Gharbi",
    coins: 250,
    avatar: "/avatars/youssef.jpg"
  }
]

export const mockCurrentUser = {
  id: "current_user",
  email: "karim.mejri@gmail.com",
  name: "Karim Mejri",
  coins: 180,
  avatar: "/avatars/karim.jpg"
} 