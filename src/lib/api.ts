const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadPDF(file: File, sessionId: string) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload-pdf/?session_id=${sessionId}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload PDF');
    }

    return response.json();
}

export async function sendMessage(sessionId: string, question: string, chatHistory: any[]) {
    const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            question: question,
            chat_history: chatHistory
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
}

