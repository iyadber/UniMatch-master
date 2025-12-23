'use client';

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  ArrowLeft,
  MessageSquare,
  Circle,
  Settings,
  Plus,
  Loader2,
  UserPlus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

// Types
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
  status?: string;
  attachments?: Array<{ url: string; type: string; name: string }>;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  role: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: boolean;
}

// Helper function to format time
const formatTime = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
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
        {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
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
      {/* Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="mt-2 space-y-1">
          {message.attachments.map((attachment, idx) => (
            <a
              key={idx}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'block text-xs underline',
                isOwn ? 'text-blue-200' : 'text-blue-500'
              )}
            >
              📎 {attachment.name}
            </a>
          ))}
        </div>
      )}
      <div className={clsx(
        'flex items-center justify-end gap-1 mt-1',
        isOwn ? 'text-white/70' : 'text-gray-400'
      )}>
        <span className="text-[10px]">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isOwn && (
          <span className="ml-0.5">
            {message.status === 'sending' && <Clock className="w-3 h-3" />}
            {message.status === 'sent' && <Check className="w-3 h-3" />}
            {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
            {(message.status === 'read' || message.read) && <CheckCheck className="w-3 h-3 text-blue-300" />}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

// Main Messages Page Component
export default function MessagesPage() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [potentialContacts, setPotentialContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = session?.user?.id;

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');

      const data = await response.json();

      setContacts(data.conversations || []);
      setPotentialContacts(data.potentialContacts || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load conversations on mount
  useEffect(() => {
    if (session?.user) {
      fetchConversations();
    }
  }, [session, fetchConversations]);

  // Fetch messages when contact is selected
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedContact) return;

      setMessagesLoading(true);
      try {
        const response = await fetch(`/api/messages?userId=${selectedContact.id}`);
        if (!response.ok) throw new Error('Failed to fetch messages');

        const data = await response.json();
        // Reverse to show oldest first
        setMessages(Array.isArray(data) ? data.reverse() : []);

        // Clear unread count for this contact
        setContacts(prev => prev.map(c =>
          c.id === selectedContact.id ? { ...c, unreadCount: 0 } : c
        ));
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    }

    fetchMessages();
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
    setShowNewChat(false);
  };

  const handleStartNewChat = (contact: Contact) => {
    // Move from potential contacts to active contacts
    setContacts(prev => {
      if (prev.find(c => c.id === contact.id)) return prev;
      return [contact, ...prev];
    });
    setPotentialContacts(prev => prev.filter(c => c.id !== contact.id));
    setSelectedContact(contact);
    setShowMobileChat(true);
    setShowNewChat(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !currentUserId || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistically add the message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      senderId: currentUserId,
      receiverId: selectedContact.id,
      createdAt: new Date().toISOString(),
      read: false,
      status: 'sending'
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const formData = new FormData();
      formData.append('content', messageContent);
      formData.append('receiverId', selectedContact.id);

      const response = await fetch('/api/messages', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to send message');

      const sentMessage = await response.json();

      // Replace optimistic message with real one
      setMessages(prev => prev.map(m =>
        m.id === optimisticMessage.id ? { ...sentMessage, status: 'sent' } : m
      ));

      // Update last message in contacts
      setContacts(prev => prev.map(c =>
        c.id === selectedContact.id
          ? { ...c, lastMessage: messageContent, lastMessageTime: new Date().toISOString() }
          : c
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      // Mark message as failed
      setMessages(prev => prev.map(m =>
        m.id === optimisticMessage.id ? { ...m, status: 'failed' } : m
      ));
    } finally {
      setSending(false);
    }
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

  const filteredPotentialContacts = potentialContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = contacts.reduce((acc, c) => acc + c.unreadCount, 0);

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

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
                <Button
                  variant="secondary"
                  className="w-9 h-9 p-0"
                  onClick={() => setShowNewChat(!showNewChat)}
                >
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

          {/* New Chat Section */}
          {showNewChat && potentialContacts.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <UserPlus className="w-3 h-3" />
                  Start a new conversation
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredPotentialContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    isSelected={false}
                    onClick={() => handleStartNewChat(contact)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 && filteredPotentialContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4">
                <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs text-center mt-2">
                  {session?.user?.role === 'student'
                    ? 'Enroll in a course or book a session to message teachers'
                    : 'Your students will appear here'}
                </p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4">
                <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No matching conversations</p>
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
                      {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
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
                      {selectedContact.role}
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
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === currentUserId}
                    />
                  ))
                )}
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
                      disabled={sending}
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border-0 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="w-10 h-10 p-0 shrink-0"
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
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
                Connect with your {session?.user?.role === 'student' ? 'tutors' : 'students'}. Select a conversation from the list to start messaging.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                    {contacts.length}
                  </span>
                  <span>conversations</span>
                </div>
                {totalUnread > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-xs font-medium">
                      {totalUnread}
                    </span>
                    <span>unread</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}