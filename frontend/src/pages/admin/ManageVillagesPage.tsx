/**
 * Manage Villages Page
 * หน้าจัดการข้อมูลหมู่บ้าน - CRUD operations
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { villagesApi, type LeafletVillage } from '../../api/villages';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { StatCard } from '../../components/common/StatCard';
import './ManageVillagesPage.css';

export default function ManageVillagesPage() {
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVillage, setEditingVillage] = useState<LeafletVillage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    moo: '',
    province: 'เชียงใหม่',
    district: 'ฝาง',
    subdistrict: 'เวียง',
    lat: '',
    lng: '',
    population: '',
    malePopulation: '',
    femalePopulation: '',
    households: ''
  });

  useEffect(() => {
    loadVillages();
  }, []);

  // Auto-calculate total population
  useEffect(() => {
    const male = parseInt(formData.malePopulation) || 0;
    const female = parseInt(formData.femalePopulation) || 0;
    const total = male + female;
    setFormData(prev => ({
      ...prev,
      population: total > 0 ? total.toString() : ''
    }));
  }, [formData.malePopulation, formData.femalePopulation]);

  const loadVillages = async () => {
    try {
      setLoading(true);
      const data = await villagesApi.getAllForMap();
      setVillages(data);
      toast.success(`โหลดข้อมูล ${data.length} หมู่บ้านสำเร็จ`);
    } catch (error: any) {
      console.error('Error loading villages:', error);
      toast.error('ไม่สามารถโหลดข้อมูลหมู่บ้านได้');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingVillage(null);
    setFormData({
      name: '',
      moo: '',
      province: 'เชียงใหม่',
      district: 'ฝาง',
      subdistrict: 'เวียง',
      lat: '',
      lng: '',
      population: '',
      malePopulation: '',
      femalePopulation: '',
      households: ''
    });
    setShowModal(true);
  };

  const handleEdit = (village: LeafletVillage) => {
    setEditingVillage(village);
    setFormData({
      name: village.name,
      moo: village.moo.toString(),
      province: 'เชียงใหม่',
      district: 'ฝาง',
      subdistrict: 'เวียง',
      lat: village.lat.toString(),
      lng: village.lng.toString(),
      population: village.population?.toString() || '',
      malePopulation: '',
      femalePopulation: '',
      households: village.households?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (village: LeafletVillage) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      html: `คุณต้องการลบหมู่บ้าน<br><strong>${village.name} (หมู่ ${village.moo})</strong><br>ใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await villagesApi.delete(village.id);
        toast.success('ลบหมู่บ้านสำเร็จ');
        loadVillages();
      } catch (error: any) {
        console.error('Error deleting village:', error);
        const message = error.response?.data?.message || 'ไม่สามารถลบหมู่บ้านได้';
        toast.error(message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare data - remove undefined values for update
      const villageData: any = {
        name: formData.name,
        province: formData.province,
        district: formData.district,
        subdistrict: formData.subdistrict,
      };

      // Add villageNo only for create (not for update)
      if (!editingVillage) {
        villageData.villageNo = parseInt(formData.moo);
      }

      // Add optional fields only if they have values
      if (formData.lat) villageData.lat = parseFloat(formData.lat);
      if (formData.lng) villageData.lng = parseFloat(formData.lng);
      if (formData.population) villageData.population = parseInt(formData.population);
      if (formData.malePopulation) villageData.malePopulation = parseInt(formData.malePopulation);
      if (formData.femalePopulation) villageData.femalePopulation = parseInt(formData.femalePopulation);
      if (formData.households) villageData.households = parseInt(formData.households);

      console.log('Submitting village data:', villageData);

      if (editingVillage) {
        // Update village
        await villagesApi.update(editingVillage.id, villageData);
        toast.success('อัปเดตข้อมูลหมู่บ้านสำเร็จ');
      } else {
        // Create village
        await villagesApi.create(villageData);
        toast.success('เพิ่มหมู่บ้านใหม่สำเร็จ');
      }
      setShowModal(false);
      loadVillages();
    } catch (error: any) {
      console.error('Error saving village:', error);
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      toast.error(message);
    }
  };

  const filteredVillages = villages.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.moo.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="manage-villages-page">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="manage-villages-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>🏘️ จัดการข้อมูลหมู่บ้าน</h1>
            <p className="subtitle">ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่</p>
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            ➕ เพิ่มหมู่บ้านใหม่
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <StatCard
            title="หมู่บ้านทั้งหมด"
            value={villages.length}
            icon="🏘️"
            color="blue"
            loading={loading}
          />
          <StatCard
            title="ประชากรชาย"
            value={villages.reduce((sum, v) => sum + (v.malePopulation || 0), 0).toLocaleString()}
            icon="👨"
            color="blue"
            loading={loading}
          />
          <StatCard
            title="ประชากรหญิง"
            value={villages.reduce((sum, v) => sum + (v.femalePopulation || 0), 0).toLocaleString()}
            icon="👩"
            color="purple"
            loading={loading}
          />
          <StatCard
            title="ประชากรรวม"
            value={villages.reduce((sum, v) => sum + (v.population || 0), 0).toLocaleString()}
            icon="👥"
            color="purple"
            loading={loading}
          />
          <StatCard
            title="ครัวเรือนรวม"
            value={villages.reduce((sum, v) => sum + (v.households || 0), 0).toLocaleString()}
            icon="🏠"
            color="green"
            loading={loading}
          />
          <StatCard
            title="มีขอบเขต"
            value={villages.filter(v => v.boundary && v.boundary.length > 0).length}
            icon="🗺️"
            color="orange"
            loading={loading}
          />
        </div>

        {/* หมายเหตุ */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#fff3f3',
          border: '1px solid #ffcdd2',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            color: '#c62828',
            fontSize: '0.9rem',
            margin: 0,
            fontWeight: 500
          }}>
            <span style={{ marginRight: '8px' }}>⚠️</span>
            <strong>หมายเหตุ:</strong> ประชากรในเขตพื้นที่ที่แสดงไว้ไม่รวมประชากรแฝงในเขตพื้นที่
          </p>
        </div>

        {/* Search */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="ค้นหาชื่อหมู่บ้าน หรือหมู่ที่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-results">
            พบ {filteredVillages.length} หมู่บ้าน
          </div>
        </div>

        {/* Villages Table */}
        <div className="table-container">
          <table className="villages-table">
            <thead>
              <tr>
                <th>หมู่ที่</th>
                <th>ชื่อหมู่บ้าน</th>
                <th>พิกัด (Lat, Lng)</th>
                <th>ประชากรชาย</th>
                <th>ประชากรหญิง</th>
                <th>ประชากรรวม</th>
                <th>ครัวเรือน</th>
                <th>ขอบเขต</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredVillages.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    ไม่พบข้อมูลหมู่บ้าน
                  </td>
                </tr>
              ) : (
                filteredVillages.map((village) => (
                  <tr key={village.id}>
                    <td>
                      <span className="moo-badge">หมู่ {village.moo}</span>
                    </td>
                    <td>
                      <strong>{village.name}</strong>
                    </td>
                    <td className="coordinates">
                      <div>{village.lat.toFixed(6)}</div>
                      <div>{village.lng.toFixed(6)}</div>
                    </td>
                    <td>{village.malePopulation?.toLocaleString() || '-'}</td>
                    <td>{village.femalePopulation?.toLocaleString() || '-'}</td>
                    <td>{village.population?.toLocaleString() || '-'}</td>
                    <td>{village.households?.toLocaleString() || '-'}</td>
                    <td>
                      {village.boundary && village.boundary.length > 0 ? (
                        <span className="badge badge-success">
                          ✅ มีขอบเขต
                        </span>
                      ) : (
                        <span className="badge badge-warning">⚠️ ยังไม่มี</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(village)}
                          title="แก้ไข"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(village)}
                          title="ลบ"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingVillage ? '✏️ แก้ไขข้อมูลหมู่บ้าน' : '➕ เพิ่มหมู่บ้านใหม่'}</h2>
                <button className="btn-close" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>ชื่อหมู่บ้าน *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="เช่น บ้านสันทราย"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>หมู่ที่ *</label>
                    <input
                      type="number"
                      value={formData.moo}
                      onChange={(e) => setFormData({ ...formData, moo: e.target.value })}
                      placeholder="เช่น 1"
                      required
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>จังหวัด *</label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      required
                    >
                      <option value="เชียงใหม่">เชียงใหม่</option>
                      <option value="เชียงราย">เชียงราย</option>
                      <option value="ลำปาง">ลำปาง</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>อำเภอ *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      required
                    >
                      <option value="ฝาง">ฝาง</option>
                      <option value="เมือง">เมือง</option>
                      <option value="แม่อาย">แม่อาย</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>ตำบล *</label>
                    <select
                      value={formData.subdistrict}
                      onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                      required
                    >
                      <option value="เวียง">เวียง</option>
                      <option value="แม่ข่า">แม่ข่า</option>
                      <option value="สันทราย">สันทราย</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label>Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={formData.lat}
                          onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                          placeholder="เช่น 19.9167"
                        />
                      </div>
                      <div>
                        <label>Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={formData.lng}
                          onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                          placeholder="เช่น 99.2333"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>จำนวนครัวเรือน</label>
                    <input
                      type="number"
                      value={formData.households}
                      onChange={(e) => setFormData({ ...formData, households: e.target.value })}
                      placeholder="เช่น 350"
                      min="0"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label>ประชากรชาย</label>
                        <input
                          type="number"
                          value={formData.malePopulation}
                          onChange={(e) => setFormData({ ...formData, malePopulation: e.target.value })}
                          placeholder="เช่น 750"
                          min="0"
                        />
                      </div>
                      <div>
                        <label>ประชากรหญิง</label>
                        <input
                          type="number"
                          value={formData.femalePopulation}
                          onChange={(e) => setFormData({ ...formData, femalePopulation: e.target.value })}
                          placeholder="เช่น 750"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>จำนวนประชากรรวม</label>
                    <input
                      type="number"
                      value={formData.population}
                      placeholder="คำนวณจาก ชาย + หญิง"
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingVillage ? '💾 บันทึกการแก้ไข' : '➕ เพิ่มหมู่บ้าน'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
