import Image from "next/image";
import Link from "next/link";

import UserButton from "@/features/auth/components/user-button";

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-muted min-h-screen">
      <div className="mx-auto w-full max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Link href={'/'} className="flex gap-2 items-center justify-center">
            <Image src='/logo.svg' width={50} height={50} alt="logo" />
            <span className="font-semibold text-2xl">Next Track</span>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  )
}
