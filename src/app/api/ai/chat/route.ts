import { NextRequest, NextResponse } from 'next/server';
import { generateContent, GeminiMessage, STUDY_ASSISTANT_PROMPT } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { message, history, systemPrompt } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const conversation: GeminiMessage[] = history?.map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        })) || [];

        const response = await generateContent(
            message,
            conversation,
            systemPrompt || STUDY_ASSISTANT_PROMPT
        );

        return NextResponse.json({
            response,
            success: true,
        });
    } catch (error) {
        console.error('AI Chat error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to generate response',
                success: false,
            },
            { status: 500 }
        );
    }
}
