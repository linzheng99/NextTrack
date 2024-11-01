"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const isSignIn = pathname === '/sign-in'

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src='/logo.svg' width={50} height={50} alt="logo" />
          <Button asChild variant={'outline'}>
            <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
              {isSignIn ? 'Sign Up' : 'Login'}
            </Link>
          </Button>
        </nav>
        <div className="flex items-center justify-center pt-4 md:p-14">
          {children}
        </div>
      </div>
    </main>
  );
}
