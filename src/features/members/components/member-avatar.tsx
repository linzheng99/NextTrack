import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MemberAvatarProps {
  name: string
  className?: string
  fallbackClassName?: string
}

export default function MemberAvatar({
  name,
  className,
  fallbackClassName
}: MemberAvatarProps) {
  return (
    <Avatar className={cn("size-5 transition border bg-neutral-200 border-neutral-300 rounded-full flex items-center justify-center", className)}>
      <AvatarFallback className={cn("bg-neutral-200 text-neutral-500 font-medium text-lg uppercase", fallbackClassName)}>
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
