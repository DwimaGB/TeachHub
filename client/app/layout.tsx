import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TeachHub",
  description: "Simple teaching platform demo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              TeachHub
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/courses">Courses</Link>
              <Link href="/create-course">Create course</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </body>
    </html>
  )
}
