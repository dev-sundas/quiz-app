import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthRedirect } from "@/components/auth/auth-redirect"
export default function StudentRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 return (
    <AuthProvider>
    {children}
    </AuthProvider>
  )
}  
