import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-dark-slate/80 backdrop-blur-sm border-b border-cyber-pink/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-white hover:text-cyber-pink transition-colors">
            The Smith Agency <span className="text-cyber-pink">CRM</span>
          </Link>
          <div className="flex space-x-6">
            <Link href="/staff" className="text-gray-300 hover:text-cyber-pink transition-colors">
              Staff
            </Link>
            <Link href="/clients" className="text-gray-300 hover:text-cyber-pink transition-colors">
              Clients
            </Link>
            <Link href="/bookings" className="text-gray-300 hover:text-cyber-pink transition-colors">
              Bookings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 