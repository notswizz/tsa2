import Head from "next/head";
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Users, Building2, Calendar, MapPin, 
  UserCheck, Clock, Briefcase, ChevronRight, Sparkles,
  Bot, MessageSquare
} from 'lucide-react';
import Image from 'next/image';
import ChatModal from '@/components/common/ChatModal';

export default function Home() {
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalClients: 0,
    totalBookings: 0,
    staffByLocation: {},
    recentActivity: []
  });

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch staff stats
      const staffRes = await fetch('/api/staff');
      const staff = await staffRes.json();
      
      // Fetch client stats
      const clientsRes = await fetch('/api/clients');
      const clients = await clientsRes.json();

      // Calculate stats
      const staffByLocation = staff.reduce((acc, s) => {
        s.location.forEach(loc => {
          acc[loc] = (acc[loc] || 0) + 1;
        });
        return acc;
      }, {});

      setStats({
        totalStaff: staff.length,
        totalClients: clients.length,
        totalBookings: 0,
        staffByLocation,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const locationNames = {
    'ATL': 'Atlanta',
    'NYC': 'New York',
    'LA': 'Los Angeles',
    'DAL': 'Dallas'
  };

  return (
    <Layout>
      <Head>
        <title>Dashboard - The Smith Agency CRM</title>
        <meta name="description" content="The Smith Agency CRM Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-elegant border border-tsa-accent/10 p-8 md:p-12">
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:gap-8 text-center md:text-left">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="relative">
                  <Image
                    src="/tsalogo.png"
                    alt="The Smith Agency Logo"
                    width={120}
                    height={120}
                    className="relative object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-tsa-white mb-3">
                  The Smith Agency
                </h1>
                <p className="text-lg md:text-xl text-tsa-light font-light">Talent Management System</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsChatOpen(true)}
              className="elegant-button flex items-center justify-center gap-2 group"
            >
              <Bot className="h-5 w-5 text-tsa-black group-hover:scale-110 transition-transform" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="elegant-box p-6 md:p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-lg bg-tsa-white/5">
                <Users className="h-8 w-8 text-tsa-white" />
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display text-tsa-white mb-2">{stats.totalStaff}</p>
                <p className="text-tsa-light font-light">Total Staff</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-tsa-accent/10">
              <Link href="/staff" className="text-tsa-white hover:text-tsa-light transition-colors flex items-center gap-2">
                View All Staff <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="elegant-box p-6 md:p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-lg bg-tsa-white/5">
                <Building2 className="h-8 w-8 text-tsa-white" />
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display text-tsa-white mb-2">{stats.totalClients}</p>
                <p className="text-tsa-light font-light">Total Clients</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-tsa-accent/10">
              <Link href="/clients" className="text-tsa-white hover:text-tsa-light transition-colors flex items-center gap-2">
                View All Clients <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="elegant-box p-6 md:p-8 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-lg bg-tsa-white/5">
                <Calendar className="h-8 w-8 text-tsa-white" />
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display text-tsa-white mb-2">{stats.totalBookings}</p>
                <p className="text-tsa-light font-light">Active Bookings</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-tsa-accent/10">
              <Link href="/bookings" className="text-tsa-white hover:text-tsa-light transition-colors flex items-center gap-2">
                View All Bookings <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="elegant-box p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-display text-tsa-white">Quick Actions</h2>
            <button
              onClick={() => setIsChatOpen(true)}
              className="secondary-button w-full sm:w-auto flex items-center justify-center gap-2 group"
            >
              <Bot className="h-4 w-4 text-tsa-white group-hover:scale-110 transition-transform" />
              <span className="text-sm">Need Help?</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/staff" className="elegant-box p-6 hover:shadow-hover transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-tsa-white/5">
                  <UserCheck className="h-6 w-6 text-tsa-white" />
                </div>
                <div>
                  <h3 className="text-lg font-display text-tsa-white mb-1">Manage Staff</h3>
                  <p className="text-sm text-tsa-light">Add or update staff profiles</p>
                </div>
              </div>
            </Link>

            <Link href="/clients" className="elegant-box p-6 hover:shadow-hover transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-tsa-white/5">
                  <Briefcase className="h-6 w-6 text-tsa-white" />
                </div>
                <div>
                  <h3 className="text-lg font-display text-tsa-white mb-1">Manage Clients</h3>
                  <p className="text-sm text-tsa-light">Handle client information</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </Layout>
  );
}
