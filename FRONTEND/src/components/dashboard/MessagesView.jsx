import React, { useState, useEffect, useCallback } from 'react';
import { messageService } from '../../services/message.service';
import ChatWindow from './ChatWindow';

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

/**
 * Dashboard "Messages" view — conversation list from GET /api/messages
 * with unread badges; selecting a conversation opens the ChatWindow.
 */
const MessagesView = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // { userId, name }

  const loadConversations = useCallback(async () => {
    try {
      const res = await messageService.getConversations();
      setConversations(res.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleCloseChat = () => {
    setActive(null);
    loadConversations(); // refresh previews + unread counts
  };

  return (
    <div className="w-full pt-4 space-y-8 font-sans animate-fade-in">
      <div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl text-ink-main">Messages</h1>
        <p className="text-lg text-ink-muted">Chat with your professionals and clients right here.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-base font-semibold animate-pulse text-brand">Loading conversations...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed text-ink-muted bg-surface-card rounded-[2rem] border-surface-border">
          <p className="mb-2 text-4xl">💬</p>
          <p className="text-lg font-bold text-ink-main">No conversations yet</p>
          <p className="max-w-md mx-auto mt-1 font-medium">
            Open a booking or a professional's profile and tap <strong>Message</strong> to start chatting.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const other = conv.user || {};
            const name = other.name || 'User';
            return (
              <button
                key={other._id || name}
                type="button"
                onClick={() => setActive({ userId: other._id, name })}
                className="flex items-center w-full gap-4 p-5 text-left transition-all border bg-surface-card rounded-3xl border-surface-border shadow-modern hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center text-xl font-black rounded-full w-14 h-14 shrink-0 bg-brand/10 text-brand">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold truncate text-ink-main">{name}</p>
                    {other.role && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-brand/10 text-brand">
                        {other.role}
                      </span>
                    )}
                  </div>
                  <p className={`truncate text-sm ${conv.unreadCount > 0 ? 'font-bold text-ink-main' : 'font-medium text-ink-muted'}`}>
                    {conv.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {formatTime(conv.lastMessage?.createdAt)}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="min-w-[22px] h-[22px] px-1.5 bg-status-error text-white text-[11px] font-black rounded-full flex items-center justify-center">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {active && (
        <ChatWindow
          otherUserId={active.userId}
          otherUserName={active.name}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default MessagesView;
