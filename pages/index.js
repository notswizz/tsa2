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
      </Head>
      
      <div className="space-y-6 md:space-y-8">
        {/* Hero Section with Chat Button */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-pink-200/20 p-4 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:gap-8 text-center md:text-left">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                  <Image
                    src="/tsalogo.png"
                    alt="The Smith Agency Logo"
                    width={100}
                    height={100}
                    className="relative rounded-full ring-2 ring-pink-500/20"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                  The Smith Agency
                  <span className="text-pink-400"><Sparkles className="h-6 w-6 md:h-8 md:w-8" /></span>
                </h1>
                <p className="text-base md:text-lg text-gray-400">Talent Management System</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-pink-500/20 backdrop-blur-xl border border-pink-300/30 rounded-xl hover:bg-pink-500/30 transition-all duration-300 group"
            >
              <Bot className="h-5 w-5 text-pink-300 group-hover:scale-110 transition-transform" />
              <span className="text-pink-100">AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative cyber-box p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-3 md:p-4 rounded-xl">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.totalStaff}</p>
                  <p className="text-sm md:text-base text-gray-400">Total Staff</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-pink-200/10">
                <Link href="/staff" className="text-pink-400 hover:text-pink-300 flex items-center gap-2 text-sm">
                  View All Staff <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative cyber-box p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-3 md:p-4 rounded-xl">
                  <Building2 className="h-6 w-6 md:h-8 md:w-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.totalClients}</p>
                  <p className="text-sm md:text-base text-gray-400">Total Clients</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-200/10">
                <Link href="/clients" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 text-sm">
                  View All Clients <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group sm:col-span-2 md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative cyber-box p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3 md:p-4 rounded-xl">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.totalBookings}</p>
                  <p className="text-sm md:text-base text-gray-400">Active Bookings</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200/10">
                <Link href="/bookings" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm">
                  View All Bookings <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="cyber-box p-4 md:p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-pink-400" />
                  Quick Actions
                </h2>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-pink-500/10 border border-pink-300/20 rounded-lg hover:bg-pink-500/20 transition-all duration-200 group"
                >
                  <Bot className="h-4 w-4 text-pink-300 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-pink-100">Need Help?</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/staff" className="group p-4 rounded-xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-pink-200/10 hover:border-pink-200/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                      <UserCheck className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Manage Staff</h3>
                      <p className="text-sm text-gray-400">Add or update staff profiles</p>
                    </div>
                  </div>
                </Link>

                <Link href="/clients" className="group p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-200/10 hover:border-emerald-200/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                      <Briefcase className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Manage Clients</h3>
                      <p className="text-sm text-gray-400">Handle client information</p>
                    </div>
                  </div>
                </Link>

                <Link href="/bookings" className="group p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-200/10 hover:border-blue-200/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Bookings</h3>
                      <p className="text-sm text-gray-400">View and manage bookings</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Location Stats */}
          <div className="cyber-box p-4 md:p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-pink-400" />
              Staff by Location
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.staffByLocation).map(([location, count]) => (
                <div key={location} className="p-4 rounded-xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-pink-200/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{locationNames[location]}</span>
                    <span className="text-pink-400 font-medium">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-dark-slate/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                      style={{ 
                        width: `${(count / stats.totalStaff) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Modal */}
        <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </Layout>
  );
}
