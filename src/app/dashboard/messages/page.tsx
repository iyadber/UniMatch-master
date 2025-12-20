'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  User,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Image,
  Mic,
  Check,
  CheckCheck,
  Clock,
  ArrowLeft,
  Star,
  MessageSquare,
  Circle,
  Settings,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

// Types
interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: boolean;
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    role: 'Mathematics Tutor',
    lastMessage: 'Great progress on your calculus work!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    role: 'Computer Science Tutor',
    lastMessage: 'The code looks much better now',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Brown',
    role: 'Physics Tutor',
    lastMessage: 'See you in our next session!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '4',
    name: 'Dr. Ahmed Hassan',
    role: 'Chemistry Tutor',
    lastMessage: 'Don\'t forget to review the organic chemistry notes',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: '5',
    name: 'Prof. Lisa Park',
    role: 'Biology Tutor',
    lastMessage: 'The lab report looks excellent!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 0,
    isOnline: true,
  },
];

// Mock messages for each contact
const mockMessagesByContact: Record<string, Message[]> = {
  '1': [
    { id: '1', content: 'Hi Dr. Wilson! I had a question about the integration problem from yesterday.', senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60), status: 'read', type: 'text' },
    { id: '2', content: 'Of course! Which problem are you referring to?', senderId: '1', timestamp: new Date(Date.now() - 1000 * 60 * 55), status: 'read', type: 'text' },
    { id: '3', content: 'The one with the trigonometric substitution. I\'m stuck on the last step.', senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 50), status: 'read', type: 'text' },
    { id: '4', content: 'Ah yes! Remember to substitute back to the original variable after integrating. Let me show you...', senderId: '1', timestamp: new Date(Date.now() - 1000 * 60 * 45), status: 'read', type: 'text' },
    { id: '5', content: 'That makes so much more sense now! Thank you!', senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 10), status: 'read', type: 'text' },
    { id: '6', content: 'Great progress on your calculus work!', senderId: '1', timestamp: new Date(Date.now() - 1000 * 60 * 5), status: 'read', type: 'text' },
  ],
  '2': [
    { id: '1', content: 'Professor Chen, I finished the Python assignment!', senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'read', type: 'text' },
    { id: '2', content: 'Excellent! Let me take a look at your code.', senderId: '2', timestamp: new Date(Date.now() - 1000 * 60 * 60), status: 'read', type: 'text' },
    { id: '3', content: 'The code looks much better now', senderId: '2', timestamp: new Date(Date.now() - 1000 * 60 * 30), status: 'read', type: 'text' },
  ],
  '3': [
    { id: '1', content: 'Thank you for the physics session today!', senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), status: 'read', type: 'text' },
    { id: '2', content: 'You\'re welcome! You\'re making great progress with quantum mechanics.', senderId: '3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), status: 'read', type: 'text' },
    { id: '3', content: 'See you in our next session!', senderId: '3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'read', type: 'text' },
  ],
  '4': [
    { id: '1', content: 'Dr. Hassan, I have a question about organic chemistry reactions.', senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), status: 'read', type: 'text' },
    { id: '2', content: 'Don\'t forget to review the organic chemistry notes', senderId: '4', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'delivered', type: 'text' },
  ],
  '5': [
    { id: '1', content: 'I submitted my lab report!', senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49), status: 'read', type: 'text' },
    { id: '2', content: 'The lab report looks excellent!', senderId: '5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), status: 'read', type: 'text' },
  ],
};

