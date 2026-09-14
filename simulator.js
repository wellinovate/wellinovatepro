/**
 * Wellinovate Clinical Simulator — welliRecord & welliID Interactive Engine
 * Simulates unified electronic health record intake, cryptographic identity
 * consensus verification, telemetry streaming, and interoperability events.
 */

const PERSONAS = {
  amara: {
    id: 'amara',
    name: 'Amara Okafor',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O+',
    welliId: 'WID-9824-771B',
    condition: 'Antenatal Care (32 Weeks) & Routine Screen',
    allergies: ['Penicillin (Severe anaphylaxis)', 'Shellfish'],
    vitals: { hr: 76, bp: '116/74', spo2: 99, temp: 36.6, glucose: 88 },
    telemetryStatus: 'Optimal Maternal-Fetal Vitals',
    qrHash: '0x9f8ca412e8b019df77cb5432a188f01b',
    timeline: [
      {
        date: 'Today, 10:15 AM',
        facility: 'Lagoon Health Hub, Ikoyi',
        specialty: 'Obstetric Ultrasound & Biometry',
        tag: 'Imaging Direct',
        tagType: 'accent',
        hash: '0x7e8b...21a0',
        summary: 'Fetal biometry concordant with 32w2d gestational age. Normal amniotic fluid index (14.2 cm). Anterior placenta, grade II maturity. Normal Doppler indices.'
      },
      {
        date: '3 Weeks Ago',
        facility: 'General Hospital Garki, Abuja',
        specialty: 'Antenatal Screen & Serology',
        tag: 'Lab Direct',
        tagType: 'neutral',
        hash: '0x3c11...99ef',
        summary: 'Hemoglobin: 11.4 g/dL. Fasting blood sugar: 84 mg/dL. Urinalysis negative for proteinuria. Rhesus positive confirmed via welliID.'
      },
      {
        date: '2 Months Ago',
        facility: 'St. Nicholas Hospital, Lagos',
        specialty: 'Prenatal Multivitamin & Iron Therapy',
        tag: 'WelliPharm',
        tagType: 'accent-2',
        hash: '0x4d90...55ab',
        summary: 'Ferrous sulfate 200mg daily + Folic Acid 5mg daily. Verified via WelliPharm drug-interaction engine: 0 contraindications with penicillin allergy profile.'
      }
    ]
  },
  babatunde: {
    id: 'babatunde',
    name: 'Babatunde Adeleke',
    age: 42,
    gender: 'Male',
    bloodGroup: 'A+',
    welliId: 'WID-4109-883K',
    condition: 'Acute Trauma & Emergency Triage',
    allergies: ['Sulfa drugs', 'NSAIDs (Severe GI sensitivity)'],
    vitals: { hr: 94, bp: '136/84', spo2: 97, temp: 37.1, glucose: 110 },
    telemetryStatus: 'Emergency Stabilization Active',
    qrHash: '0x31a8f902dc45e8910aa61427cc78912e',
    timeline: [
      {
        date: 'Today, 11:42 AM',
        facility: 'Rapid Response Unit 04 (Lagos Metro)',
        specialty: 'Emergency Triage & Vital Stabilization',
        tag: 'Emergency Response',
        tagType: 'accent-2',
        hash: '0xaa19...77de',
        summary: 'Blunt thoracic trauma post-transit incident. Rigid cervical collar applied. Bilateral breath sounds equal. Peripheral IV access secured with normal saline infusion.'
      },
      {
        date: '1 Month Ago',
        facility: 'Reddington Hospital, Victoria Island',
        specialty: 'Annual Executive Health Screen',
        tag: 'Clinical Audit',
        tagType: 'accent',
        hash: '0x88c2...14fa',
        summary: 'Cardiovascular stress test negative for ischemia. Total cholesterol: 192 mg/dL. Resting ECG: Normal sinus rhythm. Liver transaminases within normal reference limits.'
      }
    ]
  },
  chidinma: {
    id: 'chidinma',
    name: 'Chidinma Eze',
    age: 58,
    gender: 'Female',
    bloodGroup: 'B+',
    welliId: 'WID-6231-504P',
    condition: 'Chronic Hypertension & Type 2 Diabetes Monitor',
    allergies: ['No Known Drug Allergies (NKDA)'],
    vitals: { hr: 68, bp: '128/82', spo2: 98, temp: 36.5, glucose: 124 },
    telemetryStatus: 'Chronic Care Plan Synchronized',
    qrHash: '0x8854bb9114f091deaa22784532cba991',
    timeline: [
      {
        date: 'Yesterday, 04:30 PM',
        facility: 'WelliMate Remote Clinic (Home IoT)',
        specialty: 'Home Telemetry Ingestion — Fasting Glucose',
        tag: 'IoT Telemetry',
        tagType: 'neutral',
        hash: '0x55bc...4411',
        summary: 'Automated Bluetooth telemetry ingestion. Fasting capillary glucose: 124 mg/dL. 14-day trending average down 6.8%. Patient adherence flag: 98%.'
      },
      {
        date: '2 Weeks Ago',
        facility: 'Prime Care Cardiology, Ikeja',
        specialty: 'Antihypertensive Regimen Adjustment',
        tag: 'WelliCare',
        tagType: 'accent',
        hash: '0x22df...6632',
        summary: 'Amlodipine 5mg titrated to 10mg daily. Renal function panel confirmed eGFR > 90 mL/min. Electrolytes within normal limits. 24-hr ambulatory monitoring ordered.'
      }
    ]
  }
};

