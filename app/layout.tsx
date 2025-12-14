import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "elonsoul | voice ai",
  description: "voice-enabled ai conversations with elon's mind",
  openGraph: {
    title: "elonsoul",
    description: "voice-enabled ai conversations with elon's mind",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "elonsoul",
    description: "voice-enabled ai conversations with elon's mind",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
