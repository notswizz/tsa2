import { useState, useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bot, X, Send, Loader2 } from 'lucide-react';

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botMessage = { type: 'bot', content: 'This is a simulated response. Replace with actual AI integration.' };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-2xl h-[90vh] md:h-[600px] bg-gradient-to-br from-darker-slate to-black/50 rounded-2xl border border-pink-200/20 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-pink-200/10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="w-6 h-6 text-pink-400" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full" />
              </div>
              <h2 className="text-xl font-bold text-white">AI Assistant</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-pink-500/20 text-white ml-4'
                      : 'bg-dark-slate text-white mr-4'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-slate text-white p-3 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-pink-200/10">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-dark-slate/50 border border-pink-200/20 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-pink-400 hover:text-pink-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 opacity-20" />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 via-purple-600 to-pink-500 opacity-20" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-pink-500 via-purple-600 to-pink-500 opacity-20" />
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-pink-500 via-purple-600 to-pink-500 opacity-20" />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 