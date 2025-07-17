import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '감정 일기',
  description: '나의 감정을 기록하는 일기장',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}