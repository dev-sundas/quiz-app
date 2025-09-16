import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthRedirect } from "@/components/auth/auth-redirect"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Student quiz application with JWT authentication",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
         <AuthProvider>
          {/* <AuthRedirect> */}
           {children}
           <Toaster />
          {/* </AuthRedirect> */}
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
