/**
 * API Documentation Page
 * Guardian Route Project - Open Government Initiative
 * 
 * Interactive API documentation using Swagger UI
 * Accessible only to DEVELOPER role
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './ApiDocsPage.css';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load OpenAPI spec
    fetch('/openapi.json')
      .then(res => res.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load OpenAPI spec:', err);
        setError('Failed to load API documentation');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="api-docs-container">
        <div className="api-docs-header">
          <h1>🔌 API Documentation</h1>
          <Link to="/dashboard/developer" className="btn-back">← Back to Dashboard</Link>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="api-docs-container">
        <div className="api-docs-header">
          <h1>🔌 API Documentation</h1>
          <Link to="/dashboard/developer" className="btn-back">← Back to Dashboard</Link>
        </div>
        <div className="error-state">
          <p className="error-icon">⚠️</p>
          <p className="error-message">{error}</p>
          <p className="error-hint">Make sure openapi.json exists in /public directory</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-docs-container">
      {/* Header */}
      <div className="api-docs-header">
        <div className="header-content">
          <h1>🔌 API Documentation</h1>
          <p className="subtitle">Guardian Route - Interactive API Reference</p>
          <div className="header-actions">
            <Link to="/dashboard/developer" className="btn-back">← Back to Dashboard</Link>
            <Link to="/developer-handbook#security" className="btn-link">🔐 Security Guidelines</Link>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <div className="banner-content">
          <span className="banner-icon">ℹ️</span>
          <div className="banner-text">
            <strong>Developer Note:</strong> This is an interactive API documentation. 
            You can test endpoints directly from this page. Authentication requires a valid JWT token.
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="swagger-wrapper">
        <SwaggerUI
          spec={spec}
          docExpansion="list"
          defaultModelsExpandDepth={1}
          defaultModelExpandDepth={1}
          displayRequestDuration={true}
          filter={true}
          showExtensions={true}
          showCommonExtensions={true}
          tryItOutEnabled={true}
        />
      </div>

      {/* Footer */}
      <div className="api-docs-footer">
        <div className="footer-links">
          <Link to="/developer-handbook">📘 Developer Handbook</Link>
          <Link to="/developer-handbook#testing">🧪 Testing Guide</Link>
          <a href="https://github.com/jetci/Guardian-Route" target="_blank" rel="noopener noreferrer">
            💻 GitHub Repository
          </a>
        </div>
        <p className="copyright">© 2025 Guardian Route Project - Open Government Initiative</p>
      </div>
    </div>
  );
}
