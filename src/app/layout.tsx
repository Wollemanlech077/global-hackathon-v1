import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RISKGRID - Risk Analysis Dashboard',
  description: 'WEB RISK GRID - ACTA 2025 Hackathon',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css' rel='stylesheet' />
      </head>
      <body className={`${inter.className} h-full m-0 p-0`}>{children}</body>
    </html>
  )
}
