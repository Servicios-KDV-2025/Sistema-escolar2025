'use client'

import { Button } from '@/components/ui/button'
import { SignIn, SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@repo/ui/components/shadcn/card'

export default function Home() {
  const { user } = useUser()

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <SignIn />
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Bienvenido, {user.firstName}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 items-center">
            <SignOutButton />
            <h1 className="text-xl font-semibold mt-2">Hello Page</h1>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <p>ir a escuela</p>
            <Link href="/escuela">Escuela</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}