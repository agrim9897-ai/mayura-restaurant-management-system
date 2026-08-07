import React, { useState } from 'react';
import { markMessageAsRead, deleteMessage, replyToMessage } from '../../services/api/messages.service';
import AdminSkeleton from './AdminSkeleton';

export default function AdminContactMessages({ messages, setMessages }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMessage, setActiveMessage] = useState(messages[0] || null);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredMessages = messages.filter((m) =>
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMessage = async (msg) => {
    setActiveMessage(msg);
    setReplySubject(`Re: ${msg.subject || 'Inquiry regarding Mayura Fine Cuisine'}`);
    setReplyText(`Dear ${msg.name},\n\nThank you for reaching out to Mayura Fine Cuisine.\n\nWarm regards,\nMayura Management Team`);

    if (!msg.isRead) {
      try {
        await markMessageAsRead(msg.id);
        setMessages((prev) =>
          prev.map((item) => (item.id === msg.id ? { ...item, isRead: true } : item))
        );
      } catch {
        // Fallback local update
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!activeMessage || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const result = await replyToMessage(activeMessage.id, {
        email: activeMessage.email,
        subject: replySubject,
        replyText: replyText.trim(),
      });

      showToast(result.message || `Reply dispatched to ${activeMessage.email}`);
    } catch (err) {
      showToast(`Failed to send reply: ${err.message}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(id);
      const remaining = messages.filter((item) => item.id !== id);
      setMessages(remaining);
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(remaining[0] || null);
      }
      showToast('Message deleted');
    } catch (err) {
      showToast(`Failed to delete message: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8 select-none">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#050d08] font-bold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl text-[#e9c176] font-bold">Customer Communications</h2>
          <p className="text-xs text-[#a0998e]">
            Review inquiries, guest feedback, and dispatch direct email replies.
          </p>
        </div>

        <div className="text-xs text-[#a0998e]">
          Total Inquiries: <strong className="text-[#e9c176]">{messages.length}</strong>
        </div>
      </div>

      {/* Split-Pane Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[680px]">
        {/* Left Pane: Message List (4 cols) */}
        <div className="lg:col-span-5 saas-card p-4 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-[#a0998e]">
                search
              </span>
              <input
                type="text"
                placeholder="Search inbox messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-[#e6e2dd] placeholder-[#a0998e]/60 focus:outline-none custom-focus"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {filteredMessages.length === 0 ? (
                <div className="py-12 text-center text-[#a0998e] text-xs">No messages match search.</div>
              ) : (
                filteredMessages.map((m) => {
                  const isSelected = activeMessage && activeMessage.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMessage(m)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 relative ${
                        isSelected
                          ? 'bg-[#102418] border-[#e9c176]/40 shadow-sm'
                          : 'bg-[#08170e] border-[#e9c176]/10 hover:border-[#e9c176]/25'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {!m.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#e9c176]" title="Unread" />
                          )}
                          <span className="font-semibold text-xs text-[#e6e2dd]">{m.name}</span>
                        </div>
                        <span className="text-[10px] text-[#a0998e]">{m.date ? m.date.split(' ')[0] : ''}</span>
                      </div>

                      <div className="text-[11px] text-[#e9c176] font-medium truncate">
                        {m.subject || 'General Inquiry'}
                      </div>

                      <p className="text-[11px] text-[#a0998e] line-clamp-1">{m.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Reading & Reply View (7 cols) */}
        <div className="lg:col-span-7 saas-card p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          {activeMessage ? (
            <div className="space-y-6">
              {/* Message Header */}
              <div className="border-b border-[#e9c176]/10 pb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#e6e2dd] font-bold">
                    {activeMessage.subject || 'General Inquiry'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#a0998e] mt-1">
                    <span className="font-bold text-[#e9c176]">{activeMessage.name}</span>
                    <span>•</span>
                    <span>{activeMessage.email}</span>
                    {activeMessage.phone && (
                      <>
                        <span>•</span>
                        <span className="font-mono">{activeMessage.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(activeMessage.id, e)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                  title="Delete Message"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>

              {/* Message Body */}
              <div className="bg-[#08170e] border border-[#e9c176]/15 rounded-xl p-4 text-xs text-[#e6e2dd] leading-relaxed whitespace-pre-line">
                {activeMessage.message}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-[#e9c176]/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#e9c176]">
                    Dispatch Email Reply
                  </span>
                  <span className="text-[11px] text-[#a0998e]">To: {activeMessage.email}</span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <textarea
                    rows="5"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply message..."
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="px-6 py-2.5 rounded-xl bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdea5] transition-all cursor-pointer shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSendingReply ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-[#050d08]/20 border-t-[#050d08] animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">send</span>
                        <span>Send Reply Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-24 text-center text-[#a0998e] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#e9c176]/30">mark_email_read</span>
              <h3 className="font-serif text-lg text-[#e6e2dd] font-bold">Select a Message</h3>
              <p className="text-xs">Choose an inquiry from the left pane to view details and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
