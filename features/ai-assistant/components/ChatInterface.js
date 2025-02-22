import { useState } from 'react';
import ChatModal from './ChatModal';

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full flex items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
          />
        </svg>
        Open AI Assistant
      </button>

      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
} 