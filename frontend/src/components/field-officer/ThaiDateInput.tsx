/**
 * Thai Date Input Component
 * Custom date picker with Thai language and Buddhist Era
 */

import { useState, useRef, useEffect } from 'react';

interface ThaiDateInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  max?: string;
}

export const ThaiDateInput: React.FC<ThaiDateInputProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  max
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() + 543);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  // Thai month names
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Format display value
  const getDisplayValue = () => {
    if (!value) return '';
    const date = new Date(value);
    const thaiYear = date.getFullYear() + 543;
    const thaiMonth = thaiMonths[date.getMonth()];
    const day = date.getDate();
    return `${day} ${thaiMonth} ${thaiYear}`;
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const gregorianYear = selectedYear - 543;
    const date = new Date(gregorianYear, selectedMonth, day);
    const isoString = date.toISOString().split('T')[0];
    onChange(isoString);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Initialize from value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedYear(date.getFullYear() + 543);
      setSelectedMonth(date.getMonth());
    }
  }, [value]);

  const daysInMonth = getDaysInMonth(selectedYear - 543, selectedMonth);
  const firstDayOfMonth = new Date(selectedYear - 543, selectedMonth, 1).getDay();
  const maxDate = max ? new Date(max) : new Date();

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Input Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '10px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '14px',
          background: disabled ? '#f3f4f6' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: disabled ? '#9ca3af' : '#1e293b',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>{getDisplayValue() || 'เลือกวันที่'}</span>
        <span>📅</span>
      </div>

      {/* Calendar Popup */}
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '4px',
          background: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '16px',
          zIndex: 1000,
          minWidth: '300px'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {/* Month Selector */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{
                  flex: 1,
                  padding: '6px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {thaiMonths.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{
                  flex: 1,
                  padding: '6px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = (maxDate.getFullYear() + 543) - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '8px'
          }}>
            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: index === 0 ? '#ef4444' : '#64748b',
                  padding: '4px'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px'
          }}>
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(selectedYear - 543, selectedMonth, day);
              const isDisabled = date > maxDate;
              const isToday = 
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();
              const isSelected = value && 
                date.toISOString().split('T')[0] === value;

              return (
                <button
                  key={day}
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  disabled={isDisabled}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    background: isSelected 
                      ? '#3b82f6' 
                      : isToday 
                      ? '#eff6ff' 
                      : 'transparent',
                    color: isSelected 
                      ? 'white' 
                      : isDisabled 
                      ? '#cbd5e1' 
                      : '#1e293b',
                    fontWeight: isSelected || isToday ? '600' : '400',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.background = '#f1f5f9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.background = isToday ? '#eff6ff' : 'transparent';
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <button
              onClick={() => {
                const today = new Date();
                const isoString = today.toISOString().split('T')[0];
                onChange(isoString);
                setIsOpen(false);
              }}
              style={{
                padding: '4px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#3b82f6'
              }}
            >
              วันนี้
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '4px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
