// LAB ENTRY & ANALYSIS MODULE
// Allows user to add weekly labs and get instant trend analysis

class LabTracker {
    constructor() {
        this.storageKey = 'ericMillerLabResults';
        this.labs = this.loadLabs();
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
            freeKappa: { min: 0.33, max: 1.94, unit: 'mg/L', name: 'Free Kappa' },
            mSpike: { min: 0, max: 0.3, unit: 'g/dL', name: 'M-Spike' }
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
            { date: '2025-11-07', week: 'Baseline', wbc: 7.8, hemoglobin: 14.2, platelets: 245, freeKappa: 655.69, mSpike: 1.07 },
            { date: '2025-12-26', week: 'Day 5', wbc: 9.4, hemoglobin: 16.4, platelets: 293, anc: 5.3, alc: 3.1 },
            { date: '2026-01-02', week: 'Week 2', wbc: 7.2, hemoglobin: 15.3, platelets: 203, anc: 4.1, alc: 2.3 },
            { date: '2026-01-09', week: 'Week 3', wbc: 9.0, hemoglobin: 17.0, platelets: 241, anc: 6.2, alc: 2.0, creatinine: 0.78, egfr: 103, sodium: 134, calcium: 9.5 }
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
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div style="background: #fff; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="background: #000; color: #fff; padding: 40px;">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">➕ Add New Lab Results</h2>
                    <button onclick="closeLabModal()" class="text-white hover:text-gray-200 text-3xl">&times;</button>
                </div>
                <p class="text-blue-200 mt-1">Enter your latest values and get instant analysis</p>
            </div>
            
            <form id="lab-entry-form" class="p-6 space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                        <input type="date" name="date" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Week Label</label>
                        <input type="text" name="week" placeholder="e.g., Week 4" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h3 class="font-bold text-lg text-gray-800 mb-3">🩸 Complete Blood Count (CBC)</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">WBC <span class="text-gray-400">(4.0-11.0)</span></label>
                            <input type="number" step="0.1" name="wbc" placeholder="K/μL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Hemoglobin <span class="text-gray-400">(13.5-17.0)</span></label>
                            <input type="number" step="0.1" name="hemoglobin" placeholder="g/dL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Platelets <span class="text-gray-400">(130-450)</span></label>
                            <input type="number" step="1" name="platelets" placeholder="K/μL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">ANC <span class="text-gray-400">(1.5-7.8)</span></label>
                            <input type="number" step="0.1" name="anc" placeholder="K/μL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">ALC <span class="text-gray-400">(0.9-3.9)</span></label>
                            <input type="number" step="0.1" name="alc" placeholder="K/μL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h3 class="font-bold text-lg text-gray-800 mb-3">🧪 Metabolic Panel (Optional)</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Creatinine <span class="text-gray-400">(0.68-1.37)</span></label>
                            <input type="number" step="0.01" name="creatinine" placeholder="mg/dL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">eGFR <span class="text-gray-400">(≥60)</span></label>
                            <input type="number" step="1" name="egfr" placeholder="mL/min" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Sodium <span class="text-gray-400">(135-145)</span></label>
                            <input type="number" step="1" name="sodium" placeholder="mmol/L" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Calcium <span class="text-gray-400">(8.7-10.4)</span></label>
                            <input type="number" step="0.1" name="calcium" placeholder="mg/dL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h3 class="font-bold text-lg text-gray-800 mb-3">🎯 Disease Markers (If Available)</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Free Kappa <span class="text-gray-400">(0.33-1.94 normal)</span></label>
                            <input type="number" step="0.01" name="freeKappa" placeholder="mg/L" class="w-full border rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">M-Spike <span class="text-gray-400">(0 normal)</span></label>
                            <input type="number" step="0.01" name="mSpike" placeholder="g/dL" class="w-full border rounded-lg px-3 py-2">
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:-translate-y-1 shadow-lg">
                        📊 Analyze & Save
                    </button>
                    <button type="button" onclick="closeLabModal()" class="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
                        Cancel
                    </button>
                </div>
            </form>
            
            <div id="analysis-result" class="hidden p-6 border-t bg-gray-50 rounded-b-2xl"></div>
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
    const modal = document.getElementById('lab-entry-modal');
    if (!modal) createLabEntryModal();
    document.getElementById('lab-entry-modal').classList.remove('hidden');
    document.getElementById('analysis-result').classList.add('hidden');
    document.getElementById('lab-entry-form').reset();
    // Set default date to today
    document.querySelector('input[name="date"]').valueAsDate = new Date();
}

function closeLabModal() {
    document.getElementById('lab-entry-modal').classList.add('hidden');
}

function showAnalysisResult(analysis) {
    const resultDiv = document.getElementById('analysis-result');
    resultDiv.classList.remove('hidden');

    let html = `
        <h3 class="text-xl font-bold text-gray-800 mb-4">📋 Analysis Results - ${analysis.week}</h3>
        
        <div class="space-y-4">
            ${analysis.summary.map(s => `<div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">${s}</div>`).join('')}
            
            ${analysis.positives.length > 0 ? `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 class="font-bold text-green-800 mb-2">✅ Positive Findings</h4>
                    <ul class="space-y-1 text-green-700">
                        ${analysis.positives.map(p => `<li>• ${p}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${analysis.concerns.length > 0 ? `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-bold text-yellow-800 mb-2">⚠️ Items to Discuss</h4>
                    <ul class="space-y-1 text-yellow-700">
                        ${analysis.concerns.map(c => `<li>• ${c}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${analysis.recommendations.length > 0 ? `
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 class="font-bold text-purple-800 mb-2">💡 Recommendations</h4>
                    <ul class="space-y-1 text-purple-700">
                        ${analysis.recommendations.map(r => `<li>• ${r}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        
        <div class="mt-6 flex gap-3">
            <button onclick="location.reload()" class="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                🔄 Refresh Page to See Updates
            </button>
            <button onclick="closeLabModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
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
