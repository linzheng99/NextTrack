import UserButton from "@/features/auth/components/user-button";

import MoibileSidebar from "./mobile-sidebar";

export default function Navbar() {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="hidden lg:flex flex-col">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">show all projects and task about you</p>
      </div>
      <MoibileSidebar />
      <UserButton />
    </nav>
  )
}
