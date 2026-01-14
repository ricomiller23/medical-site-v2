// ERIC Medical Site - Main Application
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initAccordions();
    initTabs();
    initCharts();
    initDarkMode();
    initFontSize();
});

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${index * 0.1}s`;
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, .stat-card, .treatment-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Add animation class
    const style = document.createElement('style');
    style.textContent = `.animate-in { animation: fadeInUp 0.6s ease forwards; }`;
    document.head.appendChild(style);
}

// Accordion functionality
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = content.classList.contains('open');

            // Close all accordions
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));

            // Open clicked if it was closed
            if (!isOpen) {
                content.classList.add('open');
                header.classList.add('open');
            }
        });
    });
}

// Tab functionality
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Update buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(tabId)?.classList.add('active');
        });
    });
}

// Charts
function initCharts() {
    const qolCanvas = document.getElementById('qolChart');
    if (qolCanvas && typeof Chart !== 'undefined') {
        new Chart(qolCanvas, {
            type: 'line',
            data: {
                labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
                datasets: [{
                    label: 'Best Case (MRD-negative)',
                    data: [95, 75, 85, 88, 90, 90, 90, 90, 88, 85, 80],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: 'Most Likely',
                    data: [95, 70, 75, 77, 75, 70, 65, 60, 55, 50, null],
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: 'Worst Case',
                    data: [95, 60, 55, 50, 45, 40, 35, null, null, null, null],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: 'white' } },
                    title: {
                        display: true,
                        text: 'Quality of Life Over Time (%)',
                        color: 'white',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: 'rgba(255,255,255,0.7)' }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: 'rgba(255,255,255,0.7)' },
                        title: { display: true, text: 'Years Since Diagnosis', color: 'rgba(255,255,255,0.7)' }
                    }
                }
            }
        });
    }
}

// Dark mode
function initDarkMode() {
    const savedMode = localStorage.getItem('lightMode');
    if (savedMode === 'true') document.body.classList.add('light-mode');
}

function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('lightMode', document.body.classList.contains('light-mode'));
}

// Font size
let fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
function initFontSize() {
    document.body.style.fontSize = fontSize + 'px';
}

function adjustFontSize(action) {
    if (action === 'increase' && fontSize < 22) fontSize += 2;
    else if (action === 'decrease' && fontSize > 12) fontSize -= 2;
    document.body.style.fontSize = fontSize + 'px';
    localStorage.setItem('fontSize', fontSize);
}

// Smooth scroll
function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// Switch tabs for diagnostics
function switchTab(tabId) {
    document.querySelectorAll('.diagnostics-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.diagnostics-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId)?.classList.add('active');
    event.target.classList.add('active');
}
