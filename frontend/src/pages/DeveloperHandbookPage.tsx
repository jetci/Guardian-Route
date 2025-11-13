/**
 * Developer Handbook Page
 * Guardian Route Project - Open Government Initiative
 * 
 * Static documentation page for developers
 * Accessible without authentication
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DeveloperHandbookPage.css';

export default function DeveloperHandbookPage() {
  const [activeSection, setActiveSection] = useState('principles');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['principles', 'architecture', 'security', 'implementation', 'testing', 'qa'];
      const scrollPosition = window.scrollY + 100;

      // Show/hide back to top button
      setShowBackToTop(window.scrollY > 500);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="handbook-container">
      {/* Header */}
      <header className="handbook-header">
        <div className="header-content">
          <h1>📘 Developer Handbook</h1>
          <p className="subtitle">Guardian Route - Open Government Initiative</p>
          <p className="description">
            คู่มือนักพัฒนาสำหรับระบบบริหารจัดการภัยพิบัติ ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
          </p>
          <div className="header-badges">
            <span className="badge">React 19</span>
            <span className="badge">TypeScript</span>
            <span className="badge">NestJS</span>
            <span className="badge">PostgreSQL</span>
            <span className="badge">Open Source</span>
          </div>
        </div>
      </header>

      <div className="handbook-layout">
        {/* Sidebar Navigation */}
        <nav className="handbook-nav">
          <div className="nav-sticky">
            <h3>📑 สารบัญ</h3>
            <ul>
              <li className={activeSection === 'principles' ? 'active' : ''}>
                <button onClick={() => scrollToSection('principles')}>
                  📘 Principles & Guidelines
                </button>
              </li>
              <li className={activeSection === 'architecture' ? 'active' : ''}>
                <button onClick={() => scrollToSection('architecture')}>
                  🧠 Architecture & Design
                </button>
              </li>
              <li className={activeSection === 'security' ? 'active' : ''}>
                <button onClick={() => scrollToSection('security')}>
                  🔐 Security Checklist
                </button>
              </li>
              <li className={activeSection === 'implementation' ? 'active' : ''}>
                <button onClick={() => scrollToSection('implementation')}>
                  🛠️ Implementation & Practices
                </button>
              </li>
              <li className={activeSection === 'testing' ? 'active' : ''}>
                <button onClick={() => scrollToSection('testing')}>
                  🧪 Testing Strategy
                </button>
              </li>
              <li className={activeSection === 'qa' ? 'active' : ''}>
                <button onClick={() => scrollToSection('qa')}>
                  ✅ QA, Deployment & Maintenance
                </button>
              </li>
            </ul>

            <div className="nav-footer">
              <Link to="/" className="btn-back">← กลับหน้าหลัก</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="handbook-content">
          {/* Section 1: Principles & Guidelines */}
          <section id="principles" className="handbook-section">
            <h2>📘 Principles & Guidelines</h2>
            <p className="section-intro">
              หลักการและแนวทางการพัฒนาระบบตามมาตรฐานภาครัฐและกฎหมายที่เกี่ยวข้อง
            </p>

            <div className="content-card">
              <h3>🎯 ปรัชญาการพัฒนา</h3>
              <ul>
                <li><strong>Open Government:</strong> เปิดเผยโค้ดและกระบวนการพัฒนา</li>
                <li><strong>Citizen-Centric:</strong> ออกแบบเพื่อประชาชนเป็นศูนย์กลาง</li>
                <li><strong>Data-Driven:</strong> ใช้ข้อมูลในการตัดสินใจ</li>
                <li><strong>Sustainable:</strong> พัฒนาอย่างยั่งยืนและต่อเนื่อง</li>
                <li><strong>Secure by Design:</strong> ความปลอดภัยตั้งแต่เริ่มต้น</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>⚖️ กฎหมายและมาตรฐานที่เกี่ยวข้อง</h3>
              <ul>
                <li><strong>PDPA (พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล):</strong> ปกป้องข้อมูลส่วนบุคคลของประชาชน</li>
                <li><strong>DGA Standards:</strong> มาตรฐานการพัฒนาระบบภาครัฐ</li>
                <li><strong>WCAG 2.1 Level AA:</strong> มาตรฐานการเข้าถึงสำหรับผู้พิการ</li>
                <li><strong>Cybersecurity Act:</strong> กฎหมายความมั่นคงปลอดภัยไซเบอร์</li>
                <li><strong>Open Data Charter:</strong> หลักการข้อมูลเปิดภาครัฐ</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🔧 เทคโนโลยีที่ใช้</h3>
              <div className="tech-grid">
                <div className="tech-item">
                  <h4>Frontend</h4>
                  <ul>
                    <li>React 19 + TypeScript</li>
                    <li>Vite (Build Tool)</li>
                    <li>React Router v6</li>
                    <li>Zustand (State Management)</li>
                    <li>Tailwind CSS</li>
                    <li>Leaflet (Maps)</li>
                  </ul>
                </div>
                <div className="tech-item">
                  <h4>Backend</h4>
                  <ul>
                    <li>NestJS + TypeScript</li>
                    <li>PostgreSQL + PostGIS</li>
                    <li>Prisma ORM</li>
                    <li>JWT Authentication</li>
                    <li>Swagger/OpenAPI</li>
                    <li>Docker</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>📜 นโยบาย Open Source</h3>
              <ul>
                <li><strong>License:</strong> MIT License - เปิดให้ใช้งานและดัดแปลงได้อย่างเสรี</li>
                <li><strong>Repository:</strong> <a href="https://github.com/jetci/Guardian-Route" target="_blank" rel="noopener noreferrer">github.com/jetci/Guardian-Route</a></li>
                <li><strong>Contribution:</strong> ยินดีรับ Pull Requests และ Issues</li>
                <li><strong>Documentation:</strong> เอกสารครบถ้วนเป็นภาษาไทยและอังกฤษ</li>
                <li><strong>Community:</strong> สนับสนุนการแบ่งปันความรู้และพัฒนาร่วมกัน</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Architecture & Design */}
          <section id="architecture" className="handbook-section">
            <h2>🧠 Architecture & Design</h2>
            <p className="section-intro">
              โครงสร้างระบบและหลักการออกแบบที่ใช้ในโปรเจกต์
            </p>

            <div className="content-card">
              <h3>🏗️ โครงสร้างโปรเจกต์</h3>
              <pre className="code-block">
{`Guardian-Route/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── stores/          # State management
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
│
├── backend/                  # NestJS Application
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management
│   │   ├── incidents/       # Incident management
│   │   ├── reports/         # Report generation
│   │   ├── villages/        # Village data
│   │   ├── tasks/           # Task management
│   │   └── common/          # Shared utilities
│   └── prisma/              # Database schema & migrations
│
└── docs/                     # Documentation`}
              </pre>
            </div>

            <div className="content-card">
              <h3>🎨 Design Patterns</h3>
              <ul>
                <li><strong>MVC Pattern:</strong> Model-View-Controller สำหรับ Backend</li>
                <li><strong>Repository Pattern:</strong> แยก Data Access Layer</li>
                <li><strong>Service Layer:</strong> Business Logic แยกจาก Controllers</li>
                <li><strong>DTO Pattern:</strong> Data Transfer Objects สำหรับ API</li>
                <li><strong>Guard Pattern:</strong> Authentication & Authorization</li>
                <li><strong>Interceptor Pattern:</strong> Request/Response transformation</li>
                <li><strong>Component Pattern:</strong> Reusable UI components</li>
                <li><strong>Custom Hooks:</strong> Shared logic ใน React</li>
              </ul>
            </div>


            <div className="content-card">
              <h3>📊 Database Schema</h3>
              <p>ใช้ PostgreSQL + PostGIS สำหรับข้อมูลภูมิศาสตร์</p>
              <ul>
                <li><strong>Users:</strong> ผู้ใช้งานระบบ (4 roles)</li>
                <li><strong>Villages:</strong> ข้อมูล 20 หมู่บ้านในตำบลเวียง</li>
                <li><strong>Incidents:</strong> เหตุการณ์ภัยพิบัติ</li>
                <li><strong>Reports:</strong> รายงานการประเมิน</li>
                <li><strong>Tasks:</strong> ภารกิจที่มอบหมาย</li>
                <li><strong>ActivityLogs:</strong> บันทึกการใช้งานระบบ</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Security Checklist */}
          <section id="security" className="handbook-section">
            <h2>🔐 Security Checklist</h2>
            <p className="section-intro">
              มาตรการรักษาความปลอดภัยที่ใช้ในระบบ ตามมาตรฐาน OWASP และ Cybersecurity Act
            </p>

            <div className="content-card">
              <h3>🔑 Authentication & Authorization</h3>
              <ul>
                <li>✅ <strong>JWT Token-based Authentication:</strong> ใช้ Access Token (15 นาที) และ Refresh Token (7 วัน)</li>
                <li>✅ <strong>Role-Based Access Control (RBAC):</strong> 5 roles - DEVELOPER, ADMIN, EXECUTIVE, SUPERVISOR, FIELD_OFFICER</li>
                <li>✅ <strong>Password Security:</strong> bcrypt hashing (10 rounds), minimum 8 characters, complexity requirements</li>
                <li>✅ <strong>Session Management:</strong> Secure token storage, automatic logout on inactivity</li>
                <li>✅ <strong>Multi-Factor Authentication (MFA):</strong> รองรับ OTP ผ่าน Email/SMS (Phase 2)</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🛡️ Input Validation & Sanitization</h3>
              <ul>
                <li>✅ <strong>Backend Validation:</strong> class-validator ทุก DTO</li>
                <li>✅ <strong>Frontend Validation:</strong> React Hook Form + Zod schema</li>
                <li>✅ <strong>SQL Injection Prevention:</strong> Prisma ORM (parameterized queries)</li>
                <li>✅ <strong>XSS Protection:</strong> React auto-escaping, DOMPurify สำหรับ rich text</li>
                <li>✅ <strong>File Upload Security:</strong> Type validation, size limits, virus scanning</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🌐 Network & API Security</h3>
              <ul>
                <li>✅ <strong>HTTPS Only:</strong> TLS 1.3, HSTS headers</li>
                <li>✅ <strong>CORS Policy:</strong> Whitelist allowed origins</li>
                <li>✅ <strong>Rate Limiting:</strong> 100 requests/15 minutes per IP</li>
                <li>✅ <strong>API Throttling:</strong> Prevent brute force attacks</li>
                <li>✅ <strong>CSRF Protection:</strong> SameSite cookies, CSRF tokens</li>
                <li>✅ <strong>Security Headers:</strong> CSP, X-Frame-Options, X-Content-Type-Options</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🔒 Data Protection (PDPA Compliance)</h3>
              <ul>
                <li>✅ <strong>Encryption at Rest:</strong> Database encryption, encrypted backups</li>
                <li>✅ <strong>Encryption in Transit:</strong> TLS/SSL for all communications</li>
                <li>✅ <strong>Personal Data Handling:</strong> Consent management, data minimization</li>
                <li>✅ <strong>Right to Access:</strong> Users can view their data</li>
                <li>✅ <strong>Right to Deletion:</strong> Data erasure on request</li>
                <li>✅ <strong>Audit Logs:</strong> Track all data access and modifications</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🔍 Security Monitoring & Incident Response</h3>
              <ul>
                <li>✅ <strong>Logging:</strong> Winston logger, structured logs</li>
                <li>✅ <strong>Error Tracking:</strong> Sentry integration</li>
                <li>✅ <strong>Security Alerts:</strong> Suspicious activity detection</li>
                <li>✅ <strong>Vulnerability Scanning:</strong> npm audit, Snyk</li>
                <li>✅ <strong>Penetration Testing:</strong> Quarterly security audits</li>
                <li>✅ <strong>Incident Response Plan:</strong> Documented procedures</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>⚙️ Environment & Secrets Management</h3>
              <ul>
                <li>✅ <strong>Environment Variables:</strong> Never commit secrets to Git</li>
                <li>✅ <strong>.env Files:</strong> Different configs for dev/staging/prod</li>
                <li>✅ <strong>Secrets Rotation:</strong> Regular JWT secret rotation</li>
                <li>✅ <strong>Access Control:</strong> Principle of least privilege</li>
                <li>✅ <strong>Docker Secrets:</strong> Secure secret injection in containers</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('architecture')} className="btn-nav prev">
                ← Previous: Architecture
              </button>
              <button onClick={() => scrollToSection('implementation')} className="btn-nav next">
                Next: Implementation →
              </button>
            </div>
          </section>

          {/* Section 4: Implementation & Practices */}
          <section id="implementation" className="handbook-section">
            <h2>🛠️ Implementation & Practices</h2>
            <p className="section-intro">
              แนวปฏิบัติในการเขียนโค้ดและการทำงานร่วมกัน
            </p>

            <div className="content-card">
              <h3>💻 Coding Style</h3>
              <ul>
                <li><strong>TypeScript:</strong> ใช้ strict mode, หลีกเลี่ยง any</li>
                <li><strong>ESLint:</strong> ตรวจสอบคุณภาพโค้ดอัตโนมัติ</li>
                <li><strong>Prettier:</strong> จัดรูปแบบโค้ดให้สม่ำเสมอ</li>
                <li><strong>Naming Convention:</strong>
                  <ul>
                    <li>camelCase สำหรับ variables, functions</li>
                    <li>PascalCase สำหรับ Components, Classes</li>
                    <li>UPPER_SNAKE_CASE สำหรับ constants</li>
                  </ul>
                </li>
                <li><strong>Comments:</strong> เขียนภาษาไทยหรืออังกฤษ ชัดเจนกระชับ</li>
                <li><strong>File Organization:</strong> 1 component = 1 file</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🌿 Git Workflow</h3>
              <ul>
                <li><strong>Branch Strategy:</strong>
                  <ul>
                    <li><code>main</code> - Production-ready code</li>
                    <li><code>develop</code> - Development branch</li>
                    <li><code>feature/*</code> - New features</li>
                    <li><code>fix/*</code> - Bug fixes</li>
                    <li><code>hotfix/*</code> - Urgent production fixes</li>
                  </ul>
                </li>
                <li><strong>Commit Messages:</strong>
                  <ul>
                    <li><code>feat:</code> New feature</li>
                    <li><code>fix:</code> Bug fix</li>
                    <li><code>docs:</code> Documentation</li>
                    <li><code>style:</code> Formatting</li>
                    <li><code>refactor:</code> Code refactoring</li>
                    <li><code>test:</code> Tests</li>
                    <li><code>chore:</code> Maintenance</li>
                  </ul>
                </li>
                <li><strong>Pull Requests:</strong> ต้องผ่าน Code Review ก่อน merge</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🔌 API Design</h3>
              <ul>
                <li><strong>RESTful API:</strong> ใช้ HTTP methods ตามมาตรฐาน</li>
                <li><strong>Versioning:</strong> <code>/api/v1/...</code></li>
                <li><strong>Response Format:</strong> JSON with consistent structure</li>
                <li><strong>Error Handling:</strong> HTTP status codes + error messages</li>
                <li><strong>Pagination:</strong> <code>?page=1&limit=20</code></li>
                <li><strong>Filtering:</strong> <code>?status=ACTIVE&role=ADMIN</code></li>
                <li><strong>Swagger Documentation:</strong> Auto-generated API docs</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>📝 Documentation Standards</h3>
              <ul>
                <li>README.md ในทุก module</li>
                <li>JSDoc comments สำหรับ functions</li>
                <li>API documentation ใน Swagger</li>
                <li>Architecture Decision Records (ADR)</li>
                <li>Changelog for releases</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('security')} className="btn-nav prev">
                ← Previous: Security
              </button>
              <button onClick={() => scrollToSection('testing')} className="btn-nav next">
                Next: Testing →
              </button>
            </div>
          </section>

          {/* Section 5: Testing Strategy */}
          <section id="testing" className="handbook-section">
            <h2>🧪 Testing Strategy</h2>
            <p className="section-intro">
              กลยุทธ์การทดสอบแบบครอบคลุม เพื่อรับประกันคุณภาพและความน่าเชื่อถือของระบบ
            </p>

            <div className="content-card">
              <h3>🔬 Testing Pyramid</h3>
              <ul>
                <li><strong>Unit Tests (70%):</strong> ทดสอบ functions, components แยกส่วน</li>
                <li><strong>Integration Tests (20%):</strong> ทดสอบการทำงานร่วมกันของ modules</li>
                <li><strong>E2E Tests (10%):</strong> ทดสอบ user workflows ทั้งหมด</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🛠️ Testing Tools</h3>
              <div className="tech-grid">
                <div className="tech-item">
                  <h4>Frontend Testing</h4>
                  <ul>
                    <li><strong>Vitest:</strong> Unit & Integration tests</li>
                    <li><strong>React Testing Library:</strong> Component testing</li>
                    <li><strong>Playwright:</strong> E2E testing</li>
                    <li><strong>MSW:</strong> API mocking</li>
                  </ul>
                </div>
                <div className="tech-item">
                  <h4>Backend Testing</h4>
                  <ul>
                    <li><strong>Jest:</strong> Unit & Integration tests</li>
                    <li><strong>Supertest:</strong> API endpoint testing</li>
                    <li><strong>Prisma Mock:</strong> Database mocking</li>
                    <li><strong>Artillery:</strong> Load testing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>📊 Test Coverage Requirements</h3>
              <ul>
                <li><strong>Overall Coverage:</strong> &gt;80%</li>
                <li><strong>Critical Paths:</strong> 100% (Authentication, Authorization, Payment)</li>
                <li><strong>Business Logic:</strong> &gt;90%</li>
                <li><strong>UI Components:</strong> &gt;70%</li>
                <li><strong>Utility Functions:</strong> &gt;85%</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>✅ Test Scenarios</h3>
              <ul>
                <li><strong>Happy Path:</strong> ทดสอบการทำงานปกติ</li>
                <li><strong>Error Handling:</strong> ทดสอบการจัดการ errors</li>
                <li><strong>Edge Cases:</strong> ทดสอบกรณีพิเศษ</li>
                <li><strong>Security Tests:</strong> ทดสอบช่องโหว่ความปลอดภัย</li>
                <li><strong>Performance Tests:</strong> ทดสอบประสิทธิภาพ</li>
                <li><strong>Accessibility Tests:</strong> ทดสอบการเข้าถึง (WCAG 2.1)</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🔄 Continuous Testing</h3>
              <ul>
                <li>✅ <strong>Pre-commit Hooks:</strong> Run unit tests before commit</li>
                <li>✅ <strong>CI Pipeline:</strong> Run all tests on every push</li>
                <li>✅ <strong>Nightly Builds:</strong> Full E2E test suite</li>
                <li>✅ <strong>Coverage Reports:</strong> Track coverage trends</li>
                <li>✅ <strong>Test Automation:</strong> Automated regression testing</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>📝 Test Documentation</h3>
              <pre className="code-block">
{`// Example: Unit Test
import { describe, it, expect } from 'vitest';
import { validateEmail } from './validators';

describe('Email Validator', () => {
  it('should accept valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});

// Example: Component Test
import { render, screen } from '@testing-library/react';
import { LoginForm } from './LoginForm';

it('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});`}
              </pre>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('implementation')} className="btn-nav prev">
                ← Previous: Implementation
              </button>
              <button onClick={() => scrollToSection('qa')} className="btn-nav next">
                Next: QA & Deployment →
              </button>
            </div>
          </section>

          {/* Section 6: QA, Deployment & Maintenance */}
          <section id="qa" className="handbook-section">
            <h2>✅ QA, Deployment & Maintenance</h2>
            <p className="section-intro">
              การทดสอบ การ deploy และการดูแลรักษาระบบ
            </p>

            <div className="content-card">
              <h3>🧪 Testing Pyramid</h3>
              <ul>
                <li><strong>Unit Tests:</strong> ทดสอบ functions และ components แยกส่วน</li>
                <li><strong>Integration Tests:</strong> ทดสอบการทำงานร่วมกันของ modules</li>
                <li><strong>E2E Tests:</strong> ทดสอบ user workflows ทั้งหมด</li>
                <li><strong>Tools:</strong> Vitest, React Testing Library, Playwright</li>
                <li><strong>Coverage Target:</strong> &gt;80% for critical paths</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🐳 Docker Deployment</h3>
              <pre className="code-block">
{`# Development
docker-compose up -d

# Production
docker build -t guardian-route .
docker run -p 3000:3000 guardian-route

# Environment Variables
DATABASE_URL=postgresql://...
JWT_SECRET=...
NODE_ENV=production`}
              </pre>
            </div>

            <div className="content-card">
              <h3>🔄 CI/CD Pipeline</h3>
              <ul>
                <li>✅ Automated testing on every commit</li>
                <li>✅ Code quality checks (ESLint, TypeScript)</li>
                <li>✅ Security scanning</li>
                <li>✅ Automated deployment to staging</li>
                <li>✅ Manual approval for production</li>
                <li>✅ Rollback capability</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>🛠️ Maintenance Plan</h3>
              <ul>
                <li><strong>Daily:</strong> Monitor logs and errors</li>
                <li><strong>Weekly:</strong> Review performance metrics</li>
                <li><strong>Monthly:</strong> Update dependencies</li>
                <li><strong>Quarterly:</strong> Security audit</li>
                <li><strong>Yearly:</strong> Architecture review</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>📊 Monitoring & Logging</h3>
              <ul>
                <li>Application logs (Winston)</li>
                <li>Error tracking (Sentry)</li>
                <li>Performance monitoring</li>
                <li>Database query analysis</li>
                <li>User activity logs</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('testing')} className="btn-nav prev">
                ← Previous: Testing
              </button>
              <button onClick={scrollToTop} className="btn-nav next">
                ↑ Back to Top
              </button>
            </div>
          </section>

          {/* Footer Links */}
          <section className="handbook-footer">
            <h2>🔗 แหล่งข้อมูลเพิ่มเติม</h2>
            <div className="footer-links">
              <div className="link-group">
                <h3>📚 มาตรฐานและกฎหมาย</h3>
                <ul>
                  <li><a href="https://www.dga.or.th" target="_blank" rel="noopener noreferrer">DGA - สำนักงานพัฒนารัฐบาลดิจิทัล</a></li>
                  <li><a href="https://www.pdpc.or.th" target="_blank" rel="noopener noreferrer">PDPA - คณะกรรมการคุ้มครองข้อมูลส่วนบุคคล</a></li>
                  <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer">WCAG 2.1 Guidelines</a></li>
                </ul>
              </div>
              <div className="link-group">
                <h3>💻 เทคโนโลยี</h3>
                <ul>
                  <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
                  <li><a href="https://docs.nestjs.com" target="_blank" rel="noopener noreferrer">NestJS Documentation</a></li>
                  <li><a href="https://www.prisma.io/docs" target="_blank" rel="noopener noreferrer">Prisma Documentation</a></li>
                </ul>
              </div>
              <div className="link-group">
                <h3>🤝 ติดต่อทีมพัฒนา</h3>
                <ul>
                  <li><a href="https://github.com/jetci/Guardian-Route" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
                  <li><a href="https://github.com/jetci/Guardian-Route/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
                  <li>Email: dev@obtwiang.go.th</li>
                </ul>
              </div>
            </div>

            <div className="copyright">
              <p>© 2025 Guardian Route Project - Open Government Initiative</p>
              <p>Licensed under MIT License | Made with ❤️ for Tambon Wiang, Fang District</p>
            </div>
          </section>
        </main>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
