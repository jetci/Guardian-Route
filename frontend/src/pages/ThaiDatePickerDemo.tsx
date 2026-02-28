import { useState } from 'react';
import ThaiDatePicker from '../components/ThaiDatePicker';

export default function ThaiDatePickerDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111827',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
            📅 Thai Date Picker Component
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
            ปฏิทินภาษาไทย พ.ศ. สำหรับ React + TypeScript
          </p>
        </div>

        {/* Demo Sections */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}>
          {/* Example 1: Basic Usage */}
          <div style={{
            background: '#1f2937',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#f3f4f6' }}>
              1. การใช้งานพื้นฐาน
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#d1d5db'
              }}>
                เลือกวันที่:
              </label>
              <ThaiDatePicker
                id="demo-date-1"
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="กรุณาเลือกวันที่"
              />
            </div>
            {selectedDate && (
              <div style={{
                padding: '16px',
                background: '#374151',
                borderRadius: '8px',
                marginTop: '16px'
              }}>
                <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
                  ผลลัพธ์:
                </div>
                <div style={{ fontSize: '15px', color: '#f3f4f6' }}>
                  <strong>Date Object:</strong> {selectedDate.toISOString()}
                </div>
                <div style={{ fontSize: '15px', color: '#f3f4f6', marginTop: '4px' }}>
                  <strong>ปี ค.ศ.:</strong> {selectedDate.getFullYear()}
                </div>
                <div style={{ fontSize: '15px', color: '#f3f4f6', marginTop: '4px' }}>
                  <strong>ปี พ.ศ.:</strong> {selectedDate.getFullYear() + 543}
                </div>
              </div>
            )}
          </div>

          {/* Example 2: Date Range */}
          <div style={{
            background: '#1f2937',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#f3f4f6' }}>
              2. ช่วงวันที่ (Date Range)
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db'
                }}>
                  วันที่เริ่มต้น:
                </label>
                <ThaiDatePicker
                  id="start-date"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="เลือกวันเริ่มต้น"
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db'
                }}>
                  วันที่สิ้นสุด:
                </label>
                <ThaiDatePicker
                  id="end-date"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="เลือกวันสิ้นสุด"
                />
              </div>
            </div>
            {startDate && endDate && (
              <div style={{
                padding: '16px',
                background: '#374151',
                borderRadius: '8px',
                marginTop: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
                  ช่วงเวลาที่เลือก:
                </div>
                <div style={{ fontSize: '15px', color: '#f3f4f6' }}>
                  {startDate.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {' ถึง '}
                  {endDate.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                  จำนวนวัน: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} วัน
                </div>
              </div>
            )}
          </div>

          {/* Example 3: Disabled State */}
          <div style={{
            background: '#1f2937',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#f3f4f6' }}>
              3. สถานะ Disabled
            </h2>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#d1d5db'
              }}>
                วันที่ (ไม่สามารถแก้ไขได้):
              </label>
              <ThaiDatePicker
                id="disabled-date"
                value={new Date()}
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </div>

          {/* Features List */}
          <div style={{
            background: '#1f2937',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#f3f4f6' }}>
              ✨ คุณสมบัติ
            </h2>
            <ul style={{
              margin: 0,
              padding: '0 0 0 20px',
              color: '#d1d5db',
              fontSize: '15px',
              lineHeight: '1.8'
            }}>
              <li>✅ แสดงผลปฏิทินภาษาไทย (เดือน, วัน)</li>
              <li>✅ ใช้ปี พ.ศ. ในการแสดงผล</li>
              <li>✅ เก็บข้อมูลเป็น Date Object มาตรฐาน (ค.ศ.)</li>
              <li>✅ รองรับการเลื่อนเดือนไป-มา</li>
              <li>✅ Highlight วันที่ถูกเลือก</li>
              <li>✅ ปุ่ม "วันนี้" สำหรับเลือกวันปัจจุบัน</li>
              <li>✅ ปิดอัตโนมัติเมื่อคลิกนอก Component</li>
              <li>✅ รองรับ Disabled state</li>
              <li>✅ TypeScript support</li>
              <li>✅ ไม่ต้องพึ่ง External library</li>
            </ul>
          </div>

          {/* Code Example */}
          <div style={{
            background: '#1f2937',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#f3f4f6' }}>
              💻 ตัวอย่างโค้ด
            </h2>
            <pre style={{
              background: '#111827',
              padding: '20px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '13px',
              color: '#e5e7eb',
              margin: 0
            }}>
{`import ThaiDatePicker from './components/ThaiDatePicker';

function MyComponent() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ThaiDatePicker
      id="my-date"
      value={date}
      onChange={setDate}
      placeholder="เลือกวันที่"
    />
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
