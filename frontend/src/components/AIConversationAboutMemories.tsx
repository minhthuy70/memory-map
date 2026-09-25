'use client';

import { useState } from 'react';
import {
  Bot,
  CheckCircle,
  Info,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Star,
  User,
  Zap
} from 'lucide-react';

interface AIConversationAboutMemoriesProps {
  onCancel?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  referencedMemories?: string[];
}

interface RetrievedMemory {
  id: string;
  title: string;
  date: string;
  relevance: number;
  snippet: string;
}

interface ConversationSession {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

export default function AIConversationAboutMemories({ onCancel }: AIConversationAboutMemoriesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [inputMessage, setInputMessage] = useState('');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'user', content: 'Tell me about my beach memories from last summer', timestamp: '2024-01-15 10:30', referencedMemories: [] },
    { id: '2', role: 'assistant', content: 'Based on your memories, you had several beach experiences last summer. The most memorable was the sunny day at California Beach on July 15th where you spent time with friends and played volleyball. You also captured beautiful sunset photos that evening.', timestamp: '2024-01-15 10:31', referencedMemories: ['1', '2', '3'] },
    { id: '3', role: 'user', content: 'What was my mood during those trips?', timestamp: '2024-01-15 10:32', referencedMemories: [] },
    { id: '4', role: 'assistant', content: 'Your mood during beach trips was predominantly happy and energetic. The memories show high positive sentiment scores, especially when you were with friends or during sunset moments. These were some of your most joyful experiences.', timestamp: '2024-01-15 10:33', referencedMemories: ['1', '2'] },
  ]);

  const [retrievedMemories, setRetrievedMemories] = useState<RetrievedMemory[]>([
    { id: '1', title: 'Sunny Beach Day', date: '2024-07-15', relevance: 0.95, snippet: 'Sunny day at the beach with friends...' },
    { id: '2', title: 'Beach Sunset', date: '2024-07-15', relevance: 0.88, snippet: 'Beautiful sunset at the beach...' },
    { id: '3', title: 'Beach Volleyball', date: '2024-07-15', relevance: 0.82, snippet: 'Playing volleyball with friends...' },
  ]);

  const [conversationSessions, setConversationSessions] = useState<ConversationSession[]>([
    { id: '1', title: 'Beach Memories', createdAt: '2024-01-15', messageCount: 4 },
    { id: '2', title: 'Travel History', createdAt: '2024-02-20', messageCount: 6 },
  ]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      referencedMemories: [],
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Based on your memories, I found relevant information about "${inputMessage}". Let me provide insights based on your personal experiences.`,
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      referencedMemories: ['1', '2'],
    };

    setChatMessages([...chatMessages, userMessage, assistantMessage]);
    setInputMessage('');
  };

  const startNewSession = () => {
    const newSession: ConversationSession = {
      id: Date.now().toString(),
      title: `Conversation ${conversationSessions.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
      messageCount: 0,
    };
    setConversationSessions([...conversationSessions, newSession]);
    setChatMessages([]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-xl">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Conversation About Memories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chat with AI about your memories (RAG-based)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isChatEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isChatEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Messages</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{chatMessages.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sessions</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{conversationSessions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Retrieved</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{retrievedMemories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Relevance</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{(retrievedMemories.reduce((acc, m) => acc + m.relevance, 0) / retrievedMemories.length).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isChatEnabled}
              onChange={(e) => setIsChatEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Chat</span>
          </div>
          <button
            type="button"
            onClick={startNewSession}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <MessageSquare className="h-3 w-3" />
            New Session
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Conversation Sessions</h4>
          <div className="space-y-2">
            {conversationSessions.map((session) => (
              <div key={session.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-fuchsia-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{session.title}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{session.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{session.messageCount} messages</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Chat</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
            {chatMessages.map((message) => (
              <div key={message.id} className={`p-3 rounded-lg border ${message.role === 'user' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ml-8' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 mr-8'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'user' ? <User className="h-4 w-4 text-blue-500" /> : <Bot className="h-4 w-4 text-fuchsia-500" />}
                  <span className="text-xs text-slate-500 dark:text-slate-400">{message.timestamp}</span>
                </div>
                <p className="text-xs text-slate-900 dark:text-white">{message.content}</p>
                {message.referencedMemories && message.referencedMemories.length > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <Search className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {message.referencedMemories.length} memories referenced
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your memories..."
              className="flex-1 px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              type="button"
              onClick={sendMessage}
              className="px-3 py-2 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
            >
              <Send className="h-3 w-3" />
              Send
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Retrieved Memories (RAG)</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {retrievedMemories.map((memory) => (
              <div key={memory.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-fuchsia-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory.title}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{memory.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{(memory.relevance * 100).toFixed(0)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">relevance</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{memory.snippet}</p>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">RAG Chat Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Chat with AI about your personal memories</li>
              <li>• RAG retrieves relevant memories for context</li>
              <li>• Conversation sessions for different topics</li>
              <li>• AI references specific memories in responses</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
