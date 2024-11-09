import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const code = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
  return code
}

export function snakeCaseToTitleCase(str: string) {
  return str.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
