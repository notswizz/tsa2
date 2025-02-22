import Head from 'next/head';
import Layout from '@/components/Layout';
import ChatInterface from '@/features/ai-assistant/components/ChatInterface';

export default function AIAssistant() {
  return (
    <Layout>
      <Head>
        <title>AI Assistant - The Smith Agency CRM</title>
      </Head>

      <div className="h-[calc(100vh-6rem)] p-4">
        <ChatInterface />
      </div>
    </Layout>
  );
} 