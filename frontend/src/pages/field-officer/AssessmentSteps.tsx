import type { AssessmentData } from './DetailedAssessmentPage';

interface AssessmentStepsProps {
  currentStep: number;
  formData: AssessmentData;
  updateField: (field: keyof AssessmentData, value: string) => void;
  task: any;
}

export function AssessmentSteps({ currentStep, formData, updateField, task }: AssessmentStepsProps) {
  
  if (currentStep === 1) {
    return (
      <div className="step-content">
        <h2>📋 ข้อมูลจากการสำรวจเบื้องต้น</h2>
        <p className="step-desc">ข้อมูลจากทีมสำรวจเบื้องต้น (อ่านอย่างเดียว)</p>
        
        <div className="initial-data-card">
          <h3>📍 ข้อมูลพื้นฐาน</h3>
          <div className="data-grid">
            <div className="data-item">
              <span className="label">สถานที่:</span>
              <span className="value">{task.location}</span>
            </div>
            <div className="data-item">
              <span className="label">ประเภทภัย:</span>
              <span className="value">น้ำท่วม</span>
            </div>
            <div className="data-item">
              <span className="label">ครัวเรือน (ประมาณ):</span>
              <span className="value">50 ครัวเรือน</span>
            </div>
            <div className="data-item">
              <span className="label">ความรุนแรง:</span>
              <span className="value">3/5</span>
            </div>
          </div>
        </div>

        <div className="initial-data-card">
          <h3>🗺️ แผนที่และพื้นที่</h3>
          <div className="map-placeholder">
            <p>🗺️ แผนที่พื้นที่ที่ได้รับผลกระทบ</p>
            <p className="small-text">Polygon และ GPS จากการสำรวจเบื้องต้น</p>
          </div>
        </div>

        <div className="initial-data-card">
          <h3>📷 รูปถ่าย</h3>
          <div className="photos-grid">
            <div className="photo-placeholder">📷 รูปที่ 1</div>
            <div className="photo-placeholder">📷 รูปที่ 2</div>
            <div className="photo-placeholder">📷 รูปที่ 3</div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="step-content">
        <h2>👥 ความเสียหายครัวเรือน</h2>
        <p className="step-desc">ข้อมูลผู้ประสบภัยและครัวเรือน</p>
        
        <div className="form-section">
          <h3>จำนวนครัวเรือนและประชากร</h3>
          <div className="form-row">
            <div className="form-group">
              <label>จำนวนครัวเรือนที่ประสบภัย *</label>
              <input type="number" min="0" value={formData.affectedHouseholds} onChange={(e) => updateField('affectedHouseholds', e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ชาย (คน)</label>
              <input type="number" min="0" value={formData.peopleMale} onChange={(e) => updateField('peopleMale', e.target.value)} />
            </div>
            <div className="form-group">
              <label>หญิง (คน)</label>
              <input type="number" min="0" value={formData.peopleFemale} onChange={(e) => updateField('peopleFemale', e.target.value)} />
            </div>
            <div className="form-group">
              <label>เด็ก (คน)</label>
              <input type="number" min="0" value={formData.peopleChildren} onChange={(e) => updateField('peopleChildren', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>ผู้ได้รับผลกระทบ</h3>
          <div className="form-row">
            <div className="form-group">
              <label>ผู้บาดเจ็บ (คน)</label>
              <input type="number" min="0" value={formData.injured} onChange={(e) => updateField('injured', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ผู้เสียชีวิต (คน)</label>
              <input type="number" min="0" value={formData.deceased} onChange={(e) => updateField('deceased', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ผู้พิการ (คน)</label>
              <input type="number" min="0" value={formData.disabled} onChange={(e) => updateField('disabled', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ผู้สูงอายุ (คน)</label>
              <input type="number" min="0" value={formData.elderly} onChange={(e) => updateField('elderly', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="step-content">
        <h2>🏠 ความเสียหายทรัพย์สิน</h2>
        <p className="step-desc">บ้าน เครื่องใช้ไฟฟ้า และยานพาหนะ</p>
        
        <div className="form-section">
          <h3>บ้านเรือน</h3>
          <div className="form-row">
            <div className="form-group">
              <label>พังทั้งหลัง (หลัง)</label>
              <input type="number" min="0" value={formData.housesDestroyed} onChange={(e) => updateField('housesDestroyed', e.target.value)} />
            </div>
            <div className="form-group">
              <label>เสียหายบางส่วน (หลัง)</label>
              <input type="number" min="0" value={formData.housesDamaged} onChange={(e) => updateField('housesDamaged', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>เครื่องใช้ไฟฟ้า</h3>
          <div className="form-row">
            <div className="form-group">
              <label>ตู้เย็น (เครื่อง)</label>
              <input type="number" min="0" value={formData.refrigerators} onChange={(e) => updateField('refrigerators', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ทีวี (เครื่อง)</label>
              <input type="number" min="0" value={formData.tvs} onChange={(e) => updateField('tvs', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>เครื่องซักผ้า (เครื่อง)</label>
              <input type="number" min="0" value={formData.washingMachines} onChange={(e) => updateField('washingMachines', e.target.value)} />
            </div>
            <div className="form-group">
              <label>พัดลม/แอร์ (เครื่อง)</label>
              <input type="number" min="0" value={formData.fans} onChange={(e) => updateField('fans', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>ยานพาหนะ</h3>
          <div className="form-row">
            <div className="form-group">
              <label>รถยนต์ (คัน)</label>
              <input type="number" min="0" value={formData.cars} onChange={(e) => updateField('cars', e.target.value)} />
            </div>
            <div className="form-group">
              <label>จักรยานยนต์ (คัน)</label>
              <input type="number" min="0" value={formData.motorcycles} onChange={(e) => updateField('motorcycles', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="step-content">
        <h2>🌾 ความเสียหายการเกษตร</h2>
        <p className="step-desc">นาข้าว พืชผล และสวนผลไม้</p>
        
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>นาข้าว (ไร่)</label>
              <input type="number" min="0" step="0.01" value={formData.riceFields} onChange={(e) => updateField('riceFields', e.target.value)} />
            </div>
            <div className="form-group">
              <label>สวนผลไม้ (ไร่)</label>
              <input type="number" min="0" step="0.01" value={formData.orchards} onChange={(e) => updateField('orchards', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ชนิดพืชผล</label>
              <input type="text" placeholder="เช่น ข้าวโพด, มันสำปะหลัง" value={formData.cropsType} onChange={(e) => updateField('cropsType', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ปริมาณ (กก./ตัน)</label>
              <input type="text" placeholder="เช่น 500 กก." value={formData.crops} onChange={(e) => updateField('crops', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>มูลค่าโดยประมาณ (บาท)</label>
            <input type="number" min="0" placeholder="0" value={formData.agricultureValue} onChange={(e) => updateField('agricultureValue', e.target.value)} />
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="step-content">
        <h2>🐄 ความเสียหายสัตว์เลี้ยง</h2>
        <p className="step-desc">วัว ควาย หมู ไก่ และสัตว์อื่นๆ</p>
        
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>วัว (ตัว)</label>
              <input type="number" min="0" value={formData.cattle} onChange={(e) => updateField('cattle', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ควาย (ตัว)</label>
              <input type="number" min="0" value={formData.buffalo} onChange={(e) => updateField('buffalo', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>หมู (ตัว)</label>
              <input type="number" min="0" value={formData.pigs} onChange={(e) => updateField('pigs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ไก่/เป็ด (ตัว)</label>
              <input type="number" min="0" value={formData.poultry} onChange={(e) => updateField('poultry', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>สัตว์อื่นๆ (ระบุ)</label>
            <input type="text" placeholder="เช่น แพะ 5 ตัว, ปลา 100 กก." value={formData.otherAnimals} onChange={(e) => updateField('otherAnimals', e.target.value)} />
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 6) {
    return (
      <div className="step-content">
        <h2>🏛️ สิ่งสาธารณะ</h2>
        <p className="step-desc">ถนน สะพาน ไฟฟ้า ประปา โรงเรียน วัด</p>
        
        <div className="form-section">
          <div className="form-group">
            <label>ถนน/สะพาน</label>
            <textarea rows={2} placeholder="ระบุชื่อถนน/สะพาน และความเสียหาย" value={formData.roads} onChange={(e) => updateField('roads', e.target.value)}></textarea>
          </div>

          <div className="form-group">
            <label>ไฟฟ้า/ประปา</label>
            <textarea rows={2} placeholder="ระบุความเสียหายของระบบสาธารณูปโภค" value={formData.utilities} onChange={(e) => updateField('utilities', e.target.value)}></textarea>
          </div>

          <div className="form-group">
            <label>โรงเรียน</label>
            <textarea rows={2} placeholder="ระบุชื่อโรงเรียนและความเสียหาย" value={formData.schools} onChange={(e) => updateField('schools', e.target.value)}></textarea>
          </div>

          <div className="form-group">
            <label>วัด/ศาลา</label>
            <textarea rows={2} placeholder="ระบุชื่อวัด/ศาลาและความเสียหาย" value={formData.temples} onChange={(e) => updateField('temples', e.target.value)}></textarea>
          </div>

          <div className="form-group">
            <label>สิ่งสาธารณะอื่นๆ</label>
            <textarea rows={2} placeholder="ระบุสิ่งสาธารณะอื่นๆ ที่ได้รับความเสียหาย" value={formData.otherInfra} onChange={(e) => updateField('otherInfra', e.target.value)}></textarea>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 7) {
    return (
      <div className="step-content">
        <h2>🚑 การบรรเทาภัย</h2>
        <p className="step-desc">มาตรการ ของช่วยเหลือ กำลังคน และงบประมาณ</p>
        
        <div className="form-section">
          <div className="form-group">
            <label>มาตรการที่ทำแล้ว</label>
            <textarea rows={3} placeholder="ระบุมาตรการที่ดำเนินการไปแล้ว" value={formData.reliefMeasures} onChange={(e) => updateField('reliefMeasures', e.target.value)}></textarea>
          </div>

          <h3>ของช่วยเหลือที่แจก</h3>
          <div className="form-row">
            <div className="form-group">
              <label>น้ำดื่ม (ขวด/แพ็ค)</label>
              <input type="text" placeholder="เช่น 500 ขวด" value={formData.waterBottles} onChange={(e) => updateField('waterBottles', e.target.value)} />
            </div>
            <div className="form-group">
              <label>อาหารแห้ง (ชุด/กก.)</label>
              <input type="text" placeholder="เช่น 100 ชุด" value={formData.dryFood} onChange={(e) => updateField('dryFood', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>เครื่องอุปโภคอื่นๆ</label>
            <textarea rows={2} placeholder="เช่น ผ้าห่ม, ยา, เสื้อผ้า" value={formData.supplies} onChange={(e) => updateField('supplies', e.target.value)}></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>กำลังคนที่ใช้ (คน)</label>
              <input type="number" min="0" placeholder="0" value={formData.personnel} onChange={(e) => updateField('personnel', e.target.value)} />
            </div>
            <div className="form-group">
              <label>งบประมาณที่ใช้ไป (บาท)</label>
              <input type="number" min="0" placeholder="0" value={formData.budget} onChange={(e) => updateField('budget', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 8) {
    return (
      <div className="step-content">
        <h2>📊 สรุปและส่งรายงาน</h2>
        <p className="step-desc">ตรวจสอบข้อมูลและส่งรายงานฉบับเต็ม</p>
        
        <div className="summary-section">
          <h3>สรุปข้อมูล</h3>
          
          <div className="summary-card">
            <h4>👥 ครัวเรือนและประชากร</h4>
            <p>ครัวเรือน: {formData.affectedHouseholds || '0'}</p>
            <p>ประชากร: {(Number(formData.peopleMale) + Number(formData.peopleFemale) + Number(formData.peopleChildren)) || '0'} คน</p>
            <p>ผู้บาดเจ็บ: {formData.injured || '0'} คน | ผู้เสียชีวิต: {formData.deceased || '0'} คน</p>
          </div>

          <div className="summary-card">
            <h4>🏠 ทรัพย์สิน</h4>
            <p>บ้านพังทั้งหลัง: {formData.housesDestroyed || '0'} หลัง</p>
            <p>บ้านเสียหายบางส่วน: {formData.housesDamaged || '0'} หลัง</p>
            <p>เครื่องใช้ไฟฟ้า: {(Number(formData.refrigerators) + Number(formData.tvs) + Number(formData.washingMachines) + Number(formData.fans)) || '0'} เครื่อง</p>
          </div>

          <div className="summary-card">
            <h4>🌾 การเกษตร</h4>
            <p>นาข้าว: {formData.riceFields || '0'} ไร่</p>
            <p>มูลค่า: {formData.agricultureValue || '0'} บาท</p>
          </div>

          <div className="summary-card">
            <h4>🚑 การบรรเทา</h4>
            <p>กำลังคน: {formData.personnel || '0'} คน</p>
            <p>งบประมาณ: {formData.budget || '0'} บาท</p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>ความคิดเห็นเพิ่มเติม</label>
            <textarea rows={4} placeholder="หมายเหตุหรือข้อมูลเพิ่มเติม..." value={formData.additionalComments} onChange={(e) => updateField('additionalComments', e.target.value)}></textarea>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
