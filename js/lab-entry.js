// LAB ENTRY & ANALYSIS MODULE
// Allows user to add weekly labs and get instant trend analysis

class LabTracker {
    constructor() {
        this.storageKey = 'ericMillerLabResults';
        this.labs = this.loadLabs();
        
        // Versioning check: if the user has fewer labs than our new default dataset, update to include the new data
        const defaultLabs = this.getDefaultLabs();
        if (this.labs.length < defaultLabs.length) {
            this.labs = defaultLabs;
            this.saveLabs();
            console.log("Updated localStorage labs data to latest version.");
        }

        this.referenceRanges = {
            wbc: { min: 4.0, max: 11.0, unit: 'K/μL', name: 'WBC' },
            hemoglobin: { min: 13.5, max: 17.0, unit: 'g/dL', name: 'Hemoglobin' },
            platelets: { min: 130, max: 450, unit: 'K/μL', name: 'Platelets' },
            anc: { min: 1.5, max: 7.8, unit: 'K/μL', name: 'ANC' },
            alc: { min: 0.9, max: 3.9, unit: 'K/μL', name: 'ALC' },
            creatinine: { min: 0.68, max: 1.37, unit: 'mg/dL', name: 'Creatinine' },
            egfr: { min: 60, max: 150, unit: 'mL/min', name: 'eGFR' },
            calcium: { min: 8.7, max: 10.4, unit: 'mg/dL', name: 'Calcium' },
            sodium: { min: 135, max: 145, unit: 'mmol/L', name: 'Sodium' },
            chloride: { min: 98, max: 108, unit: 'mmol/L', name: 'Chloride' },
            glucose: { min: 70, max: 99, unit: 'mg/dL', name: 'Glucose' },
            freeKappa: { min: 0.33, max: 1.94, unit: 'mg/L', name: 'Free Kappa' },
            mSpike: { min: 0, max: 0.3, unit: 'g/dL', name: 'M-Spike' },
            b2m: { min: 0.8, max: 2.4, unit: 'mg/L', name: 'Beta-2-Microglobulin' }
        };
    }

