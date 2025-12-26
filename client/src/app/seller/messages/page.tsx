'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  User,
  Mail,
  Clock,
  Send,
  Inbox,
  ArrowLeft,
  CheckCheck,
} from 'lucide-react';
import {
  getSellerMessages,
  getSellerUserConversation,
  sendSellerReply,
  markSellerMessagesAsRead,
} from '@/actions/sellerMessageActions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface Conversation {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  lastMessage: string | null;
  lastMessageType: string | null;
  lastMessageTime: Date | null;
  unreadCount: number;
}

interface Message {
  id: string;
  message: string;
  senderType: string;
  isRead: boolean;
  createdAt: Date;
}

export default function SellerMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [sellerId, setSellerId] = useState<string>('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get seller ID from localStorage
    const userDataString = localStorage.getItem('userData');
    
    if (!userDataString) {
      router.push('/seller/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(userDataString);
      if (userData.id) {
        setSellerId(userData.id);
        fetchConversations(userData.id);

        // Set up polling for real-time updates (every 15 seconds, only when tab is visible)
        const interval = setInterval(() => {
          if (document.visibilityState === 'visible') {
            fetchConversations(userData.id, true); // silent refresh
          }
        }, 15000);

        return () => clearInterval(interval);
      } else {
        router.push('/seller/auth/login');
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/seller/auth/login');
    }
  }, [router]);

  const fetchConversations = async (sellerIdParam: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await getSellerMessages(sellerIdParam);
      if (result.success) {
        setConversations(result.conversations);
      } else if (!silent) {
        toast.error(result.message || 'Failed to load messages');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error fetching conversations:', errorMessage, error);
      if (!silent) {
        toast.error('Failed to load messages');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSelectUser = async (conversation: Conversation) => {
    setSelectedUser(conversation);
    setLoading(true);

    try {
      const result = await getSellerUserConversation(sellerId, conversation.userId);
      if (result.success) {
        setMessages(result.messages);
        
        // Mark messages as read
        if (conversation.unreadCount > 0) {
          await markSellerMessagesAsRead(sellerId, conversation.userId);
          // Update conversation unread count
          setConversations(conversations.map(c => 
            c.userId === conversation.userId ? { ...c, unreadCount: 0 } : c
          ));
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error fetching conversation:', errorMessage, error);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  // Poll for new messages in active conversation
  useEffect(() => {
    if (!selectedUser || !sellerId) return;

    const refreshConversation = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const result = await getSellerUserConversation(sellerId, selectedUser.userId);
          if (result.success) {
            setMessages(result.messages);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
          console.error('Error refreshing conversation:', errorMessage, error);
        }
      }
    };

    // Refresh conversation every 10 seconds when viewing
    const interval = setInterval(refreshConversation, 10000);

    return () => clearInterval(interval);
  }, [selectedUser, sellerId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyMessage.trim() || !selectedUser) {
      return;
    }

    setSendingReply(true);
    try {
      const result = await sendSellerReply(sellerId, selectedUser.userId, replyMessage);
      
      if (result.success) {
        setReplyMessage('');
        
        // Refresh conversation
        const conversationResult = await getSellerUserConversation(sellerId, selectedUser.userId);
        if (conversationResult.success) {
          setMessages(conversationResult.messages);
        }
        
        // Refresh conversations list
        fetchConversations(sellerId);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error sending reply:', errorMessage, error);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-9 w-9 p-0 hover:bg-muted rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-card-foreground">Customer Messages</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 overflow-hidden rounded-xl sm:rounded-2xl">
            <Card className="h-full border-border shadow-lg">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-semibold">
                  <Inbox className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto h-[calc(100%-4rem)]">
                {loading && !selectedUser ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="w-10 h-10 text-muted-foreground animate-pulse mb-3" />
                    <p className="text-sm text-muted-foreground">Loading messages...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Inbox className="w-12 h-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground text-center">
                      No customer messages yet
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.userId}
                        className={`p-3 sm:p-4 cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                          selectedUser?.userId === conversation.userId ? 'bg-muted border-l-4 border-primary' : ''
                        }`}
                        onClick={() => handleSelectUser(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            {conversation.userImage ? (
                              <Image
                                src={conversation.userImage}
                                alt={conversation.userName || 'User'}
                                width={40}
                                height={40}
                                className="rounded-full ring-2 ring-border"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center ring-2 ring-border">
                                <User className="w-5 h-5 text-primary-foreground" />
                              </div>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-destructive hover:bg-destructive shadow-md">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">
                                {conversation.userName || 'User'}
                              </h3>
                              <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                                {conversation.lastMessageTime
                                  ? new Date(conversation.lastMessageTime).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })
                                  : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{conversation.userEmail}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {conversation.lastMessageType === 'seller' && <span className="font-medium">You: </span>}
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 overflow-hidden rounded-xl sm:rounded-2xl">
            <Card className="h-full flex flex-col border-border shadow-lg">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border/50 bg-card py-3 sm:py-4">
                    <div className="flex items-center gap-3">
                      {selectedUser.userImage ? (
                        <Image
                          src={selectedUser.userImage}
                          alt={selectedUser.userName || 'User'}
                          width={44}
                          height={44}
                          className="rounded-full ring-2 ring-border"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center ring-2 ring-border">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-sm sm:text-base truncate">{selectedUser.userName || 'User'}</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{selectedUser.userEmail}</p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/10">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">No messages yet</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderType === 'seller' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-sm ${
                                message.senderType === 'seller'
                                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                                  : 'bg-card text-card-foreground rounded-bl-sm border border-border'
                              }`}
                            >
                              <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>
                              <div className="flex items-center gap-1 mt-1.5">
                                <Clock className="w-3 h-3 opacity-60" />
                                <span className="text-[10px] sm:text-xs opacity-60">
                                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {message.senderType === 'seller' && message.isRead && (
                                  <CheckCheck className="w-3 h-3 ml-0.5 opacity-60" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </CardContent>

                  {/* Reply Form */}
                  <div className="border-t border-border/50 p-3 sm:p-4 bg-card">
                    <form onSubmit={handleSendReply} className="flex gap-2">
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={2}
                        className="resize-none text-sm bg-background border-border rounded-xl"
                        disabled={sendingReply}
                      />
                      <Button
                        type="submit"
                        disabled={sendingReply || !replyMessage.trim()}
                        className="gap-2 h-auto px-4 sm:px-5 font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{sendingReply ? 'Sending...' : 'Send'}</span>
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center max-w-sm">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Select a Conversation</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Choose a customer from the list to view and reply to their messages
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
