import { redirect } from "next/navigation";

import SignInCard from "@/features/auth/components/sign-in-card";
import { getCurrent } from "@/features/auth/queries";

export const dynamic = "force-dynamic";

export default async function SignIn() {
  const user = await getCurrent()
  if (user) redirect('/')

  return (
    <SignInCard />
  )
}
