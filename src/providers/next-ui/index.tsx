'use client'

import { HeroUIProvider as NextProvider } from "@heroui/react"
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

export default function HeroUIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <NextProvider navigate={router.push}>
      <ThemeProvider attribute='class' defaultTheme='light'>
        {children}
      </ThemeProvider>
    </NextProvider>
  )
}
