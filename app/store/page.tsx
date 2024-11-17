'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CoinsIcon, ShoppingCart, ArrowLeft, Heart } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

// Predefined store items
const STORE_ITEMS = [
  {
    id: '1',
    name: 'Eco-Friendly Tote Bag',
    description: 'Handcrafted from recycled plastic bottles. Each bag helps remove 10 plastic bottles from the environment.',
    price: 50,
    image_url: '/ss.png' // Add these images to your public/images folder
  },
  {
    id: '2',
    name: 'Recycled Paper Notebook',
    description: 'Made from 100% recycled paper and bound with reclaimed fabric. Perfect for daily journaling.',
    price: 30,
    image_url: '/sad.png'
  },
  {
    id: '3',
    name: 'Upcycled Glass Planter',
    description: 'Beautiful planter created from recycled glass bottles. Each piece is unique and handcrafted.',
    price: 45,
    image_url: '/asd.png'
  }
]

export default function Store() {
  const [coins, setCoins] = useState(100)
  const [cart, setCart] = useState<{[key: string]: number}>({})
  const router = useRouter()

  const addToCart = (itemId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = STORE_ITEMS.find(i => i.id === itemId)
      return total + (item ? item.price * quantity : 0)
    }, 0)
  }

  const handleCheckout = () => {
    const totalPrice = getTotalPrice()
    if (coins >= totalPrice) {
      setCoins(coins - totalPrice)
      setCart({})
      alert('Thank you for your purchase! 100% of profits will be donated to humanitarian aid in Palestine.')
    } else {
      alert('Not enough coins for this purchase.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="bg-green-700 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-600"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">EcoVerse Store</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-green-600 px-4 py-2 rounded-full flex items-center">
              <CoinsIcon className="mr-2" size={24} />
              <span className="text-xl font-bold">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <Alert className="mb-8 bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
          <Heart className="h-5 w-5 text-red-500" />
          <AlertDescription className="ml-2 text-gray-700">
            100% of all purchases from our store will be donated to humanitarian aid in Palestine.
            Together we can make a difference while promoting sustainability.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STORE_ITEMS.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="space-y-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-xl text-green-700">{item.name}</CardTitle>
                <CardDescription className="text-gray-600">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{item.price} coins</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-gray-50 p-4 rounded-b-lg">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    disabled={!cart[item.id]}
                    className="hover:bg-green-100"
                  >
                    -
                  </Button>
                  <span className="font-medium w-8 text-center">{cart[item.id] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addToCart(item.id)}
                    className="hover:bg-green-100"
                  >
                    +
                  </Button>
                </div>
                <Button 
                  onClick={() => addToCart(item.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {Object.keys(cart).length > 0 && (
        <footer className="bg-green-700 text-white p-6 sticky bottom-0 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <ShoppingCart size={24} />
              <span className="text-xl font-bold">
                {Object.values(cart).reduce((a, b) => a + b, 0)} items
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-xl font-bold">Total: {getTotalPrice()} coins</span>
              <Button
                onClick={handleCheckout}
                className="bg-white text-green-700 hover:bg-green-100"
              >
                Checkout
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}