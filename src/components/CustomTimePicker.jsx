import React, { useState, useEffect, useRef } from 'react';

const availableSlots = [
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM",
  "09:30 PM", "10:00 PM", "10:30 PM"
];

export default function CustomTimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300 time-picker-container" ref={wrapperRef}>
      <input
        type="text"
        id="reserve_time"
        name="time"
        readOnly
        required
        value={value}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Preferred Time"
        className="peer w-full h-12 bg-transparent rounded-12 pl-4 pr-10 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0 cursor-pointer"
      />
      <label
        htmlFor="reserve_time"
        className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                   peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                   peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                   peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
      >
        Preferred Time
      </label>
      <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-on-surface-variant pointer-events-none text-xl">
        schedule
      </span>

      {/* Custom Time List Dropdown */}
      <div
        className={`absolute left-0 right-0 top-full mt-2 max-h-48 overflow-y-auto bg-[#0f1f15] border border-primary/30 rounded-12 shadow-2xl p-2 z-40 transition-all duration-300 origin-top custom-scrollbar ${
          isOpen ? 'block opacity-100 scale-100' : 'hidden opacity-0 scale-95'
        }`}
      >
        <div className="grid grid-cols-2 gap-2 p-1 text-center">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => {
                onChange(slot);
                setIsOpen(false);
              }}
              className={`py-2.5 border rounded-12 text-xs cursor-pointer transition-all duration-200 ${
                value === slot
                  ? 'border-primary text-primary bg-primary/10 font-bold'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
