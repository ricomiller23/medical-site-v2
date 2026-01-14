// MEDICAL SITE V2 - Enhanced Animations
// tripleROBUST Pass 2: Visual Enhancement Layer

// ===== ENHANCED PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.resize();
        window.addEventListener('resize', () => this.resize());
        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                color: this.getRandomColor(),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    getRandomColor() {
        const colors = ['#60a5fa', '#f472b6', '#34d399', '#a78bfa', '#fbbf24'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    p.vx -= dx * 0.00005;
                    p.vy -= dy * 0.00005;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            // Boundary wrap
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Pulse effect
            p.pulsePhase += 0.02;
            const pulse = 1 + Math.sin(p.pulsePhase) * 0.2;

            // Draw particle with glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });

        // Draw connections with gradient
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1, i + 10).forEach(p2 => {
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (dist < 120) {
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    gradient.addColorStop(0, p1.color);
                    gradient.addColorStop(1, p2.color);
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.globalAlpha = 0.1 * (1 - dist / 120);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== ENHANCED DNA HELIX WITH 3D EFFECT =====
class DNAHelix {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement?.offsetWidth || 800;
        this.canvas.height = 220;
    }

    drawNucleotide(x, y, z, color, isAbnormal) {
        const scale = 0.5 + z * 0.5;
        const radius = 10 * scale;

        // 3D shadow effect
        this.ctx.beginPath();
        this.ctx.arc(x + 3 * scale, y + 3 * scale, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.fill();

        // Main nucleotide
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
        gradient.addColorStop(0, isAbnormal ? '#fca5a5' : color);
        gradient.addColorStop(1, isAbnormal ? '#dc2626' : color.replace('fa', '40'));
        this.ctx.fillStyle = gradient;
        this.ctx.shadowColor = isAbnormal ? '#ef4444' : color;
        this.ctx.shadowBlur = isAbnormal ? 20 : 8;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerY = this.canvas.height / 2;
        const amplitude = 40;
        const frequency = 0.03;
        const speed = 0.05;

        // Draw from back to front for proper layering
        const nucleotides = [];

        for (let x = 0; x < this.canvas.width; x += 20) {
            const phase = (x * frequency) + this.time;
            const y1 = centerY + Math.sin(phase) * amplitude;
            const y2 = centerY + Math.sin(phase + Math.PI) * amplitude;
            const z1 = (Math.cos(phase) + 1) / 2;
            const z2 = (Math.cos(phase + Math.PI) + 1) / 2;

            const isAbnormal = (x > this.canvas.width * 0.2 && x < this.canvas.width * 0.35) ||
                (x > this.canvas.width * 0.65 && x < this.canvas.width * 0.8);

            nucleotides.push({ x, y: y1, z: z1, strand: 1, isAbnormal });
            nucleotides.push({ x, y: y2, z: z2, strand: 2, isAbnormal });
        }

        // Sort by z for proper depth
        nucleotides.sort((a, b) => a.z - b.z);

        // Draw base pairs first
        for (let x = 0; x < this.canvas.width; x += 20) {
            const phase = (x * frequency) + this.time;
            const y1 = centerY + Math.sin(phase) * amplitude;
            const y2 = centerY + Math.sin(phase + Math.PI) * amplitude;
            const avgZ = (Math.cos(phase) + 1) / 2;

            if (Math.abs(y1 - y2) < amplitude * 1.8) {
                const colors = ['#22c55e', '#fbbf24', '#ec4899', '#3b82f6'];
                this.ctx.beginPath();
                this.ctx.moveTo(x, y1);
                this.ctx.lineTo(x, y2);
                this.ctx.strokeStyle = colors[Math.floor(x / 20) % 4];
                this.ctx.globalAlpha = 0.3 + avgZ * 0.3;
                this.ctx.lineWidth = 2 + avgZ * 2;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }

        // Draw nucleotides
        nucleotides.forEach(n => {
            const color = n.strand === 1 ? '#3b82f6' : '#ec4899';
            this.drawNucleotide(n.x, n.y, n.z, color, n.isAbnormal);
        });

        // Labels for abnormal regions
        const labels = [
            { x: this.canvas.width * 0.275, label: '1q21 GAIN' },
            { x: this.canvas.width * 0.725, label: 'TP53 ABNORMAL' }
        ];

        labels.forEach(({ x, label }) => {
            const pulse = Math.sin(this.time * 3) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
            this.ctx.font = 'bold 11px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, x, 18);

            // Bracket lines
            this.ctx.strokeStyle = `rgba(239, 68, 68, ${pulse * 0.5})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x - 50, 25);
            this.ctx.lineTo(x - 50, 35);
            this.ctx.lineTo(x + 50, 35);
            this.ctx.lineTo(x + 50, 25);
            this.ctx.stroke();
        });

        this.time += speed;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== CHO CELL BIOREACTOR (ENHANCED) =====
class CHOCellAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cells = [];
        this.antibodies = [];
        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement?.offsetWidth || 650;
        this.canvas.height = 340;
    }

    init() {
        for (let i = 0; i < 18; i++) {
            this.cells.push({
                x: 60 + Math.random() * 180,
                y: 40 + Math.random() * 240,
                radius: 12 + Math.random() * 12,
                pulsePhase: Math.random() * Math.PI * 2,
                wobbleX: Math.random() * Math.PI * 2,
                wobbleY: Math.random() * Math.PI * 2
            });
        }
    }

    drawCell(cell, index) {
        const pulse = 1 + Math.sin(this.time * 2 + cell.pulsePhase) * 0.1;
        const wx = Math.sin(this.time * 0.8 + cell.wobbleX) * 4;
        const wy = Math.cos(this.time * 0.6 + cell.wobbleY) * 3;
        const x = cell.x + wx;
        const y = cell.y + wy;
        const r = cell.radius * pulse;

        // Cell shadow
        this.ctx.beginPath();
        this.ctx.ellipse(x + 3, y + 3, r, r * 0.75, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
        this.ctx.fill();

        // Cell body with gradient
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, r, r * 0.75, 0, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(x - r / 3, y - r / 3, 0, x, y, r);
        gradient.addColorStop(0, '#fde68a');
        gradient.addColorStop(0.5, '#f59e0b');
        gradient.addColorStop(1, '#b45309');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = '#92400e';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Nucleus
        this.ctx.beginPath();
        this.ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
        const nucGrad = this.ctx.createRadialGradient(x - r * 0.1, y - r * 0.1, 0, x, y, r * 0.35);
        nucGrad.addColorStop(0, '#a78bfa');
        nucGrad.addColorStop(1, '#5b21b6');
        this.ctx.fillStyle = nucGrad;
        this.ctx.fill();

        // Produce antibody
        if (Math.random() < 0.012) {
            this.antibodies.push({
                x: x, y: y,
                vx: 2.5 + Math.random() * 1.5,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                scale: 0.5 + Math.random() * 0.5
            });
        }
    }

    drawAntibody(ab) {
        const size = 12 * ab.scale;
        this.ctx.save();
        this.ctx.translate(ab.x, ab.y);
        this.ctx.globalAlpha = ab.life;

        // Y-shape antibody
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 2.5;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(0, size);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(-size * 0.6, -size * 0.8);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(size * 0.6, -size * 0.8);
        this.ctx.stroke();

        // Binding sites (glow)
        const glow = Math.sin(this.time * 5) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(239, 68, 68, ${glow})`;
        this.ctx.beginPath();
        this.ctx.arc(-size * 0.6, -size * 0.8, 4, 0, Math.PI * 2);
        this.ctx.arc(size * 0.6, -size * 0.8, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Bioreactor vessel
        this.ctx.fillStyle = 'rgba(30, 64, 175, 0.1)';
        this.ctx.strokeStyle = 'rgba(30, 64, 175, 0.5)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.roundRect(20, 15, 230, 290, 25);
        this.ctx.fill();
        this.ctx.stroke();

        // Bubbles
        for (let i = 0; i < 5; i++) {
            const bx = 40 + Math.random() * 190;
            const by = 280 - (this.time * 50 + i * 60) % 260;
            this.ctx.beginPath();
            this.ctx.arc(bx, by, 3 + Math.random() * 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(147, 197, 253, 0.4)';
            this.ctx.fill();
        }

        // Tank label
        this.ctx.fillStyle = '#1e40af';
        this.ctx.font = 'bold 13px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CHO CELL BIOREACTOR', 135, 325);
        this.ctx.font = '10px Inter, system-ui, sans-serif';
        this.ctx.fillStyle = '#6b7280';
        this.ctx.fillText('Chinese Hamster Ovary Cells', 135, 338);

        // Draw cells
        this.cells.forEach((cell, i) => this.drawCell(cell, i));

        // Update and draw antibodies
        this.antibodies = this.antibodies.filter(ab => ab.life > 0 && ab.x < this.canvas.width - 120);
        this.antibodies.forEach(ab => {
            ab.x += ab.vx;
            ab.y += ab.vy + Math.sin(this.time * 3 + ab.x * 0.05) * 0.3;
            ab.life -= 0.003;
            this.drawAntibody(ab);
        });

        // Arrow
        this.drawArrow(260, 160, 300, 160);

        // Purification column
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        this.ctx.beginPath();
        this.ctx.roundRect(310, 50, 70, 200, 12);
        this.ctx.fill();
        this.ctx.stroke();

        // Column beads
        for (let i = 0; i < 20; i++) {
            this.ctx.beginPath();
            this.ctx.arc(325 + (i % 3) * 20, 70 + Math.floor(i / 3) * 25, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(167, 139, 250, ${0.3 + Math.sin(this.time + i) * 0.2})`;
            this.ctx.fill();
        }

        this.ctx.fillStyle = '#7c3aed';
        this.ctx.font = 'bold 10px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PROTEIN A', 345, 270);
        this.ctx.fillText('COLUMN', 345, 282);

        // Arrow to product
        this.drawArrow(390, 160, 430, 160);

        // Final product box
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        this.ctx.beginPath();
        this.ctx.roundRect(440, 60, 190, 180, 18);
        this.ctx.fill();
        this.ctx.stroke();

        // Large antibody in product box
        const abX = 535, abY = 120;
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(abX, abY + 40);
        this.ctx.lineTo(abX, abY);
        this.ctx.lineTo(abX - 30, abY - 35);
        this.ctx.moveTo(abX, abY);
        this.ctx.lineTo(abX + 30, abY - 35);
        this.ctx.stroke();

        // Binding sites with pulsing glow
        const glow = Math.sin(this.time * 3) * 0.4 + 0.6;
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 15 * glow;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(abX - 30, abY - 35, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(abX + 30, abY - 35, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#10b981';
        this.ctx.font = 'bold 16px Inter, system-ui, sans-serif';
        this.ctx.fillText('DARATUMUMAB', 535, 190);
        this.ctx.font = '12px Inter, system-ui, sans-serif';
        this.ctx.fillStyle = '#6b7280';
        this.ctx.fillText('Anti-CD38 Antibody', 535, 208);
        this.ctx.fillText('~10 g/L yield', 535, 224);

        this.time += 0.03;
        requestAnimationFrame(() => this.animate());
    }

    drawArrow(x1, y1, x2, y2) {
        this.ctx.strokeStyle = '#9ca3af';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.moveTo(x2 - 8, y2 - 6);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x2 - 8, y2 + 6);
        this.ctx.stroke();
    }
}

// ===== DRUG MECHANISM ANIMATION (ENHANCED) =====
class DrugMechanismAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.phase = 0; // 0: approach, 1: bind, 2: kill
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement?.offsetWidth || 800;
        this.canvas.height = 380;
    }

    drawMyelomaCell(x, y, radius, damage = 0) {
        const pulse = 1 + Math.sin(this.time * 2) * 0.05;
        const shake = damage > 0.5 ? Math.sin(this.time * 20) * 5 * damage : 0;

        // Death particles
        if (damage > 0.7) {
            for (let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = radius + Math.random() * 30;
                this.ctx.beginPath();
                this.ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(239, 68, 68, ${Math.random() * 0.5})`;
                this.ctx.fill();
            }
        }

        // Cell membrane
        this.ctx.beginPath();
        this.ctx.arc(x + shake, y, radius * pulse * (1 - damage * 0.3), 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(x - radius / 3 + shake, y - radius / 3, 0, x + shake, y, radius);
        if (damage > 0.5) {
            gradient.addColorStop(0, `rgba(239, 68, 68, ${0.5 - damage * 0.3})`);
            gradient.addColorStop(1, `rgba(127, 29, 29, ${0.7 - damage * 0.4})`);
        } else {
            gradient.addColorStop(0, 'rgba(167, 139, 250, 0.6)');
            gradient.addColorStop(1, 'rgba(88, 28, 135, 0.8)');
        }
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = damage > 0.5 ? '#ef4444' : '#7c3aed';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // CD38 receptors
        if (damage < 0.8) {
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2 + this.time * 0.3;
                const rx = x + shake + Math.cos(angle) * (radius * pulse * (1 - damage * 0.3));
                const ry = y + Math.sin(angle) * (radius * pulse * (1 - damage * 0.3));

                this.ctx.beginPath();
                this.ctx.arc(rx, ry, 5, 0, Math.PI * 2);
                this.ctx.fillStyle = '#fbbf24';
                this.ctx.fill();
            }
        }

        // Nucleus
        if (damage < 0.9) {
            this.ctx.beginPath();
            this.ctx.arc(x + shake, y, radius * 0.35 * (1 - damage * 0.5), 0, Math.PI * 2);
            this.ctx.fillStyle = damage > 0.5 ? '#7f1d1d' : '#581c87';
            this.ctx.fill();
        }

        // Label
        if (damage < 0.5) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 11px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('MYELOMA', x, y - 5);
            this.ctx.fillText('CELL', x, y + 8);
        }
    }

    drawAntibody(x, y, angle = 0, bound = false) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        this.ctx.strokeStyle = bound ? '#ef4444' : '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 18);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(-12, -15);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(12, -15);
        this.ctx.stroke();

        // Binding sites
        const glow = Math.sin(this.time * 4) * 0.3 + 0.7;
        this.ctx.shadowColor = bound ? '#ef4444' : '#10b981';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = bound ? '#ef4444' : '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(-12, -15, 5, 0, Math.PI * 2);
        this.ctx.arc(12, -15, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Animation phase
        const cycleTime = this.time % 12;
        let damage = 0;

        if (cycleTime < 4) {
            this.phase = 0; // Approaching
        } else if (cycleTime < 8) {
            this.phase = 1; // Binding
            damage = (cycleTime - 4) / 8;
        } else {
            this.phase = 2; // Killing
            damage = 0.5 + (cycleTime - 8) / 8;
        }

        // Draw cell
        this.drawMyelomaCell(centerX, centerY, 70, damage);

        // Draw antibodies
        const numAntibodies = 8;
        for (let i = 0; i < numAntibodies; i++) {
            const baseAngle = (i / numAntibodies) * Math.PI * 2;
            let orbitRadius;

            if (this.phase === 0) {
                orbitRadius = 140 - (cycleTime / 4) * 40;
            } else {
                orbitRadius = 100 - damage * 20;
            }
            orbitRadius += Math.sin(this.time + i) * 5;

            const angle = baseAngle + this.time * 0.2;
            const ax = centerX + Math.cos(angle) * orbitRadius;
            const ay = centerY + Math.sin(angle) * orbitRadius;

            this.drawAntibody(ax, ay, angle + Math.PI / 2, this.phase > 0);

            // Attack lines
            if (this.phase > 0) {
                const targetX = centerX + Math.cos(angle) * 70;
                const targetY = centerY + Math.sin(angle) * 70;
                this.ctx.setLineDash([4, 4]);
                this.ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + Math.sin(this.time * 5) * 0.2})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(ax, ay);
                this.ctx.lineTo(targetX, targetY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }

        // Title and status
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = 'bold 16px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DARATUMUMAB ATTACKING YOUR MYELOMA', centerX, 30);

        // Phase indicator
        let statusText, statusColor;
        if (this.phase === 0) {
            statusText = '🎯 Antibodies approaching target...';
            statusColor = '#10b981';
        } else if (this.phase === 1) {
            statusText = '🔗 Binding to CD38 receptors...';
            statusColor = '#f59e0b';
        } else {
            statusText = '⚡ TRIGGERING CELL DEATH ⚡';
            statusColor = '#ef4444';
        }

        this.ctx.fillStyle = statusColor;
        this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        this.ctx.fillText(statusText, centerX, this.canvas.height - 25);

        this.time += 0.025;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== LAB TREND SPARKLINE =====
class LabTrendSparkline {
    constructor(canvas, data, color = '#10b981') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;
        this.color = color;
        this.draw();
    }

    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const padding = 5;

        const min = Math.min(...this.data) * 0.9;
        const max = Math.max(...this.data) * 1.1;
        const range = max - min;

        const stepX = (w - padding * 2) / (this.data.length - 1);

        // Gradient fill
        const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, this.color + '40');
        gradient.addColorStop(1, this.color + '00');

        // Draw fill
        this.ctx.beginPath();
        this.ctx.moveTo(padding, h);
        this.data.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = h - padding - ((val - min) / range) * (h - padding * 2);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        this.ctx.lineTo(padding + (this.data.length - 1) * stepX, h);
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Draw line
        this.ctx.beginPath();
        this.data.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = h - padding - ((val - min) / range) * (h - padding * 2);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw dots
        this.data.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = h - padding - ((val - min) / range) * (h - padding * 2);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Particle background
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) new ParticleSystem(particlesCanvas);

    // DNA Helix
    const dnaCanvas = document.getElementById('dna-helix');
    if (dnaCanvas) new DNAHelix(dnaCanvas);

    // CHO Cell Animation
    const choCanvas = document.getElementById('cho-cell-animation');
    if (choCanvas) new CHOCellAnimation(choCanvas);

    // Drug Mechanism Animation
    const drugCanvas = document.getElementById('drug-mechanism-animation');
    if (drugCanvas) new DrugMechanismAnimation(drugCanvas);

    // Scroll reveal with stagger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, i * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll, .card').forEach(el => observer.observe(el));

    // Initialize sparklines
    document.querySelectorAll('.sparkline').forEach(canvas => {
        const data = JSON.parse(canvas.dataset.values || '[]');
        const color = canvas.dataset.color || '#10b981';
        new LabTrendSparkline(canvas, data, color);
    });
});

// Dynamic styles
const style = document.createElement('style');
style.textContent = `
    @keyframes chromosomeFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-12px) rotate(2deg); }
    }
    
    @keyframes cardEntrance {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .card {
        opacity: 0;
        animation: cardEntrance 0.6s ease forwards;
    }
    
    .card:nth-child(1) { animation-delay: 0.1s; }
    .card:nth-child(2) { animation-delay: 0.2s; }
    .card:nth-child(3) { animation-delay: 0.3s; }
    .card:nth-child(4) { animation-delay: 0.4s; }
    .card:nth-child(5) { animation-delay: 0.5s; }
    .card:nth-child(6) { animation-delay: 0.6s; }
    
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(25px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .reveal-on-scroll.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Smooth hover effects */
    .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }
`;
document.head.appendChild(style);

console.log('🚀 Medical Site V2 - tripleROBUST Enhanced Animations Loaded');
