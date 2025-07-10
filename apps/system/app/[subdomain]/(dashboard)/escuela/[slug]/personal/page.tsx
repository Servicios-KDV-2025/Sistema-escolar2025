'use client'

import { Eye } from "lucide-react"
import { PersonalCRUD } from "../../../../../../components/PersonalCRUD"

export default function Page() {
  return(
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Personal</h1>
        <PersonalCRUD />
    </main>
  )
}