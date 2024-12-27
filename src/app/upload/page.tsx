'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadPDF } from '@/lib/api'

export default function Upload() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        try {
            const sessionId = 'session_' + Date.now()
            await uploadPDF(file, sessionId)
            router.push(`/chat?session_id=${sessionId}`)
        } catch (error) {
            console.error('Error uploading file:', error)
            alert('Error uploading file. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold mb-4">Upload Your PDF</h1>
            <Input type="file" accept=".pdf" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? 'Uploading...' : 'Upload and Start Chat'}
            </Button>
        </div>
    )
}

