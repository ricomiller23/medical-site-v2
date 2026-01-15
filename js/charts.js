// MEDICAL PORTAL - INTERACTIVE CHARTS MODULE
// Uses Chart.js for lab trend visualizations with predictions

class MedicalCharts {
    constructor() {
        this.labData = {
            dates: ['Nov 7', 'Dec 26', 'Jan 2', 'Jan 9'],
            weeks: ['Baseline', 'Day 5', 'Week 2', 'Week 3'],
            wbc: [7.8, 9.4, 7.2, 9.0],
            hemoglobin: [14.2, 16.4, 15.3, 17.0],
            platelets: [245, 293, 203, 241],
            anc: [null, 5.3, 4.1, 6.2],
            alc: [null, 3.1, 2.3, 2.0],
            egfr: [null, null, null, 103],
            freeKappa: [655.69, null, null, null],
            mSpike: [1.07, null, null, null]
        };

        this.referenceRanges = {
            wbc: { min: 4.0, max: 11.0, good: true },
            hemoglobin: { min: 13.5, max: 17.0, good: true },
            platelets: { min: 130, max: 450, good: true },
            anc: { min: 1.5, max: 7.8, good: true },
            egfr: { min: 60, max: 150, good: true },
            freeKappa: { min: 0.33, max: 1.94, good: false },
            mSpike: { min: 0, max: 0.3, good: false }
        };

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

    // Create CBC Trends Chart
    createCBCChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        new Chart(ctx, {
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
                        data: this.labData.platelets.map(v => v / 10),
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

        // Project future values (target 50% reduction)
        const projectedFreeKappa = [655.69, 500, 400, 328, 200, 100];
        const projectedMSpike = [1.07, 0.85, 0.65, 0.45, 0.25, 0.10];
        const projectedLabels = ['Baseline', 'Week 2', 'Week 4', 'Week 8', 'Week 12', 'Week 16'];

        new Chart(ctx, {
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
                        label: 'Target Zone (≤328)',
                        data: [328, 328, 328, 328, 328, 328],
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
                        max: 700
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

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Creatinine', 'eGFR', 'Sodium', 'Chloride'],
                datasets: [{
                    label: 'Week 3 Values',
                    data: [0.78, 103, 134, 92],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
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
                        text: 'Metabolic Panel — Week 3',
                        font: { family: 'Inter', size: 16, weight: 500 },
                        padding: { bottom: 20 }
                    },
                    legend: { display: false }
                }
            }
        });
    }

    // Generate Status Summary
    getStatusSummary() {
        const latest = {
            wbc: this.labData.wbc[this.labData.wbc.length - 1],
            hemoglobin: this.labData.hemoglobin[this.labData.hemoglobin.length - 1],
            platelets: this.labData.platelets[this.labData.platelets.length - 1],
            egfr: 103,
            sodium: 134,
            freeKappa: 655.69
        };

        return {
            wbc: { value: latest.wbc, status: 'normal', trend: 'up', change: '+25%' },
            hemoglobin: { value: latest.hemoglobin, status: 'normal', trend: 'up', change: '+11%' },
            platelets: { value: latest.platelets, status: 'normal', trend: 'stable', change: '-2%' },
            egfr: { value: latest.egfr, status: 'excellent', trend: 'stable', change: 'N/A' },
            sodium: { value: latest.sodium, status: 'low', trend: 'down', change: '-1' },
            freeKappa: { value: latest.freeKappa, status: 'elevated', trend: 'pending', change: 'Week 4' }
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

        console.log('📊 Medical charts initialized');
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
