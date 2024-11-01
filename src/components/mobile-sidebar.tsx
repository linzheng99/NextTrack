"use client"

import { MenuIcon } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react"

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import Sidebar from "./sidebar";

export default function MoibileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div>
      <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant={'secondary'} size={'icon'} className="lg:hidden">
            <MenuIcon className="size-4 text-neutral-500" />
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'} className="p-0">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
