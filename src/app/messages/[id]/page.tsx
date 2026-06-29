'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isModeratorAlert: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
}

interface Conversation {
  id: string;
  clientId: string;
  domesticId: string;
  domestic: {
    user: {
      name: string;
      photoUrl: string | null;
    };
  };
}

export default function MessagesPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchData(token);
    const interval = setInterval(() => fetchMessages(token), 3000);
    return () => clearInterval(interval);
  }, [conversationId, router]);

  const fetchData = async (token: string) => {
    try {
      // Get user info
      const userRes = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      // Get conversation
      const convRes = await fetch(
        `/api/conversations/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const convData = await convRes.json();
      setConversation(convData);

      await fetchMessages(token);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchMessages = async (token: string) => {
    try {
      const res = await fetch(
        `/api/messages?conversationId=${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          content: newMessage,
          receiverId: conversation!.domesticId,
        }),
      });

      if (!res.ok) throw new Error('Error sending message');

      const data = await res.json();

      if (data.warning) {
        alert(data.warning);
      }

      setNewMessage('');
      await fetchMessages(token || '');
    } catch (error) {
      alert('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
              ← Volver
            </Link>
            {conversation && (
              <div>
                <h1 className="font-semibold text-gray-900">
                  {conversation.domestic.user.name}
                </h1>
                <p className="text-sm text-gray-600">En línea</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            Inicia la conversación
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.senderId === user?.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="break-words">{msg.content}</p>
                {msg.isModeratorAlert && (
                  <p className="text-xs mt-1 opacity-75">
                    ⚠️ Contiene información de contacto
                  </p>
                )}
                <p className="text-xs mt-1 opacity-75">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Tus primeros 3 mensajes son gratis. Para compartir contacto directo, necesitas comprar créditos.
          </p>
        </div>
      </div>
    </div>
  );
}
