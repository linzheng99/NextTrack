"use client"

import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader className="animate-spin size-6" />
    </div>
  )
}
