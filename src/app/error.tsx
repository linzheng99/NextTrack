"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <AlertTriangle className="size-10 text-red-500" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <Button variant="outline" size="sm">
        <Link href="/">
          Back to home
        </Link>
      </Button>
    </div>
  )
}
