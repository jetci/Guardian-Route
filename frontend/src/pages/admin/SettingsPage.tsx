import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import './SettingsPage.css';
import * as settingsService from '../../services/settingsService';
import { useAuthStore } from '../../stores/authStore';

type SettingsTab = 'general' | 'security' | 'map' | 'notifications' | 'api' | 'data';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Check if user is DEVELOPER
  const isDeveloper = user?.role === 'DEVELOPER';
  
  // General Settings (Tab 1)
  const [systemName, setSystemName] = useState('Guardian Route');
  const [timezone, setTimezone] = useState('Asia/Bangkok');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('ระบบอยู่ระหว่างการบำรุงรักษา กรุณากลับมาใหม่ภายหลัง');

  // Security Settings (Tab 2)
  const [enforce2FA, setEnforce2FA] = useState(false);
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [ipAllowlist, setIpAllowlist] = useState('');

  // Map Settings (Tab 3)
  const [defaultLat, setDefaultLat] = useState(19.9167);
  const [defaultLng, setDefaultLng] = useState(99.8833);
  const [defaultZoom, setDefaultZoom] = useState(13);
  const [defaultBaseLayer, setDefaultBaseLayer] = useState<'satellite' | 'street'>('street');
  const [customTileServer, setCustomTileServer] = useState('');
  const [enableWeatherRadar, setEnableWeatherRadar] = useState(false);

  // Notification Settings (Tab 4)
  const [emailOnNewIncident, setEmailOnNewIncident] = useState(true);
  const [smsOnHighSeverity, setSmsOnHighSeverity] = useState(false);
  const [dailyEmailSummary, setDailyEmailSummary] = useState(true);
  const [enableLineNotify, setEnableLineNotify] = useState(false);
  const [lineNotifyToken, setLineNotifyToken] = useState('');

  // API Settings (Tab 5)
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [smsGatewayApiKey, setSmsGatewayApiKey] = useState('');
  const [maxRequestsPerMinute, setMaxRequestsPerMinute] = useState(60);
  const [blockDuration, setBlockDuration] = useState(300);

  // Data Settings (Tab 6)
  const [dataRetentionDays, setDataRetentionDays] = useState(365);
  const [backupFrequency, setBackupFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'disabled'>('daily');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.fetchSettings();
      
      // General
      setSystemName(data.systemName);
      setTimezone(data.timezone);
      setMaintenanceMode(data.maintenanceMode);
      setMaintenanceMessage(data.maintenanceMessage || '');
      
      // Security
      setEnforce2FA(data.enforce2FA);
      setMinPasswordLength(data.minPasswordLength);
      setSessionTimeout(data.sessionTimeout);
      setIpAllowlist(data.ipAllowlist || '');
      
      // Map
      setDefaultLat(data.defaultLat);
      setDefaultLng(data.defaultLng);
      setDefaultZoom(data.defaultZoom);
      setDefaultBaseLayer(data.defaultBaseLayer as 'satellite' | 'street');
      setCustomTileServer(data.customTileServer || '');
      setEnableWeatherRadar(data.enableWeatherRadar);
      
      // Notifications
      setEmailOnNewIncident(data.emailOnNewIncident);
      setSmsOnHighSeverity(data.smsOnHighSeverity);
      setDailyEmailSummary(data.dailyEmailSummary);
      setEnableLineNotify(data.enableLineNotify);
      setLineNotifyToken(data.lineNotifyToken || '');
      
      // API
      setWeatherApiKey(data.weatherApiKey || '');
      setSmsGatewayApiKey(data.smsGatewayApiKey || '');
      setMaxRequestsPerMinute(data.maxRequestsPerMinute);
      setBlockDuration(data.blockDuration);
      
      // Data
      setDataRetentionDays(data.dataRetentionDays);
      setBackupFrequency(data.backupFrequency as 'daily' | 'weekly' | 'monthly' | 'disabled');
      
      toast.success('โหลดการตั้งค่าเรียบร้อย');
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('ไม่สามารถโหลดการตั้งค่าได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({
        systemName,
        timezone,
        maintenanceMode,
        maintenanceMessage: maintenanceMessage || undefined,
      });
      toast.success('บันทึกการตั้งค่าทั่วไปเรียบร้อย');
    } catch (error) {
      console.error('Failed to save general settings:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({
        enforce2FA,
        minPasswordLength,
        sessionTimeout,
        ipAllowlist: ipAllowlist || undefined,
      });
      toast.success('บันทึกการตั้งค่าความปลอดภัยเรียบร้อย');
    } catch (error) {
      console.error('Failed to save security settings:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMap = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({
        defaultLat,
        defaultLng,
        defaultZoom,
        defaultBaseLayer,
        customTileServer: customTileServer || undefined,
        enableWeatherRadar,
      });
      toast.success('บันทึกการตั้งค่าแผนที่เรียบร้อย');
    } catch (error) {
      console.error('Failed to save map settings:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({
        emailOnNewIncident,
        smsOnHighSeverity,
        dailyEmailSummary,
        enableLineNotify,
        lineNotifyToken: lineNotifyToken || undefined,
      });
      toast.success('บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อย');
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAPI = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({
        weatherApiKey: weatherApiKey || undefined,
        smsGatewayApiKey: smsGatewayApiKey || undefined,
        maxRequestsPerMinute,
        blockDuration,
      });
      toast.success('บันทึกการตั้งค่า API เรียบร้อย');
    } catch (error) {
      console.error('Failed to save API settings:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveData = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({
        dataRetentionDays,
        backupFrequency,
      });
      toast.success('บันทึกการตั้งค่าข้อมูลเรียบร้อย');
    } catch (error) {
      console.error('Failed to save data settings:', error);
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeOldData = async () => {
    // Generate math CAPTCHA
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let correctAnswer = 0;
    let question = '';
    
    switch (operator) {
      case '+':
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        correctAnswer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '×':
        correctAnswer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
    }

    // First confirmation
    const firstConfirm = await Swal.fire({
      title: '⚠️ คำเตือนครั้งที่ 1',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin-bottom: 1rem; font-weight: 600;">คุณแน่ใจหรือไม่ที่จะลบข้อมูลเก่า?</p>
          <div style="background: #fff5f5; padding: 1rem; border-radius: 8px; border-left: 4px solid #fc8181;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 600;">📋 ข้อมูลที่จะถูกลบ:</p>
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li>Incidents เก่ากว่า <strong>${dataRetentionDays} วัน</strong></li>
              <li>Logs และ Reports เก่า</li>
              <li style="color: #c53030; font-weight: 600;">ไม่สามารถกู้คืนได้</li>
            </ul>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ดำเนินการต่อ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f56565',
      cancelButtonColor: '#718096',
    });

    if (!firstConfirm.isConfirmed) return;

    // Second confirmation with CAPTCHA
    const captchaResult = await Swal.fire({
      title: '🔐 ยืนยันการลบข้อมูล',
      html: `
        <div style="text-align: center;">
          <div style="background: #fff5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #fc8181;">
            <p style="margin: 0; color: #742a2a; font-weight: 600;">⚠️ คำเตือนครั้งที่ 2: กรุณาแก้โจทย์ด้านล่างเพื่อยืนยัน</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 12px; margin-bottom: 1rem;">
            <div style="font-size: 2rem; color: white; font-weight: 700; font-family: 'Courier New', monospace;">
              🧮 ${question} = ?
            </div>
          </div>
          
          <p style="color: #718096; font-size: 0.875rem; margin-top: 1rem;">กรอกคำตอบเป็นตัวเลข</p>
        </div>
      `,
      input: 'number',
      inputPlaceholder: 'กรอกคำตอบ',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '🗑️ ยืนยันลบข้อมูล',
      cancelButtonText: '❌ ยกเลิก',
      confirmButtonColor: '#f56565',
      cancelButtonColor: '#718096',
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณากรอกคำตอบ';
        }
        if (parseInt(value) !== correctAnswer) {
          return '❌ คำตอบไม่ถูกต้อง กรุณาลองใหม่';
        }
        return null;
      }
    });

    if (!captchaResult.isConfirmed) return;

    // Execute purge
    try {
      setSaving(true);
      const result = await settingsService.purgeOldData();
      
      await Swal.fire({
        title: '✅ สำเร็จ!',
        html: `ลบข้อมูลเก่าเรียบร้อย<br><small>ก่อน ${new Date(result.retentionDate).toLocaleDateString('th-TH')}</small>`,
        icon: 'success',
        confirmButtonColor: '#48bb78',
      });
    } catch (error) {
      console.error('Failed to purge old data:', error);
      await Swal.fire({
        title: '❌ เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบข้อมูลเก่าได้',
        icon: 'error',
        confirmButtonColor: '#f56565',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFactoryReset = async () => {
    if (window.confirm('⚠️⚠️ คุณแน่ใจหรือไม่? การรีเซ็ตจะลบการตั้งค่าทั้งหมด!')) {
      if (window.confirm('⚠️⚠️⚠️ ยืนยันอีกครั้ง! การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
        try {
          setSaving(true);
          await settingsService.factoryReset();
          toast.success('รีเซ็ตระบบเรียบร้อย กำลังโหลดการตั้งค่าใหม่...');
          await loadSettings();
        } catch (error) {
          console.error('Failed to factory reset:', error);
          toast.error('ไม่สามารถรีเซ็ตระบบได้');
        } finally {
          setSaving(false);
        }
      }
    }
  };

  const renderGeneralTab = () => (
    <div className="settings-tab-content">
      <h2>⚙️ การตั้งค่าทั่วไป</h2>
      <p className="tab-description">กำหนดค่าพื้นฐานของแอปพลิเคชัน</p>

      <div className="settings-section">
        <div className="form-group">
          <label htmlFor="systemName">ชื่อแอปพลิเคชัน</label>
          <input
            type="text"
            id="systemName"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            placeholder="Guardian Route"
          />
          <span className="hint">ชื่อที่แสดงบน Header และหน้า Login</span>
        </div>

        <div className="form-group">
          <label htmlFor="timezone">เขตเวลา</label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
            <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
            <option value="UTC">UTC (GMT+0)</option>
          </select>
          <span className="hint">เขตเวลาหลักของระบบ</span>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">เปิดใช้งานโหมดบำรุงรักษา</span>
          </label>
          <span className="hint">ผู้ใช้ทั่วไปจะไม่สามารถเข้าถึงระบบได้</span>
        </div>

        {maintenanceMode && (
          <div className="form-group">
            <label htmlFor="maintenanceMessage">ข้อความในโหมดบำรุงรักษา</label>
            <textarea
              id="maintenanceMessage"
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              rows={3}
              placeholder="ระบบอยู่ระหว่างการบำรุงรักษา..."
            />
          </div>
        )}
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSaveGeneral} disabled={saving}>
          💾 {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
        </button>
        <button className="btn-secondary" onClick={() => toast('ยกเลิกการเปลี่ยนแปลง')} disabled={saving}>
          ❌ ยกเลิก
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-tab-content">
      <h2>🔒 ผู้ใช้และความปลอดภัย</h2>
      <p className="tab-description">กำหนดนโยบายความปลอดภัยในการเข้าถึง</p>

      <div className="settings-section">
        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={enforce2FA}
              onChange={(e) => setEnforce2FA(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">บังคับใช้ Two-Factor Authentication (2FA)</span>
          </label>
          <span className="hint">ผู้ใช้ทุกคนต้องตั้งค่า 2FA</span>
        </div>

        <div className="form-group">
          <label htmlFor="minPasswordLength">ความยาวรหัสผ่านขั้นต่ำ (ตัวอักษร)</label>
          <input
            type="number"
            id="minPasswordLength"
            value={minPasswordLength}
            onChange={(e) => setMinPasswordLength(Number(e.target.value))}
            min="8"
            max="32"
          />
          <span className="hint">แนะนำ: 8-16 ตัวอักษร</span>
        </div>

        <div className="form-group">
          <label htmlFor="sessionTimeout">ระยะเวลาเซสชัน (นาที)</label>
          <input
            type="number"
            id="sessionTimeout"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            min="5"
            max="120"
          />
          <span className="hint">ออกจากระบบอัตโนมัติเมื่อไม่มีการใช้งาน</span>
        </div>

        <div className="form-group">
          <label htmlFor="ipAllowlist">IP Address Allowlist</label>
          <textarea
            id="ipAllowlist"
            value={ipAllowlist}
            onChange={(e) => setIpAllowlist(e.target.value)}
            rows={3}
            placeholder="192.168.1.1, 10.0.0.1, 172.16.0.1"
          />
          <span className="hint">รายการ IP ที่อนุญาตให้เข้าถึง (คั่นด้วยจุลภาค)</span>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSaveSecurity}>
          💾 บันทึกการตั้งค่า
        </button>
        <button className="btn-secondary" onClick={() => toast('ยกเลิกการเปลี่ยนแปลง')}>
          ❌ ยกเลิก
        </button>
      </div>
    </div>
  );

  const renderMapTab = () => (
    <div className="settings-tab-content">
      <h2>🗺️ แผนที่และภูมิสารสนเทศ</h2>
      <p className="tab-description">ปรับแต่งการแสดงผลแผนที่</p>

      <div className="settings-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="defaultLat">Default Latitude</label>
            <input
              type="number"
              id="defaultLat"
              value={defaultLat}
              onChange={(e) => setDefaultLat(Number(e.target.value))}
              step="0.0001"
            />
            <span className="hint">ตำแหน่ง Latitude เริ่มต้น</span>
          </div>

          <div className="form-group">
            <label htmlFor="defaultLng">Default Longitude</label>
            <input
              type="number"
              id="defaultLng"
              value={defaultLng}
              onChange={(e) => setDefaultLng(Number(e.target.value))}
              step="0.0001"
            />
            <span className="hint">ตำแหน่ง Longitude เริ่มต้น</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="defaultZoom">Default Zoom Level</label>
          <input
            type="number"
            id="defaultZoom"
            value={defaultZoom}
            onChange={(e) => setDefaultZoom(Number(e.target.value))}
            min="1"
            max="18"
          />
          <span className="hint">ระดับ Zoom เริ่มต้น (1-18)</span>
        </div>

        <div className="form-group">
          <label htmlFor="defaultBaseLayer">Default Base Layer</label>
          <select
            id="defaultBaseLayer"
            value={defaultBaseLayer}
            onChange={(e) => setDefaultBaseLayer(e.target.value as 'satellite' | 'street')}
          >
            <option value="street">แผนที่ถนน (Street Map)</option>
            <option value="satellite">ภาพถ่ายดาวเทียม (Satellite)</option>
          </select>
          <span className="hint">ชั้นข้อมูลแผนที่เริ่มต้น</span>
        </div>

        <div className="form-group">
          <label htmlFor="customTileServer">Custom Map Tile Server URL</label>
          <input
            type="text"
            id="customTileServer"
            value={customTileServer}
            onChange={(e) => setCustomTileServer(e.target.value)}
            placeholder="https://tile.example.com/{z}/{x}/{y}.png"
          />
          <span className="hint">URL ของ Tile Server (เช่น GISTDA)</span>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={enableWeatherRadar}
              onChange={(e) => setEnableWeatherRadar(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">เปิดใช้งานเรดาร์สภาพอากาศ</span>
          </label>
          <span className="hint">แสดงชั้นข้อมูลเรดาร์อัตโนมัติ</span>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSaveMap}>
          💾 บันทึกการตั้งค่า
        </button>
        <button className="btn-secondary" onClick={() => toast('ยกเลิกการเปลี่ยนแปลง')}>
          ❌ ยกเลิก
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-tab-content">
      <h2>🔔 การแจ้งเตือน</h2>
      <p className="tab-description">ควบคุมการส่งการแจ้งเตือนอัตโนมัติ</p>

      <div className="settings-section">
        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={emailOnNewIncident}
              onChange={(e) => setEmailOnNewIncident(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">ส่งอีเมลเมื่อมีเหตุการณ์ใหม่</span>
          </label>
          <span className="hint">แจ้งเตือนผ่านอีเมลทันทีเมื่อมีเหตุการณ์ใหม่</span>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={smsOnHighSeverity}
              onChange={(e) => setSmsOnHighSeverity(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">ส่ง SMS เมื่อเหตุการณ์ความรุนแรงสูง</span>
          </label>
          <span className="hint">แจ้งเตือนผ่าน SMS สำหรับเหตุการณ์ฉุกเฉิน</span>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={dailyEmailSummary}
              onChange={(e) => setDailyEmailSummary(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">ส่งสรุปรายงานประจำวัน</span>
          </label>
          <span className="hint">ส่งอีเมลสรุปเหตุการณ์ทุกวันเวลา 18:00 น.</span>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={enableLineNotify}
              onChange={(e) => setEnableLineNotify(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">เปิดใช้งาน LINE Notify</span>
          </label>
          <span className="hint">แจ้งเตือนผ่าน LINE Notify</span>
        </div>

        {enableLineNotify && (
          <div className="form-group">
            <label htmlFor="lineNotifyToken">LINE Notify Access Token</label>
            <input
              type="password"
              id="lineNotifyToken"
              value={lineNotifyToken}
              onChange={(e) => setLineNotifyToken(e.target.value)}
              placeholder="••••••••••••••••••••"
            />
            <span className="hint">Access Token จาก LINE Notify (ข้อมูลนี้จะถูกเข้ารหัส)</span>
          </div>
        )}
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSaveNotifications}>
          💾 บันทึกการตั้งค่า
        </button>
        <button className="btn-secondary" onClick={() => toast('ยกเลิกการเปลี่ยนแปลง')}>
          ❌ ยกเลิก
        </button>
      </div>
    </div>
  );

  const renderAPITab = () => (
    <div className="settings-tab-content">
      <h2>🔌 การเชื่อมต่อและ API</h2>
      <p className="tab-description">จัดการ API Keys และ Rate Limiting</p>

      <div className="settings-section">
        <div className="form-group">
          <label htmlFor="weatherApiKey">Weather API Key</label>
          <input
            type="password"
            id="weatherApiKey"
            value={weatherApiKey}
            onChange={(e) => setWeatherApiKey(e.target.value)}
            placeholder="••••••••••••••••••••"
          />
          <span className="hint">API Key สำหรับข้อมูลสภาพอากาศ</span>
        </div>

        <div className="form-group">
          <label htmlFor="smsGatewayApiKey">SMS Gateway API Key</label>
          <input
            type="password"
            id="smsGatewayApiKey"
            value={smsGatewayApiKey}
            onChange={(e) => setSmsGatewayApiKey(e.target.value)}
            placeholder="••••••••••••••••••••"
          />
          <span className="hint">API Key สำหรับส่ง SMS</span>
        </div>

        <h3 className="section-title">⚡ Rate Limiting</h3>

        <div className="form-group">
          <label htmlFor="maxRequestsPerMinute">จำนวนคำขอสูงสุดต่อนาที</label>
          <input
            type="number"
            id="maxRequestsPerMinute"
            value={maxRequestsPerMinute}
            onChange={(e) => setMaxRequestsPerMinute(Number(e.target.value))}
            min="10"
            max="1000"
          />
          <span className="hint">จำกัดจำนวนคำขอ API เพื่อป้องกันการโจมตี</span>
        </div>

        <div className="form-group">
          <label htmlFor="blockDuration">ระยะเวลาที่บล็อก (วินาที)</label>
          <input
            type="number"
            id="blockDuration"
            value={blockDuration}
            onChange={(e) => setBlockDuration(Number(e.target.value))}
            min="60"
            max="3600"
          />
          <span className="hint">บล็อก IP ที่เรียก API เกินกำหนด</span>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSaveAPI}>
          💾 บันทึกการตั้งค่า
        </button>
        <button className="btn-secondary" onClick={() => toast('ยกเลิกการเปลี่ยนแปลง')}>
          ❌ ยกเลิก
        </button>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="settings-tab-content">
      <h2>💾 ข้อมูลและพื้นที่จัดเก็บ</h2>
      <p className="tab-description">กำหนดนโยบายการจัดเก็บและสำรองข้อมูล</p>

      {/* Storage Settings */}
      <div className="settings-section">
        <h3 className="section-title">📊 การจัดเก็บข้อมูล</h3>
        
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-card-header">
              <span className="setting-icon">📅</span>
              <h4>ระยะเวลาจัดเก็บข้อมูล</h4>
            </div>
            <div className="setting-card-body">
              <div className="input-with-unit">
                <input
                  type="number"
                  id="dataRetentionDays"
                  value={dataRetentionDays}
                  onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                  min="30"
                  max="3650"
                  className="input-large"
                />
                <span className="input-unit">วัน</span>
              </div>
              <p className="setting-description">
                ข้อมูลที่เก่ากว่า <strong>{dataRetentionDays} วัน</strong> จะถูกลบอัตโนมัติ
              </p>
              <div className="setting-info">
                <span className="info-badge info">ℹ️ แนะนำ: 365-730 วัน (1-2 ปี)</span>
              </div>
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-card-header">
              <span className="setting-icon">💾</span>
              <h4>ความถี่การสำรองข้อมูล</h4>
            </div>
            <div className="setting-card-body">
              <select
                id="backupFrequency"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value as 'daily' | 'weekly' | 'monthly' | 'disabled')}
                className="select-large"
              >
                <option value="daily">🌅 รายวัน (Daily)</option>
                <option value="weekly">📅 รายสัปดาห์ (Weekly)</option>
                <option value="monthly">📆 รายเดือน (Monthly)</option>
                <option value="disabled">🚫 ปิดใช้งาน (Disabled)</option>
              </select>
              <p className="setting-description">
                สำรองข้อมูลอัตโนมัติ: <strong>{backupFrequency === 'daily' ? 'ทุกวัน' : backupFrequency === 'weekly' ? 'ทุกสัปดาห์' : backupFrequency === 'monthly' ? 'ทุกเดือน' : 'ปิดใช้งาน'}</strong>
              </p>
              <div className="setting-info">
                <span className="info-badge success">✓ แนะนำ: รายวัน สำหรับข้อมูลสำคัญ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={handleSaveData} disabled={saving}>
          💾 {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
        </button>
        <button className="btn-secondary" onClick={() => toast('ยกเลิกการเปลี่ยนแปลง')} disabled={saving}>
          ❌ ยกเลิก
        </button>
      </div>

      {/* Danger Zone */}
      <div className="danger-zone">
        <div className="danger-zone-header">
          <h3 className="danger-title">⚠️ Danger Zone</h3>
          <p className="danger-description">การกระทำเหล่านี้มีความเสี่ยงสูง กรุณาใช้ความระมัดระวัง</p>
        </div>

        <div className="danger-actions">
          <div className="danger-action-card">
            <div className="danger-icon">🗑️</div>
            <div className="danger-content">
              <h4 className="danger-action-title">ลบข้อมูลเก่า (Purge Old Data)</h4>
              <p className="danger-action-description">
                ลบข้อมูลที่เก่ากว่า <strong>{dataRetentionDays} วัน</strong> ทันที
              </p>
              <ul className="danger-list">
                <li>ลบ incidents, logs, และ reports เก่า</li>
                <li>ไม่สามารถกู้คืนได้</li>
                <li>ใช้เวลา 5-10 นาที</li>
              </ul>
            </div>
            <button className="btn-danger" onClick={handlePurgeOldData} disabled={saving}>
              🗑️ ลบข้อมูลเก่า
            </button>
          </div>

          {/* Factory Reset - DEVELOPER ONLY */}
          {isDeveloper && (
            <div className="danger-action-card danger-critical">
              <div className="danger-icon">🚨</div>
              <div className="danger-content">
                <h4 className="danger-action-title">รีเซ็ตระบบ (Factory Reset)</h4>
                <p className="danger-action-description">
                  รีเซ็ตการตั้งค่าทั้งหมดกลับเป็นค่าเริ่มต้น
                </p>
                <ul className="danger-list">
                  <li>ลบการตั้งค่าทั้งหมด</li>
                  <li>ไม่ลบข้อมูล users และ incidents</li>
                  <li>ต้องตั้งค่าใหม่ทั้งหมด</li>
                  <li>ต้องยืนยัน 2 ครั้ง</li>
                </ul>
                <div className="developer-only-badge">
                  👨‍💻 DEVELOPER ONLY
                </div>
              </div>
              <button className="btn-danger btn-danger-critical" onClick={handleFactoryReset} disabled={saving}>
                🚨 Factory Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="settings-page">
          <div className="page-header">
            <h1>⚙️ ตั้งค่าระบบ</h1>
            <p className="subtitle">กำลังโหลดการตั้งค่า...</p>
          </div>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div className="spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="settings-page">
        <div className="page-header">
          <h1>⚙️ ตั้งค่าระบบ</h1>
          <p className="subtitle">จัดการการตั้งค่าและกำหนดค่าระบบ Guardian Route</p>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <h3>หมวดหมู่</h3>
            <nav className="settings-nav">
              <button
                className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <span className="icon">⚙️</span>
                ทั่วไป
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <span className="icon">🔒</span>
                ผู้ใช้และความปลอดภัย
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <span className="icon">🗺️</span>
                แผนที่และภูมิสารสนเทศ
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <span className="icon">🔔</span>
                การแจ้งเตือน
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'api' ? 'active' : ''}`}
                onClick={() => setActiveTab('api')}
              >
                <span className="icon">🔌</span>
                การเชื่อมต่อและ API
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'data' ? 'active' : ''}`}
                onClick={() => setActiveTab('data')}
              >
                <span className="icon">💾</span>
                ข้อมูลและพื้นที่จัดเก็บ
              </button>
            </nav>
          </div>

          <div className="settings-content">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'map' && renderMapTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'api' && renderAPITab()}
            {activeTab === 'data' && renderDataTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
