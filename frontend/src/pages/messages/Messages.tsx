import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Reply,
  Forward,
  Archive,
  MoreHorizontal,
  Paperclip,
  Smile
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'admin';
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  attachments: string[];
  threadId: string;
}

interface MessageThread {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
  }>;
  lastMessage: Message;
  unreadCount: number;
  isActive: boolean;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    // Simulate loading messages data
    const loadMessages = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'S001',
          senderName: 'Michael Chen',
          senderRole: 'student',
          recipientId: user?.id || '',
          recipientName: user?.firstName + ' ' + user?.lastName || '',
          subject: 'Question about tomorrow\'s exam',
          content: 'Hi, I have a question about the Mathematics exam tomorrow. Can you clarify the topics that will be covered? I want to make sure I\'m studying the right material.',
          timestamp: '2024-03-15T14:30:00Z',
          isRead: false,
          isImportant: true,
          attachments: [],
          threadId: 'thread1'
        },
        {
          id: '2',
          senderId: user?.id || '',
          senderName: user?.firstName + ' ' + user?.lastName || '',
          senderRole: 'teacher',
          recipientId: 'S001',
          recipientName: 'Michael Chen',
          subject: 'Re: Question about tomorrow\'s exam',
          content: 'Hi Michael, the exam will cover Chapters 5-8 as mentioned in the syllabus. Focus on quadratic equations, functions, and basic calculus. Let me know if you need any clarification!',
          timestamp: '2024-03-15T15:00:00Z',
          isRead: true,
          isImportant: false,
          attachments: [],
          threadId: 'thread1'
        },
        {
          id: '3',
          senderId: 'S002',
          senderName: 'Emily Wilson',
          senderRole: 'student',
          recipientId: user?.id || '',
          recipientName: user?.firstName + ' ' + user?.lastName || '',
          subject: 'Physics lab report submission',
          content: 'I\'ve completed my physics lab report and uploaded it to the portal. Could you please review it when you have time? I\'d appreciate any feedback.',
          timestamp: '2024-03-14T16:45:00Z',
          isRead: true,
          isImportant: false,
          attachments: ['lab_report.pdf'],
          threadId: 'thread2'
        },
        {
          id: '4',
          senderId: 'S003',
          senderName: 'David Brown',
          senderRole: 'student',
          recipientId: user?.id || '',
          recipientName: user?.firstName + ' ' + user?.lastName || '',
          subject: 'Request for extra help',
          content: 'I\'m struggling with the Chemistry concepts from last week\'s class. Would it be possible to schedule some extra help sessions? I\'m available after school on Tuesdays and Thursdays.',
          timestamp: '2024-03-13T11:20:00Z',
          isRead: false,
          isImportant: true,
          attachments: [],
          threadId: 'thread3'
        },
        {
          id: '5',
          senderId: user?.id || '',
          senderName: user?.firstName + ' ' + user?.lastName || '',
          senderRole: 'teacher',
          recipientId: 'S003',
          recipientName: 'David Brown',
          subject: 'Re: Request for extra help',
          content: 'Of course, David! I\'d be happy to help. Let\'s meet on Tuesday after school at 3:30 PM in Room 205. We can go through the concepts you\'re finding challenging.',
          timestamp: '2024-03-13T14:15:00Z',
          isRead: true,
          isImportant: false,
          attachments: [],
          threadId: 'thread3'
        }
      ];

      // Filter messages based on user role
      let filteredMessages = mockMessages;
      if (user?.role === 'teacher') {
        // Show messages where teacher is sender or recipient
        filteredMessages = mockMessages.filter(
          msg => msg.senderId === user.id || msg.recipientId === user.id
        );
      }

      // Create message threads
      const threadMap = new Map<string, MessageThread>();
      
      filteredMessages.forEach(message => {
        if (!threadMap.has(message.threadId)) {
          threadMap.set(message.threadId, {
            id: message.threadId,
            participants: [
              {
                id: message.senderId,
                name: message.senderName,
                role: message.senderRole
              },
              {
                id: message.recipientId,
                name: message.recipientName,
                role: message.senderRole === 'student' ? 'teacher' : 'student'
              }
            ],
            lastMessage: message,
            unreadCount: 0,
            isActive: true
          });
        }
        
        const thread = threadMap.get(message.threadId)!;
        if (message.timestamp > thread.lastMessage.timestamp) {
          thread.lastMessage = message;
        }
        if (!message.isRead && message.senderId !== user?.id) {
          thread.unreadCount++;
        }
      });

      setMessages(filteredMessages);
      setThreads(Array.from(threadMap.values()));
      setIsLoading(false);
    };

    loadMessages();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getThreadMessages = (threadId: string) => {
    return messages
      .filter(msg => msg.threadId === threadId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      senderName: user?.firstName + ' ' + user?.lastName || '',
      senderRole: 'teacher',
      recipientId: selectedThread.participants.find(p => p.id !== user?.id)?.id || '',
      recipientName: selectedThread.participants.find(p => p.id !== user?.id)?.name || '',
      subject: 'Re: ' + selectedThread.lastMessage.subject,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
      isImportant: false,
      attachments: [],
      threadId: selectedThread.id
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update thread
    setThreads(prev => 
      prev.map(thread => 
        thread.id === selectedThread.id 
          ? { ...thread, lastMessage: message, unreadCount: 0 }
          : thread
      )
    );
  };

  const filteredThreads = threads.filter(thread => {
    if (searchTerm) {
      return thread.participants.some(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || thread.lastMessage.subject.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (filterType === 'unread') {
      return thread.unreadCount > 0;
    }
    if (filterType === 'important') {
      return thread.lastMessage.isImportant;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">
                Communicate with your students and colleagues
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCompose(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Message Threads */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="important">Important</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedThread?.id === thread.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {thread.participants.find(p => p.id !== user?.id)?.name}
                          </h3>
                          {thread.lastMessage.isImportant && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {thread.lastMessage.subject}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(thread.lastMessage.timestamp)}
                        </p>
                      </div>
                      {thread.unreadCount > 0 && (
                        <div className="ml-2">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                            {thread.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredThreads.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No messages match your search.' : 'Start a conversation to get started.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2">
            {selectedThread ? (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedThread.participants.find(p => p.id !== user?.id)?.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedThread.lastMessage.subject}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Forward className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Archive className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {getThreadMessages(selectedThread.id).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">
                            {message.senderName}
                          </span>
                          <span className="text-xs opacity-75">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-opacity-20">
                            <div className="flex items-center text-xs opacity-75">
                              <Paperclip className="w-3 h-3 mr-1" />
                              {message.attachments.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 