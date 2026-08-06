import React, { useState } from 'react';

export default function AdminContactMessages({ messages, setMessages }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenView = (msg) => {
    setSelectedMessage(msg);
    // Mark as read in local state
    setMessages((prev) =>
      prev.map((item) => (item.id === msg.id ? { ...item, isRead: true } : item))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Control Search Header */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-sm text-[#a0998e]">
            search
          </span>
          <input
            type="text"
            placeholder="Search contact messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#e6e2dd] focus:outline-none custom-focus"
          />
        </div>

        <div className="text-xs text-[#a0998e]">
          Total Messages: <strong className="text-[#e9c176]">{messages.length}</strong>
        </div>
      </div>

      {/* Messages Table Card */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#09160e] border-b border-[#e9c176]/15 text-[11px] uppercase tracking-wider text-[#e9c176]">
                <th className="py-4 px-4 font-semibold">Name</th>
                <th className="py-4 px-4 font-semibold">Email</th>
                <th className="py-4 px-4 font-semibold">Subject</th>
                <th className="py-4 px-4 font-semibold">Message Preview</th>
                <th className="py-4 px-4 font-semibold">Date</th>
                <th className="py-4 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9c176]/10 text-xs text-[#c8c2b7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-[#a0998e]">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-[#e9c176]/40">
                      mail
                    </span>
                    No contact messages match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-[#122419] transition-colors">
                    {/* Name */}
                    <td className="py-4 px-4 font-semibold text-[#e6e2dd] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {!m.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#e9c176]" title="Unread" />
                        )}
                        <span>{m.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-[#a0998e]">{m.email}</td>

                    {/* Subject */}
                    <td className="py-4 px-4 font-medium text-[#e9c176]">{m.subject}</td>

                    {/* Message Preview */}
                    <td className="py-4 px-4 max-w-xs truncate text-[#c8c2b7]">{m.message}</td>

                    {/* Date */}
                    <td className="py-4 px-4 text-[#a0998e] whitespace-nowrap">{m.date}</td>

                    {/* View Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenView(m)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#122419] border border-[#e9c176]/30 text-[#e9c176] hover:bg-[#e9c176] hover:text-[#0f1f15] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Preview Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-scale">
            <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#e9c176] font-bold">
                  INQUIRY #{selectedMessage.id}
                </span>
                <h3 className="font-serif text-xl text-[#e6e2dd] font-bold mt-1">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-[#a0998e] hover:text-[#e9c176]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-[#07140c] rounded-xl p-4 border border-[#e9c176]/10 text-xs space-y-2 text-[#a0998e]">
              <p>
                From: <strong className="text-[#e6e2dd]">{selectedMessage.name}</strong> ({selectedMessage.email})
              </p>
              {selectedMessage.phone && <p>Phone: <span className="font-mono text-[#e6e2dd]">{selectedMessage.phone}</span></p>}
              <p>Received: {selectedMessage.date}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#e9c176] font-semibold block">
                Message Content:
              </label>
              <div className="bg-[#07140c] border border-[#e9c176]/15 rounded-xl p-5 text-sm text-[#e6e2dd] leading-relaxed whitespace-pre-line">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  alert(`Replying to ${selectedMessage.email}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#e9c176] text-[#0f1f15] font-semibold text-xs uppercase tracking-wider hover:bg-[#ffdea5] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">reply</span>
                <span>Send Reply</span>
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 rounded-xl border border-[#e9c176]/30 text-xs text-[#a0998e] hover:text-[#e6e2dd]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
