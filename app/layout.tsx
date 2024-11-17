import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { TreeDeciduous } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { currentUser } from '@clerk/nextjs/server'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "EcoVerse",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser()

  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
        <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-green-100">
              <div className="container mx-auto flex justify-between items-center p-4">
                <Link className="flex items-center justify-center" href="/">
                  <TreeDeciduous className="h-8 w-8 text-green-600" />
                  <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-green-600">
                    EcoVerse
                  </span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                  <Link href="#features" className="text-gray-600 hover:text-green-600">Features</Link>
                  <Link href="#about" className="text-gray-600 hover:text-green-600">About</Link>
                  <Link href="#contact" className="text-gray-600 hover:text-green-600">Contact</Link>
                  <Link href="/store" className="text-gray-600 hover:text-green-600">Store</Link>
                </div>
                {user ? <UserButton /> : <SignInButton />}
              </div>
            </nav>
            <div className="mt-16">
              {children}
            </div>
            <footer className="bg-green-900 text-white py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <TreeDeciduous className="h-6 w-6 mr-2" />
                      <span className="text-xl font-bold">EcoVerse</span>
                    </div>
                    <p className="text-green-100">
                      Making environmental action accessible and rewarding for everyone.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li><Link href="#" className="text-green-100 hover:text-white">Home</Link></li>
                      <li><Link href="#" className="text-green-100 hover:text-white">About</Link></li>
                      <li><Link href="#" className="text-green-100 hover:text-white">Features</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                      <li><Link href="#" className="text-green-100 hover:text-white">Privacy Policy</Link></li>
                      <li><Link href="#" className="text-green-100 hover:text-white">Terms of Service</Link></li>
                      <li><Link href="#" className="text-green-100 hover:text-white">Cookie Policy</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Connect</h3>
                    <ul className="space-y-2">
                      <li><Link href="#" className="text-green-100 hover:text-white">Contact Us</Link></li>
                      <li><Link href="#" className="text-green-100 hover:text-white">Support</Link></li>
                      <li><Link href="#" className="text-green-100 hover:text-white">Newsletter</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-green-800 mt-8 pt-8 flex justify-between items-center">
                  <p className="text-green-100">© 2024 EcoVerse. All rights reserved.</p>
                  <ThemeSwitcher />
                </div>
              </div>
            </footer>
          </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
