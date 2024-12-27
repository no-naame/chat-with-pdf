import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'PDF Chat',
    description: 'Chat with your PDF documents',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.ENV = ${JSON.stringify({
                        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
                    })}`,
                }}
            />
        </head>
        <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center grainy justify-between p-24">
            {children}
        </main>
        </body>
        </html>
    )
}

