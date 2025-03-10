import './globals.css'

export const metadata = {
  title: 'Platform Web3D',
  description: 'Platform Web3D masa depan dengan visualisasi yang memukau',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  )
} 