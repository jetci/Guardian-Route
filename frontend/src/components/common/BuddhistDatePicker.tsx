import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './BuddhistDatePicker.css';

interface BuddhistDatePickerProps {
    id?: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    max?: string; // YYYY-MM-DD format
    placeholder?: string;
    required?: boolean;
}

// Thai month names
const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Thai day names (short)
const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

/**
 * Buddhist Date Picker Component with Calendar Popup
 * 
 * แสดงและรับวันที่ในรูปแบบปี พ.ศ. (พุทธศักราช) พร้อม calendar popup
 * รูปแบบ: DD/MM/YYYY (พ.ศ.)
 * 
 * @example
 * <BuddhistDatePicker
 *   value={incidentDate}
 *   onChange={setIncidentDate}
 *   max={new Date().toISOString().split('T')[0]}
 *   required
 * />
 */
export const BuddhistDatePicker: React.FC<BuddhistDatePickerProps> = ({
    id,
    value,
    onChange,
    max,
    placeholder = 'วว/ดด/ปปปป',
    required = false
}) => {
    // Convert Date to Buddhist year format (DD/MM/YYYY)
    const formatDateToBuddhist = (date: Date | null): string => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const buddhistYear = date.getFullYear() + 543;
        return `${day}/${month}/${buddhistYear}`;
    };

    // Custom header component for calendar
    const CustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }: any) => {
        const buddhistYear = date.getFullYear() + 543;
        const monthName = THAI_MONTHS[date.getMonth()];

        return (
            <div className="buddhist-datepicker-header">
                <button
                    type="button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="buddhist-datepicker-nav-button"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="buddhist-datepicker-current-month">
                    {monthName} {buddhistYear}
                </div>
                <button
                    type="button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="buddhist-datepicker-nav-button"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    // Custom input component
    const CustomInput = React.forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (
        <div className="buddhist-datepicker-input-wrapper">
            <Calendar
                className="buddhist-datepicker-icon"
                size={20}
            />
            <input
                ref={ref}
                type="text"
                value={value}
                onClick={onClick}
                placeholder={placeholder}
                required={required}
                readOnly
                className="buddhist-datepicker-input"
                aria-label="วันที่เกิดเหตุ"
                aria-required={required}
            />
        </div>
    ));

    CustomInput.displayName = 'CustomInput';

    // Get max date as Date object
    const maxDate = max ? new Date(max) : undefined;

    return (
        <div className="form-group">
            <DatePicker
                selected={value}
                onChange={onChange}
                dateFormat="dd/MM/yyyy"
                maxDate={maxDate}
                customInput={<CustomInput />}
                renderCustomHeader={CustomHeader}
                formatWeekDay={(day) => THAI_DAYS_SHORT[new Date(day).getDay()]}
                showPopperArrow={false}
                popperPlacement="bottom-start"
                popperModifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            rootBoundary: 'viewport',
                            tether: false,
                            altAxis: true,
                        },
                    },
                ]}
            />
            <p className="text-gray-500 text-xs mt-1">
                รูปแบบ: วว/ดด/ปปปป (เช่น {formatDateToBuddhist(new Date())}) - คลิกเพื่อเลือกวันที่
            </p>
        </div>
    );
};

export default BuddhistDatePicker;
