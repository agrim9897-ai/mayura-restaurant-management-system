import React, { useState, useEffect, useRef } from 'react';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CustomDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonthPaddingDays = [];
  for (let x = firstDayIndex; x > 0; x--) {
    prevMonthPaddingDays.push(prevLastDate - x + 1);
  }

  const activeDays = [];
  for (let i = 1; i <= lastDate; i++) {
    const thisDate = new Date(currentYear, currentMonth, i);
    const isPast = thisDate < today;
    const dayString = String(i).padStart(2, '0');
    const monthString = String(currentMonth + 1).padStart(2, '0');
    const dateStr = `${currentYear}-${monthString}-${dayString}`;
    const isSelected = value === dateStr;
    const isToday = thisDate.getTime() === today.getTime();

    activeDays.push({
      day: i,
      dateStr,
      isPast,
      isSelected,
      isToday,
    });
  }

  return (
    <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300 date-picker-container" ref={wrapperRef}>
      <input
        type="text"
        id="reserve_date"
        name="date"
        readOnly
        required
        value={value}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Reservation Date"
        className="peer w-full h-12 bg-transparent rounded-12 pl-4 pr-10 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0 cursor-pointer"
      />
      <label
        htmlFor="reserve_date"
        className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                   peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                   peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                   peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
      >
        Reservation Date
      </label>
      <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-on-surface-variant pointer-events-none text-xl">
        calendar_month
      </span>

      {/* Custom Calendar Dropdown */}
      <div
        className={`absolute left-0 right-0 top-full mt-2 bg-[#0f1f15] border border-primary/30 rounded-12 shadow-2xl p-4 z-40 transition-all duration-300 origin-top ${
          isOpen ? 'block opacity-100 scale-100' : 'hidden opacity-0 scale-95'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={handlePrevMonth} className="text-primary hover:text-primary-fixed-dim p-1 transition-colors">
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <h4 className="font-button text-xs text-primary uppercase tracking-wider">
            {monthNames[currentMonth]} {currentYear}
          </h4>
          <button type="button" onClick={handleNextMonth} className="text-primary hover:text-primary-fixed-dim p-1 transition-colors">
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-primary-fixed-dim mb-2 uppercase tracking-widest">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-on-surface">
          {prevMonthPaddingDays.map((d, idx) => (
            <div key={`prev-${idx}`} className="text-on-surface-variant/20 py-2">
              {d}
            </div>
          ))}

          {activeDays.map((item) => (
            <button
              key={item.dateStr}
              type="button"
              disabled={item.isPast}
              onClick={() => {
                onChange(item.dateStr);
                setIsOpen(false);
              }}
              className={`py-2 rounded-full cursor-pointer transition-all duration-200 ${
                item.isPast
                  ? 'text-on-surface-variant/30 pointer-events-none'
                  : item.isSelected
                  ? 'bg-primary text-on-primary font-bold'
                  : item.isToday
                  ? 'border border-primary/50 text-primary hover:bg-primary/20'
                  : 'hover:bg-primary/20 hover:text-primary'
              }`}
            >
              {item.day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
