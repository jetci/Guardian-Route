import React from 'react';
import { Calendar } from 'lucide-react';

interface ThaiDatePickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

/**
 * Thai Date Picker Component
 * 
 * Features:
 * - Uses HTML5 date input (native browser support)
 * - Displays in dd/mm/yyyy format (browser locale)
 * - Calendar icon for better UX
 * - Validation support
 * - Accessible (keyboard navigation, screen reader)
 * - Mobile-friendly
 * 
 * @example
 * <ThaiDatePicker
 *   label="วันที่เริ่มต้น"
 *   name="startDate"
 *   value={startDate}
 *   onChange={setStartDate}
 *   required
 * />
 */
export const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  placeholder = 'เลือกวันที่',
  className = '',
  error,
}) => {
  // Convert ISO string to YYYY-MM-DD format for input
  const formatValueForInput = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Convert YYYY-MM-DD to ISO string
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // Convert to ISO string for storage
      const isoString = new Date(dateValue).toISOString();
      onChange(isoString);
    } else {
      onChange('');
    }
  };

  const inputValue = formatValueForInput(value);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {/* Calendar Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>

        {/* Date Input */}
        <input
          type="date"
          name={name}
          value={inputValue}
          onChange={handleChange}
          required={required}
          min={min}
          max={max}
          placeholder={placeholder}
          className={`
            w-full pl-11 pr-4 py-2.5
            border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${!inputValue ? 'text-gray-400' : 'text-gray-900'}
          `}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-1 text-xs text-gray-500">
          รูปแบบ: วว/ดด/ปปปป (เช่น 29/11/2568)
        </p>
      )}
    </div>
  );
};

/**
 * Thai Date Time Picker Component
 * 
 * Similar to ThaiDatePicker but includes time selection
 */
interface ThaiDateTimePickerProps extends Omit<ThaiDatePickerProps, 'placeholder'> {
  showTime?: boolean;
}

export const ThaiDateTimePicker: React.FC<ThaiDateTimePickerProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  className = '',
  error,
  showTime = true,
}) => {
  // Convert ISO string to YYYY-MM-DDTHH:mm format for datetime-local input
  const formatValueForInput = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  // Convert datetime-local value to ISO string
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTimeValue = e.target.value;
    if (dateTimeValue) {
      const isoString = new Date(dateTimeValue).toISOString();
      onChange(isoString);
    } else {
      onChange('');
    }
  };

  const inputValue = formatValueForInput(value);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {/* Calendar Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>

        {/* DateTime Input */}
        <input
          type="datetime-local"
          name={name}
          value={inputValue}
          onChange={handleChange}
          required={required}
          min={min}
          max={max}
          className={`
            w-full pl-11 pr-4 py-2.5
            border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${!inputValue ? 'text-gray-400' : 'text-gray-900'}
          `}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-1 text-xs text-gray-500">
          รูปแบบ: วว/ดด/ปปปป เวลา (เช่น 29/11/2568 14:30)
        </p>
      )}
    </div>
  );
};

/**
 * Date Range Picker Component
 * 
 * Combines two date pickers with validation
 */
interface DateRangePickerProps {
  startLabel?: string;
  endLabel?: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startLabel = 'วันที่เริ่มต้น',
  endLabel = 'วันที่สิ้นสุด',
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  required = false,
  className = '',
}) => {
  // Validation
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (startValue && endValue) {
      const start = new Date(startValue);
      const end = new Date(endValue);
      
      if (start > end) {
        setError('วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด');
      } else {
        setError('');
      }
    }
  }, [startValue, endValue]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ThaiDatePicker
          label={startLabel}
          name="periodStart"
          value={startValue}
          onChange={onStartChange}
          required={required}
          max={endValue ? new Date(endValue).toISOString().split('T')[0] : undefined}
        />
        
        <ThaiDatePicker
          label={endLabel}
          name="periodEnd"
          value={endValue}
          onChange={onEndChange}
          required={required}
          min={startValue ? new Date(startValue).toISOString().split('T')[0] : undefined}
        />
      </div>

      {/* Range Error */}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium" role="alert">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default ThaiDatePicker;
