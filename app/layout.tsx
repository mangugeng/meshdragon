import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MeshDragon - 3D Web Platform',
  description: 'Platform visualisasi 3D modern untuk kreator digital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  )
} 