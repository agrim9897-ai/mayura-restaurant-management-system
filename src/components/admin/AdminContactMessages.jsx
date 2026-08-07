import React, { useState } from 'react';
import { markMessageAsRead, deleteMessage, replyToMessage } from '../../services/api/messages.service';

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
    <div className="space-y-6 animate-fadeIn pb-12 select-none max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#C5A059] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title Header */}
      <div className="flex justify-between items-baseline border-b border-[#E8E4DE]/60 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Messages & Inquiries
          </h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Review guest inquiries, private event requests, and dispatch email replies.
          </p>
        </div>

        <div className="text-xs text-[#666666]">
          Total Inquiries: <strong className="text-[#1A1A1A]">{messages.length}</strong>
        </div>
      </div>

      {/* Notion/Linear Style Split-Pane Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[680px]">
        {/* Left Pane: Message List (5 cols) */}
        <div className="lg:col-span-5 saas-card p-4 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-[#666666]">
                search
              </span>
              <input
                type="text"
                placeholder="Search inbox messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#666666]/60 focus:outline-none custom-focus"
              />
            </div>

            {/* Message Item List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {filteredMessages.length === 0 ? (
                <div className="py-12 text-center text-[#666666] text-xs">No messages match search.</div>
              ) : (
                filteredMessages.map((m) => {
                  const isSelected = activeMessage && activeMessage.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMessage(m)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 relative ${
                        isSelected
                          ? 'bg-[#EFE9DF] border-[#E0D7C8] shadow-2xs'
                          : 'bg-[#FAF8F4] border-[#E8E4DE] hover:border-[#C5A059]/40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {!m.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#C5A059]" title="Unread" />
                          )}
                          <span className="font-semibold text-xs text-[#1A1A1A]">{m.name}</span>
                        </div>
                        <span className="text-[10px] text-[#666666]">{m.date ? m.date.split(' ')[0] : ''}</span>
                      </div>

                      <div className="text-[11px] text-[#C5A059] font-semibold truncate">
                        {m.subject || 'General Inquiry'}
                      </div>

                      <p className="text-[11px] text-[#666666] line-clamp-1">{m.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Reading & Inline Reply View (7 cols) */}
        <div className="lg:col-span-7 saas-card p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          {activeMessage ? (
            <div className="space-y-6">
              {/* Message Header */}
              <div className="border-b border-[#E8E4DE] pb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-[#1A1A1A] font-bold">
                    {activeMessage.subject || 'General Inquiry'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#666666] mt-1.5 font-medium">
                    <span className="font-bold text-[#1A1A1A]">{activeMessage.name}</span>
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
                  className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Message"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>

              {/* Message Body */}
              <div className="bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-5 text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-line">
                {activeMessage.message}
              </div>

              {/* Inline Email Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-[#E8E4DE] text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Email Reply
                  </span>
                  <span className="text-[11px] text-[#666666]">To: {activeMessage.email}</span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                  />
                </div>

                <div>
                  <textarea
                    rows="5"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply message..."
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-3 text-[#1A1A1A] focus:outline-none custom-focus leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSendingReply ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
            <div className="py-24 text-center text-[#666666] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#666666]/30">mark_email_read</span>
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold">Select a Message</h3>
              <p className="text-xs text-[#666666]">Choose an inquiry from the left pane to view details and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
