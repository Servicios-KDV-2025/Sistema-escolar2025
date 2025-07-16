'use client'

import React from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { Button } from '@repo/ui/components/shadcn/button'

export default function Navbar() {
  const { user } = useUser()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Sistema Escolar</h1>
          </div>

          {/* Información del usuario y botón de cerrar sesión */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>
                <SignOutButton>
                  <Button variant="outline" size="sm">
                    Cerrar Sesión
                  </Button>
                </SignOutButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 