    loadLabs() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : this.getDefaultLabs();
        } catch (e) {
            return this.getDefaultLabs();
        }
    }

    getDefaultLabs() {
        return [
            { date: '2025-11-07', week: 'Baseline', wbc: 7.8, hemoglobin: 14.2, platelets: 245, freeKappa: 655.69, ratio: 52.41, mSpike: 1.07 },
            { date: '2025-12-26', week: 'Day 5', wbc: 9.4, hemoglobin: 16.4, platelets: 293, anc: 5.3, alc: 3.1 },
            { date: '2026-01-02', week: 'Week 2', wbc: 7.2, hemoglobin: 15.3, platelets: 203, anc: 4.1, alc: 2.3 },
            { date: '2026-01-09', week: 'Week 3', wbc: 9.0, hemoglobin: 17.0, platelets: 241, anc: 6.2, alc: 2.0, creatinine: 0.78, egfr: 103, sodium: 134, chloride: 92, calcium: 9.5 },
            { date: '2026-01-16', week: 'Week 4', wbc: 7.2, hemoglobin: 15.8, platelets: 254, anc: 4.1, alc: 2.3, creatinine: 0.76, egfr: 104, sodium: 134, calcium: 9.2, glucose: 103 },
            { date: '2026-01-23', week: 'Week 5', wbc: 10.3, hemoglobin: 15.8, platelets: 279, anc: 6.3, alc: 2.5 },
            { date: '2026-01-30', week: 'Week 9', wbc: 8.7, hemoglobin: 15.0, platelets: 237, anc: 5.5, alc: 2.1, creatinine: 0.75, egfr: 104, sodium: 134, chloride: 90, calcium: 9.6, glucose: 97, freeKappa: 96.07, ratio: 14.47, mSpike: 0.63, b2m: 1.8 },
            { date: '2026-02-04', week: 'Week 10', wbc: 13.5, hemoglobin: 15.1, platelets: 262, anc: 11.6, alc: 0.7, creatinine: 0.83, egfr: 101, sodium: 127, chloride: 85, calcium: 10.2, glucose: 116 },
            { date: '2026-02-05', week: 'Week 11', wbc: 10.2, hemoglobin: 15.1, platelets: 252, anc: 6.3, alc: 2.3, creatinine: 0.70, egfr: 106, sodium: 128, chloride: 88, calcium: 9.4, glucose: 86, freeKappa: 52.48, ratio: 18.48, mSpike: 0.75, b2m: 1.3 },
            { date: '2026-04-16', week: 'Week 21', wbc: 6.2, hemoglobin: 14.2, platelets: 188, anc: 3.6, alc: 1.8 },
            { date: '2026-04-30', week: 'Week 23', wbc: 6.0, hemoglobin: 15.5, platelets: 272, anc: 3.2, alc: 1.8, creatinine: 0.74, egfr: 105, sodium: 136, chloride: 94, calcium: 9.8, glucose: 84 },
            { date: '2026-05-14', week: 'Week 25', wbc: 8.8, hemoglobin: 14.9, platelets: 213, anc: 5.9, alc: 2.1 },
            { date: '2026-05-26', week: 'Week 27', wbc: 8.0, hemoglobin: 16.5, platelets: 257, anc: 5.3, alc: 1.8, creatinine: 0.70, egfr: 106, sodium: 139, chloride: 97, calcium: 10.4, glucose: 74, freeKappa: 64.74, ratio: 18.71, mSpike: 0.49, b2m: 1.8 },
            { date: '2026-05-29', week: 'Week 27 Follow-up', wbc: 8.0, hemoglobin: 15.9, platelets: 263, anc: 5.0, alc: 2.1, creatinine: 0.66, egfr: 108, sodium: 138, chloride: 98, calcium: 9.9, glucose: 88 }
        ];
    }

    saveLabs() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.labs));
    }

    addLab(labData) {
        const entry = {
            date: labData.date,
            week: labData.week || `Week ${this.labs.length}`,
            timestamp: new Date().toISOString(),
            ...labData
        };
        this.labs.push(entry);
        this.labs.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.saveLabs();
        return this.analyzeImpact(entry);
    }

    getStatus(value, key) {
        if (!value || !this.referenceRanges[key]) return { status: 'unknown', icon: '—' };
        const range = this.referenceRanges[key];
        if (value < range.min) return { status: 'low', icon: '⚠️ Low', class: 'text-yellow-600' };
        if (value > range.max) return { status: 'high', icon: '⚠️ High', class: 'text-red-600' };
        return { status: 'normal', icon: '✅ Normal', class: 'text-green-600' };
    }

    getTrend(key) {
        const values = this.labs.filter(l => l[key] !== undefined).map(l => ({ date: l.date, value: l[key] }));
        if (values.length < 2) return { trend: 'stable', icon: '—', change: 0 };

        const latest = values[values.length - 1].value;
        const previous = values[values.length - 2].value;
        const change = ((latest - previous) / previous * 100).toFixed(1);

        if (Math.abs(change) < 5) return { trend: 'stable', icon: '→', change, class: 'text-gray-500' };
        if (change > 0) return { trend: 'up', icon: '↑', change, class: 'text-green-600' };
        return { trend: 'down', icon: '↓', change, class: 'text-yellow-600' };
    }

    analyzeImpact(newEntry) {
        const analysis = {
            date: newEntry.date,
            week: newEntry.week,
            summary: [],
            concerns: [],
            positives: [],
            recommendations: []
        };

        // Analyze each value
        Object.keys(this.referenceRanges).forEach(key => {
            if (newEntry[key] !== undefined) {
                const status = this.getStatus(newEntry[key], key);
                const trend = this.getTrend(key);
                const range = this.referenceRanges[key];

                if (status.status === 'low') {
                    analysis.concerns.push(`${range.name}: ${newEntry[key]} ${range.unit} (Low - below ${range.min})`);
                } else if (status.status === 'high') {
                    analysis.concerns.push(`${range.name}: ${newEntry[key]} ${range.unit} (High - above ${range.max})`);
                } else {
                    analysis.positives.push(`${range.name}: ${newEntry[key]} ${range.unit} ✓`);
                }
            }
        });

        // Generate overall summary
        if (analysis.concerns.length === 0) {
            analysis.summary.push('🎉 Excellent! All values within normal range.');
        } else if (analysis.concerns.length <= 2) {
            analysis.summary.push(`⚠️ Minor concerns (${analysis.concerns.length}). Most values normal.`);
        } else {
            analysis.summary.push(`⚠️ Multiple values outside range. Discuss with your oncologist.`);
        }

        // Specific recommendations
        if (newEntry.sodium && newEntry.sodium < 135) {
            analysis.recommendations.push('💧 Low sodium detected - increase fluid intake and discuss electrolyte supplements.');
        }
        if (newEntry.anc && newEntry.anc < 1.5) {
            analysis.recommendations.push('🔴 Low neutrophils (ANC) - avoid crowds, report any fever immediately.');
        }
        if (newEntry.platelets && newEntry.platelets < 100) {
            analysis.recommendations.push('🩸 Low platelets - avoid injury, watch for unusual bruising/bleeding.');
        }
        if (newEntry.hemoglobin && newEntry.hemoglobin < 10) {
            analysis.recommendations.push('😴 Low hemoglobin - you may feel fatigued, consider iron-rich foods.');
        }
        if (newEntry.egfr && newEntry.egfr >= 90) {
            analysis.positives.push('🏆 Kidney function excellent!');
        }

        // Disease marker analysis
        if (newEntry.freeKappa) {
            const baseline = this.labs.find(l => l.week === 'Baseline');
            if (baseline && baseline.freeKappa) {
                const reduction = ((baseline.freeKappa - newEntry.freeKappa) / baseline.freeKappa * 100).toFixed(1);
                if (reduction >= 50) {
                    analysis.positives.push(`🎯 Free Kappa reduced by ${reduction}% from baseline - EXCELLENT RESPONSE!`);
                } else if (reduction > 0) {
                    analysis.summary.push(`📉 Free Kappa reduced ${reduction}% - trending in right direction.`);
                }
            }
        }

        return analysis;
    }

    getLatestLab() {
        return this.labs[this.labs.length - 1];
    }

    getAllLabs() {
        return this.labs;
    }

    getChartData(keys = ['wbc', 'hemoglobin', 'platelets']) {
        return {
            labels: this.labs.map(l => l.week),
            datasets: keys.map((key, i) => ({
                label: this.referenceRanges[key]?.name || key,
                data: this.labs.map(l => l[key] || null),
                borderColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
                tension: 0.3,
                fill: false
            }))
        };
    }

    exportCSV() {
        const headers = ['Date', 'Week', 'WBC', 'Hgb', 'Plt', 'ANC', 'ALC', 'Creat', 'eGFR', 'Na', 'Ca', 'FreeKappa', 'M-Spike'];
        const rows = this.labs.map(l => [
            l.date, l.week, l.wbc, l.hemoglobin, l.platelets, l.anc, l.alc,
            l.creatinine, l.egfr, l.sodium, l.calcium, l.freeKappa, l.mSpike
        ].join(','));
        return [headers.join(','), ...rows].join('\n');
    }
}

