// SYMPTOM LOGGING & PATIENT NOTES MODULE
// Persistent local storage for tracking symptoms and questions

class SymptomLogger {
    constructor() {
        this.storageKey = 'ericMillerSymptomLog';
        this.entries = this.loadEntries();
    }

    loadEntries() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    saveEntries() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
    }

    addEntry(entry) {
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            ...entry
        };
        this.entries.unshift(newEntry);
        this.saveEntries();
        return newEntry;
    }

    deleteEntry(id) {
        this.entries = this.entries.filter(e => e.id !== id);
        this.saveEntries();
    }

    getEntries() {
        return this.entries;
    }

    exportCSV() {
        const headers = ['Date', 'Type', 'Fatigue', 'Nausea', 'Appetite', 'Pain', 'Notes'];
        const rows = this.entries.map(e => [
            e.date, e.type, e.fatigue, e.nausea, e.appetite, e.pain, `"${e.notes || ''}"`
        ].join(','));
        return [headers.join(','), ...rows].join('\n');
    }
}

// Initialize global logger
window.symptomLogger = new SymptomLogger();

// Create Symptom Log Modal
function createSymptomModal() {
    const modal = document.createElement('div');
    modal.id = 'symptom-modal';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: none; z-index: 1000; align-items: center; justify-content: center; padding: 20px;';

    modal.innerHTML = `
        <div style="background: #fff; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="background: #000; color: #fff; padding: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Patient Journal</div>
                        <h2 style="font-size: 28px; font-weight: 500;">Log Symptoms</h2>
                    </div>
                    <button onclick="closeSymptomModal()" style="background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; line-height: 1;">&times;</button>
                </div>
            </div>
            
            <form id="symptom-form" style="padding: 40px;">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 12px;">Type of Entry</label>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="radio" name="type" value="daily" checked style="width: 18px; height: 18px;">
                            <span>Daily Check-in</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="radio" name="type" value="symptom" style="width: 18px; height: 18px;">
                            <span>New Symptom</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="radio" name="type" value="question" style="width: 18px; height: 18px;">
                            <span>Question for Doctor</span>
                        </label>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 30px;">
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 12px;">Fatigue Level (1-10)</label>
                        <input type="range" name="fatigue" min="1" max="10" value="3" style="width: 100%;" oninput="this.nextElementSibling.textContent = this.value">
                        <span style="font-size: 24px; font-weight: 600; display: block; text-align: center; margin-top: 8px;">3</span>
                    </div>
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 12px;">Nausea Level (1-10)</label>
                        <input type="range" name="nausea" min="1" max="10" value="1" style="width: 100%;" oninput="this.nextElementSibling.textContent = this.value">
                        <span style="font-size: 24px; font-weight: 600; display: block; text-align: center; margin-top: 8px;">1</span>
                    </div>
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 12px;">Appetite (1-10)</label>
                        <input type="range" name="appetite" min="1" max="10" value="7" style="width: 100%;" oninput="this.nextElementSibling.textContent = this.value">
                        <span style="font-size: 24px; font-weight: 600; display: block; text-align: center; margin-top: 8px;">7</span>
                    </div>
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 12px;">Pain Level (1-10)</label>
                        <input type="range" name="pain" min="1" max="10" value="1" style="width: 100%;" oninput="this.nextElementSibling.textContent = this.value">
                        <span style="font-size: 24px; font-weight: 600; display: block; text-align: center; margin-top: 8px;">1</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 12px;">Notes / Questions</label>
                    <textarea name="notes" rows="4" placeholder="Any symptoms, observations, or questions for your next appointment..." style="width: 100%; padding: 16px; border: 1px solid #ddd; font-family: inherit; font-size: 16px; resize: vertical;"></textarea>
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button type="submit" style="flex: 1; background: #000; color: #fff; padding: 16px 32px; border: none; font-size: 14px; font-weight: 500; cursor: pointer;">Save Entry</button>
                    <button type="button" onclick="closeSymptomModal()" style="padding: 16px 32px; border: 1px solid #000; background: #fff; font-size: 14px; font-weight: 500; cursor: pointer;">Cancel</button>
                </div>
            </form>
            
            <div id="symptom-history" style="border-top: 1px solid #eee; padding: 40px;"></div>
        </div>
    `;

    document.body.appendChild(modal);

    // Form submission
    document.getElementById('symptom-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const entry = {
            type: formData.get('type'),
            fatigue: formData.get('fatigue'),
            nausea: formData.get('nausea'),
            appetite: formData.get('appetite'),
            pain: formData.get('pain'),
            notes: formData.get('notes')
        };

        window.symptomLogger.addEntry(entry);
        renderSymptomHistory();
        this.reset();

        // Show confirmation
        alert('✅ Entry saved! View your history below.');
    });
}

function openSymptomModal() {
    const modal = document.getElementById('symptom-modal');
    if (!modal) createSymptomModal();
    document.getElementById('symptom-modal').style.display = 'flex';
    renderSymptomHistory();
}

function closeSymptomModal() {
    document.getElementById('symptom-modal').style.display = 'none';
}

function renderSymptomHistory() {
    const container = document.getElementById('symptom-history');
    if (!container) return;

    const entries = window.symptomLogger.getEntries();

    if (entries.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No entries yet. Start logging to track your symptoms over time.</p>';
        return;
    }

    let html = '<h3 style="font-size: 18px; font-weight: 500; margin-bottom: 24px;">Recent Entries</h3>';

    entries.slice(0, 5).forEach(e => {
        const typeLabels = { daily: '📅 Daily', symptom: '⚠️ Symptom', question: '❓ Question' };
        html += `
            <div style="padding: 20px 0; border-bottom: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: #666;">${e.date}</span>
                    <span style="font-size: 12px; background: #f5f5f5; padding: 2px 10px; border-radius: 100px;">${typeLabels[e.type] || e.type}</span>
                </div>
                <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px;">
                    <span>Fatigue: ${e.fatigue}/10</span>
                    <span>Pain: ${e.pain}/10</span>
                    <span>Appetite: ${e.appetite}/10</span>
                </div>
                ${e.notes ? `<p style="color: #666; font-size: 14px; margin-top: 8px;">${e.notes}</p>` : ''}
            </div>
        `;
    });

    if (entries.length > 0) {
        html += `<button onclick="downloadSymptomLog()" style="margin-top: 20px; padding: 12px 24px; border: 1px solid #000; background: #fff; font-size: 13px; cursor: pointer;">Export All Entries (CSV)</button>`;
    }

    container.innerHTML = html;
}

function downloadSymptomLog() {
    const csv = window.symptomLogger.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptom_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Initialize modal on load
document.addEventListener('DOMContentLoaded', createSymptomModal);

console.log('📝 Symptom Logger loaded');
