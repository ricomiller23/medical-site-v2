// INTERACTIVE UI FEATURES MODULE
// Accordions, Search, Sortable Tables

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
class SiteSearch {
    constructor() {
        this.searchIndex = [];
        this.buildIndex();
    }

    buildIndex() {
        // Index all text content for search
        document.querySelectorAll('section').forEach((section, idx) => {
            const heading = section.querySelector('h2, h3, .display-large, .display-medium');
            const text = section.textContent;
            this.searchIndex.push({
                id: section.id || `section-${idx}`,
                title: heading ? heading.textContent.trim() : `Section ${idx + 1}`,
                content: text.toLowerCase(),
                element: section
            });
        });
    }

    search(query) {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        return this.searchIndex.filter(item =>
            item.content.includes(q) || item.title.toLowerCase().includes(q)
        );
    }

    highlightResult(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            section.style.animation = 'highlight-pulse 1.5s ease';
            setTimeout(() => section.style.animation = '', 1500);
        }
    }
}

// ============================================
// ACCORDION TIMELINE
// ============================================
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = content.classList.contains('open');

            // Close all others
            document.querySelectorAll('.accordion-content.open').forEach(c => {
                c.classList.remove('open');
                c.previousElementSibling.querySelector('.accordion-icon').textContent = '+';
            });

            // Toggle current
            if (!isOpen) {
                content.classList.add('open');
                header.querySelector('.accordion-icon').textContent = '−';
            }
        });
    });
}

// ============================================
// SORTABLE TABLES
// ============================================
function makeSortable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const headers = table.querySelectorAll('th[data-sort]');
    const tbody = table.querySelector('tbody');

    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const idx = Array.from(header.parentElement.children).indexOf(header);
            const isAsc = header.dataset.order !== 'asc';

            rows.sort((a, b) => {
                const aVal = a.cells[idx].textContent.trim();
                const bVal = b.cells[idx].textContent.trim();
                const aNum = parseFloat(aVal);
                const bNum = parseFloat(bVal);

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return isAsc ? aNum - bNum : bNum - aNum;
                }
                return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });

            // Update sort indicators
            headers.forEach(h => {
                h.dataset.order = '';
                h.querySelector('.sort-icon')?.remove();
            });
            header.dataset.order = isAsc ? 'asc' : 'desc';
            header.innerHTML += `<span class="sort-icon">${isAsc ? ' ↑' : ' ↓'}</span>`;

            // Re-append rows
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

// ============================================
// SEARCH MODAL
// ============================================
function createSearchModal() {
    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.8); 
        display: none; z-index: 2000; align-items: flex-start; 
        justify-content: center; padding-top: 15vh;
    `;

    modal.innerHTML = `
        <div style="background: #fff; width: 100%; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <div style="padding: 24px; border-bottom: 1px solid #eee;">
                <input type="text" id="search-input" placeholder="Search labs, treatments, timeline..." 
                    style="width: 100%; padding: 16px; border: none; font-size: 18px; outline: none; font-family: inherit;">
            </div>
            <div id="search-results" style="max-height: 400px; overflow-y: auto;"></div>
            <div style="padding: 16px; background: #f5f5f5; font-size: 13px; color: #666; display: flex; justify-content: space-between;">
                <span>Press Enter to search</span>
                <span>ESC to close</span>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSearch();
    });

    // Search on input
    input.addEventListener('input', () => {
        const query = input.value;
        const matches = window.siteSearch.search(query);

        if (matches.length === 0) {
            results.innerHTML = query.length > 1
                ? '<div style="padding: 24px; color: #666;">No results found</div>'
                : '';
            return;
        }

        results.innerHTML = matches.slice(0, 5).map(m => `
            <div class="search-result" data-id="${m.id}" style="padding: 16px 24px; border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.2s;">
                <div style="font-weight: 500; margin-bottom: 4px;">${m.title}</div>
                <div style="font-size: 13px; color: #666;">${m.content.substring(0, 100)}...</div>
            </div>
        `).join('');

        // Add click handlers
        results.querySelectorAll('.search-result').forEach(r => {
            r.addEventListener('mouseenter', () => r.style.background = '#f5f5f5');
            r.addEventListener('mouseleave', () => r.style.background = '');
            r.addEventListener('click', () => {
                window.siteSearch.highlightResult(r.dataset.id);
                closeSearch();
            });
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
}

function openSearch() {
    const modal = document.getElementById('search-modal');
    modal.style.display = 'flex';
    document.getElementById('search-input').focus();
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '';
}

function closeSearch() {
    document.getElementById('search-modal').style.display = 'none';
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize search
    window.siteSearch = new SiteSearch();
    createSearchModal();

    // Initialize accordions
    initAccordions();

    // Initialize sortable tables
    document.querySelectorAll('table').forEach((table, idx) => {
        table.id = table.id || `table-${idx}`;
        const headers = table.querySelectorAll('th');
        headers.forEach(h => h.dataset.sort = 'true');
        makeSortable(table.id);
    });

    console.log('🔍 Interactive features loaded (Search: Cmd+K)');
});

// Add highlight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight-pulse {
        0%, 100% { background-color: transparent; }
        50% { background-color: rgba(16, 185, 129, 0.15); }
    }
    .accordion-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s ease;
    }
    .accordion-content.open {
        max-height: 500px;
    }
    .accordion-header {
        cursor: pointer;
        transition: background 0.2s;
    }
    .accordion-header:hover {
        background: rgba(0,0,0,0.03);
    }
`;
document.head.appendChild(style);
