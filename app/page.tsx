'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Leaf, TreeDeciduous, Recycle, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import type { NextPage } from 'next'

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className="w-12 h-12 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

function PricingTier({ name, price, description, features, buttonText, highlighted = false }: PricingTierProps): JSX.Element {
  return (
    <motion.div
      className={`relative flex flex-col p-6 rounded-2xl ${
        highlighted 
          ? 'bg-green-600 text-white shadow-xl border-2 border-green-500' 
          : 'bg-white text-gray-600'
      }`}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {highlighted && (
        <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      )}
      <h3 className={`text-xl font-bold ${highlighted ? 'text-white' : 'text-green-800'}`}>{name}</h3>
      <div className="mt-4 mb-2">
        <span className={`text-3xl font-bold ${highlighted ? 'text-white' : 'text-green-800'}`}>{price}</span>
        <span className={highlighted ? 'text-green-100' : 'text-gray-500'}>/month</span>
      </div>
      <p className={`mb-6 ${highlighted ? 'text-green-100' : 'text-gray-500'}`}>{description}</p>
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className={`w-5 h-5 ${highlighted ? 'text-green-200' : 'text-green-500'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`w-full ${
          highlighted 
            ? 'bg-white text-green-600 hover:bg-green-50' 
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {buttonText}
      </Button>
    </motion.div>
  )
}

const LandingPage: NextPage = () => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <motion.div 
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-green-800">
                    Join the EcoVerse Revolution
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Embark on eco-friendly missions, earn rewards, and make a real impact on our planet. Together, we can create a sustainable future.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">Learn More</Button>
                  </Link>
                </div>
              </motion.div>
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                {mounted && (
                  <Image
                    src="/tai.png?height=400&width=500"
                    alt="Eco-friendly activities"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Why Choose EcoVerce?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={Leaf}
                title="Eco-Friendly Missions"
                description="Participate in various environmental missions and make a tangible impact on your local community."
              />
              <FeatureCard 
                icon={Recycle}
                title="Earn Green Rewards"
                description="Complete missions to earn eco-coins, redeemable for sustainable products and exclusive perks."
              />
              <FeatureCard 
                icon={TreeDeciduous}
                title="Track Your Impact"
                description="Monitor your environmental contributions and see the real-world difference you're making."
              />
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-800">
                Choose Your Impact Level
              </h2>
              <p className="mt-4 text-gray-600 md:text-lg">
                Start making a difference today with our flexible plans
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
              <PricingTier
                name="Earth Guardian"
                price="Free"
                description="Perfect for getting started with eco-friendly missions"
                features={[
                  "Access to basic missions",
                  "Community forum access",
                  "Basic impact tracking",
                  "Monthly eco-tips newsletter",
                  "Personal achievement badges"
                ]}
                buttonText="Get Started"
              />
              <PricingTier
                name="Planet Protector"
                price="9.99 TND"
                description="For dedicated environmental champions"
                features={[
                  "All Earth Guardian features",
                  "Premium exclusive missions",
                  "Advanced impact analytics",
                  "Priority support",
                  "Monthly eco-product discounts",
                  "Custom mission creation"
                ]}
                buttonText="Upgrade Now"
                highlighted={true}
              />
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-800">Our Mission</h2>
                <p className="text-gray-600 md:text-lg">
                  At EcoVerce, we're on a mission to make environmental conservation fun, rewarding, and accessible to everyone. 
                  By gamifying eco-friendly actions, we aim to create a global community of earth champions who are passionate about 
                  preserving our planet for future generations.
                </p>
                <Link href="/about">
                  <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">Learn More About Us</Button>
                </Link>
              </motion.div>
              <motion.div 
                className="aspect-video rounded-xl bg-green-100 overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/tai.png?height=400&width=600"
                  alt="People planting trees"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
     
    </div>
  )
}

export default LandingPage