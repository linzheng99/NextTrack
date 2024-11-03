import Image from "next/image";
import Link from "next/link";

import WorkspaceSwitcher from "@/features/workspaces/components/workspace-switcher";

import DottedSeparator from "./dotted-separator";
import Navigation from "./navigation";

export default function Sidebar() {
  return (
    <div className="h-full bg-neutral-100 p-4 w-full">
      <Link href={'/'} className="flex gap-2 items-center justify-center">
        <Image src='/logo.svg' width={50} height={50} alt="logo" />
        <span className="font-semibold text-2xl">Next Track</span>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
    </div>
  )
}
