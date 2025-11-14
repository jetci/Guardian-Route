import React, { useState, useEffect, useRef } from 'react';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const formatThaiDate = (date: Date | null): string => {
  if (!date) return '';
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day.toString().padStart(2, '0')} ${month} ${year}`;
};

interface ThaiDatePickerProps {
  id: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  id,
  value,
  onChange,
  placeholder = 'เลือกวันที่',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync displayDate with value changes
  useEffect(() => {
    if (value) {
      setDisplayDate(value);
    } else {
      setDisplayDate(new Date());
    }
  }, [value]);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    onChange(newDate);
    setIsOpen(false);
  };

  const changeMonth = (amount: number) => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  const generateCalendarGrid = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (number | null)[] = Array(firstDayOfMonth).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push(i);
    }
    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      {/* Input Field */}
      <div style={{ position: 'relative', marginTop: '4px' }}>
        <input
          id={id}
          type="text"
          readOnly
          value={formatThaiDate(value)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            background: disabled ? '#1f2937' : '#374151',
            border: '1px solid #4b5563',
            borderRadius: '6px',
            padding: '10px 40px 10px 12px',
            fontSize: '14px',
            color: disabled ? '#6b7280' : '#f3f4f6',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#9ca3af'
        }}>
          📅
        </div>
      </div>

      {/* Calendar Popup */}
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          zIndex: 10,
          marginTop: '8px',
          width: '288px',
          background: '#1f2937',
          border: '1px solid #4b5563',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          padding: '16px'
        }}>
          {/* Header - Month/Year Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'transparent',
                border: 'none',
                color: '#d1d5db',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ‹
            </button>
            <div style={{
              fontWeight: '600',
              color: '#f3f4f6',
              fontSize: '15px'
            }}>
              {THAI_MONTHS[displayDate.getMonth()]} {displayDate.getFullYear() + 543}
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'transparent',
                border: 'none',
                color: '#d1d5db',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ›
            </button>
          </div>

          {/* Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontSize: '12px',
            color: '#9ca3af',
            marginBottom: '8px',
            gap: '4px'
          }}>
            {THAI_DAYS_SHORT.map(day => (
              <div key={day} style={{ padding: '4px' }}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px'
          }}>
            {calendarGrid.map((day, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {day ? (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background:
                        value &&
                        value.getDate() === day &&
                        value.getMonth() === displayDate.getMonth() &&
                        value.getFullYear() === displayDate.getFullYear()
                          ? '#3b82f6'
                          : 'transparent',
                      color:
                        value &&
                        value.getDate() === day &&
                        value.getMonth() === displayDate.getMonth() &&
                        value.getFullYear() === displayDate.getFullYear()
                          ? '#ffffff'
                          : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      if (!(value &&
                        value.getDate() === day &&
                        value.getMonth() === displayDate.getMonth() &&
                        value.getFullYear() === displayDate.getFullYear())) {
                        e.currentTarget.style.background = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(value &&
                        value.getDate() === day &&
                        value.getMonth() === displayDate.getMonth() &&
                        value.getFullYear() === displayDate.getFullYear())) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {day}
                  </button>
                ) : (
                  <div style={{ width: '32px', height: '32px' }} />
                )}
              </div>
            ))}
          </div>

          {/* Today Button */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #374151' }}>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onChange(today);
                setDisplayDate(today);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: '#374151',
                border: 'none',
                borderRadius: '6px',
                color: '#e5e7eb',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#374151'}
            >
              วันนี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThaiDatePicker;
