'use client';

import { useState, useRef, useEffect, KeyboardEvent, forwardRef, useImperativeHandle } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X, Minimize2, Maximize2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIChatProps {
    isOpen?: boolean;
    onClose?: () => void;
    systemPrompt?: string;
    title?: string;
    placeholder?: string;
    embedded?: boolean;
    initialMessage?: string;
    onSendMessage?: (message: string) => void;
}

export interface AIChatHandle {
    sendMessage: (message: string) => void;
}

export const AIChat = forwardRef<AIChatHandle, AIChatProps>(({
    isOpen = true,
    onClose,
    systemPrompt,
    title = 'AI Study Assistant',
    placeholder = 'Ask me anything about your studies...',
    embedded = false,
    initialMessage,
    onSendMessage
}, ref) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Handle initial message
    useEffect(() => {
        if (initialMessage && messages.length === 0) {
            handleSendInternal(initialMessage);
        }
    }, [initialMessage]);

    const handleSendInternal = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (onSendMessage) {
            onSendMessage(messageText.trim());
        }

        try {
            const history = messages.map(m => ({
                role: m.role,
                content: m.content,
            }));

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history,
                    systemPrompt,
                }),
            });

            const data = await response.json();

            if (data.success) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => {
        handleSendInternal(input);
    };

    // Expose sendMessage method via ref
    useImperativeHandle(ref, () => ({
        sendMessage: (message: string) => {
            handleSendInternal(message);
        }
    }));

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatMessage = (content: string) => {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');
    };

    if (!isOpen) return null;

    return (
        <div className={clsx(
            'flex flex-col',
            embedded
                ? 'h-full w-full'
                : 'fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50'
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-t-xl shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="text-xs text-white/70">Powered by Gemini AI</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {!embedded && (
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        </button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col min-h-0 overflow-hidden"
                    >
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4">
                                        <Bot className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                                        How can I help you today?
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
                                        I'm your AI study assistant. Ask me about any subject, concept, or homework problem!
                                    </p>
                                    <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-[320px]">
                                        {[
                                            'Explain a concept',
                                            'Help with homework',
                                            'Create study plan',
                                            'Practice questions'
                                        ].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => setInput(suggestion)}
                                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={clsx(
                                        'flex gap-3',
                                        message.role === 'user' ? 'flex-row-reverse' : ''
                                    )}
                                >
                                    <div className={clsx(
                                        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                                        message.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-pink-600'
                                            : 'bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30'
                                    )}>
                                        {message.role === 'user' ? (
                                            <User className="w-5 h-5 text-white" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 max-w-[80%]">
                                        <div className={clsx(
                                            'rounded-2xl px-4 py-3',
                                            message.role === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-tr-md'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-md'
                                        )}>
                                            <div
                                                className="text-sm whitespace-pre-wrap leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                                            />
                                        </div>
                                        {message.role === 'assistant' && (
                                            <div className="flex items-center gap-2 px-2">
                                                <button
                                                    onClick={() => copyToClipboard(message.content, message.id)}
                                                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                                                >
                                                    {copiedId === message.id ? (
                                                        <>
                                                            <Check className="w-3 h-3" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            Copy
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-pink-600 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
                            <div className="flex items-end gap-3">
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            // Auto-resize
                                            e.target.style.height = 'auto';
                                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder={placeholder}
                                        rows={1}
                                        className={clsx(
                                            'w-full resize-none px-4 py-3 rounded-xl',
                                            'bg-gray-100 dark:bg-gray-800',
                                            'border-2 border-transparent',
                                            'text-gray-900 dark:text-white text-sm',
                                            'placeholder-gray-500 dark:placeholder-gray-400',
                                            'focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900',
                                            'transition-all duration-200'
                                        )}
                                        style={{ minHeight: '48px', maxHeight: '120px' }}
                                    />
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={clsx(
                                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                                        'bg-gradient-to-r from-blue-600 to-pink-600',
                                        'text-white transition-all duration-200',
                                        'hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105',
                                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
                                    )}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                                Press Enter to send, Shift+Enter for new line
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

AIChat.displayName = 'AIChat';
