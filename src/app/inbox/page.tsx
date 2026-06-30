'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Header } from '@/components/Header';
import { Avatar } from '@/components/Avatar';
import { formatZone } from '@/lib/utils';

interface OtherUser {
  id: string;
  name: string;
  photoUrl: string | null;
  zone: string | null;
  email?: string;
  phone?: string;
  role: 'CLIENT' | 'DOMESTIC';
  domesticId?: string;
  hourlyRate?: number;
  experience?: string;
  skills?: Array<{ skillType: string }>;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isModeratorAlert: boolean;
  isRead: boolean;
}

interface Conversation {
  id: string;
  otherUser: OtherUser;
  lastMessage: Message | null;
  updatedAt: string;
}

export default function InboxPage() {
  const router = useRouter();
  const [searchParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unlockedContacts, setUnlockedContacts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const selectedConvRef = useRef<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchUser(token);
    fetchConversations(token);

    // Conectar a Socket.io
    socketRef.current = io('http://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Conectado a Socket.io');
      // Registrar usuario
      if (user?.id) {
        socketRef.current?.emit('join-user', user.id);
      }
    });

    socketRef.current.on('new-message', (data) => {
      console.log('📨 Nuevo mensaje:', data, 'Conversación actual:', selectedConvRef.current);
      if (data.conversationId === selectedConvRef.current) {
        // Recargar conversación si estamos en ella
        fetchConversationMessages(token, data.conversationId);
        // Marcar como leído inmediatamente
        markMessagesAsRead(token, data.conversationId);
      }
      // Actualizar lista de conversaciones
      fetchConversations(token);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.io');
    });

    // Si hay conversationId en URL, abrir automáticamente
    const conversationId = searchParams.get('conversationId');
    if (conversationId) {
      setTimeout(() => {
        handleSelectConversation(conversationId, token);
      }, 500);
    }

    // NO desconectar - mantener conexión persistente
    return () => {};
  }, [router]);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchConversations = async (token: string) => {
    try {
      const res = await fetch('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const convs = data.conversations || [];
      setConversations(convs);

      // Contar mensajes sin leer
      const unread = convs.filter(
        (conv: Conversation) => conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.senderId !== user?.id
      ).length;
      setUnreadCount(unread);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchConversationMessages = async (token: string, conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCurrentChat(data);
      setMessages(data.messages || []);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSelectConversation = (conversationId: string, token?: string) => {
    const authToken = token || localStorage.getItem('token');
    if (authToken) {
      fetchConversationMessages(authToken, conversationId);
      // Marcar mensajes como leídos
      markMessagesAsRead(authToken, conversationId);
    }
  };

  const markMessagesAsRead = async (token: string, conversationId: string) => {
    try {
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId }),
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Error del API (400, 403, etc)
        alert(data.error || 'Error enviando mensaje');
        setSending(false);
        return;
      }

      if (data.warning) {
        alert(data.warning);
      }

      // Emitir por Socket.io para que llegue instantáneamente
      socketRef.current?.emit('send-message', {
        conversationId: selectedConversation,
        message: data,
      });

      setNewMessage('');

      // Refetch messages
      if (token) {
        await fetchConversationMessages(token, selectedConversation);
        await fetchConversations(token);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error enviando mensaje');
    } finally {
      setSending(false);
    }
  };

  // Actualizar ref cuando selectedConversation cambia
  useEffect(() => {
    selectedConvRef.current = selectedConversation;
  }, [selectedConversation]);

  // Unirse a conversación vía Socket.io + polling para detectar borrados
  useEffect(() => {
    if (!selectedConversation || !socketRef.current) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    console.log('📍 Uniéndose a conversación:', selectedConversation);

    // Unirse a la conversación
    socketRef.current.emit('join-conversation', selectedConversation);

    // Cargar mensajes iniciales
    fetchConversationMessages(token, selectedConversation);

    // Marcar como leído
    markMessagesAsRead(token, selectedConversation);

    // Actualizar lista de conversaciones para quitar el indicador rojo
    const timer = setTimeout(() => {
      fetchConversations(token);
    }, 300);

    // Polling cada 3 segundos para detectar borrados por IA
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    pollIntervalRef.current = setInterval(() => {
      fetchConversationMessages(token, selectedConversation);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [selectedConversation]);

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      <Header user={user} unreadCount={unreadCount} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conversations */}
        <div className="w-full sm:w-80 bg-white/5 border-r border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Conversaciones</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-white/50">
                No hay conversaciones aún
              </div>
            ) : (
              conversations.map((conv) => {
                const hasUnread = conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.senderId !== user?.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full px-4 py-3 border-b border-white/5 hover:bg-white/10 transition text-left ${
                      selectedConversation === conv.id ? 'bg-white/20 border-l-4 border-l-purple-500' : ''
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="relative">
                        <Avatar name={conv.otherUser.name} photoUrl={conv.otherUser.photoUrl} size="md" />
                        {hasUnread && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`truncate ${hasUnread ? 'text-white font-bold' : 'text-white font-semibold'}`}>
                          {conv.otherUser.name}
                        </p>
                        <p className={`text-sm truncate ${hasUnread ? 'text-white/70 font-semibold' : 'text-white/50'}`}>
                          {conv.lastMessage?.content || 'Sin mensajes'}
                        </p>
                      </div>
                      {hasUnread && <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden sm:flex flex-1 flex-col overflow-hidden">
          {selectedConversation && currentChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-3">
                <Avatar
                  name={currentChat.otherUser.name}
                  photoUrl={currentChat.otherUser.photoUrl}
                  size="md"
                />
                <div className="flex-1">
                  <h3 className="text-white font-bold">{currentChat.otherUser.name}</h3>
                  <p className="text-white/50 text-sm">📍 {formatZone(currentChat.otherUser.zone)}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-300px)]">
                {messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white border border-white/20'
                        } ${msg.isModeratorAlert ? 'border-2 border-yellow-500' : ''}`}
                      >
                        <p className="break-words">{msg.content}</p>
                        {msg.isModeratorAlert && (
                          <p className="text-xs text-yellow-300 mt-1">⚠️ Contiene info de contacto</p>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white/5 backdrop-blur-md border-t border-white/10 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {sending ? '...' : '✓'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-white/50">
              Selecciona una conversación para comenzar
            </div>
          )}
        </div>

        {/* Right Panel - Contact Info */}
        {selectedConversation && currentChat && (
          <div className="hidden lg:flex w-80 bg-white/5 backdrop-blur-md border-l border-white/10 flex-col p-6 space-y-6 overflow-y-auto">
            {/* User Info */}
            <div className="text-center">
              <Avatar
                name={currentChat.otherUser.name}
                photoUrl={currentChat.otherUser.photoUrl}
                size="xl"
                className="!rounded-lg mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white">{currentChat.otherUser.name}</h3>
              <p className="text-white/50 text-sm">📍 {formatZone(currentChat.otherUser.zone)}</p>
            </div>

            {/* Details */}
            {currentChat.otherUser.role === 'DOMESTIC' && (
              <>
                {currentChat.otherUser.hourlyRate && (
                  <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                    <p className="text-white/60 text-sm">Tarifa horaria</p>
                    <p className="text-2xl font-bold text-purple-400">
                      ${currentChat.otherUser.hourlyRate}/h
                    </p>
                  </div>
                )}

                {currentChat.otherUser.experience && (
                  <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                    <p className="text-white/60 text-sm">Experiencia</p>
                    <p className="text-white font-semibold">{currentChat.otherUser.experience}</p>
                  </div>
                )}

                {currentChat.otherUser.skills && currentChat.otherUser.skills.length > 0 && (
                  <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-2">Servicios</p>
                    <div className="flex flex-wrap gap-2">
                      {currentChat.otherUser.skills.map((skill: any) => (
                        <span
                          key={skill.skillType}
                          className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs font-semibold"
                        >
                          {skill.skillType === 'CLEANING' && 'Limpieza'}
                          {skill.skillType === 'NANNY' && 'Niñera'}
                          {skill.skillType === 'COOKING' && 'Cocina'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {unlockedContacts.includes(currentChat.otherUser.domesticId) ? (
                  <div className="space-y-3 bg-purple-600/20 border border-purple-500 rounded-lg p-4">
                    {currentChat.otherUser.phone && (
                      <div>
                        <p className="text-white/60 text-sm">📱 Teléfono</p>
                        <a href={`tel:${currentChat.otherUser.phone}`} className="text-lg text-purple-300 font-bold hover:text-purple-200 break-all">
                          {currentChat.otherUser.phone}
                        </a>
                      </div>
                    )}
                    {currentChat.otherUser.email && (
                      <div className="pt-3 border-t border-purple-500">
                        <p className="text-white/60 text-sm">✉️ Email</p>
                        <a href={`mailto:${currentChat.otherUser.email}`} className="text-purple-300 font-semibold hover:text-purple-200 break-all">
                          {currentChat.otherUser.email}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setUnlockedContacts([...unlockedContacts, currentChat.otherUser.domesticId])}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold rounded-lg transition"
                  >
                    🔓 Desbloquear contacto
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