// Helper function to format time
const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Contact Item Component
const ContactItem = ({
  contact,
  isSelected,
  onClick
}: {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={clsx(
      'w-full p-4 flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-gray-800',
      isSelected && 'bg-blue-50 dark:bg-blue-900/20'
    )}
  >
    {/* Avatar */}
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold">
        {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      {contact.isOnline && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
      )}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {contact.name}
        </h3>
        {contact.lastMessageTime && (
          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">
            {formatTime(contact.lastMessageTime)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {contact.isTyping ? (
            <span className="text-green-500">typing...</span>
          ) : (
            contact.lastMessage || contact.role
          )}
        </p>
        {contact.unreadCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full shrink-0">
            {contact.unreadCount}
          </span>
        )}
      </div>
    </div>
  </motion.button>
);

// Message Bubble Component
const MessageBubble = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={clsx('flex', isOwn ? 'justify-end' : 'justify-start')}
  >
    <div
      className={clsx(
        'max-w-[70%] px-4 py-2.5 rounded-2xl',
        isOwn
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
      )}
    >
      <p className="text-sm leading-relaxed">{message.content}</p>
      <div className={clsx(
        'flex items-center justify-end gap-1 mt-1',
        isOwn ? 'text-white/70' : 'text-gray-400'
      )}>
        <span className="text-[10px]">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isOwn && (
          <span className="ml-0.5">
            {message.status === 'sending' && <Clock className="w-3 h-3" />}
            {message.status === 'sent' && <Check className="w-3 h-3" />}
            {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
            {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-300" />}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

// Main Messages Page Component
export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      const contactMessages = mockMessagesByContact[selectedContact.id] || [];
      setMessages(contactMessages);

      // Clear unread count
      setContacts(prev => prev.map(c =>
        c.id === selectedContact.id ? { ...c, unreadCount: 0 } : c
      ));
    }
  }, [selectedContact]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when contact is selected
  useEffect(() => {
    if (selectedContact && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedContact]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowMobileChat(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: 'me',
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === message.id ? { ...m, status: 'sent' } : m
      ));

      // Simulate delivered
      setTimeout(() => {
        setMessages(prev => prev.map(m =>
          m.id === message.id ? { ...m, status: 'delivered' } : m
        ));

        // Simulate typing indicator
        setContacts(prev => prev.map(c =>
          c.id === selectedContact.id ? { ...c, isTyping: true } : c
        ));

        // Simulate response
        setTimeout(() => {
          setContacts(prev => prev.map(c =>
            c.id === selectedContact.id ? { ...c, isTyping: false } : c
          ));

          // AI-like response
          const responses = [
            "That's a great question! Let me help you with that.",
            "I understand. Let's work through this together.",
            "Excellent progress! Keep up the good work.",
            "Sure, I'd be happy to explain that further.",
            "Let me know if you need any clarification.",
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];

          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: randomResponse,
            senderId: selectedContact.id,
            timestamp: new Date(),
            status: 'read',
            type: 'text',
          };

          setMessages(prev => [...prev, aiMessage]);

          // Mark original message as read
          setMessages(prev => prev.map(m =>
            m.id === message.id ? { ...m, status: 'read' } : m
          ));
        }, 2000);
      }, 500);
    }, 300);

    // Update last message in contacts
    setContacts(prev => prev.map(c =>
      c.id === selectedContact.id
        ? { ...c, lastMessage: newMessage.trim(), lastMessageTime: new Date() }
        : c
    ));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-8rem)]"
    >
      <div className="flex h-full gap-0 lg:gap-6">
        {/* Contacts Sidebar */}
        <Card className={clsx(
          'flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 overflow-hidden',
          'w-full lg:w-96 shrink-0',
          showMobileChat && 'hidden lg:flex'
        )}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Messages
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="w-9 h-9 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="secondary" className="w-9 h-9 p-0">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border-0 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4">
                <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              <div>
                {filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContact?.id === contact.id}
                    onClick={() => handleSelectContact(contact)}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className={clsx(
          'flex-1 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 overflow-hidden',
          !showMobileChat && !selectedContact && 'hidden lg:flex'
        )}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                      {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    {selectedContact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {selectedContact.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {contacts.find(c => c.id === selectedContact.id)?.isTyping
                        ? <span className="text-green-500">typing...</span>
                        : selectedContact.isOnline
                          ? 'Online'
                          : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="secondary" className="w-9 h-9 p-0">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" className="w-9 h-9 p-0">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" className="w-9 h-9 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === 'me'}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="w-10 h-10 p-0 shrink-0">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button variant="secondary" className="w-10 h-10 p-0 shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border-0 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {newMessage.trim() ? (
                    <Button onClick={handleSendMessage} className="w-10 h-10 p-0 shrink-0">
                      <Send className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-10 h-10 p-0 shrink-0">
                      <Mic className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Messages
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                Connect with your tutors and students. Select a conversation from the list to start messaging.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                  <span>{contacts.filter(c => c.isOnline).length} online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                    {contacts.reduce((acc, c) => acc + c.unreadCount, 0)}
                  </span>
                  <span>unread messages</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}