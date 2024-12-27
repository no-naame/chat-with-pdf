import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to PDF Chat</h1>
        <p className="mb-8">Upload your PDF and start chatting with it!</p>
        <Link href="/upload">
          <Button>Get Started</Button>
        </Link>
      </div>
  )
}

