import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Calendar, 
  Users, 
  Building2, 
  Menu,
  X,
  Home
} from 'lucide-react';
import ChatBubble from './common/ChatBubble';
import ChatModal from './common/ChatModal';
import Image from 'next/image';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/clients', label: 'Clients', icon: Building2 },
    { href: '/staff', label: 'Staff', icon: Users },
    { href: '/bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-tsa-black text-tsa-white">
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-tsa-black/80 backdrop-blur-sm border-b border-tsa-accent/10 h-16 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/tsalogo.png"
                alt="The Smith Agency Logo"
                width={40}
                height={40}
                className="rounded-none object-contain"
              />
              <span className="text-xl font-display text-tsa-white">The Smith Agency</span>
            </Link>
            <div className="flex items-center space-x-8">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-tsa-white bg-tsa-white/5'
                      : 'text-tsa-light hover:text-tsa-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-light">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-tsa-black/80 backdrop-blur-sm border-b border-tsa-accent/10 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/tsalogo.png"
              alt="The Smith Agency Logo"
              width={32}
              height={32}
              className="rounded-none object-contain"
            />
            <span className="text-lg font-display text-tsa-white">TSA</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-tsa-light hover:text-tsa-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-tsa-black/95 border-b border-tsa-accent/10 py-2 px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-tsa-white bg-tsa-white/5'
                    : 'text-tsa-light hover:text-tsa-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-light">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
        <div className="min-h-[calc(100vh-6rem)]">
          {children}
        </div>
      </main>

      {/* Chat Components - Adjusted for mobile */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBubble onClick={() => setIsChatOpen(true)} />
      </div>
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
} 