class ClinicalSimulator {
  constructor() {
    this.currentPersonaKey = 'amara';
    this.isVerified = false;
    this.vitalsInterval = null;
    this.modal = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.modal = document.getElementById('clinical-simulator-modal');
    if (!this.modal) return;

    this.bindEvents();
    this.renderPersona(this.currentPersonaKey);
    this.startVitalsSimulation();
  }

  bindEvents() {
    // Open triggers across pages
    document.querySelectorAll('[data-action="open-simulator"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close button
    const closeBtn = this.modal.querySelector('[data-action="close-simulator"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click
    this.modal.addEventListener('click', (e) => {
      const modalBox = this.modal.querySelector('.sim-dialog');
      if (modalBox && !modalBox.contains(e.target)) {
        this.close();
      }
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Persona Selector Switch
    const personaTabs = this.modal.querySelectorAll('[data-persona]');
    personaTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-persona');
        if (key && PERSONAS[key]) {
          personaTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.isVerified = false;
          this.renderPersona(key);
        }
      });
    });

    // QR Scan / Verify Consent Button
    const scanBtn = this.modal.querySelector('#sim-scan-btn');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => this.triggerVerification());
    }

    // Quick Clinical Action Button
    const addNoteBtn = this.modal.querySelector('#sim-add-note-btn');
    const noteInput = this.modal.querySelector('#sim-note-input');
    if (addNoteBtn && noteInput) {
      addNoteBtn.addEventListener('click', () => {
        const text = noteInput.value.trim();
        if (text) {
          this.appendEncounterNote(text);
          noteInput.value = '';
        }
      });
    }

    // Quick template pills
    this.modal.querySelectorAll('.sim-preset-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (noteInput) {
          noteInput.value = pill.textContent.trim();
          noteInput.focus();
        }
      });
    });
  }

  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.renderPersona(this.currentPersonaKey);
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  renderPersona(key) {
    this.currentPersonaKey = key;
    const p = PERSONAS[key];
    if (!p) return;

    const nameEl = this.modal.querySelector('#sim-patient-name');
    const metaEl = this.modal.querySelector('#sim-patient-meta');
    const idEl = this.modal.querySelector('#sim-patient-id');
    const condEl = this.modal.querySelector('#sim-patient-condition');
    const allergyEl = this.modal.querySelector('#sim-patient-allergies');
    const qrText = this.modal.querySelector('#sim-qr-subtext');

    if (nameEl) nameEl.textContent = p.name;
    if (metaEl) metaEl.textContent = `${p.age} yrs • ${p.gender} • Blood Group ${p.bloodGroup}`;
    if (idEl) idEl.textContent = p.welliId;
    if (condEl) condEl.textContent = p.condition;
    
    if (allergyEl) {
      allergyEl.innerHTML = p.allergies.map(a => 
        `<span class="sim-allergy-tag ${a.toLowerCase().includes('severe') ? 'severe' : ''}">${a}</span>`
      ).join(' ');
    }

    if (qrText) {
      qrText.textContent = `WelliID Token: ${p.welliId}`;
    }

    this.updateVerificationUI();
    this.renderVitals(p.vitals);
    this.renderTimeline(p.timeline);
  }

  renderVitals(v) {
    const hrEl = this.modal.querySelector('#sim-vital-hr');
    const bpEl = this.modal.querySelector('#sim-vital-bp');
    const spo2El = this.modal.querySelector('#sim-vital-spo2');
    const tempEl = this.modal.querySelector('#sim-vital-temp');
    const glucEl = this.modal.querySelector('#sim-vital-gluc');

    if (hrEl) hrEl.textContent = `${v.hr} bpm`;
    if (bpEl) bpEl.textContent = `${v.bp} mmHg`;
    if (spo2El) spo2El.textContent = `${v.spo2}%`;
    if (tempEl) tempEl.textContent = `${v.temp} °C`;
    if (glucEl) glucEl.textContent = `${v.glucose} mg/dL`;
  }

  renderTimeline(timeline) {
    const listEl = this.modal.querySelector('#sim-timeline-list');
    if (!listEl) return;

    listEl.innerHTML = timeline.map(item => `
      <div class="sim-timeline-item">
        <div class="sim-item-header">
          <span class="sim-item-facility">${item.facility}</span>
          <span class="sim-item-date">${item.date}</span>
        </div>
        <div class="sim-item-title-row">
          <h4 class="sim-item-title">${item.specialty}</h4>
          <span class="tag tag-${item.tagType || 'accent'}">${item.tag}</span>
        </div>
        <p class="sim-item-summary">${item.summary}</p>
        <div class="sim-item-footer">
          <span class="sim-hash-stamp">Consensus Hash: <code>${item.hash}</code></span>
          <span class="sim-badge-ok">✓ Encrypted Block</span>
        </div>
      </div>
    `).join('');
  }

  triggerVerification() {
    const scannerLaser = this.modal.querySelector('.sim-qr-laser');
    const scanStatus = this.modal.querySelector('#sim-scan-status');
    const scanBtn = this.modal.querySelector('#sim-scan-btn');

    if (!scannerLaser || !scanStatus || !scanBtn) return;

    scannerLaser.classList.add('scanning');
    scanBtn.disabled = true;
    scanBtn.innerHTML = `
      <span class="sim-spinner"></span>
      Verifying on WelliID Consensus...
    `;
    scanStatus.className = 'sim-status-banner checking';
    scanStatus.textContent = 'Contacting 4 network validation nodes (Hospital, Clinic, Lab, Registry)...';

    setTimeout(() => {
      scannerLaser.classList.remove('scanning');
      this.isVerified = true;
      this.updateVerificationUI();
    }, 1200);
  }

  updateVerificationUI() {
    const scanStatus = this.modal.querySelector('#sim-scan-status');
    const scanBtn = this.modal.querySelector('#sim-scan-btn');
    const p = PERSONAS[this.currentPersonaKey];

    if (!scanStatus || !scanBtn) return;

    if (this.isVerified) {
      scanStatus.className = 'sim-status-banner verified';
      scanStatus.innerHTML = `
        <strong>✓ Patient Identity &amp; Consent Verified</strong>
        <span>WelliID: <code>${p.welliId}</code> • Token: <code>${p.qrHash.slice(0, 14)}...</code> • Attending Access Granted</span>
      `;
      scanBtn.disabled = false;
      scanBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Consent Verified (Re-scan)
      `;
    } else {
      scanStatus.className = 'sim-status-banner pending';
      scanStatus.textContent = 'Scan required to authorize biometric/EHR write transactions';
      scanBtn.disabled = false;
      scanBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg>
        Scan Patient Badge &amp; Verify Consent
      `;
    }
  }

  appendEncounterNote(noteText) {
    const listEl = this.modal.querySelector('#sim-timeline-list');
    if (!listEl) return;

    const newTxHash = '0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6);
    const newEncounter = {
      facility: 'Current Clinical Terminal (Attending Physician)',
      date: 'Just now',
      specialty: 'Clinical Note & Order Entry',
      tag: 'Real-time Sync',
      tagType: 'accent',
      hash: newTxHash,
      summary: noteText
    };

    PERSONAS[this.currentPersonaKey].timeline.unshift(newEncounter);

    const div = document.createElement('div');
    div.className = 'sim-timeline-item sim-just-added';
    div.innerHTML = `
      <div class="sim-item-header">
        <span class="sim-item-facility">${newEncounter.facility}</span>
        <span class="sim-item-date">${newEncounter.date}</span>
      </div>
      <div class="sim-item-title-row">
        <h4 class="sim-item-title">${newEncounter.specialty}</h4>
        <span class="tag tag-accent">${newEncounter.tag}</span>
      </div>
      <p class="sim-item-summary">${newEncounter.summary}</p>
      <div class="sim-item-footer">
        <span class="sim-hash-stamp">Consensus Hash: <code>${newEncounter.hash}</code></span>
        <span class="sim-badge-ok">✓ Encrypted Block Appended</span>
      </div>
    `;

    listEl.prepend(div);
  }

  startVitalsSimulation() {
    if (this.vitalsInterval) clearInterval(this.vitalsInterval);

    this.vitalsInterval = setInterval(() => {
      if (!this.modal || !this.modal.classList.contains('active')) return;

      const p = PERSONAS[this.currentPersonaKey];
      if (!p) return;

      const deltaHr = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.6 ? 1 : 0);
      const currentHr = Math.max(55, Math.min(130, p.vitals.hr + deltaHr));
      p.vitals.hr = currentHr;

      const hrEl = this.modal.querySelector('#sim-vital-hr');
      if (hrEl) {
        hrEl.textContent = `${currentHr} bpm`;
        hrEl.classList.add('pulse');
        setTimeout(() => hrEl.classList.remove('pulse'), 400);
      }
    }, 2800);
  }
}

const simulator = new ClinicalSimulator();
export default simulator;
