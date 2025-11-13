/**
 * Developer Handbook Page - COMPLETE 12 SECTIONS
 * Guardian Route Project - Open Government Initiative
 * Last Updated: Nov 13, 2025
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
          <h1> Developer Handbook</h1>
          <p className="subtitle">Guardian Route - Open Government Initiative</p>
          <p className="description">
            คู่มือนักพัฒนาสำหรับระบบบริหารจัดการภัยพิบัติ ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
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
            <h3> สารบัญ (12 หัวข้อ)</h3>
            <ul>
              <li className={activeSection === 'principles' ? 'active' : ''}>
                <button onClick={() => scrollToSection('principles')}>1. ปรัชญาการพัฒนาแอปภาครัฐ</button>
              </li>
              <li className={activeSection === 'tech-stack' ? 'active' : ''}>
                <button onClick={() => scrollToSection('tech-stack')}>2. เทคโนโลยีที่แนะนำ</button>
              </li>
              <li className={activeSection === 'innovation' ? 'active' : ''}>
                <button onClick={() => scrollToSection('innovation')}>3. นวัตกรรมสำหรับหน่วยงานราชการ</button>
              </li>
              <li className={activeSection === 'structure' ? 'active' : ''}>
                <button onClick={() => scrollToSection('structure')}>4. โครงสร้างโปรเจกต์</button>
              </li>
              <li className={activeSection === 'design' ? 'active' : ''}>
                <button onClick={() => scrollToSection('design')}>5. การออกแบบระบบ</button>
              </li>
              <li className={activeSection === 'state-management' ? 'active' : ''}>
                <button onClick={() => scrollToSection('state-management')}>6. การจัดการ State</button>
              </li>
              <li className={activeSection === 'security' ? 'active' : ''}>
                <button onClick={() => scrollToSection('security')}>7. ความปลอดภัย</button>
              </li>
              <li className={activeSection === 'coding-practice' ? 'active' : ''}>
                <button onClick={() => scrollToSection('coding-practice')}>8. แนวปฏิบัติการเขียนโค้ด</button>
              </li>
              <li className={activeSection === 'api-design' ? 'active' : ''}>
                <button onClick={() => scrollToSection('api-design')}>9. การจัดการข้อมูลและ API</button>
              </li>
              <li className={activeSection === 'testing' ? 'active' : ''}>
                <button onClick={() => scrollToSection('testing')}>10. การทดสอบและประกันคุณภาพ</button>
              </li>
              <li className={activeSection === 'deployment' ? 'active' : ''}>
                <button onClick={() => scrollToSection('deployment')}>11. การติดตั้งและ Deployment</button>
              </li>
              <li className={activeSection === 'maintenance' ? 'active' : ''}>
                <button onClick={() => scrollToSection('maintenance')}>12. การดูแลรักษาและอัปเดต</button>
              </li>
              <li className={activeSection === 'resources' ? 'active' : ''}>
                <button onClick={() => scrollToSection('resources')}>13. แหล่งข้อมูลอ้างอิง</button>
              </li>
            </ul>
            <div className="nav-footer">
              <Link to="/" className="btn-back"> กลับหน้าหลัก</Link>
            </div>
          </div>
        </nav>

        <main className="handbook-content">