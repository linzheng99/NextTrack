import { redirect } from "next/navigation";

import SignUpCard from "@/features/auth/components/sign-up-card";
import { getCurrent } from "@/features/auth/queries";

export const dynamic = "force-dynamic";

export default async function SignUp() {
  const user = await getCurrent()
  if (user) redirect('/')
    
  return (
    <SignUpCard />
  )
}
