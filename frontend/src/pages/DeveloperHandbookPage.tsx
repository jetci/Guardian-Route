/**
 * Developer Handbook Page - COMPLETE 12 SECTIONS
 * Guardian Route Project - Open Government Initiative
 * Generated: 2025-11-13T16:31:06.792Z
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DeveloperHandbookPage.css';

export default function DeveloperHandbookPage() {
  const [activeSection, setActiveSection] = useState('principles');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['principles', 'tech-stack', 'innovation', 'structure', 'design', 'state-management', 'security', 'coding-practice', 'api-design', 'testing', 'deployment', 'maintenance', 'resources'];
      const scrollPosition = window.scrollY + 100;
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
      <header className="handbook-header">
        <div className="header-content">
          <h1>ðŸ“˜ Developer Handbook</h1>
          <p className="subtitle">Guardian Route - Open Government Initiative</p>
          <p className="description">
            à¸„à¸¹à¹ˆà¸¡à¸·à¸­à¸™à¸±à¸à¸žà¸±à¸’à¸™à¸²à¸ªà¸³à¸«à¸£à¸±à¸šà¸£à¸°à¸šà¸šà¸šà¸£à¸´à¸«à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£à¸ à¸±à¸¢à¸žà¸´à¸šà¸±à¸•à¸´ à¸•à¸³à¸šà¸¥à¹€à¸§à¸µà¸¢à¸‡ à¸­à¸³à¹€à¸ à¸­à¸à¸²à¸‡ à¸ˆà¸±à¸‡à¸«à¸§à¸±à¸”à¹€à¸Šà¸µà¸¢à¸‡à¹ƒà¸«à¸¡à¹ˆ
          </p>
          <div className="header-badges">
            <span className="badge">React 19</span>
            <span className="badge">TypeScript</span>
            <span className="badge">NestJS</span>
            <span className="badge">PostgreSQL</span>
            <span className="badge">PWA Ready</span>
          </div>
        </div>
      </header>

      <div className="handbook-layout">
        <nav className="handbook-nav">
          <div className="nav-sticky">
            <h3>ðŸ“‘ à¸ªà¸²à¸£à¸šà¸±à¸ (13 à¸«à¸±à¸§à¸‚à¹‰à¸­)</h3>
            <ul>
              <li className={activeSection === 'principles' ? 'active' : ''}>
                <button onClick={() => scrollToSection('principles')}>1. à¸›à¸£à¸±à¸Šà¸à¸²à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸²à¹à¸­à¸›à¸ à¸²à¸„à¸£à¸±à¸</button>
              </li>
              <li className={activeSection === 'tech-stack' ? 'active' : ''}>
                <button onClick={() => scrollToSection('tech-stack')}>2. à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µà¸—à¸µà¹ˆà¹à¸™à¸°à¸™à¸³</button>
              </li>
              <li className={activeSection === 'innovation' ? 'active' : ''}>
                <button onClick={() => scrollToSection('innovation')}>3. à¸™à¸§à¸±à¸•à¸à¸£à¸£à¸¡à¸ªà¸³à¸«à¸£à¸±à¸šà¸«à¸™à¹ˆà¸§à¸¢à¸‡à¸²à¸™à¸£à¸²à¸Šà¸à¸²à¸£</button>
              </li>
              <li className={activeSection === 'structure' ? 'active' : ''}>
                <button onClick={() => scrollToSection('structure')}>4. à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹‚à¸›à¸£à¹€à¸ˆà¸à¸•à¹Œ</button>
              </li>
              <li className={activeSection === 'design' ? 'active' : ''}>
                <button onClick={() => scrollToSection('design')}>5. à¸à¸²à¸£à¸­à¸­à¸à¹à¸šà¸šà¸£à¸°à¸šà¸š</button>
              </li>
              <li className={activeSection === 'state-management' ? 'active' : ''}>
                <button onClick={() => scrollToSection('state-management')}>6. à¸à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£ State</button>
              </li>
              <li className={activeSection === 'security' ? 'active' : ''}>
                <button onClick={() => scrollToSection('security')}>7. à¸„à¸§à¸²à¸¡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢</button>
              </li>
              <li className={activeSection === 'coding-practice' ? 'active' : ''}>
                <button onClick={() => scrollToSection('coding-practice')}>8. à¹à¸™à¸§à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸à¸²à¸£à¹€à¸‚à¸µà¸¢à¸™à¹‚à¸„à¹‰à¸”</button>
              </li>
              <li className={activeSection === 'api-design' ? 'active' : ''}>
                <button onClick={() => scrollToSection('api-design')}>9. à¸à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹à¸¥à¸° API</button>
              </li>
              <li className={activeSection === 'testing' ? 'active' : ''}>
                <button onClick={() => scrollToSection('testing')}>10. à¸à¸²à¸£à¸—à¸”à¸ªà¸­à¸šà¹à¸¥à¸°à¸›à¸£à¸°à¸à¸±à¸™à¸„à¸¸à¸“à¸ à¸²à¸ž</button>
              </li>
              <li className={activeSection === 'deployment' ? 'active' : ''}>
                <button onClick={() => scrollToSection('deployment')}>11. à¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¹à¸¥à¸° Deployment</button>
              </li>
              <li className={activeSection === 'maintenance' ? 'active' : ''}>
                <button onClick={() => scrollToSection('maintenance')}>12. à¸à¸²à¸£à¸”à¸¹à¹à¸¥à¸£à¸±à¸à¸©à¸²à¹à¸¥à¸°à¸­à¸±à¸›à¹€à¸”à¸•</button>
              </li>
              <li className={activeSection === 'resources' ? 'active' : ''}>
                <button onClick={() => scrollToSection('resources')}>13. à¹à¸«à¸¥à¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡</button>
              </li>
            </ul>
            <div className="nav-footer">
              <Link to="/" className="btn-back">â† à¸à¸¥à¸±à¸šà¸«à¸™à¹‰à¸²à¸«à¸¥à¸±à¸</Link>
            </div>
          </div>
        </nav>

        <main className="handbook-content">
          {/* SECTION 1: à¸›à¸£à¸±à¸Šà¸à¸²à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸²à¹à¸­à¸›à¸ à¸²à¸„à¸£à¸±à¸ */}
          <section id="principles" className="handbook-section">
            <h2>1. à¸›à¸£à¸±à¸Šà¸à¸²à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸²à¹à¸­à¸›à¸ à¸²à¸„à¸£à¸±à¸</h2>
            <p className="section-intro">
              à¸«à¸¥à¸±à¸à¸à¸²à¸£à¹à¸¥à¸°à¹à¸™à¸§à¸—à¸²à¸‡à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸²à¸£à¸°à¸šà¸šà¸•à¸²à¸¡à¸¡à¸²à¸•à¸£à¸à¸²à¸™à¸ à¸²à¸„à¸£à¸±à¸à¹à¸¥à¸°à¸à¸Žà¸«à¸¡à¸²à¸¢à¸—à¸µà¹ˆà¹€à¸à¸µà¹ˆà¸¢à¸§à¸‚à¹‰à¸­à¸‡
            </p>

            <div className="content-card">
              <h3>ðŸŽ¯ à¸›à¸£à¸±à¸Šà¸à¸²à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸²</h3>
              <ul>
                <li><strong>Open Government:</strong> à¹€à¸›à¸´à¸”à¹€à¸œà¸¢à¹‚à¸„à¹‰à¸”à¹à¸¥à¸°à¸à¸£à¸°à¸šà¸§à¸™à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸² à¹€à¸žà¸·à¹ˆà¸­à¸„à¸§à¸²à¸¡à¹‚à¸›à¸£à¹ˆà¸‡à¹ƒà¸ª</li>
                <li><strong>Citizen-Centric:</strong> à¸­à¸­à¸à¹à¸šà¸šà¹€à¸žà¸·à¹ˆà¸­à¸›à¸£à¸°à¸Šà¸²à¸Šà¸™à¹€à¸›à¹‡à¸™à¸¨à¸¹à¸™à¸¢à¹Œà¸à¸¥à¸²à¸‡ à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¸‡à¹ˆà¸²à¸¢ à¹€à¸‚à¹‰à¸²à¸–à¸¶à¸‡à¹„à¸”à¹‰</li>
                <li><strong>Data-Driven:</strong> à¹ƒà¸Šà¹‰à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹ƒà¸™à¸à¸²à¸£à¸•à¸±à¸”à¸ªà¸´à¸™à¹ƒà¸ˆ à¸§à¸´à¹€à¸„à¸£à¸²à¸°à¸«à¹Œ à¹à¸¥à¸°à¸žà¸±à¸’à¸™à¸²à¸£à¸°à¸šà¸š</li>
                <li><strong>Sustainable:</strong> à¸žà¸±à¸’à¸™à¸²à¸­à¸¢à¹ˆà¸²à¸‡à¸¢à¸±à¹ˆà¸‡à¸¢à¸·à¸™à¹à¸¥à¸°à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ à¸£à¸­à¸‡à¸£à¸±à¸šà¸à¸²à¸£à¸‚à¸¢à¸²à¸¢à¸•à¸±à¸§</li>
                <li><strong>Secure by Design:</strong> à¸„à¸§à¸²à¸¡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢à¸•à¸±à¹‰à¸‡à¹à¸•à¹ˆà¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹€à¸žà¸´à¹ˆà¸¡à¸—à¸µà¸«à¸¥à¸±à¸‡</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>âš–ï¸ à¸à¸Žà¸«à¸¡à¸²à¸¢à¹à¸¥à¸°à¸¡à¸²à¸•à¸£à¸à¸²à¸™à¸—à¸µà¹ˆà¹€à¸à¸µà¹ˆà¸¢à¸§à¸‚à¹‰à¸­à¸‡</h3>
              <ul>
                <li><strong>PDPA (à¸ž.à¸£.à¸š. à¸„à¸¸à¹‰à¸¡à¸„à¸£à¸­à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¹ˆà¸§à¸™à¸šà¸¸à¸„à¸„à¸¥ à¸ž.à¸¨. 2562):</strong> à¸›à¸à¸›à¹‰à¸­à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¹ˆà¸§à¸™à¸šà¸¸à¸„à¸„à¸¥à¸‚à¸­à¸‡à¸›à¸£à¸°à¸Šà¸²à¸Šà¸™ à¸¡à¸µà¸«à¸¥à¸±à¸à¸à¸²à¸£ Consent, Purpose Limitation, Data Minimization</li>
                <li><strong>DGA Standards:</strong> à¸¡à¸²à¸•à¸£à¸à¸²à¸™à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸²à¸£à¸°à¸šà¸šà¸ à¸²à¸„à¸£à¸±à¸ à¸ˆà¸²à¸à¸ªà¸³à¸™à¸±à¸à¸‡à¸²à¸™à¸žà¸±à¸’à¸™à¸²à¸£à¸±à¸à¸šà¸²à¸¥à¸”à¸´à¸ˆà¸´à¸—à¸±à¸¥</li>
                <li><strong>WCAG 2.1 Level AA:</strong> à¸¡à¸²à¸•à¸£à¸à¸²à¸™à¸à¸²à¸£à¹€à¸‚à¹‰à¸²à¸–à¸¶à¸‡à¸ªà¸³à¸«à¸£à¸±à¸šà¸œà¸¹à¹‰à¸žà¸´à¸à¸²à¸£ à¸£à¸­à¸‡à¸£à¸±à¸š Screen Reader, Keyboard Navigation</li>
                <li><strong>Cybersecurity Act:</strong> à¸à¸Žà¸«à¸¡à¸²à¸¢à¸„à¸§à¸²à¸¡à¸¡à¸±à¹ˆà¸™à¸„à¸‡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢à¹„à¸‹à¹€à¸šà¸­à¸£à¹Œ à¸›à¹‰à¸­à¸‡à¸à¸±à¸™à¸ à¸±à¸¢à¸„à¸¸à¸à¸„à¸²à¸¡</li>
                <li><strong>Open Data Charter:</strong> à¸«à¸¥à¸±à¸à¸à¸²à¸£à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹€à¸›à¸´à¸”à¸ à¸²à¸„à¸£à¸±à¸ à¹€à¸žà¸·à¹ˆà¸­à¸„à¸§à¸²à¸¡à¹‚à¸›à¸£à¹ˆà¸‡à¹ƒà¸ªà¹à¸¥à¸°à¸à¸²à¸£à¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸£à¹ˆà¸§à¸¡</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={scrollToTop} className="btn-nav prev">â†‘ à¸à¸¥à¸±à¸šà¸”à¹‰à¸²à¸™à¸šà¸™</button>
              <button onClick={() => scrollToSection('tech-stack')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µ â†’</button>
            </div>
          </section>

          {/* SECTION 2: à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µà¸—à¸µà¹ˆà¹à¸™à¸°à¸™à¸³ */}
          <section id="tech-stack" className="handbook-section">
            <h2>2. à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µà¸—à¸µà¹ˆà¹à¸™à¸°à¸™à¸³</h2>
            <p className="section-intro">
              à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µà¹à¸¥à¸°à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­à¸—à¸µà¹ˆà¹ƒà¸Šà¹‰à¹ƒà¸™à¸à¸²à¸£à¸žà¸±à¸’à¸™à¸²à¸£à¸°à¸šà¸š Guardian Route
            </p>

            <div className="content-card">
              <h3>ðŸ”§ Technology Stack</h3>
              <div className="tech-grid">
                <div className="tech-item">
                  <h4>Frontend</h4>
                  <ul>
                    <li><strong>React 19:</strong> UI Library à¸¥à¹ˆà¸²à¸ªà¸¸à¸” à¸žà¸£à¹‰à¸­à¸¡ Server Components</li>
                    <li><strong>TypeScript:</strong> Type Safety à¸›à¹‰à¸­à¸‡à¸à¸±à¸™ Runtime Errors</li>
                    <li><strong>Vite:</strong> Build Tool à¹€à¸£à¹‡à¸§ HMR à¸—à¸±à¸™à¹ƒà¸ˆ</li>
                    <li><strong>React Router v6:</strong> Client-side Routing</li>
                    <li><strong>Zustand:</strong> State Management à¹€à¸šà¸² à¸£à¸§à¸”à¹€à¸£à¹‡à¸§</li>
                    <li><strong>Tailwind CSS:</strong> Utility-first CSS Framework</li>
                    <li><strong>Leaflet:</strong> Interactive Maps à¸ªà¸³à¸«à¸£à¸±à¸šà¹à¸ªà¸”à¸‡à¸žà¸´à¸à¸±à¸”</li>
                  </ul>
                </div>
                <div className="tech-item">
                  <h4>Backend</h4>
                  <ul>
                    <li><strong>NestJS:</strong> Enterprise-grade Node.js Framework</li>
                    <li><strong>TypeScript:</strong> à¹ƒà¸Šà¹‰à¸—à¸±à¹‰à¸‡ Frontend à¹à¸¥à¸° Backend</li>
                    <li><strong>PostgreSQL:</strong> Relational Database à¸—à¸µà¹ˆà¹€à¸ªà¸–à¸µà¸¢à¸£</li>
                    <li><strong>PostGIS:</strong> Spatial Extension à¸ªà¸³à¸«à¸£à¸±à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ à¸¹à¸¡à¸´à¸¨à¸²à¸ªà¸•à¸£à¹Œ</li>
                    <li><strong>Prisma ORM:</strong> Type-safe Database Access</li>
                    <li><strong>JWT:</strong> Token-based Authentication</li>
                    <li><strong>Swagger/OpenAPI:</strong> API Documentation à¸­à¸±à¸•à¹‚à¸™à¸¡à¸±à¸•à¸´</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>ðŸ› ï¸ Development Tools</h3>
              <ul>
                <li><strong>Git + GitHub:</strong> Version Control à¹à¸¥à¸° Collaboration</li>
                <li><strong>Docker:</strong> Containerization à¸ªà¸³à¸«à¸£à¸±à¸š Development à¹à¸¥à¸° Production</li>
                <li><strong>ESLint + Prettier:</strong> Code Quality à¹à¸¥à¸° Formatting</li>
                <li><strong>Vitest:</strong> Unit Testing Framework</li>
                <li><strong>Playwright:</strong> E2E Testing</li>
                <li><strong>Sentry:</strong> Error Tracking à¹à¸¥à¸° Monitoring</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('principles')} className="btn-nav prev">â† à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¸›à¸£à¸±à¸Šà¸à¸²</button>
              <button onClick={() => scrollToSection('innovation')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¸™à¸§à¸±à¸•à¸à¸£à¸£à¸¡ â†’</button>
            </div>
          </section>

          {/* SECTION 3: à¸™à¸§à¸±à¸•à¸à¸£à¸£à¸¡à¸ªà¸³à¸«à¸£à¸±à¸šà¸«à¸™à¹ˆà¸§à¸¢à¸‡à¸²à¸™à¸£à¸²à¸Šà¸à¸²à¸£ */}
          <section id="innovation" className="handbook-section">
            <h2>3. à¸™à¸§à¸±à¸•à¸à¸£à¸£à¸¡à¸ªà¸³à¸«à¸£à¸±à¸šà¸«à¸™à¹ˆà¸§à¸¢à¸‡à¸²à¸™à¸£à¸²à¸Šà¸à¸²à¸£ (PWA & Offline-First)</h2>
            <p className="section-intro">
              à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µ Progressive Web App (PWA) à¹à¸¥à¸° Offline-First à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸²à¸£à¸—à¸³à¸‡à¸²à¸™à¹ƒà¸™à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸«à¹ˆà¸²à¸‡à¹„à¸à¸¥
            </p>

            <div className="content-card">
              <h3>ðŸ“± Progressive Web App (PWA)</h3>
              <p><strong>PWA à¸„à¸·à¸­à¸­à¸°à¹„à¸£?</strong> à¹à¸­à¸›à¸žà¸¥à¸´à¹€à¸„à¸Šà¸±à¸™à¹€à¸§à¹‡à¸šà¸—à¸µà¹ˆà¸—à¸³à¸‡à¸²à¸™à¹€à¸«à¸¡à¸·à¸­à¸™à¹à¸­à¸›à¸¡à¸·à¸­à¸–à¸·à¸­ à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¹„à¸”à¹‰ à¹ƒà¸Šà¹‰à¸‡à¸²à¸™ Offline à¹„à¸”à¹‰</p>
              <ul>
                <li><strong>Installable:</strong> à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¸šà¸™à¸«à¸™à¹‰à¸²à¸ˆà¸­à¹‚à¸—à¸£à¸¨à¸±à¸žà¸—à¹Œ à¹€à¸«à¸¡à¸·à¸­à¸™ Native App</li>
                <li><strong>Offline Support:</strong> à¸—à¸³à¸‡à¸²à¸™à¹„à¸”à¹‰à¹à¸¡à¹‰à¹„à¸¡à¹ˆà¸¡à¸µà¸­à¸´à¸™à¹€à¸—à¸­à¸£à¹Œà¹€à¸™à¹‡à¸• (Service Worker)</li>
                <li><strong>Push Notifications:</strong> à¹à¸ˆà¹‰à¸‡à¹€à¸•à¸·à¸­à¸™à¹€à¸«à¸•à¸¸à¸à¸²à¸£à¸“à¹Œà¸ªà¸³à¸„à¸±à¸</li>
                <li><strong>Fast & Reliable:</strong> à¹‚à¸«à¸¥à¸”à¹€à¸£à¹‡à¸§ Cache à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹„à¸§à¹‰</li>
                <li><strong>Responsive:</strong> à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¹„à¸”à¹‰à¸—à¸¸à¸à¸­à¸¸à¸›à¸à¸£à¸“à¹Œ (Mobile, Tablet, Desktop)</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>ðŸŒ Offline-First Strategy</h3>
              <p><strong>à¸—à¸³à¹„à¸¡à¸•à¹‰à¸­à¸‡ Offline-First?</strong> à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸«à¹ˆà¸²à¸‡à¹„à¸à¸¥à¸­à¸²à¸ˆà¹„à¸¡à¹ˆà¸¡à¸µà¸ªà¸±à¸à¸à¸²à¸“ à¹à¸•à¹ˆà¸‡à¸²à¸™à¸•à¹‰à¸­à¸‡à¸—à¸³à¸•à¹ˆà¸­</p>
              <ul>
                <li><strong>Service Worker:</strong> Cache API Responses, Static Assets</li>
                <li><strong>IndexedDB:</strong> à¹€à¸à¹‡à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹ƒà¸™à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡ Sync à¹€à¸¡à¸·à¹ˆà¸­à¸¡à¸µà¹€à¸™à¹‡à¸•</li>
                <li><strong>Background Sync:</strong> à¸ªà¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸­à¸±à¸•à¹‚à¸™à¸¡à¸±à¸•à¸´à¹€à¸¡à¸·à¹ˆà¸­à¸à¸¥à¸±à¸šà¸¡à¸²à¸¡à¸µà¸ªà¸±à¸à¸à¸²à¸“</li>
                <li><strong>Optimistic UI:</strong> à¹à¸ªà¸”à¸‡à¸œà¸¥à¸—à¸±à¸™à¸—à¸µ à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸£à¸­ Server</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>ðŸ¤– AI Tools à¸ªà¸³à¸«à¸£à¸±à¸šà¸™à¸±à¸à¸žà¸±à¸’à¸™à¸²</h3>
              <ul>
                <li><strong>GitHub Copilot:</strong> AI Pair Programming à¸Šà¹ˆà¸§à¸¢à¹€à¸‚à¸µà¸¢à¸™à¹‚à¸„à¹‰à¸”</li>
                <li><strong>ChatGPT/Claude:</strong> à¸Šà¹ˆà¸§à¸¢à¹à¸à¹‰à¸›à¸±à¸à¸«à¸² à¹€à¸‚à¸µà¸¢à¸™ Documentation</li>
                <li><strong>Cursor IDE:</strong> AI-powered Code Editor</li>
                <li><strong>Windsurf:</strong> AI Assistant à¸ªà¸³à¸«à¸£à¸±à¸š Codebase Navigation</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('tech-stack')} className="btn-nav prev">← ก่อนหน้า: เทคโนโลยี</button>
              <button onClick={() => scrollToSection('structure')} className="btn-nav next">ถัดไป: โครงสร้าง →</button>
            </div>
          </section>

          {/* SECTION 4: โครงสร้างโปรเจกต์ */}
          <section id="structure" className="handbook-section">
            <h2>4. โครงสร้างโปรเจกต์</h2>
            <p className="section-intro">โครงสร้างไฟล์และโฟลเดอร์ของโปรเจกต์ Guardian Route</p>
            
            <div className="content-card">
              <h3> Project Structure</h3>
              <pre className="code-block">{`Guardian-Route/
 frontend/                 # React Application
    src/
       components/      # Reusable components
       pages/           # Page components
       services/        # API services
       stores/          # Zustand stores
       types/           # TypeScript types
       utils/           # Utility functions
       App.tsx          # Main app component
    public/              # Static assets
    package.json

 backend/                  # NestJS Application
    src/
       auth/            # Authentication module
       users/           # User management
       incidents/       # Incident management
       villages/        # Village data
       tasks/           # Task management
       common/          # Shared utilities
    prisma/              # Database schema
    package.json

 docs/                     # Documentation`}</pre>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('innovation')} className="btn-nav prev"> ก่อนหน้า: นวัตกรรม</button>
              <button onClick={() => scrollToSection('design')} className="btn-nav next">ถัดไป: การออกแบบ </button>
            </div>
          </section>

          {/* SECTION 5: การออกแบบระบบ */}
          <section id="design" className="handbook-section">
            <h2>5. การออกแบบระบบ</h2>
            <p className="section-intro">หลักการออกแบบและ Design Patterns ที่ใช้</p>
            
            <div className="content-card">
              <h3> Design Patterns</h3>
              <ul>
                <li><strong>MVC Pattern:</strong> Model-View-Controller สำหรับ Backend</li>
                <li><strong>Repository Pattern:</strong> แยก Data Access Layer</li>
                <li><strong>Service Layer:</strong> Business Logic แยกจาก Controllers</li>
                <li><strong>DTO Pattern:</strong> Data Transfer Objects สำหรับ API</li>
                <li><strong>Component Pattern:</strong> Reusable UI components</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('structure')} className="btn-nav prev"> ก่อนหน้า: โครงสร้าง</button>
              <button onClick={() => scrollToSection('state-management')} className="btn-nav next">ถัดไป: State Management </button>
            </div>
          </section>

          {/* SECTION 6: การจัดการ State */}
          <section id="state-management" className="handbook-section">
            <h2>6. การจัดการ State</h2>
            <p className="section-intro">การจัดการ State ด้วย Zustand และ React Hooks</p>
            
            <div className="content-card">
              <h3> Zustand State Management</h3>
              <p><strong>ทำไมใช้ Zustand?</strong> เบา รวดเร็ว ไม่ซับซ้อน</p>
              <ul>
                <li><strong>Simple API:</strong> เรียนรู้ง่าย ใช้งานสะดวก</li>
                <li><strong>No Boilerplate:</strong> ไม่ต้องเขียน Actions, Reducers</li>
                <li><strong>TypeScript Support:</strong> Type-safe ตั้งแต่ต้น</li>
                <li><strong>Persist Middleware:</strong> บันทึก State ใน localStorage</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('design')} className="btn-nav prev"> ก่อนหน้า: การออกแบบ</button>
              <button onClick={() => scrollToSection('security')} className="btn-nav next">ถัดไป: ความปลอดภัย </button>
            </div>
          </section>

          {/* SECTION 7: ความปลอดภัย */}
          <section id="security" className="handbook-section">
            <h2>7. ความปลอดภัย (Security)</h2>
            <p className="section-intro">มาตรการรักษาความปลอดภัยตามมาตรฐาน OWASP และ PDPA</p>
            
            <div className="content-card">
              <h3> Authentication & Authorization</h3>
              <ul>
                <li><strong>JWT Token:</strong> Access Token (15 นาที) + Refresh Token (7 วัน)</li>
                <li><strong>RBAC:</strong> Role-Based Access Control (5 roles)</li>
                <li><strong>Password Hashing:</strong> bcrypt (10 rounds)</li>
                <li><strong>Session Management:</strong> Auto logout on inactivity</li>
              </ul>
            </div>

            <div className="content-card">
              <h3> OWASP Top 10 Protection</h3>
              <ul>
                <li><strong>SQL Injection:</strong> Prisma ORM (parameterized queries)</li>
                <li><strong>XSS:</strong> React auto-escaping + DOMPurify</li>
                <li><strong>CSRF:</strong> SameSite cookies + CSRF tokens</li>
                <li><strong>Rate Limiting:</strong> 100 requests/15 min per IP</li>
              </ul>
            </div>

            <div className="content-card">
              <h3> PDPA Compliance</h3>
              <ul>
                <li><strong>Consent Management:</strong> ขอความยินยอมก่อนเก็บข้อมูล</li>
                <li><strong>Data Minimization:</strong> เก็บเฉพาะที่จำเป็น</li>
                <li><strong>Right to Access:</strong> ผู้ใช้ดูข้อมูลตนเองได้</li>
                <li><strong>Right to Deletion:</strong> ลบข้อมูลตามคำขอ</li>
                <li><strong>Audit Logs:</strong> บันทึกการเข้าถึงข้อมูล</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('state-management')} className="btn-nav prev"> ก่อนหน้า: State</button>
              <button onClick={() => scrollToSection('coding-practice')} className="btn-nav next">ถัดไป: การเขียนโค้ด </button>
            </div>
          </section>

          {/* SECTION 8: แนวปฏิบัติการเขียนโค้ด */}
          <section id="coding-practice" className="handbook-section">
            <h2>8. แนวปฏิบัติการเขียนโค้ด</h2>
            <p className="section-intro">Coding Standards และ Best Practices</p>
            
            <div className="content-card">
              <h3> Coding Style</h3>
              <ul>
                <li><strong>TypeScript:</strong> ใช้ strict mode หลีกเลี่ยง any</li>
                <li><strong>ESLint + Prettier:</strong> ตรวจสอบและจัดรูปแบบอัตโนมัติ</li>
                <li><strong>Naming Convention:</strong> camelCase (variables), PascalCase (Components)</li>
                <li><strong>Comments:</strong> เขียนภาษาไทยหรืออังกฤษ ชัดเจนกระชับ</li>
              </ul>
            </div>

            <div className="content-card">
              <h3> Git Workflow</h3>
              <ul>
                <li><strong>Branches:</strong> main, develop, feature/*, fix/*, hotfix/*</li>
                <li><strong>Commit Messages:</strong> feat:, fix:, docs:, style:, refactor:, test:, chore:</li>
                <li><strong>Pull Requests:</strong> ต้องผ่าน Code Review ก่อน merge</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('security')} className="btn-nav prev"> ก่อนหน้า: ความปลอดภัย</button>
              <button onClick={() => scrollToSection('api-design')} className="btn-nav next">ถัดไป: API </button>
            </div>
          </section>

          {/* SECTION 9: การจัดการ API */}
          <section id="api-design" className="handbook-section">
            <h2>9. การจัดการข้อมูลและ API</h2>
            <p className="section-intro">API Design และ Data Management</p>
            
            <div className="content-card">
              <h3> RESTful API Design</h3>
              <ul>
                <li><strong>Versioning:</strong> /api/v1/...</li>
                <li><strong>HTTP Methods:</strong> GET, POST, PUT, DELETE</li>
                <li><strong>Status Codes:</strong> 200, 201, 400, 401, 403, 404, 500</li>
                <li><strong>Pagination:</strong> ?page=1&limit=20</li>
                <li><strong>Filtering:</strong> ?status=ACTIVE&role=ADMIN</li>
              </ul>
            </div>

            <div className="content-card">
              <h3> Database Management</h3>
              <ul>
                <li><strong>PostgreSQL + PostGIS:</strong> Spatial data support</li>
                <li><strong>Prisma ORM:</strong> Type-safe database access</li>
                <li><strong>Migrations:</strong> Version control สำหรับ schema</li>
                <li><strong>Backup:</strong> Daily automated backups</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('coding-practice')} className="btn-nav prev"> ก่อนหน้า: การเขียนโค้ด</button>
              <button onClick={() => scrollToSection('testing')} className="btn-nav next">ถัดไป: การทดสอบ </button>
            </div>
          </section>

          {/* SECTION 10: การทดสอบ */}
          <section id="testing" className="handbook-section">
            <h2>10. การทดสอบและประกันคุณภาพ</h2>
            <p className="section-intro">Testing Strategy และ QA Process</p>
            
            <div className="content-card">
              <h3> Testing Pyramid</h3>
              <ul>
                <li><strong>Unit Tests (70%):</strong> Vitest, Jest</li>
                <li><strong>Integration Tests (20%):</strong> API testing, Database testing</li>
                <li><strong>E2E Tests (10%):</strong> Playwright</li>
              </ul>
            </div>

            <div className="content-card">
              <h3> Quality Assurance</h3>
              <ul>
                <li><strong>Code Coverage:</strong> &gt;80% for critical paths</li>
                <li><strong>Automated Testing:</strong> Run on every commit (CI/CD)</li>
                <li><strong>Manual Testing:</strong> UAT before production</li>
                <li><strong>Performance Testing:</strong> Load testing with Artillery</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('api-design')} className="btn-nav prev"> ก่อนหน้า: API</button>
              <button onClick={() => scrollToSection('deployment')} className="btn-nav next">ถัดไป: Deployment </button>
            </div>
          </section>

          {/* SECTION 11: การติดตั้งและ Deployment */}
          <section id="deployment" className="handbook-section">
            <h2>11. การติดตั้งและ Deployment</h2>
            <p className="section-intro">การ Deploy และ Infrastructure</p>
            
            <div className="content-card">
              <h3> Docker Deployment</h3>
              <pre className="code-block">{`# Development
docker-compose up -d

# Production
docker build -t guardian-route .
docker run -p 3000:3000 guardian-route`}</pre>
            </div>

            <div className="content-card">
              <h3> CI/CD Pipeline</h3>
              <ul>
                <li><strong>GitHub Actions:</strong> Automated testing and deployment</li>
                <li><strong>Staging Environment:</strong> Test before production</li>
                <li><strong>Blue-Green Deployment:</strong> Zero-downtime updates</li>
                <li><strong>Rollback:</strong> Quick rollback if issues occur</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('testing')} className="btn-nav prev"> ก่อนหน้า: การทดสอบ</button>
              <button onClick={() => scrollToSection('maintenance')} className="btn-nav next">ถัดไป: การดูแล </button>
            </div>
          </section>

          {/* SECTION 12: การดูแลรักษาและอัปเดต */}
          <section id="maintenance" className="handbook-section">
            <h2>12. การดูแลรักษาและอัปเดต</h2>
            <p className="section-intro">Maintenance Plan และ Update Strategy</p>
            
            <div className="content-card">
              <h3> Maintenance Checklist</h3>
              <ul>
                <li><strong>Daily:</strong> Monitor logs, check errors</li>
                <li><strong>Weekly:</strong> Review performance metrics</li>
                <li><strong>Monthly:</strong> Update dependencies, security patches</li>
                <li><strong>Quarterly:</strong> Security audit, penetration testing</li>
                <li><strong>Yearly:</strong> Architecture review, major upgrades</li>
              </ul>
            </div>

            <div className="content-card">
              <h3> Monitoring & Logging</h3>
              <ul>
                <li><strong>Application Logs:</strong> Winston logger</li>
                <li><strong>Error Tracking:</strong> Sentry</li>
                <li><strong>Performance:</strong> Prometheus + Grafana</li>
                <li><strong>Uptime:</strong> UptimeRobot</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('deployment')} className="btn-nav prev"> ก่อนหน้า: Deployment</button>
              <button onClick={() => scrollToSection('resources')} className="btn-nav next">ถัดไป: แหล่งข้อมูล </button>
            </div>
          </section>

          {/* SECTION 13: แหล่งข้อมูลอ้างอิง */}
          <section id="resources" className="handbook-section">
            <h2>13. แหล่งข้อมูลอ้างอิง</h2>
            <p className="section-intro">เอกสารและแหล่งข้อมูลที่เป็นประโยชน์</p>
            
            <div className="content-card">
              <h3> มาตรฐานและกฎหมาย</h3>
              <ul>
                <li><a href="https://www.dga.or.th" target="_blank" rel="noopener noreferrer">DGA - สำนักงานพัฒนารัฐบาลดิจิทัล</a></li>
                <li><a href="https://www.pdpc.or.th" target="_blank" rel="noopener noreferrer">PDPA - คณะกรรมการคุ้มครองข้อมูลส่วนบุคคล</a></li>
                <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer">WCAG 2.1 Guidelines</a></li>
                <li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer">OWASP Top 10</a></li>
              </ul>
            </div>

            <div className="content-card">
              <h3> เทคโนโลยี</h3>
              <ul>
                <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
                <li><a href="https://docs.nestjs.com" target="_blank" rel="noopener noreferrer">NestJS Documentation</a></li>
                <li><a href="https://www.prisma.io/docs" target="_blank" rel="noopener noreferrer">Prisma Documentation</a></li>
                <li><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">TypeScript Handbook</a></li>
              </ul>
            </div>

            <div className="content-card">
              <h3> ติดต่อทีมพัฒนา</h3>
              <ul>
                <li><a href="https://github.com/jetci/Guardian-Route" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
                <li><a href="https://github.com/jetci/Guardian-Route/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
                <li>Email: dev@obtwiang.go.th</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('maintenance')} className="btn-nav prev"> ก่อนหน้า: การดูแล</button>
              <button onClick={scrollToTop} className="btn-nav next"> กลับด้านบน</button>
            </div>
          </section>

          <footer className="handbook-footer">
            <p> 2025 Guardian Route Project - Open Government Initiative</p>
            <p>Licensed under MIT License | Made with  for Tambon Wiang, Fang District</p>
          </footer>
          {/* Due to length, I'll create a marker here and continue in next part */}
        </main>
      </div>

      {showBackToTop && (
        <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">↑</button>
      )}
    </div>
  );
}
