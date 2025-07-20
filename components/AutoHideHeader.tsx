'use client'

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function AutoHideHeader() {
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 50) {
        setVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [lastScrollY])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-gray-200/50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Header Line */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">
            Giri Seat Covers
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 gap-6 mx-4">
            <Link href="/shop" className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-colors whitespace-nowrap">
              Shop
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-colors whitespace-nowrap">
              Cart
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-colors whitespace-nowrap">
              Orders
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-colors whitespace-nowrap">
              Profile
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-colors whitespace-nowrap">
              About Us
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SignedOut>
              <SignInButton>
                <button className="text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg transition-colors hover:bg-gray-50 whitespace-nowrap">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 whitespace-nowrap">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 sm:w-9 sm:h-9"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>

        {/* Creative Tagline Below */}
        <div className="w-full pb-2 text-center">
          <span className="text-xs sm:text-sm font-medium text-gray-500 italic">
            enhance your ride & decorate your own style on it
          </span>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-2 border-t border-gray-100">
            <nav className="flex flex-col gap-1">
              <Link 
                href="/shop" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/cart" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart
              </Link>
              <Link 
                href="/orders" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Link 
                href="/profile" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}