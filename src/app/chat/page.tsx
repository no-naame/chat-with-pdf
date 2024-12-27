'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from 'lucide-react'
import { sendMessage } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Suspense } from 'react'
interface Message {
    role: 'user' | 'assistant'
    content: string
}

function ChatComponent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!sessionId || !input.trim()) return

        setLoading(true)
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
            toast.error('Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!sessionId) {
        return (
            <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
                <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
                    No session ID provided
                </h1>
                <p className='mt-5 max-w-prose text-zinc-700 sm:text-lg'>
                    Please upload a PDF first to start chatting.
                </p>
                <Button className='mt-5' onClick={() => window.location.href = '/upload'}>
                    Go to Upload
                </Button>
            </MaxWidthWrapper>
        )
    }

    return (
        <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center'>
            <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
                <p className='text-sm font-semibold text-gray-700'>
                    Chat with your PDF
                </p>
            </div>
            <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl mb-10 text-center'>
                Ask questions about your{' '}
                <span className='text-blue-600'>document</span>
            </h1>

            <div className='w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-8'>
                <div className='space-y-4 mb-4 h-[400px] overflow-y-auto'>
                    {messages.map((m, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                m.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-sm rounded-lg p-4 ${
                                    m.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className='flex gap-2'>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your PDF..."
                        className='flex-grow'
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                            <>
                                Send <ArrowRight className='ml-2 h-4 w-4' />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </MaxWidthWrapper>
    )
}
export default function Chat() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatComponent/>
        </Suspense>
    )
}
