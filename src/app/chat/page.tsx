'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendMessage } from '@/lib/api'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function Chat() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!sessionId || !input.trim()) return

        setLoading(true)
        setError(null)
        const newMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, newMessage])
        setInput('')

        try {
            const response = await sendMessage(sessionId, input, messages)
            if (response && response.answer) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.answer }])
            } else {
                throw new Error('Invalid response format')
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setError('Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!sessionId) {
        return <div className="text-red-500">No session ID provided. Please upload a PDF first.</div>
    }

    return (
        <div className="flex flex-col w-full max-w-md">
            <div className="flex-1 overflow-y-auto mb-4 max-h-[60vh]">
                {messages.map((m, index) => (
                    <div key={index} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {m.content}
            </span>
                    </div>
                ))}
                {error && <div className="text-red-500 mb-4">{error}</div>}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about your PDF..."
                    disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                </Button>
            </form>
        </div>
    )
}

