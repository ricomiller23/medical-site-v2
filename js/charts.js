// MEDICAL PORTAL - INTERACTIVE CHARTS MODULE
// Uses Chart.js for lab trend visualizations with predictions
// Now integrated with LabTracker for dynamic data

class MedicalCharts {
    constructor() {
        // Load data from labTracker if available, otherwise use defaults
        this.loadFromLabTracker();

        this.referenceRanges = {
            wbc: { min: 4.0, max: 11.0, good: true },
            hemoglobin: { min: 13.5, max: 17.0, good: true },
            platelets: { min: 130, max: 450, good: true },
            anc: { min: 1.5, max: 7.8, good: true },
            egfr: { min: 60, max: 150, good: true },
            freeKappa: { min: 0.33, max: 1.94, good: false },
            mSpike: { min: 0, max: 0.3, good: false }
        };

        this.chartInstances = {};

        this.chartDefaults = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Inter', size: 12 },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: '#000',
                    titleFont: { family: 'Inter', size: 14 },
                    bodyFont: { family: 'Inter', size: 13 },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 12 } }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { family: 'Inter', size: 12 } }
                }
            }
        };
    }

    // Load lab data from labTracker localStorage
    loadFromLabTracker() {
        try {
            const stored = localStorage.getItem('ericMillerLabResults');
            if (stored) {
                const labs = JSON.parse(stored);
                this.labData = this.transformLabData(labs);
                console.log('📊 Charts: Loaded', labs.length, 'lab entries from storage');
            } else {
                this.labData = this.getDefaultLabData();
            }
        } catch (e) {
            console.warn('Charts: Could not load from storage, using defaults');
            this.labData = this.getDefaultLabData();
        }
    }

    // Transform labTracker format to chart format
    transformLabData(labs) {
        // Sort by date
        labs.sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            dates: labs.map(l => this.formatDate(l.date)),
            weeks: labs.map(l => l.week || this.formatDate(l.date)),
            wbc: labs.map(l => l.wbc || null),
            hemoglobin: labs.map(l => l.hemoglobin || null),
            platelets: labs.map(l => l.platelets || null),
            anc: labs.map(l => l.anc || null),
            alc: labs.map(l => l.alc || null),
            egfr: labs.map(l => l.egfr || null),
            sodium: labs.map(l => l.sodium || null),
            calcium: labs.map(l => l.calcium || null),
            creatinine: labs.map(l => l.creatinine || null),
            freeKappa: labs.map(l => l.freeKappa || null),
            mSpike: labs.map(l => l.mSpike || null)
        };
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    getDefaultLabData() {
        return {
            dates: ['Nov 7', 'Dec 26', 'Jan 2', 'Jan 9'],
            weeks: ['Baseline', 'Day 5', 'Week 2', 'Week 3'],
            wbc: [7.8, 9.4, 7.2, 9.0],
            hemoglobin: [14.2, 16.4, 15.3, 17.0],
            platelets: [245, 293, 203, 241],
            anc: [null, 5.3, 4.1, 6.2],
            alc: [null, 3.1, 2.3, 2.0],
            egfr: [null, null, null, 103],
            sodium: [null, null, null, 134],
            calcium: [null, null, null, 9.5],
            creatinine: [null, null, null, 0.78],
            freeKappa: [655.69, null, null, null],
            mSpike: [1.07, null, null, null]
        };
    }

    // Refresh charts with latest data
    refresh() {
        this.loadFromLabTracker();
        Object.values(this.chartInstances).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.chartInstances = {};
        this.init();
        console.log('📊 Charts refreshed with latest data');
    }

    // Get latest lab entry
    getLatestLab() {
        const stored = localStorage.getItem('ericMillerLabResults');
        if (stored) {
            const labs = JSON.parse(stored);
            labs.sort((a, b) => new Date(b.date) - new Date(a.date));
            return labs[0];
        }
        return null;
    }

    // Create CBC Trends Chart
    createCBCChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        this.chartInstances.cbc = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.labData.weeks,
                datasets: [
                    {
                        label: 'WBC (K/μL)',
                        data: this.labData.wbc,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Hemoglobin (g/dL)',
                        data: this.labData.hemoglobin,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Platelets (÷10 K/μL)',
                        data: this.labData.platelets.map(v => v ? v / 10 : null),
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                ...this.chartDefaults,
                plugins: {
                    ...this.chartDefaults.plugins,
                    title: {
                        display: true,
                        text: 'Complete Blood Count Trends',
                        font: { family: 'Inter', size: 16, weight: 500 },
                        padding: { bottom: 20 }
                    },
                    annotation: {
                        annotations: {
                            normalRange: {
                                type: 'box',
                                yMin: 4,
                                yMax: 11,
                                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                borderWidth: 0
                            }
                        }
                    }
                }
            }
        });
    }

    // Create Disease Markers Chart
    createDiseaseMarkersChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Get actual Free Kappa values from data
        const actualFreeKappa = this.labData.freeKappa.filter(v => v !== null);
        const baselineFreeKappa = actualFreeKappa[0] || 655.69;

        // Project future values (target 50% reduction)
        const projectedFreeKappa = [baselineFreeKappa, baselineFreeKappa * 0.76, baselineFreeKappa * 0.61, baselineFreeKappa * 0.5, baselineFreeKappa * 0.3, baselineFreeKappa * 0.15];
        const projectedLabels = ['Baseline', 'Week 2', 'Week 4', 'Week 8', 'Week 12', 'Week 16'];

        this.chartInstances.disease = new Chart(ctx, {
            type: 'line',
            data: {
                labels: projectedLabels,
                datasets: [
                    {
                        label: 'Free Kappa (mg/L)',
                        data: projectedFreeKappa,
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: [8, 0, 0, 0, 0, 0],
                        pointBackgroundColor: '#EF4444',
                        borderDash: [0, 0, 5, 5]
                    },
                    {
                        label: `Target Zone (≤${Math.round(baselineFreeKappa / 2)})`,
                        data: Array(6).fill(baselineFreeKappa / 2),
                        borderColor: '#10B981',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                ...this.chartDefaults,
                scales: {
                    ...this.chartDefaults.scales,
                    y: {
                        ...this.chartDefaults.scales.y,
                        min: 0,
                        max: Math.ceil(baselineFreeKappa * 1.1)
                    }
                },
                plugins: {
                    ...this.chartDefaults.plugins,
                    title: {
                        display: true,
                        text: 'Free Kappa Trajectory — Target ≥50% Reduction',
                        font: { family: 'Inter', size: 16, weight: 500 },
                        padding: { bottom: 20 }
                    }
                }
            }
        });
    }

    // Create Kidney Health Chart
    createKidneyChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Get latest values from labData
        const latestIdx = this.labData.creatinine.length - 1;
        const creatinine = this.labData.creatinine.filter(v => v !== null).pop() || 0.78;
        const egfr = this.labData.egfr.filter(v => v !== null).pop() || 103;
        const sodium = this.labData.sodium.filter(v => v !== null).pop() || 134;
        const calcium = this.labData.calcium.filter(v => v !== null).pop() || 9.5;

        this.chartInstances.kidney = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Creatinine', 'eGFR', 'Sodium', 'Calcium'],
                datasets: [{
                    label: 'Latest Values',
                    data: [creatinine, egfr, sodium * 0.1, calcium],
                    backgroundColor: [
                        creatinine >= 0.68 && creatinine <= 1.37 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(245, 158, 11, 0.8)',
                        egfr >= 60 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(245, 158, 11, 0.8)',
                        sodium >= 135 && sodium <= 145 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(245, 158, 11, 0.8)',
                        calcium >= 8.7 && calcium <= 10.4 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(245, 158, 11, 0.8)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                ...this.chartDefaults,
                indexAxis: 'y',
                plugins: {
                    ...this.chartDefaults.plugins,
                    title: {
                        display: true,
                        text: 'Metabolic Panel — Latest',
                        font: { family: 'Inter', size: 16, weight: 500 },
                        padding: { bottom: 20 }
                    },
                    legend: { display: false }
                }
            }
        });
    }

    // Create Quality of Life Chart
    createQoLChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        this.chartInstances.qol = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Now', 'Yr 1', 'Yr 2', 'Yr 3', 'Yr 5', 'Yr 7', 'Yr 10', 'Yr 15', 'Yr 20'],
                datasets: [
                    {
                        label: 'MRD-Negative (Best)',
                        data: [100, 60, 55, 70, 80, 85, 85, 80, 75],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'MRD-Positive (Middle)',
                        data: [100, 55, 50, 60, 65, 60, 55, 40, null],
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Refractory (Worst)',
                        data: [100, 50, 45, 40, 35, 25, null, null, null],
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                ...this.chartDefaults,
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: 'rgba(255,255,255,0.7)' }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: {
                            color: 'rgba(255,255,255,0.7)',
                            callback: value => value + '%'
                        }
                    }
                },
                plugins: {
                    ...this.chartDefaults.plugins,
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255,255,255,0.8)',
                            font: { family: 'Inter', size: 12 },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    title: {
                        display: true,
                        text: 'Quality of Life Over Time (%)',
                        color: '#fff',
                        font: { family: 'Inter', size: 16, weight: 500 },
                        padding: { bottom: 20 }
                    }
                }
            }
        });
    }

    // Generate Status Summary from latest lab data
    getStatusSummary() {
        const latestLab = this.getLatestLab();
        if (!latestLab) {
            return {
                wbc: { value: 9.0, status: 'normal', trend: 'up', change: '+25%' },
                hemoglobin: { value: 17.0, status: 'normal', trend: 'up', change: '+11%' },
                platelets: { value: 241, status: 'normal', trend: 'stable', change: '-2%' },
                egfr: { value: 103, status: 'excellent', trend: 'stable', change: 'N/A' },
                sodium: { value: 134, status: 'low', trend: 'down', change: '-1' },
                freeKappa: { value: 655.69, status: 'elevated', trend: 'pending', change: 'Week 4' }
            };
        }

        const getStatus = (value, min, max) => {
            if (value === undefined || value === null) return 'unknown';
            if (value < min) return 'low';
            if (value > max) return 'high';
            return 'normal';
        };

        return {
            wbc: { value: latestLab.wbc, status: getStatus(latestLab.wbc, 4.0, 11.0) },
            hemoglobin: { value: latestLab.hemoglobin, status: getStatus(latestLab.hemoglobin, 13.5, 17.0) },
            platelets: { value: latestLab.platelets, status: getStatus(latestLab.platelets, 130, 450) },
            egfr: { value: latestLab.egfr, status: latestLab.egfr >= 90 ? 'excellent' : getStatus(latestLab.egfr, 60, 150) },
            sodium: { value: latestLab.sodium, status: getStatus(latestLab.sodium, 135, 145) },
            freeKappa: { value: latestLab.freeKappa, status: latestLab.freeKappa ? 'elevated' : 'pending' }
        };
    }

    // Initialize all charts
    init() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        // Set default font
        Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';

        this.createCBCChart('cbc-chart');
        this.createDiseaseMarkersChart('disease-chart');
        this.createKidneyChart('kidney-chart');
        this.createQoLChart('qol-chart');

        console.log('📊 Medical charts initialized with', this.labData.weeks.length, 'data points');
    }
}

