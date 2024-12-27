'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Cloud, File, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { uploadPDF } from '@/lib/api'

interface CustomProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    indicatorClassName?: string;
}

export default function UploadPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const router = useRouter()

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        setIsUploading(true)
        setUploadProgress(0)

        const file = acceptedFiles[0]
        const maxSize = 16 * 1024 * 1024 // 16MB

        if (file.size > maxSize) {
            setIsUploading(false)
            return toast.error('File size exceeds 16MB limit')
        }

        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(progressInterval)
                    return prev
                }
                return prev + 5
            })
        }, 500)

        try {
            const sessionId = 'session_' + Date.now()
            await uploadPDF(file, sessionId)
            clearInterval(progressInterval)
            setUploadProgress(100)

            toast.success('File uploaded successfully')
            setTimeout(() => {
                router.push(`/chat?session_id=${sessionId}`)
            }, 1000)
        } catch (error) {
            console.error('Error uploading file:', error)
            toast.error('Error uploading file. Please try again.')
            clearInterval(progressInterval)
            setIsUploading(false)
        }
    }, [router])

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
    })

    return (
        <>
            <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
                <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
                    <p className='text-sm font-semibold text-gray-700'>
                        Upload your PDF
                    </p>
                </div>
                <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
                    Start chatting with your{' '}
                    <span className='text-blue-600'>document</span>
                </h1>
                <p className='mt-5 max-w-prose text-zinc-700 sm:text-lg'>
                    Upload your PDF and we&apos;ll process it for you. Then you can start asking questions right away.
                </p>

                <div className='w-full max-w-2xl mt-8'>
                    <div
                        {...getRootProps()}
                        className='border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-all cursor-pointer'>
                        <input {...getInputProps()} />
                        <div className='flex flex-col items-center justify-center'>
                            <Cloud className='h-10 w-10 text-gray-400 mb-4' />
                            <p className='mb-2 text-sm text-gray-700'>
                                <span className='font-semibold'>Click to upload</span> or drag and drop
                            </p>
                            <p className='text-xs text-gray-500'>PDF (up to 16MB)</p>
                        </div>

                        {acceptedFiles && acceptedFiles[0] && (
                            <div className='mt-4 max-w-xs mx-auto bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                                <div className='px-3 py-2 h-full grid place-items-center'>
                                    <File className='h-4 w-4 text-blue-500' />
                                </div>
                                <div className='px-3 py-2 h-full text-sm truncate'>
                                    {acceptedFiles[0].name}
                                </div>
                            </div>
                        )}

                        {isUploading && (
                            <div className='w-full mt-4 max-w-xs mx-auto'>
                                <Progress
                                    value={uploadProgress}
                                    className='h-1 w-full bg-zinc-200'
                                    indicatorClassName={uploadProgress === 100 ? 'bg-green-500' : ''}
                                />
                                {uploadProgress === 100 && (
                                    <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                                        <Loader2 className='h-3 w-3 animate-spin' />
                                        Redirecting...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <Button className='mt-8' onClick={() => document.querySelector('input')?.click()}>
                    Upload PDF
                </Button>
            </MaxWidthWrapper>
        </>
    )
}

