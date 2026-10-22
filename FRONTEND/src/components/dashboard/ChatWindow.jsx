import React, { useState, useEffect, useRef, useCallback } from 'react';
import { messageService } from '../../services/message.service';
import { showToast } from '../../utils/toast';

const POLL_MS = 10000;

const getCurrentUserId = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('currentUser'));
    return stored?._id || stored?.id || null;
  } catch {
    return null;
  }
};

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

/**
 * Chat modal with one other user. Loads the conversation oldest → newest,
 * marks it read on open, and polls for new messages every 10s while open.
 */
const ChatWindow = ({ otherUserId, otherUserName = 'User', bookingId = null, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const currentUserId = getCurrentUserId();
  const scrollRef = useRef(null);
  const markedReadForRef = useRef(null);

  const loadMessages = useCallback(async (silent = false) => {
    try {
      const res = await messageService.getConversation(otherUserId);
      const list = res.messages || [];
      setMessages(list);
      // Mark the conversation read once per open, and again if a poll
      // surfaces new unread messages from the other party.
      const hasUnreadIncoming = list.some(
        (m) => String(m.receiver) === String(currentUserId) && !m.isRead
      );
      if (hasUnreadIncoming || markedReadForRef.current !== otherUserId) {
        markedReadForRef.current = otherUserId;
        messageService.markConversationRead(otherUserId).catch(() => {});
      }
    } catch (err) {
      if (!silent) console.error('Failed to load conversation', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [otherUserId, currentUserId]);

  useEffect(() => {
    loadMessages();
    const timer = setInterval(() => loadMessages(true), POLL_MS);
    return () => clearInterval(timer);
  }, [loadMessages]);

  // Keep the newest message in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Escape closes the chat
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSend = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const res = await messageService.sendMessage({
        receiverId: otherUserId,
        content,
        bookingReference: bookingId || undefined
      });
      setDraft('');
      if (res.message && typeof res.message === 'object') {
        setMessages((prev) => [...prev, res.message]);
      } else {
        loadMessages(true);
      }
    } catch (err) {
      console.error('Failed to send message', err);
      showToast(err.response?.data?.message || 'Could not send the message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const isMine = (m) => String(m.sender?._id || m.sender) === String(currentUserId);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 bg-black/60 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Chat with ${otherUserName}`}
    >
      <div
        className="flex flex-col w-full max-w-lg overflow-hidden border shadow-2xl bg-surface-card border-surface-border rounded-t-[2rem] sm:rounded-[2rem] h-[85vh] sm:h-[70vh] animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 text-white bg-gradient-to-r from-brand to-brand-dark shrink-0">
          <div className="flex items-center justify-center w-11 h-11 text-lg font-black rounded-full bg-white/20">
            {otherUserName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{otherUserName}</p>
            <p className="text-xs font-medium text-emerald-50/90">House Help Connect chat</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex items-center justify-center w-9 h-9 transition-colors rounded-full bg-white/15 hover:bg-white/30"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 px-4 py-5 space-y-3 overflow-y-auto bg-surface">
          {loading ? (
            <p className="py-10 font-semibold text-center animate-pulse text-brand">Loading conversation...</p>
          ) : messages.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-3xl mb-2">👋</p>
              <p className="font-semibold text-ink-main">No messages yet</p>
              <p className="text-sm text-ink-muted">Say hello to {otherUserName} to get started.</p>
            </div>
          ) : (
            messages.map((m) => {
              const mine = isMine(m);
              return (
                <div key={m._id || `${m.createdAt}-${m.content}`} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl shadow-sm ${
                      mine
                        ? 'bg-brand text-white rounded-br-md'
                        : 'bg-surface-card border border-surface-border text-ink-main rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.content}</p>
                    <p className={`mt-1 text-[10px] font-semibold text-right ${mine ? 'text-emerald-50/80' : 'text-ink-muted'}`}>
                      {formatTime(m.createdAt)}
                      {mine && m.isRead ? ' · Read' : ''}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t shrink-0 bg-surface-card border-surface-border">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${otherUserName}...`}
            className="flex-1 p-3 text-sm font-medium border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="px-5 py-3 text-sm font-bold text-white transition-all bg-brand rounded-xl hover:bg-brand-dark active:scale-95 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