// Future Milestones Data
const futureMilestones = [
    { date: 'Jan 18, 2026', type: 'labs', title: 'Week 4 Labs + Disease Markers', description: 'Free Kappa, M-Spike, CBC. Target: ≥50% reduction in Free Kappa.', priority: 'high' },
    { date: 'Jan 25, 2026', type: 'infusion', title: 'Daratumumab Infusion #5', description: 'Weekly dosing continues. Monitor for infusion reactions.', priority: 'normal' },
    { date: 'Feb 1, 2026', type: 'labs', title: 'Week 6 Labs', description: 'CBC + CMP. Assess electrolyte recovery.', priority: 'normal' },
    { date: 'Feb 15, 2026', type: 'appointment', title: 'Follow-up with Dr. Bagai', description: 'Review response data, discuss treatment adjustments if needed.', priority: 'high' },
    { date: 'Mar 2026', type: 'decision', title: 'Month 3 Assessment', description: 'Evaluate overall response. Consider combo therapy if insufficient.', priority: 'critical' },
    { date: 'Apr 2026', type: 'test', title: 'First MRD Test', description: 'Minimal Residual Disease assessment via bone marrow.', priority: 'high' }
];

function renderMilestones(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const icons = {
        labs: '🧪',
        infusion: '💉',
        appointment: '👨‍⚕️',
        decision: '⚖️',
        test: '🔬'
    };

    const priorityColors = {
        normal: 'rgba(0,0,0,0.1)',
        high: 'rgba(59, 130, 246, 0.2)',
        critical: 'rgba(239, 68, 68, 0.2)'
    };

    let html = '';
    futureMilestones.forEach(m => {
        html += `
            <div style="display: flex; gap: 24px; padding: 30px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <div style="font-size: 32px;">${icons[m.type]}</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; color: #666; margin-bottom: 4px;">${m.date}</div>
                    <div style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">${m.title}</div>
                    <div style="font-size: 15px; color: #666; line-height: 1.6;">${m.description}</div>
                </div>
                ${m.priority === 'critical' ? '<div style="background: #FEE2E2; color: #DC2626; padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; height: fit-content;">CRITICAL</div>' : ''}
            </div>
        `;
    });

    container.innerHTML = html;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.medicalCharts = new MedicalCharts();
    window.medicalCharts.init();
    renderMilestones('future-milestones');
});

console.log('📊 Charts module loaded');