// Initialize global tracker
window.labTracker = new LabTracker();

// Create the Lab Entry Modal
function createLabEntryModal() {
    const modal = document.createElement('div');
    modal.id = 'lab-entry-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: none; z-index: 9999; align-items: center; justify-content: center; padding: 16px;';
    modal.innerHTML = `
        <div style="background: #fff; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div style="background: #000; color: #fff; padding: 32px; border-radius: 16px 16px 0 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="font-size: 24px; font-weight: 700; margin: 0;">➕ Add New Lab Results</h2>
                    <button onclick="closeLabModal()" style="background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
                </div>
                <p style="color: #93C5FD; margin-top: 8px; font-size: 14px;">Enter your latest values and get instant analysis</p>
            </div>
            
            <form id="lab-entry-form" style="padding: 24px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px;">Date</label>
                        <input type="date" name="date" required style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 10px 14px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px;">Week Label</label>
                        <input type="text" name="week" placeholder="e.g., Week 5" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 10px 14px; font-size: 14px; box-sizing: border-box;">
                    </div>
                </div>
                
                <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 24px;">
                    <h3 style="font-weight: 700; font-size: 16px; color: #1F2937; margin-bottom: 16px;">🩸 Complete Blood Count (CBC)</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">WBC <span style="color: #9CA3AF;">(4.0-11.0)</span></label>
                            <input type="number" step="0.1" name="wbc" placeholder="K/μL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">Hemoglobin <span style="color: #9CA3AF;">(13.5-17.0)</span></label>
                            <input type="number" step="0.1" name="hemoglobin" placeholder="g/dL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">Platelets <span style="color: #9CA3AF;">(130-450)</span></label>
                            <input type="number" step="1" name="platelets" placeholder="K/μL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">ANC <span style="color: #9CA3AF;">(1.5-7.8)</span></label>
                            <input type="number" step="0.1" name="anc" placeholder="K/μL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">ALC <span style="color: #9CA3AF;">(0.9-3.9)</span></label>
                            <input type="number" step="0.1" name="alc" placeholder="K/μL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 24px;">
                    <h3 style="font-weight: 700; font-size: 16px; color: #1F2937; margin-bottom: 16px;">🧪 Metabolic Panel (Optional)</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">Creatinine <span style="color: #9CA3AF;">(0.68-1.37)</span></label>
                            <input type="number" step="0.01" name="creatinine" placeholder="mg/dL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">eGFR <span style="color: #9CA3AF;">(≥60)</span></label>
                            <input type="number" step="1" name="egfr" placeholder="mL/min" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">Sodium <span style="color: #9CA3AF;">(135-145)</span></label>
                            <input type="number" step="1" name="sodium" placeholder="mmol/L" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">Calcium <span style="color: #9CA3AF;">(8.7-10.4)</span></label>
                            <input type="number" step="0.1" name="calcium" placeholder="mg/dL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 24px;">
                    <h3 style="font-weight: 700; font-size: 16px; color: #1F2937; margin-bottom: 16px;">🎯 Disease Markers (If Available)</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">Free Kappa <span style="color: #9CA3AF;">(0.33-1.94 normal)</span></label>
                            <input type="number" step="0.01" name="freeKappa" placeholder="mg/L" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px;">M-Spike <span style="color: #9CA3AF;">(0 normal)</span></label>
                            <input type="number" step="0.01" name="mSpike" placeholder="g/dL" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box;">
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; padding-top: 16px;">
                    <button type="submit" style="flex: 1; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: white; font-weight: 700; padding: 14px 24px; border-radius: 12px; border: none; cursor: pointer; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                        📊 Analyze & Save
                    </button>
                    <button type="button" onclick="closeLabModal()" style="padding: 14px 24px; border: 1px solid #D1D5DB; border-radius: 12px; background: #fff; cursor: pointer; font-size: 15px;">
                        Cancel
                    </button>
                </div>
            </form>
            
            <div id="analysis-result" style="display: none; padding: 24px; border-top: 1px solid #E5E7EB; background: #F9FAFB; border-radius: 0 0 16px 16px;"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Form submission handler
    document.getElementById('lab-entry-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const labData = {};

        formData.forEach((value, key) => {
            if (value) {
                labData[key] = key === 'date' || key === 'week' ? value : parseFloat(value);
            }
        });

        const analysis = window.labTracker.addLab(labData);
        showAnalysisResult(analysis);

        // Trigger UI updates
        if (typeof updateDashboardUI === 'function') {
            updateDashboardUI();
        }
        if (typeof updateLabsSection === 'function') {
            updateLabsSection();
        }
        if (window.medicalCharts && typeof window.medicalCharts.refresh === 'function') {
            window.medicalCharts.refresh();
        }
        if (typeof updateLabTrackerTable === 'function') {
            updateLabTrackerTable();
        }

        console.log('🧪 Lab added and UI updated');
    });
}

function openLabModal() {
    let modal = document.getElementById('lab-entry-modal');
    if (!modal) {
        createLabEntryModal();
        modal = document.getElementById('lab-entry-modal');
    }
    modal.style.display = 'flex';
    document.getElementById('analysis-result').style.display = 'none';
    document.getElementById('lab-entry-form').reset();
    // Set default date to today
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) dateInput.valueAsDate = new Date();
}

function closeLabModal() {
    const modal = document.getElementById('lab-entry-modal');
    if (modal) modal.style.display = 'none';
}

function showAnalysisResult(analysis) {
    const resultDiv = document.getElementById('analysis-result');
    resultDiv.style.display = 'block';

    let html = `
        <h3 style="font-size: 20px; font-weight: 700; color: #1F2937; margin-bottom: 16px;">📋 Analysis Results - ${analysis.week}</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
            ${analysis.summary.map(s => `<div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 12px; border-radius: 4px;">${s}</div>`).join('')}
            
            ${analysis.positives.length > 0 ? `
                <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px;">
                    <h4 style="font-weight: 700; color: #166534; margin-bottom: 8px;">✅ Positive Findings</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; color: #15803D;">
                        ${analysis.positives.map(p => `<li style="margin-bottom: 4px;">• ${p}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${analysis.concerns.length > 0 ? `
                <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 16px;">
                    <h4 style="font-weight: 700; color: #92400E; margin-bottom: 8px;">⚠️ Items to Discuss</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; color: #B45309;">
                        ${analysis.concerns.map(c => `<li style="margin-bottom: 4px;">• ${c}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${analysis.recommendations.length > 0 ? `
                <div style="background: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 8px; padding: 16px;">
                    <h4 style="font-weight: 700; color: #7E22CE; margin-bottom: 8px;">💡 Recommendations</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; color: #9333EA;">
                        ${analysis.recommendations.map(r => `<li style="margin-bottom: 4px;">• ${r}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        
        <div style="margin-top: 24px; display: flex; gap: 12px;">
            <button onclick="closeLabModal()" style="flex: 1; background: #10B981; color: white; font-weight: 700; padding: 12px 16px; border-radius: 8px; border: none; cursor: pointer;">
                ✓ Done
            </button>
            <button onclick="closeLabModal()" style="padding: 12px 16px; border: 1px solid #D1D5DB; border-radius: 8px; background: #fff; cursor: pointer;">
                Close
            </button>
        </div>
    `;

    resultDiv.innerHTML = html;
}

// Export for CSV download
function downloadLabsCSV() {
    const csv = window.labTracker.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eric_miller_labs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Add button to page on load
document.addEventListener('DOMContentLoaded', function () {
    createLabEntryModal();

    // Add floating action button
    const fab = document.createElement('button');
    fab.id = 'add-lab-fab';
    fab.className = '';
    fab.innerHTML = '<span style="font-size: 18px;">+</span><span>Add Labs</span>';
    fab.onclick = openLabModal;
    fab.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 16px 32px; border-radius: 100px; background: #000; color: #fff; border: none; cursor: pointer; font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; box-shadow: 0 20px 60px rgba(0,0,0,0.3); transition: transform 0.3s;';
    document.body.appendChild(fab);
});

console.log('🧪 Lab Entry Module Loaded');
