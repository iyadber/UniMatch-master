// Gemini AI client library

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA_h71I8EXjRpjadzoTNza2FqyxPIyGf8Y';
const MODELS = ['models/gemini-3-flash-preview', 'models/gemini-flash-lite-latest'];

export interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface GeminiResponse {
    candidates: {
        content: {
            parts: { text: string }[];
            role: string;
        };
        finishReason: string;
        index: number;
    }[];
    usageMetadata: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
    };
}

export async function generateContent(
    prompt: string,
    history: GeminiMessage[] = [],
    systemInstruction?: string
): Promise<string> {
    const contents = history.length > 0
        ? [...history, { role: 'user' as const, parts: [{ text: prompt }] }]
        : [{ role: 'user' as const, parts: [{ text: prompt }] }];

    const requestBody: {
        contents: GeminiMessage[];
        generationConfig: {
            temperature: number;
            topK: number;
            topP: number;
            maxOutputTokens: number;
        };
        systemInstruction?: { parts: { text: string }[] };
    } = {
        contents,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
        },
    };

    if (systemInstruction) {
        requestBody.systemInstruction = {
            parts: [{ text: systemInstruction }],
        };
    }

    let lastError: Error | null = null;

    for (const model of MODELS) {
        try {
            console.log(`[Gemini] Attempting with model: ${model}`);
            const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${GEMINI_API_KEY}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data: GeminiResponse = await response.json();

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No response candidates from Gemini');
            }

            return data.candidates[0].content.parts
                .map((part) => part.text)
                .join('');

        } catch (error) {
            console.warn(`[Gemini] Model ${model} failed:`, error instanceof Error ? error.message : error);
            lastError = error instanceof Error ? error : new Error(String(error));
            // Continue to next model
        }
    }

    throw lastError || new Error('All models failed to generate content');
}

export async function streamContent(
    prompt: string,
    history: GeminiMessage[] = [],
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
): Promise<string> {
    const contents = history.length > 0
        ? [...history, { role: 'user' as const, parts: [{ text: prompt }] }]
        : [{ role: 'user' as const, parts: [{ text: prompt }] }];

    const requestBody: {
        contents: GeminiMessage[];
        generationConfig: {
            temperature: number;
            topK: number;
            topP: number;
            maxOutputTokens: number;
        };
        systemInstruction?: { parts: { text: string }[] };
    } = {
        contents,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        },
    };

    if (systemInstruction) {
        requestBody.systemInstruction = {
            parts: [{ text: systemInstruction }],
        };
    }

    let lastError: Error | null = null;
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

    for (const model of MODELS) {
        try {
            const streamUrl = `https://generativelanguage.googleapis.com/v1beta/${model}:streamGenerateContent?key=${GEMINI_API_KEY}`;

            const response = await fetch(streamUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            reader = response.body?.getReader();
            if (reader) break; // Success, break loop

        } catch (error) {
            console.warn(`[Gemini] Stream init failed for ${model}:`, error);
            lastError = error instanceof Error ? error : new Error(String(error));
        }
    }

    if (!reader) {
        throw lastError || new Error('All models failed to initialize stream');
    }

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                if (jsonStr === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(jsonStr);
                    if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
                        const text = parsed.candidates[0].content.parts[0].text;
                        fullText += text;
                        onChunk?.(text);
                    }
                } catch {
                    // Skip invalid JSON
                }
            }
        }
    }

    return fullText;
}

// Study assistant specific prompts
export const STUDY_ASSISTANT_PROMPT = `You are an AI Study Assistant for UniMatch, an educational platform connecting students with PhD researchers and tutors. 

Your role is to:
1. Help students understand complex academic concepts across all subjects
2. Provide clear, step-by-step explanations
3. Suggest study strategies and resources
4. Answer questions about courses and learning paths
5. Encourage and motivate students in their academic journey

Be friendly, professional, and encouraging. Use examples when helpful. If you don't know something, admit it and suggest how the student might find the answer (like asking their tutor).

Always respond in a helpful and educational manner.`;

// Tutor recommendation prompt
export const TUTOR_RECOMMENDATION_PROMPT = `You are an AI assistant helping match students with the right PhD tutors on UniMatch.

Based on the student's:
- Current courses and subjects of interest
- Learning style and preferences
- Academic goals
- Areas where they need help

Suggest tutors who would be a good match. Explain why each tutor would be beneficial.`;
