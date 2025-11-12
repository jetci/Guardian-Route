import { DashboardLayout } from '../components/layout/DashboardLayout';
import '../pages/dashboards/FieldOfficerDashboard.css';

export function SubmitReportPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Submit Incident Report</h1>
      </div>

      <div className="content-section">
        <form className="quick-report-form">
          <div className="form-group">
            <label>Incident Type *</label>
            <select className="form-input" required>
              <option value="">Select type...</option>
              <option>น้ำท่วม (Flood)</option>
              <option>ดินถลม (Landslide)</option>
              <option>ไฟไหม้ (Fire)</option>
              <option>อื่นๆ (Other)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input type="text" className="form-input" placeholder="Enter location..." required />
          </div>

          <div className="form-group">
            <label>Severity *</label>
            <select className="form-input" required>
              <option value="">Select severity...</option>
              <option>HIGH</option>
              <option>MEDIUM</option>
              <option>LOW</option>
            </select>
          </div>

          <div className="form-group">
            <label>Affected People</label>
            <input type="number" className="form-input" placeholder="Number of people affected" />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea className="form-input" rows={5} placeholder="Describe the incident in detail..." required></textarea>
          </div>

          <div className="form-group">
            <label>Photos</label>
            <input type="file" className="form-input" multiple accept="image/*" />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Submit Report
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
