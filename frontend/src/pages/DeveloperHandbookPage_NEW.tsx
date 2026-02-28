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
          <h1>Ã°Å¸â€œËœ Developer Handbook</h1>
          <p className="subtitle">Guardian Route - Open Government Initiative</p>
          <p className="description">
            Ã Â¸â€žÃ Â¸Â¹Ã Â¹Ë†Ã Â¸Â¡Ã Â¸Â·Ã Â¸Â­Ã Â¸â„¢Ã Â¸Â±Ã Â¸ÂÃ Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸Â£Ã Â¸Â°Ã Â¸Å¡Ã Â¸Å¡Ã Â¸Å¡Ã Â¸Â£Ã Â¸Â´Ã Â¸Â«Ã Â¸Â²Ã Â¸Â£Ã Â¸Ë†Ã Â¸Â±Ã Â¸â€Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Â Ã Â¸Â±Ã Â¸Â¢Ã Â¸Å¾Ã Â¸Â´Ã Â¸Å¡Ã Â¸Â±Ã Â¸â€¢Ã Â¸Â´ Ã Â¸â€¢Ã Â¸Â³Ã Â¸Å¡Ã Â¸Â¥Ã Â¹â‚¬Ã Â¸Â§Ã Â¸ÂµÃ Â¸Â¢Ã Â¸â€¡ Ã Â¸Â­Ã Â¸Â³Ã Â¹â‚¬Ã Â¸Â Ã Â¸Â­Ã Â¸ÂÃ Â¸Â²Ã Â¸â€¡ Ã Â¸Ë†Ã Â¸Â±Ã Â¸â€¡Ã Â¸Â«Ã Â¸Â§Ã Â¸Â±Ã Â¸â€Ã Â¹â‚¬Ã Â¸Å Ã Â¸ÂµÃ Â¸Â¢Ã Â¸â€¡Ã Â¹Æ’Ã Â¸Â«Ã Â¸Â¡Ã Â¹Ë†
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
            <h3>Ã°Å¸â€œâ€˜ Ã Â¸ÂªÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¡Ã Â¸Â±Ã Â¸Â (13 Ã Â¸Â«Ã Â¸Â±Ã Â¸Â§Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­)</h3>
            <ul>
              <li className={activeSection === 'principles' ? 'active' : ''}>
                <button onClick={() => scrollToSection('principles')}>1. Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â±Ã Â¸Å Ã Â¸ÂÃ Â¸Â²Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¹ÂÃ Â¸Â­Ã Â¸â€ºÃ Â¸Â Ã Â¸Â²Ã Â¸â€žÃ Â¸Â£Ã Â¸Â±Ã Â¸Â</button>
              </li>
              <li className={activeSection === 'tech-stack' ? 'active' : ''}>
                <button onClick={() => scrollToSection('tech-stack')}>2. Ã Â¹â‚¬Ã Â¸â€”Ã Â¸â€žÃ Â¹â€šÃ Â¸â„¢Ã Â¹â€šÃ Â¸Â¥Ã Â¸Â¢Ã Â¸ÂµÃ Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¹ÂÃ Â¸â„¢Ã Â¸Â°Ã Â¸â„¢Ã Â¸Â³</button>
              </li>
              <li className={activeSection === 'innovation' ? 'active' : ''}>
                <button onClick={() => scrollToSection('innovation')}>3. Ã Â¸â„¢Ã Â¸Â§Ã Â¸Â±Ã Â¸â€¢Ã Â¸ÂÃ Â¸Â£Ã Â¸Â£Ã Â¸Â¡Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸Â«Ã Â¸â„¢Ã Â¹Ë†Ã Â¸Â§Ã Â¸Â¢Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¸Â£Ã Â¸Â²Ã Â¸Å Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£</button>
              </li>
              <li className={activeSection === 'structure' ? 'active' : ''}>
                <button onClick={() => scrollToSection('structure')}>4. Ã Â¹â€šÃ Â¸â€žÃ Â¸Â£Ã Â¸â€¡Ã Â¸ÂªÃ Â¸Â£Ã Â¹â€°Ã Â¸Â²Ã Â¸â€¡Ã Â¹â€šÃ Â¸â€ºÃ Â¸Â£Ã Â¹â‚¬Ã Â¸Ë†Ã Â¸ÂÃ Â¸â€¢Ã Â¹Å’</button>
              </li>
              <li className={activeSection === 'design' ? 'active' : ''}>
                <button onClick={() => scrollToSection('design')}>5. Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Â­Ã Â¸Â­Ã Â¸ÂÃ Â¹ÂÃ Â¸Å¡Ã Â¸Å¡Ã Â¸Â£Ã Â¸Â°Ã Â¸Å¡Ã Â¸Å¡</button>
              </li>
              <li className={activeSection === 'state-management' ? 'active' : ''}>
                <button onClick={() => scrollToSection('state-management')}>6. Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Ë†Ã Â¸Â±Ã Â¸â€Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£ State</button>
              </li>
              <li className={activeSection === 'security' ? 'active' : ''}>
                <button onClick={() => scrollToSection('security')}>7. Ã Â¸â€žÃ Â¸Â§Ã Â¸Â²Ã Â¸Â¡Ã Â¸â€ºÃ Â¸Â¥Ã Â¸Â­Ã Â¸â€Ã Â¸Â Ã Â¸Â±Ã Â¸Â¢</button>
              </li>
              <li className={activeSection === 'coding-practice' ? 'active' : ''}>
                <button onClick={() => scrollToSection('coding-practice')}>8. Ã Â¹ÂÃ Â¸â„¢Ã Â¸Â§Ã Â¸â€ºÃ Â¸ÂÃ Â¸Â´Ã Â¸Å¡Ã Â¸Â±Ã Â¸â€¢Ã Â¸Â´Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¹â‚¬Ã Â¸â€šÃ Â¸ÂµÃ Â¸Â¢Ã Â¸â„¢Ã Â¹â€šÃ Â¸â€žÃ Â¹â€°Ã Â¸â€</button>
              </li>
              <li className={activeSection === 'api-design' ? 'active' : ''}>
                <button onClick={() => scrollToSection('api-design')}>9. Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Ë†Ã Â¸Â±Ã Â¸â€Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° API</button>
              </li>
              <li className={activeSection === 'testing' ? 'active' : ''}>
                <button onClick={() => scrollToSection('testing')}>10. Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€”Ã Â¸â€Ã Â¸ÂªÃ Â¸Â­Ã Â¸Å¡Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â°Ã Â¸ÂÃ Â¸Â±Ã Â¸â„¢Ã Â¸â€žÃ Â¸Â¸Ã Â¸â€œÃ Â¸Â Ã Â¸Â²Ã Â¸Å¾</button>
              </li>
              <li className={activeSection === 'deployment' ? 'active' : ''}>
                <button onClick={() => scrollToSection('deployment')}>11. Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€¢Ã Â¸Â´Ã Â¸â€Ã Â¸â€¢Ã Â¸Â±Ã Â¹â€°Ã Â¸â€¡Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° Deployment</button>
              </li>
              <li className={activeSection === 'maintenance' ? 'active' : ''}>
                <button onClick={() => scrollToSection('maintenance')}>12. Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€Ã Â¸Â¹Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â£Ã Â¸Â±Ã Â¸ÂÃ Â¸Â©Ã Â¸Â²Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸Â­Ã Â¸Â±Ã Â¸â€ºÃ Â¹â‚¬Ã Â¸â€Ã Â¸â€¢</button>
              </li>
              <li className={activeSection === 'resources' ? 'active' : ''}>
                <button onClick={() => scrollToSection('resources')}>13. Ã Â¹ÂÃ Â¸Â«Ã Â¸Â¥Ã Â¹Ë†Ã Â¸â€¡Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¸Â­Ã Â¹â€°Ã Â¸Â²Ã Â¸â€¡Ã Â¸Â­Ã Â¸Â´Ã Â¸â€¡</button>
              </li>
            </ul>
            <div className="nav-footer">
              <Link to="/" className="btn-back">Ã¢â€ Â Ã Â¸ÂÃ Â¸Â¥Ã Â¸Â±Ã Â¸Å¡Ã Â¸Â«Ã Â¸â„¢Ã Â¹â€°Ã Â¸Â²Ã Â¸Â«Ã Â¸Â¥Ã Â¸Â±Ã Â¸Â</Link>
            </div>
          </div>
        </nav>

        <main className="handbook-content">
          {/* SECTION 1: Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â±Ã Â¸Å Ã Â¸ÂÃ Â¸Â²Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¹ÂÃ Â¸Â­Ã Â¸â€ºÃ Â¸Â Ã Â¸Â²Ã Â¸â€žÃ Â¸Â£Ã Â¸Â±Ã Â¸Â */}
          <section id="principles" className="handbook-section">
            <h2>1. Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â±Ã Â¸Å Ã Â¸ÂÃ Â¸Â²Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¹ÂÃ Â¸Â­Ã Â¸â€ºÃ Â¸Â Ã Â¸Â²Ã Â¸â€žÃ Â¸Â£Ã Â¸Â±Ã Â¸Â</h2>
            <p className="section-intro">
              Ã Â¸Â«Ã Â¸Â¥Ã Â¸Â±Ã Â¸ÂÃ Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¹ÂÃ Â¸â„¢Ã Â¸Â§Ã Â¸â€”Ã Â¸Â²Ã Â¸â€¡Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¸Â£Ã Â¸Â°Ã Â¸Å¡Ã Â¸Å¡Ã Â¸â€¢Ã Â¸Â²Ã Â¸Â¡Ã Â¸Â¡Ã Â¸Â²Ã Â¸â€¢Ã Â¸Â£Ã Â¸ÂÃ Â¸Â²Ã Â¸â„¢Ã Â¸Â Ã Â¸Â²Ã Â¸â€žÃ Â¸Â£Ã Â¸Â±Ã Â¸ÂÃ Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸ÂÃ Â¸Å½Ã Â¸Â«Ã Â¸Â¡Ã Â¸Â²Ã Â¸Â¢Ã Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¹â‚¬Ã Â¸ÂÃ Â¸ÂµÃ Â¹Ë†Ã Â¸Â¢Ã Â¸Â§Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸â€¡
            </p>

            <div className="content-card">
              <h3>Ã°Å¸Å½Â¯ Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â±Ã Â¸Å Ã Â¸ÂÃ Â¸Â²Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²</h3>
              <ul>
                <li><strong>Open Government:</strong> Ã Â¹â‚¬Ã Â¸â€ºÃ Â¸Â´Ã Â¸â€Ã Â¹â‚¬Ã Â¸Å“Ã Â¸Â¢Ã Â¹â€šÃ Â¸â€žÃ Â¹â€°Ã Â¸â€Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸ÂÃ Â¸Â£Ã Â¸Â°Ã Â¸Å¡Ã Â¸Â§Ã Â¸â„¢Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â² Ã Â¹â‚¬Ã Â¸Å¾Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸â€žÃ Â¸Â§Ã Â¸Â²Ã Â¸Â¡Ã Â¹â€šÃ Â¸â€ºÃ Â¸Â£Ã Â¹Ë†Ã Â¸â€¡Ã Â¹Æ’Ã Â¸Âª</li>
                <li><strong>Citizen-Centric:</strong> Ã Â¸Â­Ã Â¸Â­Ã Â¸ÂÃ Â¹ÂÃ Â¸Å¡Ã Â¸Å¡Ã Â¹â‚¬Ã Â¸Å¾Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â°Ã Â¸Å Ã Â¸Â²Ã Â¸Å Ã Â¸â„¢Ã Â¹â‚¬Ã Â¸â€ºÃ Â¹â€¡Ã Â¸â„¢Ã Â¸Â¨Ã Â¸Â¹Ã Â¸â„¢Ã Â¸Â¢Ã Â¹Å’Ã Â¸ÂÃ Â¸Â¥Ã Â¸Â²Ã Â¸â€¡ Ã Â¹Æ’Ã Â¸Å Ã Â¹â€°Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¸â€¡Ã Â¹Ë†Ã Â¸Â²Ã Â¸Â¢ Ã Â¹â‚¬Ã Â¸â€šÃ Â¹â€°Ã Â¸Â²Ã Â¸â€“Ã Â¸Â¶Ã Â¸â€¡Ã Â¹â€žÃ Â¸â€Ã Â¹â€°</li>
                <li><strong>Data-Driven:</strong> Ã Â¹Æ’Ã Â¸Å Ã Â¹â€°Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¹Æ’Ã Â¸â„¢Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€¢Ã Â¸Â±Ã Â¸â€Ã Â¸ÂªÃ Â¸Â´Ã Â¸â„¢Ã Â¹Æ’Ã Â¸Ë† Ã Â¸Â§Ã Â¸Â´Ã Â¹â‚¬Ã Â¸â€žÃ Â¸Â£Ã Â¸Â²Ã Â¸Â°Ã Â¸Â«Ã Â¹Å’ Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¸Â£Ã Â¸Â°Ã Â¸Å¡Ã Â¸Å¡</li>
                <li><strong>Sustainable:</strong> Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¸Â­Ã Â¸Â¢Ã Â¹Ë†Ã Â¸Â²Ã Â¸â€¡Ã Â¸Â¢Ã Â¸Â±Ã Â¹Ë†Ã Â¸â€¡Ã Â¸Â¢Ã Â¸Â·Ã Â¸â„¢Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸â€¢Ã Â¹Ë†Ã Â¸Â­Ã Â¹â‚¬Ã Â¸â„¢Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸â€¡ Ã Â¸Â£Ã Â¸Â­Ã Â¸â€¡Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€šÃ Â¸Â¢Ã Â¸Â²Ã Â¸Â¢Ã Â¸â€¢Ã Â¸Â±Ã Â¸Â§</li>
                <li><strong>Secure by Design:</strong> Ã Â¸â€žÃ Â¸Â§Ã Â¸Â²Ã Â¸Â¡Ã Â¸â€ºÃ Â¸Â¥Ã Â¸Â­Ã Â¸â€Ã Â¸Â Ã Â¸Â±Ã Â¸Â¢Ã Â¸â€¢Ã Â¸Â±Ã Â¹â€°Ã Â¸â€¡Ã Â¹ÂÃ Â¸â€¢Ã Â¹Ë†Ã Â¹â‚¬Ã Â¸Â£Ã Â¸Â´Ã Â¹Ë†Ã Â¸Â¡Ã Â¸â€¢Ã Â¹â€°Ã Â¸â„¢ Ã Â¹â€žÃ Â¸Â¡Ã Â¹Ë†Ã Â¹Æ’Ã Â¸Å Ã Â¹Ë†Ã Â¹â‚¬Ã Â¸Å¾Ã Â¸Â´Ã Â¹Ë†Ã Â¸Â¡Ã Â¸â€”Ã Â¸ÂµÃ Â¸Â«Ã Â¸Â¥Ã Â¸Â±Ã Â¸â€¡</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>Ã¢Å¡â€“Ã¯Â¸Â Ã Â¸ÂÃ Â¸Å½Ã Â¸Â«Ã Â¸Â¡Ã Â¸Â²Ã Â¸Â¢Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸Â¡Ã Â¸Â²Ã Â¸â€¢Ã Â¸Â£Ã Â¸ÂÃ Â¸Â²Ã Â¸â„¢Ã Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¹â‚¬Ã Â¸ÂÃ Â¸ÂµÃ Â¹Ë†Ã Â¸Â¢Ã Â¸Â§Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸â€¡</h3>
              <ul>
                <li><strong>PDPA (Ã Â¸Å¾.Ã Â¸Â£.Ã Â¸Å¡. Ã Â¸â€žÃ Â¸Â¸Ã Â¹â€°Ã Â¸Â¡Ã Â¸â€žÃ Â¸Â£Ã Â¸Â­Ã Â¸â€¡Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¸ÂªÃ Â¹Ë†Ã Â¸Â§Ã Â¸â„¢Ã Â¸Å¡Ã Â¸Â¸Ã Â¸â€žÃ Â¸â€žÃ Â¸Â¥ Ã Â¸Å¾.Ã Â¸Â¨. 2562):</strong> Ã Â¸â€ºÃ Â¸ÂÃ Â¸â€ºÃ Â¹â€°Ã Â¸Â­Ã Â¸â€¡Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¸ÂªÃ Â¹Ë†Ã Â¸Â§Ã Â¸â„¢Ã Â¸Å¡Ã Â¸Â¸Ã Â¸â€žÃ Â¸â€žÃ Â¸Â¥Ã Â¸â€šÃ Â¸Â­Ã Â¸â€¡Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â°Ã Â¸Å Ã Â¸Â²Ã Â¸Å Ã Â¸â„¢ Ã Â¸Â¡Ã Â¸ÂµÃ Â¸Â«Ã Â¸Â¥Ã Â¸Â±Ã Â¸ÂÃ Â¸ÂÃ Â¸Â²Ã Â¸Â£ Consent, Purpose Limitation, Data Minimization</li>
                <li><strong>DGA Standards:</strong> Ã Â¸Â¡Ã Â¸Â²Ã Â¸â€¢Ã Â¸Â£Ã Â¸ÂÃ Â¸Â²Ã Â¸â„¢Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¸Â£Ã Â¸Â°Ã Â¸Å¡Ã Â¸Å¡Ã Â¸Â Ã Â¸Â²Ã Â¸â€žÃ Â¸Â£Ã Â¸Â±Ã Â¸Â Ã Â¸Ë†Ã Â¸Â²Ã Â¸ÂÃ Â¸ÂªÃ Â¸Â³Ã Â¸â„¢Ã Â¸Â±Ã Â¸ÂÃ Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¸Â£Ã Â¸Â±Ã Â¸ÂÃ Â¸Å¡Ã Â¸Â²Ã Â¸Â¥Ã Â¸â€Ã Â¸Â´Ã Â¸Ë†Ã Â¸Â´Ã Â¸â€”Ã Â¸Â±Ã Â¸Â¥</li>
                <li><strong>WCAG 2.1 Level AA:</strong> Ã Â¸Â¡Ã Â¸Â²Ã Â¸â€¢Ã Â¸Â£Ã Â¸ÂÃ Â¸Â²Ã Â¸â„¢Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¹â‚¬Ã Â¸â€šÃ Â¹â€°Ã Â¸Â²Ã Â¸â€“Ã Â¸Â¶Ã Â¸â€¡Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸Å“Ã Â¸Â¹Ã Â¹â€°Ã Â¸Å¾Ã Â¸Â´Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£ Ã Â¸Â£Ã Â¸Â­Ã Â¸â€¡Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡ Screen Reader, Keyboard Navigation</li>
                <li><strong>Cybersecurity Act:</strong> Ã Â¸ÂÃ Â¸Å½Ã Â¸Â«Ã Â¸Â¡Ã Â¸Â²Ã Â¸Â¢Ã Â¸â€žÃ Â¸Â§Ã Â¸Â²Ã Â¸Â¡Ã Â¸Â¡Ã Â¸Â±Ã Â¹Ë†Ã Â¸â„¢Ã Â¸â€žÃ Â¸â€¡Ã Â¸â€ºÃ Â¸Â¥Ã Â¸Â­Ã Â¸â€Ã Â¸Â Ã Â¸Â±Ã Â¸Â¢Ã Â¹â€žÃ Â¸â€¹Ã Â¹â‚¬Ã Â¸Å¡Ã Â¸Â­Ã Â¸Â£Ã Â¹Å’ Ã Â¸â€ºÃ Â¹â€°Ã Â¸Â­Ã Â¸â€¡Ã Â¸ÂÃ Â¸Â±Ã Â¸â„¢Ã Â¸Â Ã Â¸Â±Ã Â¸Â¢Ã Â¸â€žÃ Â¸Â¸Ã Â¸ÂÃ Â¸â€žÃ Â¸Â²Ã Â¸Â¡</li>
                <li><strong>Open Data Charter:</strong> Ã Â¸Â«Ã Â¸Â¥Ã Â¸Â±Ã Â¸ÂÃ Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¹â‚¬Ã Â¸â€ºÃ Â¸Â´Ã Â¸â€Ã Â¸Â Ã Â¸Â²Ã Â¸â€žÃ Â¸Â£Ã Â¸Â±Ã Â¸Â Ã Â¹â‚¬Ã Â¸Å¾Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸â€žÃ Â¸Â§Ã Â¸Â²Ã Â¸Â¡Ã Â¹â€šÃ Â¸â€ºÃ Â¸Â£Ã Â¹Ë†Ã Â¸â€¡Ã Â¹Æ’Ã Â¸ÂªÃ Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Â¡Ã Â¸ÂµÃ Â¸ÂªÃ Â¹Ë†Ã Â¸Â§Ã Â¸â„¢Ã Â¸Â£Ã Â¹Ë†Ã Â¸Â§Ã Â¸Â¡</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={scrollToTop} className="btn-nav prev">Ã¢â€ â€˜ Ã Â¸ÂÃ Â¸Â¥Ã Â¸Â±Ã Â¸Å¡Ã Â¸â€Ã Â¹â€°Ã Â¸Â²Ã Â¸â„¢Ã Â¸Å¡Ã Â¸â„¢</button>
              <button onClick={() => scrollToSection('tech-stack')} className="btn-nav next">Ã Â¸â€“Ã Â¸Â±Ã Â¸â€Ã Â¹â€žÃ Â¸â€º: Ã Â¹â‚¬Ã Â¸â€”Ã Â¸â€žÃ Â¹â€šÃ Â¸â„¢Ã Â¹â€šÃ Â¸Â¥Ã Â¸Â¢Ã Â¸Âµ Ã¢â€ â€™</button>
            </div>
          </section>

          {/* SECTION 2: Ã Â¹â‚¬Ã Â¸â€”Ã Â¸â€žÃ Â¹â€šÃ Â¸â„¢Ã Â¹â€šÃ Â¸Â¥Ã Â¸Â¢Ã Â¸ÂµÃ Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¹ÂÃ Â¸â„¢Ã Â¸Â°Ã Â¸â„¢Ã Â¸Â³ */}
          <section id="tech-stack" className="handbook-section">
            <h2>2. Ã Â¹â‚¬Ã Â¸â€”Ã Â¸â€žÃ Â¹â€šÃ Â¸â„¢Ã Â¹â€šÃ Â¸Â¥Ã Â¸Â¢Ã Â¸ÂµÃ Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¹ÂÃ Â¸â„¢Ã Â¸Â°Ã Â¸â„¢Ã Â¸Â³</h2>
            <p className="section-intro">
              Ã Â¹â‚¬Ã Â¸â€”Ã Â¸â€žÃ Â¹â€šÃ Â¸â„¢Ã Â¹â€šÃ Â¸Â¥Ã Â¸Â¢Ã Â¸ÂµÃ Â¹ÂÃ Â¸Â¥Ã Â¸Â°Ã Â¹â‚¬Ã Â¸â€žÃ Â¸Â£Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸â€¡Ã Â¸Â¡Ã Â¸Â·Ã Â¸Â­Ã Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¹Æ’Ã Â¸Å Ã Â¹â€°Ã Â¹Æ’Ã Â¸â„¢Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²Ã Â¸Â£Ã Â¸Â°Ã Â¸Å¡Ã Â¸Å¡ Guardian Route
            </p>

            <div className="content-card">
              <h3>Ã°Å¸â€Â§ Technology Stack</h3>
              <div className="tech-grid">
                <div className="tech-item">
                  <h4>Frontend</h4>
                  <ul>
                    <li><strong>React 19:</strong> UI Library Ã Â¸Â¥Ã Â¹Ë†Ã Â¸Â²Ã Â¸ÂªÃ Â¸Â¸Ã Â¸â€ Ã Â¸Å¾Ã Â¸Â£Ã Â¹â€°Ã Â¸Â­Ã Â¸Â¡ Server Components</li>
                    <li><strong>TypeScript:</strong> Type Safety Ã Â¸â€ºÃ Â¹â€°Ã Â¸Â­Ã Â¸â€¡Ã Â¸ÂÃ Â¸Â±Ã Â¸â„¢ Runtime Errors</li>
                    <li><strong>Vite:</strong> Build Tool Ã Â¹â‚¬Ã Â¸Â£Ã Â¹â€¡Ã Â¸Â§ HMR Ã Â¸â€”Ã Â¸Â±Ã Â¸â„¢Ã Â¹Æ’Ã Â¸Ë†</li>
                    <li><strong>React Router v6:</strong> Client-side Routing</li>
                    <li><strong>Zustand:</strong> State Management Ã Â¹â‚¬Ã Â¸Å¡Ã Â¸Â² Ã Â¸Â£Ã Â¸Â§Ã Â¸â€Ã Â¹â‚¬Ã Â¸Â£Ã Â¹â€¡Ã Â¸Â§</li>
                    <li><strong>Tailwind CSS:</strong> Utility-first CSS Framework</li>
                    <li><strong>Leaflet:</strong> Interactive Maps Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¹ÂÃ Â¸ÂªÃ Â¸â€Ã Â¸â€¡Ã Â¸Å¾Ã Â¸Â´Ã Â¸ÂÃ Â¸Â±Ã Â¸â€</li>
                  </ul>
                </div>
                <div className="tech-item">
                  <h4>Backend</h4>
                  <ul>
                    <li><strong>NestJS:</strong> Enterprise-grade Node.js Framework</li>
                    <li><strong>TypeScript:</strong> Ã Â¹Æ’Ã Â¸Å Ã Â¹â€°Ã Â¸â€”Ã Â¸Â±Ã Â¹â€°Ã Â¸â€¡ Frontend Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° Backend</li>
                    <li><strong>PostgreSQL:</strong> Relational Database Ã Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¹â‚¬Ã Â¸ÂªÃ Â¸â€“Ã Â¸ÂµÃ Â¸Â¢Ã Â¸Â£</li>
                    <li><strong>PostGIS:</strong> Spatial Extension Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¸Â Ã Â¸Â¹Ã Â¸Â¡Ã Â¸Â´Ã Â¸Â¨Ã Â¸Â²Ã Â¸ÂªÃ Â¸â€¢Ã Â¸Â£Ã Â¹Å’</li>
                    <li><strong>Prisma ORM:</strong> Type-safe Database Access</li>
                    <li><strong>JWT:</strong> Token-based Authentication</li>
                    <li><strong>Swagger/OpenAPI:</strong> API Documentation Ã Â¸Â­Ã Â¸Â±Ã Â¸â€¢Ã Â¹â€šÃ Â¸â„¢Ã Â¸Â¡Ã Â¸Â±Ã Â¸â€¢Ã Â¸Â´</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>Ã°Å¸â€ºÂ Ã¯Â¸Â Development Tools</h3>
              <ul>
                <li><strong>Git + GitHub:</strong> Version Control Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° Collaboration</li>
                <li><strong>Docker:</strong> Containerization Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡ Development Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° Production</li>
                <li><strong>ESLint + Prettier:</strong> Code Quality Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° Formatting</li>
                <li><strong>Vitest:</strong> Unit Testing Framework</li>
                <li><strong>Playwright:</strong> E2E Testing</li>
                <li><strong>Sentry:</strong> Error Tracking Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° Monitoring</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('principles')} className="btn-nav prev">Ã¢â€ Â Ã Â¸ÂÃ Â¹Ë†Ã Â¸Â­Ã Â¸â„¢Ã Â¸Â«Ã Â¸â„¢Ã Â¹â€°Ã Â¸Â²: Ã Â¸â€ºÃ Â¸Â£Ã Â¸Â±Ã Â¸Å Ã Â¸ÂÃ Â¸Â²</button>
              <button onClick={() => scrollToSection('innovation')} className="btn-nav next">Ã Â¸â€“Ã Â¸Â±Ã Â¸â€Ã Â¹â€žÃ Â¸â€º: Ã Â¸â„¢Ã Â¸Â§Ã Â¸Â±Ã Â¸â€¢Ã Â¸ÂÃ Â¸Â£Ã Â¸Â£Ã Â¸Â¡ Ã¢â€ â€™</button>
            </div>
          </section>

          {/* SECTION 3: Ã Â¸â„¢Ã Â¸Â§Ã Â¸Â±Ã Â¸â€¢Ã Â¸ÂÃ Â¸Â£Ã Â¸Â£Ã Â¸Â¡Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸Â«Ã Â¸â„¢Ã Â¹Ë†Ã Â¸Â§Ã Â¸Â¢Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¸Â£Ã Â¸Â²Ã Â¸Å Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£ */}
          <section id="innovation" className="handbook-section">
            <h2>3. Ã Â¸â„¢Ã Â¸Â§Ã Â¸Â±Ã Â¸â€¢Ã Â¸ÂÃ Â¸Â£Ã Â¸Â£Ã Â¸Â¡Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸Â«Ã Â¸â„¢Ã Â¹Ë†Ã Â¸Â§Ã Â¸Â¢Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¸Â£Ã Â¸Â²Ã Â¸Å Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£ (PWA & Offline-First)</h2>
            <p className="section-intro">
              Ã Â¹â‚¬Ã Â¸â€”Ã Â¸â€žÃ Â¹â€šÃ Â¸â„¢Ã Â¹â€šÃ Â¸Â¥Ã Â¸Â¢Ã Â¸Âµ Progressive Web App (PWA) Ã Â¹ÂÃ Â¸Â¥Ã Â¸Â° Offline-First Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€”Ã Â¸Â³Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¹Æ’Ã Â¸â„¢Ã Â¸Å¾Ã Â¸Â·Ã Â¹â€°Ã Â¸â„¢Ã Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¸Â«Ã Â¹Ë†Ã Â¸Â²Ã Â¸â€¡Ã Â¹â€žÃ Â¸ÂÃ Â¸Â¥
            </p>

            <div className="content-card">
              <h3>Ã°Å¸â€œÂ± Progressive Web App (PWA)</h3>
              <p><strong>PWA Ã Â¸â€žÃ Â¸Â·Ã Â¸Â­Ã Â¸Â­Ã Â¸Â°Ã Â¹â€žÃ Â¸Â£?</strong> Ã Â¹ÂÃ Â¸Â­Ã Â¸â€ºÃ Â¸Å¾Ã Â¸Â¥Ã Â¸Â´Ã Â¹â‚¬Ã Â¸â€žÃ Â¸Å Ã Â¸Â±Ã Â¸â„¢Ã Â¹â‚¬Ã Â¸Â§Ã Â¹â€¡Ã Â¸Å¡Ã Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¸â€”Ã Â¸Â³Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¹â‚¬Ã Â¸Â«Ã Â¸Â¡Ã Â¸Â·Ã Â¸Â­Ã Â¸â„¢Ã Â¹ÂÃ Â¸Â­Ã Â¸â€ºÃ Â¸Â¡Ã Â¸Â·Ã Â¸Â­Ã Â¸â€“Ã Â¸Â·Ã Â¸Â­ Ã Â¸â€¢Ã Â¸Â´Ã Â¸â€Ã Â¸â€¢Ã Â¸Â±Ã Â¹â€°Ã Â¸â€¡Ã Â¹â€žÃ Â¸â€Ã Â¹â€° Ã Â¹Æ’Ã Â¸Å Ã Â¹â€°Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢ Offline Ã Â¹â€žÃ Â¸â€Ã Â¹â€°</p>
              <ul>
                <li><strong>Installable:</strong> Ã Â¸â€¢Ã Â¸Â´Ã Â¸â€Ã Â¸â€¢Ã Â¸Â±Ã Â¹â€°Ã Â¸â€¡Ã Â¸Å¡Ã Â¸â„¢Ã Â¸Â«Ã Â¸â„¢Ã Â¹â€°Ã Â¸Â²Ã Â¸Ë†Ã Â¸Â­Ã Â¹â€šÃ Â¸â€”Ã Â¸Â£Ã Â¸Â¨Ã Â¸Â±Ã Â¸Å¾Ã Â¸â€”Ã Â¹Å’ Ã Â¹â‚¬Ã Â¸Â«Ã Â¸Â¡Ã Â¸Â·Ã Â¸Â­Ã Â¸â„¢ Native App</li>
                <li><strong>Offline Support:</strong> Ã Â¸â€”Ã Â¸Â³Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¹â€žÃ Â¸â€Ã Â¹â€°Ã Â¹ÂÃ Â¸Â¡Ã Â¹â€°Ã Â¹â€žÃ Â¸Â¡Ã Â¹Ë†Ã Â¸Â¡Ã Â¸ÂµÃ Â¸Â­Ã Â¸Â´Ã Â¸â„¢Ã Â¹â‚¬Ã Â¸â€”Ã Â¸Â­Ã Â¸Â£Ã Â¹Å’Ã Â¹â‚¬Ã Â¸â„¢Ã Â¹â€¡Ã Â¸â€¢ (Service Worker)</li>
                <li><strong>Push Notifications:</strong> Ã Â¹ÂÃ Â¸Ë†Ã Â¹â€°Ã Â¸â€¡Ã Â¹â‚¬Ã Â¸â€¢Ã Â¸Â·Ã Â¸Â­Ã Â¸â„¢Ã Â¹â‚¬Ã Â¸Â«Ã Â¸â€¢Ã Â¸Â¸Ã Â¸ÂÃ Â¸Â²Ã Â¸Â£Ã Â¸â€œÃ Â¹Å’Ã Â¸ÂªÃ Â¸Â³Ã Â¸â€žÃ Â¸Â±Ã Â¸Â</li>
                <li><strong>Fast & Reliable:</strong> Ã Â¹â€šÃ Â¸Â«Ã Â¸Â¥Ã Â¸â€Ã Â¹â‚¬Ã Â¸Â£Ã Â¹â€¡Ã Â¸Â§ Cache Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¹â€žÃ Â¸Â§Ã Â¹â€°</li>
                <li><strong>Responsive:</strong> Ã Â¹Æ’Ã Â¸Å Ã Â¹â€°Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¹â€žÃ Â¸â€Ã Â¹â€°Ã Â¸â€”Ã Â¸Â¸Ã Â¸ÂÃ Â¸Â­Ã Â¸Â¸Ã Â¸â€ºÃ Â¸ÂÃ Â¸Â£Ã Â¸â€œÃ Â¹Å’ (Mobile, Tablet, Desktop)</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>Ã°Å¸Å’Â Offline-First Strategy</h3>
              <p><strong>Ã Â¸â€”Ã Â¸Â³Ã Â¹â€žÃ Â¸Â¡Ã Â¸â€¢Ã Â¹â€°Ã Â¸Â­Ã Â¸â€¡ Offline-First?</strong> Ã Â¸Å¾Ã Â¸Â·Ã Â¹â€°Ã Â¸â„¢Ã Â¸â€”Ã Â¸ÂµÃ Â¹Ë†Ã Â¸Â«Ã Â¹Ë†Ã Â¸Â²Ã Â¸â€¡Ã Â¹â€žÃ Â¸ÂÃ Â¸Â¥Ã Â¸Â­Ã Â¸Â²Ã Â¸Ë†Ã Â¹â€žÃ Â¸Â¡Ã Â¹Ë†Ã Â¸Â¡Ã Â¸ÂµÃ Â¸ÂªÃ Â¸Â±Ã Â¸ÂÃ Â¸ÂÃ Â¸Â²Ã Â¸â€œ Ã Â¹ÂÃ Â¸â€¢Ã Â¹Ë†Ã Â¸â€¡Ã Â¸Â²Ã Â¸â„¢Ã Â¸â€¢Ã Â¹â€°Ã Â¸Â­Ã Â¸â€¡Ã Â¸â€”Ã Â¸Â³Ã Â¸â€¢Ã Â¹Ë†Ã Â¸Â­</p>
              <ul>
                <li><strong>Service Worker:</strong> Cache API Responses, Static Assets</li>
                <li><strong>IndexedDB:</strong> Ã Â¹â‚¬Ã Â¸ÂÃ Â¹â€¡Ã Â¸Å¡Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¹Æ’Ã Â¸â„¢Ã Â¹â‚¬Ã Â¸â€žÃ Â¸Â£Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸â€¡ Sync Ã Â¹â‚¬Ã Â¸Â¡Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸Â¡Ã Â¸ÂµÃ Â¹â‚¬Ã Â¸â„¢Ã Â¹â€¡Ã Â¸â€¢</li>
                <li><strong>Background Sync:</strong> Ã Â¸ÂªÃ Â¹Ë†Ã Â¸â€¡Ã Â¸â€šÃ Â¹â€°Ã Â¸Â­Ã Â¸Â¡Ã Â¸Â¹Ã Â¸Â¥Ã Â¸Â­Ã Â¸Â±Ã Â¸â€¢Ã Â¹â€šÃ Â¸â„¢Ã Â¸Â¡Ã Â¸Â±Ã Â¸â€¢Ã Â¸Â´Ã Â¹â‚¬Ã Â¸Â¡Ã Â¸Â·Ã Â¹Ë†Ã Â¸Â­Ã Â¸ÂÃ Â¸Â¥Ã Â¸Â±Ã Â¸Å¡Ã Â¸Â¡Ã Â¸Â²Ã Â¸Â¡Ã Â¸ÂµÃ Â¸ÂªÃ Â¸Â±Ã Â¸ÂÃ Â¸ÂÃ Â¸Â²Ã Â¸â€œ</li>
                <li><strong>Optimistic UI:</strong> Ã Â¹ÂÃ Â¸ÂªÃ Â¸â€Ã Â¸â€¡Ã Â¸Å“Ã Â¸Â¥Ã Â¸â€”Ã Â¸Â±Ã Â¸â„¢Ã Â¸â€”Ã Â¸Âµ Ã Â¹â€žÃ Â¸Â¡Ã Â¹Ë†Ã Â¸â€¢Ã Â¹â€°Ã Â¸Â­Ã Â¸â€¡Ã Â¸Â£Ã Â¸Â­ Server</li>
              </ul>
            </div>

            <div className="content-card">
              <h3>Ã°Å¸Â¤â€“ AI Tools Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡Ã Â¸â„¢Ã Â¸Â±Ã Â¸ÂÃ Â¸Å¾Ã Â¸Â±Ã Â¸â€™Ã Â¸â„¢Ã Â¸Â²</h3>
              <ul>
                <li><strong>GitHub Copilot:</strong> AI Pair Programming Ã Â¸Å Ã Â¹Ë†Ã Â¸Â§Ã Â¸Â¢Ã Â¹â‚¬Ã Â¸â€šÃ Â¸ÂµÃ Â¸Â¢Ã Â¸â„¢Ã Â¹â€šÃ Â¸â€žÃ Â¹â€°Ã Â¸â€</li>
                <li><strong>ChatGPT/Claude:</strong> Ã Â¸Å Ã Â¹Ë†Ã Â¸Â§Ã Â¸Â¢Ã Â¹ÂÃ Â¸ÂÃ Â¹â€°Ã Â¸â€ºÃ Â¸Â±Ã Â¸ÂÃ Â¸Â«Ã Â¸Â² Ã Â¹â‚¬Ã Â¸â€šÃ Â¸ÂµÃ Â¸Â¢Ã Â¸â„¢ Documentation</li>
                <li><strong>Cursor IDE:</strong> AI-powered Code Editor</li>
                <li><strong>Windsurf:</strong> AI Assistant Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡ Codebase Navigation</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('tech-stack')} className="btn-nav prev">â† à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µ</button>
              <button onClick={() => scrollToSection('structure')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡ â†’</button>
            </div>
          </section>

          {/* SECTION 4: à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹‚à¸›à¸£à¹€à¸ˆà¸à¸•à¹Œ */}
          <section id="structure" className="handbook-section">
            <h2>4. à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹‚à¸›à¸£à¹€à¸ˆà¸à¸•à¹Œ</h2>
            <p className="section-intro">à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¸°à¹‚à¸Ÿà¸¥à¹€à¸”à¸­à¸£à¹Œà¸‚à¸­à¸‡à¹‚à¸›à¸£à¹€à¸ˆà¸à¸•à¹Œ Guardian Route</p>
            
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
              <button onClick={() => scrollToSection('innovation')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¸™à¸§à¸±à¸•à¸à¸£à¸£à¸¡</button>
              <button onClick={() => scrollToSection('design')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¸à¸²à¸£à¸­à¸­à¸à¹à¸šà¸š </button>
            </div>
          </section>

          {/* SECTION 5: à¸à¸²à¸£à¸­à¸­à¸à¹à¸šà¸šà¸£à¸°à¸šà¸š */}
          <section id="design" className="handbook-section">
            <h2>5. à¸à¸²à¸£à¸­à¸­à¸à¹à¸šà¸šà¸£à¸°à¸šà¸š</h2>
            <p className="section-intro">à¸«à¸¥à¸±à¸à¸à¸²à¸£à¸­à¸­à¸à¹à¸šà¸šà¹à¸¥à¸° Design Patterns à¸—à¸µà¹ˆà¹ƒà¸Šà¹‰</p>
            
            <div className="content-card">
              <h3> Design Patterns</h3>
              <ul>
                <li><strong>MVC Pattern:</strong> Model-View-Controller à¸ªà¸³à¸«à¸£à¸±à¸š Backend</li>
                <li><strong>Repository Pattern:</strong> à¹à¸¢à¸ Data Access Layer</li>
                <li><strong>Service Layer:</strong> Business Logic à¹à¸¢à¸à¸ˆà¸²à¸ Controllers</li>
                <li><strong>DTO Pattern:</strong> Data Transfer Objects à¸ªà¸³à¸«à¸£à¸±à¸š API</li>
                <li><strong>Component Pattern:</strong> Reusable UI components</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('structure')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡</button>
              <button onClick={() => scrollToSection('state-management')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: State Management </button>
            </div>
          </section>

          {/* SECTION 6: à¸à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£ State */}
          <section id="state-management" className="handbook-section">
            <h2>6. à¸à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£ State</h2>
            <p className="section-intro">à¸à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£ State à¸”à¹‰à¸§à¸¢ Zustand à¹à¸¥à¸° React Hooks</p>
            
            <div className="content-card">
              <h3> Zustand State Management</h3>
              <p><strong>à¸—à¸³à¹„à¸¡à¹ƒà¸Šà¹‰ Zustand?</strong> à¹€à¸šà¸² à¸£à¸§à¸”à¹€à¸£à¹‡à¸§ à¹„à¸¡à¹ˆà¸‹à¸±à¸šà¸‹à¹‰à¸­à¸™</p>
              <ul>
                <li><strong>Simple API:</strong> à¹€à¸£à¸µà¸¢à¸™à¸£à¸¹à¹‰à¸‡à¹ˆà¸²à¸¢ à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¸ªà¸°à¸”à¸§à¸</li>
                <li><strong>No Boilerplate:</strong> à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹€à¸‚à¸µà¸¢à¸™ Actions, Reducers</li>
                <li><strong>TypeScript Support:</strong> Type-safe à¸•à¸±à¹‰à¸‡à¹à¸•à¹ˆà¸•à¹‰à¸™</li>
                <li><strong>Persist Middleware:</strong> à¸šà¸±à¸™à¸—à¸¶à¸ State à¹ƒà¸™ localStorage</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('design')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¸à¸²à¸£à¸­à¸­à¸à¹à¸šà¸š</button>
              <button onClick={() => scrollToSection('security')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¸„à¸§à¸²à¸¡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢ </button>
            </div>
          </section>

          {/* SECTION 7: à¸„à¸§à¸²à¸¡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢ */}
          <section id="security" className="handbook-section">
            <h2>7. à¸„à¸§à¸²à¸¡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢ (Security)</h2>
            <p className="section-intro">à¸¡à¸²à¸•à¸£à¸à¸²à¸£à¸£à¸±à¸à¸©à¸²à¸„à¸§à¸²à¸¡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢à¸•à¸²à¸¡à¸¡à¸²à¸•à¸£à¸à¸²à¸™ OWASP à¹à¸¥à¸° PDPA</p>
            
            <div className="content-card">
              <h3> Authentication & Authorization</h3>
              <ul>
                <li><strong>JWT Token:</strong> Access Token (15 à¸™à¸²à¸—à¸µ) + Refresh Token (7 à¸§à¸±à¸™)</li>
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
                <li><strong>Consent Management:</strong> à¸‚à¸­à¸„à¸§à¸²à¸¡à¸¢à¸´à¸™à¸¢à¸­à¸¡à¸à¹ˆà¸­à¸™à¹€à¸à¹‡à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥</li>
                <li><strong>Data Minimization:</strong> à¹€à¸à¹‡à¸šà¹€à¸‰à¸žà¸²à¸°à¸—à¸µà¹ˆà¸ˆà¸³à¹€à¸›à¹‡à¸™</li>
                <li><strong>Right to Access:</strong> à¸œà¸¹à¹‰à¹ƒà¸Šà¹‰à¸”à¸¹à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸•à¸™à¹€à¸­à¸‡à¹„à¸”à¹‰</li>
                <li><strong>Right to Deletion:</strong> à¸¥à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸•à¸²à¸¡à¸„à¸³à¸‚à¸­</li>
                <li><strong>Audit Logs:</strong> à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¹€à¸‚à¹‰à¸²à¸–à¸¶à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('state-management')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: State</button>
              <button onClick={() => scrollToSection('coding-practice')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¸à¸²à¸£à¹€à¸‚à¸µà¸¢à¸™à¹‚à¸„à¹‰à¸” </button>
            </div>
          </section>

          {/* SECTION 8: à¹à¸™à¸§à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸à¸²à¸£à¹€à¸‚à¸µà¸¢à¸™à¹‚à¸„à¹‰à¸” */}
          <section id="coding-practice" className="handbook-section">
            <h2>8. à¹à¸™à¸§à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸à¸²à¸£à¹€à¸‚à¸µà¸¢à¸™à¹‚à¸„à¹‰à¸”</h2>
            <p className="section-intro">Coding Standards à¹à¸¥à¸° Best Practices</p>
            
            <div className="content-card">
              <h3> Coding Style</h3>
              <ul>
                <li><strong>TypeScript:</strong> à¹ƒà¸Šà¹‰ strict mode à¸«à¸¥à¸µà¸à¹€à¸¥à¸µà¹ˆà¸¢à¸‡ any</li>
                <li><strong>ESLint + Prettier:</strong> à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¹à¸¥à¸°à¸ˆà¸±à¸”à¸£à¸¹à¸›à¹à¸šà¸šà¸­à¸±à¸•à¹‚à¸™à¸¡à¸±à¸•à¸´</li>
                <li><strong>Naming Convention:</strong> camelCase (variables), PascalCase (Components)</li>
                <li><strong>Comments:</strong> à¹€à¸‚à¸µà¸¢à¸™à¸ à¸²à¸©à¸²à¹„à¸—à¸¢à¸«à¸£à¸·à¸­à¸­à¸±à¸‡à¸à¸¤à¸© à¸Šà¸±à¸”à¹€à¸ˆà¸™à¸à¸£à¸°à¸Šà¸±à¸š</li>
              </ul>
            </div>

            <div className="content-card">
              <h3> Git Workflow</h3>
              <ul>
                <li><strong>Branches:</strong> main, develop, feature/*, fix/*, hotfix/*</li>
                <li><strong>Commit Messages:</strong> feat:, fix:, docs:, style:, refactor:, test:, chore:</li>
                <li><strong>Pull Requests:</strong> à¸•à¹‰à¸­à¸‡à¸œà¹ˆà¸²à¸™ Code Review à¸à¹ˆà¸­à¸™ merge</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('security')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¸„à¸§à¸²à¸¡à¸›à¸¥à¸­à¸”à¸ à¸±à¸¢</button>
              <button onClick={() => scrollToSection('api-design')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: API </button>
            </div>
          </section>

          {/* SECTION 9: à¸à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£ API */}
          <section id="api-design" className="handbook-section">
            <h2>9. à¸à¸²à¸£à¸ˆà¸±à¸”à¸à¸²à¸£à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹à¸¥à¸° API</h2>
            <p className="section-intro">API Design à¹à¸¥à¸° Data Management</p>
            
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
                <li><strong>Migrations:</strong> Version control à¸ªà¸³à¸«à¸£à¸±à¸š schema</li>
                <li><strong>Backup:</strong> Daily automated backups</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('coding-practice')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¸à¸²à¸£à¹€à¸‚à¸µà¸¢à¸™à¹‚à¸„à¹‰à¸”</button>
              <button onClick={() => scrollToSection('testing')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¸à¸²à¸£à¸—à¸”à¸ªà¸­à¸š </button>
            </div>
          </section>

          {/* SECTION 10: à¸à¸²à¸£à¸—à¸”à¸ªà¸­à¸š */}
          <section id="testing" className="handbook-section">
            <h2>10. à¸à¸²à¸£à¸—à¸”à¸ªà¸­à¸šà¹à¸¥à¸°à¸›à¸£à¸°à¸à¸±à¸™à¸„à¸¸à¸“à¸ à¸²à¸ž</h2>
            <p className="section-intro">Testing Strategy à¹à¸¥à¸° QA Process</p>
            
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
              <button onClick={() => scrollToSection('api-design')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: API</button>
              <button onClick={() => scrollToSection('deployment')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: Deployment </button>
            </div>
          </section>

          {/* SECTION 11: à¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¹à¸¥à¸° Deployment */}
          <section id="deployment" className="handbook-section">
            <h2>11. à¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¹à¸¥à¸° Deployment</h2>
            <p className="section-intro">à¸à¸²à¸£ Deploy à¹à¸¥à¸° Infrastructure</p>
            
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
              <button onClick={() => scrollToSection('testing')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¸à¸²à¸£à¸—à¸”à¸ªà¸­à¸š</button>
              <button onClick={() => scrollToSection('maintenance')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¸à¸²à¸£à¸”à¸¹à¹à¸¥ </button>
            </div>
          </section>

          {/* SECTION 12: à¸à¸²à¸£à¸”à¸¹à¹à¸¥à¸£à¸±à¸à¸©à¸²à¹à¸¥à¸°à¸­à¸±à¸›à¹€à¸”à¸• */}
          <section id="maintenance" className="handbook-section">
            <h2>12. à¸à¸²à¸£à¸”à¸¹à¹à¸¥à¸£à¸±à¸à¸©à¸²à¹à¸¥à¸°à¸­à¸±à¸›à¹€à¸”à¸•</h2>
            <p className="section-intro">Maintenance Plan à¹à¸¥à¸° Update Strategy</p>
            
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
              <button onClick={() => scrollToSection('deployment')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: Deployment</button>
              <button onClick={() => scrollToSection('resources')} className="btn-nav next">à¸–à¸±à¸”à¹„à¸›: à¹à¸«à¸¥à¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ </button>
            </div>
          </section>

          {/* SECTION 13: à¹à¸«à¸¥à¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡ */}
          <section id="resources" className="handbook-section">
            <h2>13. à¹à¸«à¸¥à¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡</h2>
            <p className="section-intro">à¹€à¸­à¸à¸ªà¸²à¸£à¹à¸¥à¸°à¹à¸«à¸¥à¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸—à¸µà¹ˆà¹€à¸›à¹‡à¸™à¸›à¸£à¸°à¹‚à¸¢à¸Šà¸™à¹Œ</p>
            
            <div className="content-card">
              <h3> à¸¡à¸²à¸•à¸£à¸à¸²à¸™à¹à¸¥à¸°à¸à¸Žà¸«à¸¡à¸²à¸¢</h3>
              <ul>
                <li><a href="https://www.dga.or.th" target="_blank" rel="noopener noreferrer">DGA - à¸ªà¸³à¸™à¸±à¸à¸‡à¸²à¸™à¸žà¸±à¸’à¸™à¸²à¸£à¸±à¸à¸šà¸²à¸¥à¸”à¸´à¸ˆà¸´à¸—à¸±à¸¥</a></li>
                <li><a href="https://www.pdpc.or.th" target="_blank" rel="noopener noreferrer">PDPA - à¸„à¸“à¸°à¸à¸£à¸£à¸¡à¸à¸²à¸£à¸„à¸¸à¹‰à¸¡à¸„à¸£à¸­à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¹ˆà¸§à¸™à¸šà¸¸à¸„à¸„à¸¥</a></li>
                <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer">WCAG 2.1 Guidelines</a></li>
                <li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer">OWASP Top 10</a></li>
              </ul>
            </div>

            <div className="content-card">
              <h3> à¹€à¸—à¸„à¹‚à¸™à¹‚à¸¥à¸¢à¸µ</h3>
              <ul>
                <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
                <li><a href="https://docs.nestjs.com" target="_blank" rel="noopener noreferrer">NestJS Documentation</a></li>
                <li><a href="https://www.prisma.io/docs" target="_blank" rel="noopener noreferrer">Prisma Documentation</a></li>
                <li><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">TypeScript Handbook</a></li>
              </ul>
            </div>

            <div className="content-card">
              <h3> à¸•à¸´à¸”à¸•à¹ˆà¸­à¸—à¸µà¸¡à¸žà¸±à¸’à¸™à¸²</h3>
              <ul>
                <li><a href="https://github.com/jetci/Guardian-Route" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
                <li><a href="https://github.com/jetci/Guardian-Route/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
                <li>Email: dev@obtwiang.go.th</li>
              </ul>
            </div>

            <div className="section-nav">
              <button onClick={() => scrollToSection('maintenance')} className="btn-nav prev"> à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²: à¸à¸²à¸£à¸”à¸¹à¹à¸¥</button>
              <button onClick={scrollToTop} className="btn-nav next"> à¸à¸¥à¸±à¸šà¸”à¹‰à¸²à¸™à¸šà¸™</button>
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
        <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">â†‘</button>
      )}
    </div>
  );
}
