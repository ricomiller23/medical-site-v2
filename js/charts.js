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
            dates: ['Nov 7', 'Dec 26', 'Jan 2', 'Jan 9', 'Jan 16', 'Jan 23', 'Jan 30', 'Feb 4', 'Feb 5', 'Apr 16', 'Apr 30', 'May 14', 'May 26', 'May 29'],
            weeks: ['Baseline', 'Day 5', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 9', 'Week 10', 'Week 11', 'Week 21', 'Week 23', 'Week 25', 'Week 27', 'Week 27 Follow-up'],
            wbc: [7.8, 9.4, 7.2, 9.0, 7.2, 10.3, 8.7, 13.5, 10.2, 6.2, 6.0, 8.8, 8.0, 8.0],
            hemoglobin: [14.2, 16.4, 15.3, 17.0, 15.8, 15.8, 15.0, 15.1, 15.1, 14.2, 15.5, 14.9, 16.5, 15.9],
            platelets: [245, 293, 203, 241, 254, 279, 237, 262, 252, 188, 272, 213, 257, 263],
            anc: [null, 5.3, 4.1, 6.2, 4.1, 6.3, 5.5, 11.6, 6.3, 3.6, 3.2, 5.9, 5.3, 5.0],
            alc: [null, 3.1, 2.3, 2.0, 2.3, 2.5, 2.1, 0.7, 2.3, 1.8, 1.8, 2.1, 1.8, 2.1],
            egfr: [null, null, null, 103, 104, null, 104, 101, 106, null, 105, null, 106, 108],
            sodium: [null, null, null, 134, 134, null, 134, 127, 128, null, 136, null, 139, 138],
            calcium: [null, null, null, 9.5, 9.2, null, 9.6, 10.2, 9.4, null, 9.8, null, 10.4, 9.9],
            creatinine: [null, null, null, 0.78, 0.76, null, 0.75, 0.83, 0.70, null, 0.74, null, 0.70, 0.66],
            freeKappa: [655.69, null, null, null, null, null, 96.07, null, 52.48, null, null, null, 64.74, null],
            mSpike: [1.07, null, null, null, null, null, 0.63, null, 0.75, null, null, null, 0.49, null]
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
        const markersData = [];
        for (let i = 0; i < this.labData.weeks.length; i++) {
            if (this.labData.freeKappa[i] !== null) {
                markersData.push({
                    week: this.labData.weeks[i],
                    value: this.labData.freeKappa[i]
                });
            }
        }

        const baselineFreeKappa = markersData[0]?.value || 655.69;
        const chartWeeks = markersData.map(d => d.week);
        const chartValues = markersData.map(d => d.value);

        this.chartInstances.disease = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartWeeks,
                datasets: [
                    {
                        label: 'Free Kappa (mg/L)',
                        data: chartValues,
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 6,
                        pointBackgroundColor: '#EF4444',
                        borderWidth: 3
                    },
                    {
                        label: `Target Zone (≤${Math.round(baselineFreeKappa / 2)})`,
                        data: Array(chartWeeks.length).fill(baselineFreeKappa / 2),
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
                        text: 'Free Kappa Trajectory — Actual Response',
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
    { date: 'June 26, 2026', type: 'labs', title: 'Monthly CBC + CMP Labs', description: 'Monitor blood counts and electrolyte levels. Assess ongoing recovery.', priority: 'normal' },
    { date: 'July 10, 2026', type: 'infusion', title: 'Daratumumab Infusion (Cycle 7, Dose 2)', description: 'Monthly maintenance dosing. Monitor clinical tolerance.', priority: 'normal' },
    { date: 'August 28, 2026', type: 'labs', title: 'Month 9 Response Evaluation', description: 'Full disease markers check: Free Kappa, M-Spike, CBC/CMP, Immunotyping.', priority: 'high' },
    { date: 'September 4, 2026', type: 'appointment', title: 'Dr. Bagai Follow-up Consultation', description: 'Review Month 9 marker results, discuss durability and maintenance plan.', priority: 'high' },
    { date: 'December 2026', type: 'decision', title: '1-Year Response Assessment', description: 'Repeat bone marrow biopsy, flow cytometry, and MRD status evaluation.', priority: 'critical' }
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
