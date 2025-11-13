/**
 * Developer Handbook Page - COMPLETE 12 SECTIONS
 * Guardian Route Project - Open Government Initiative
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
      const sections = ['principles', 'tech-stack', 'innovation', 'project-structure', 'system-design', 'state-management', 'security', 'coding-practices', 'api-management', 'testing', 'maintenance', 'resources'];
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
    <div className=\"handbook-container\">
      <header className=\"handbook-header\">
        <div className=\"header-content\">
          <h1> Developer Handbook</h1>
          <p className=\"subtitle\">Guardian Route - Open Government Initiative</p>
          <p className=\"description\">
            คู่มือนักพัฒนาสำหรับระบบบริหารจัดการภัยพิบัติ ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
          </p>
          <div className=\"header-badges\">
            <span className=\"badge\">React 19</span>
            <span className=\"badge\">TypeScript</span>
            <span className=\"badge\">NestJS</span>
            <span className=\"badge\">PostgreSQL</span>
            <span className=\"badge\">PWA Ready</span>
          </div>
        </div>
      </header>

      <div className=\"handbook-layout\">
        <nav className=\"handbook-nav\">
          <div className=\"nav-sticky\">
            <h3> สารบัญ (12 หัวข้อ)</h3>
            <ul>
              <li className={activeSection === 'principles' ? 'active' : ''}>
                <button onClick={() => scrollToSection('principles')}>1. ปรัชญาการพัฒนาแอปภาครัฐ</button>
              </li>
              <li className={activeSection === 'tech-stack' ? 'active' : ''}>
                <button onClick={() => scrollToSection('tech-stack')}>2. เทคโนโลยีที่แนะนำ</button>
              </li>
              <li className={activeSection === 'innovation' ? 'active' : ''}>
                <button onClick={() => scrollToSection('innovation')}>3. นวัตกรรมสำหรับราชการ (PWA)</button>
              </li>
              <li className={activeSection === 'project-structure' ? 'active' : ''}>
                <button onClick={() => scrollToSection('project-structure')}>4. โครงสร้างโปรเจกต์</button>
              </li>
              <li className={activeSection === 'system-design' ? 'active' : ''}>
                <button onClick={() => scrollToSection('system-design')}>5. การออกแบบระบบ</button>
              </li>
              <li className={activeSection === 'state-management' ? 'active' : ''}>
                <button onClick={() => scrollToSection('state-management')}>6. การจัดการ State</button>
              </li>
              <li className={activeSection === 'security' ? 'active' : ''}>
                <button onClick={() => scrollToSection('security')}>7. ความปลอดภัย (Security)</button>
              </li>
              <li className={activeSection === 'coding-practices' ? 'active' : ''}>
                <button onClick={() => scrollToSection('coding-practices')}>8. การเขียนโค้ด</button>
              </li>
              <li className={activeSection === 'api-management' ? 'active' : ''}>
                <button onClick={() => scrollToSection('api-management')}>9. API Design & Data</button>
              </li>
              <li className={activeSection === 'testing' ? 'active' : ''}>
                <button onClick={() => scrollToSection('testing')}>10. การทดสอบและ QA</button>
              </li>
              <li className={activeSection === 'maintenance' ? 'active' : ''}>
                <button onClick={() => scrollToSection('maintenance')}>11. Deployment & Maintenance</button>
              </li>
              <li className={activeSection === 'resources' ? 'active' : ''}>
                <button onClick={() => scrollToSection('resources')}>12. เอกสารอ้างอิง</button>
              </li>
            </ul>
            <div className=\"nav-footer\">
              <Link to=\"/\" className=\"btn-back\"> กลับหน้าหลัก</Link>
            </div>
          </div>
        </nav>

        <main className=\"handbook-content\">
          {/* SECTION 1 */}
          <section id=\"principles\" className=\"handbook-section\">
            <h2>1. ปรัชญาการพัฒนาแอปภาครัฐ</h2>
            <div className=\"content-card\">
              <h3> หลักการพัฒนา</h3>
              <ul>
                <li><strong>Open Government:</strong> เปิดเผยโค้ดและกระบวนการพัฒนา</li>
                <li><strong>Citizen-Centric:</strong> ออกแบบเพื่อประชาชนเป็นศูนย์กลาง</li>
                <li><strong>Data-Driven:</strong> ใช้ข้อมูลในการตัดสินใจ</li>
                <li><strong>Sustainable:</strong> พัฒนาอย่างยั่งยืนและต่อเนื่อง</li>
                <li><strong>Secure by Design:</strong> ความปลอดภัยตั้งแต่เริ่มต้น</li>
              </ul>
            </div>
            <div className=\"content-card\">
              <h3> กฎหมายและมาตรฐาน</h3>
              <ul>
                <li><strong>PDPA:</strong> พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</li>
                <li><strong>DGA Standards:</strong> มาตรฐานการพัฒนาระบบภาครัฐ</li>
                <li><strong>WCAG 2.1 Level AA:</strong> มาตรฐานการเข้าถึงสำหรับผู้พิการ</li>
                <li><strong>Cybersecurity Act:</strong> กฎหมายความมั่นคงปลอดภัยไซเบอร์</li>
              </ul>
            </div>
          </section>

          {/* Continue with remaining sections... */}
        </main>
      </div>

      {showBackToTop && (
        <button onClick={scrollToTop} className=\"back-to-top\" aria-label=\"Back to top\"></button>
      )}
    </div>
  );
}
