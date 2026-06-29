'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoWithText } from '@/components/Logo';

interface ConversationWithMessages {
  id: string;
  clientId: string;
  domesticId: string;
  domestic: {
    user: {
      name: string;
      photoUrl: string | null;
    };
  };
  messages: Array<{
    content: string;
    createdAt: string;
  }>;
  updatedAt: string;
}

export default function InboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchConversations(token);
  }, [router]);

  const fetchConversations = async (token: string) => {
    try {
      const res = await fetch('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br slate-950">
      {/* Header */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-8 items-center">
          <LogoWithText />
          <Link href="/dashboard" className="text-white/70 hover:text-white transition font-medium">
            Dashboard
          </Link>
          <Link href="/profile" className="text-white/70 hover:text-white transition font-medium">
            Mi Perfil
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Mensajes</h1>

        {conversations.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <p className="text-white/70 mb-4 text-lg">No tienes conversaciones aún</p>
            <Link href="/dashboard" className="text-purple-300 hover:text-purple-200 font-semibold transition">
              Buscar personal doméstico
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-500/50 hover:bg-white/20 rounded-xl p-6 transition block"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg">{conversation.domestic.user.name}</h3>
                    <p className="text-white/60 truncate">
                      {conversation.messages.length > 0
                        ? conversation.messages[conversation.messages.length - 1].content
                        : 'Sin mensajes'}
                    </p>
                  </div>
                  <p className="text-white/50 text-sm flex-shrink-0">
                    {new Date(conversation.updatedAt).toLocaleDateString('es-AR')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
