import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VenSport U-13 League',
  description: 'Official website for VenSport U-13 Football League',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}