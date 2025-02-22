import { MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ChatBubble({ onClick }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a slight delay before showing the bubble for a nice entrance
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      <button
        onClick={onClick}
        className="relative group bg-gradient-to-br from-cyber-pink to-purple-600 p-4 rounded-full shadow-lg hover:shadow-cyber-pink/50 transition-all duration-300 hover:scale-110"
      >
        {/* Ping animation */}
        <div className="absolute inset-0 rounded-full bg-cyber-pink/20 animate-ping" />
        
        {/* Rotating border */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyber-pink/30 border-r-cyber-pink/20 animate-spin" />
        
        <MessageSquare className="w-6 h-6 text-white relative z-10" />
        
        {/* Hover tooltip */}
        <div className="absolute bottom-full right-0 mb-2 pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          <div className="bg-darker-slate px-3 py-1 rounded-lg border border-cyber-pink/20 text-white text-sm whitespace-nowrap">
            Chat with AI Assistant
          </div>
        </div>
      </button>
    </div>
  );
} 