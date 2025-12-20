import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { content, type } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        let prompt = '';
        let systemPrompt = '';

        switch (type) {
            case 'summary':
                systemPrompt = `You are an educational AI assistant that creates clear, concise summaries. 
        Format your response with:
        1. A brief overview (2-3 sentences)
        2. Key points (bullet points)
        3. Important takeaways
        Use markdown formatting for better readability.`;
                prompt = `Please provide a comprehensive summary of the following topic or content:\n\n${content}`;
                break;

            case 'flashcards':
                systemPrompt = `You are an educational AI that creates flashcards. 
        Always respond with valid JSON array only, no other text or markdown.
        Format: [{"question": "...", "answer": "...", "topic": "..."}]`;
                prompt = `Generate 5 flashcards for studying the following topic:\n\n${content}`;
                break;

            case 'quiz':
                systemPrompt = `You are an educational AI that creates quiz questions.
        Always respond with valid JSON array only, no other text or markdown.
        Format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}]
        correctAnswer is the index (0-3) of the correct option.`;
                prompt = `Generate 5 multiple-choice quiz questions for the following topic:\n\n${content}`;
                break;

            case 'explain':
                systemPrompt = `You are a patient and thorough educational AI tutor.
        Explain concepts in a clear, step-by-step manner.
        Use examples and analogies to make complex topics understandable.
        Format your response with clear sections and bullet points where appropriate.`;
                prompt = `Please explain the following concept in detail, suitable for a student:\n\n${content}`;
                break;

            case 'practice':
                systemPrompt = `You are an educational AI that creates practice problems.
        Generate problems that help students practice and understand concepts.
        Include hints and step-by-step solutions.`;
                prompt = `Generate 3 practice problems with solutions for:\n\n${content}`;
                break;

            default:
                systemPrompt = 'You are a helpful educational AI assistant.';
                prompt = content;
        }

        const response = await generateContent(prompt, [], systemPrompt);

        return NextResponse.json({
            response,
            type,
            success: true,
        });
    } catch (error) {
        console.error('AI Tools error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to generate content',
                success: false,
            },
            { status: 500 }
        );
    }
}
