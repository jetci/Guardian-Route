/**
 * Date Formatter Utilities
 * แปลงวันที่เป็นรูปแบบภาษาไทย
 */

/**
 * แปลงวันที่เป็นรูปแบบไทยแบบสั้น เช่น "13 พ.ย. 2568"
 */
export function formatThaiDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543; // แปลงเป็น พ.ศ.
  
  return `${day} ${month} ${year}`;
}

/**
 * แปลงวันที่เป็นรูปแบบไทยแบบยาว เช่น "13 พฤศจิกายน 2568"
 */
export function formatThaiDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const thaiMonthsFull = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const day = d.getDate();
  const month = thaiMonthsFull[d.getMonth()];
  const year = d.getFullYear() + 543;
  
  return `${day} ${month} ${year}`;
}

/**
 * แปลงวันที่และเวลาเป็นรูปแบบไทย เช่น "13 พ.ย. 2568 14:30"
 */
export function formatThaiDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const dateStr = formatThaiDateShort(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * แปลงวันที่เป็นรูปแบบสั้นมาก เช่น "13/11/68"
 */
export function formatThaiDateVeryShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = (d.getFullYear() + 543).toString().slice(-2); // เอา 2 หลักท้าย
  
  return `${day}/${month}/${year}`;
}

/**
 * คำนวณจำนวนวันที่เหลือจนถึงวันที่กำหนด
 */
export function getDaysRemaining(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * แสดงข้อความเวลาที่เหลือ เช่น "เหลือ 3 วัน", "เลยกำหนด 2 วัน"
 */
export function getTimeRemainingText(dueDate: Date | string): string {
  const days = getDaysRemaining(dueDate);
  
  if (days > 0) {
    return `เหลือ ${days} วัน`;
  } else if (days === 0) {
    return 'ครบกำหนดวันนี้';
  } else {
    return `เลยกำหนด ${Math.abs(days)} วัน`;
  }
}
