// Transactions page JavaScript
if (!localStorage.getItem('token')) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('userName').textContent = user.name || 'User';

let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

// Render transactions table
function renderTransactions(filter = {}) {
    let filtered = [...transactions];

    if (filter.type && filter.type !== 'all') filtered = filtered.filter(t => t.type === filter.type);
    if (filter.category && filter.category !== 'all') filtered = filtered.filter(t => t.category === filter.category);
    if (filter.search) filtered = filtered.filter(t => t.description?.toLowerCase().includes(filter.search.toLowerCase()));
    if (filter.month) filtered = filtered.filter(t => t.date.startsWith(filter.month));

    const tbody = document.getElementById('transactionsList');
    tbody.innerHTML = filtered.length ? filtered.map(t => `
        <tr>
            <td>${formatDate(t.date)}</td>
            <td><div class="transaction-desc"><div class="transaction-icon ${t.category}"><i class="fas fa-${getCategoryIcon(t.category)}"></i></div>${t.description || t.category}</div></td>
            <td><span class="category-badge ${t.category}">${t.category}</span></td>
            <td><span class="type-badge ${t.type}">${t.type}</span></td>
            <td class="${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</td>
            <td><button class="action-btn" onclick="deleteTransaction(${t.id})"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('') : '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No transactions found</td></tr>';
}

function getCategoryIcon(cat) { return { food: 'utensils', salary: 'briefcase', shopping: 'shopping-bag', transport: 'car', entertainment: 'film', bills: 'file-invoice', health: 'heart', investment: 'chart-line', other: 'ellipsis-h' }[cat] || 'circle'; }

window.deleteTransaction = function (id) {
    if (confirm('Delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions(getFilters());
        showNotification('Transaction deleted');
    }
};

// Filters
function getFilters() {
    return {
        type: document.getElementById('filterType').value,
        category: document.getElementById('filterCategory').value,
        month: document.getElementById('filterMonth').value,
        search: document.getElementById('searchInput').value
    };
}

document.getElementById('filterType').addEventListener('change', () => renderTransactions(getFilters()));
document.getElementById('filterCategory').addEventListener('change', () => renderTransactions(getFilters()));
document.getElementById('filterMonth').addEventListener('change', () => renderTransactions(getFilters()));
document.getElementById('searchInput').addEventListener('input', () => renderTransactions(getFilters()));

// Modal & form
window.openModal = id => document.getElementById(id).classList.add('active');
window.closeModal = id => document.getElementById(id).classList.remove('active');

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('transactionType').value = btn.dataset.value;
    });
});

document.getElementById('transactionForm').addEventListener('submit', e => {
    e.preventDefault();
    transactions.unshift({ id: Date.now(), type: document.getElementById('transactionType').value, amount: parseFloat(document.getElementById('amount').value), category: document.getElementById('category').value, description: document.getElementById('description').value, date: document.getElementById('date').value });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    closeModal('transactionModal');
    e.target.reset();
    showNotification('Transaction added!');
    renderTransactions(getFilters());
});

document.getElementById('date').valueAsDate = new Date();
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
    
    // Create or toggle overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    overlay.classList.toggle('active');
});

// Additional CSS for table
const style = document.createElement('style');
style.textContent = `
.filters-bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-group { display: flex; gap: 12px; align-items: center; }
.filter-group select, .filter-group input[type="month"] { padding: 10px 16px; background: var(--bg-glass); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; }
.transactions-table { width: 100%; border-collapse: collapse; }
.transactions-table th, .transactions-table td { padding: 16px; text-align: left; border-bottom: 1px solid var(--border-color); }
.transactions-table th { color: var(--text-muted); font-weight: 500; font-size: 0.875rem; }
.transaction-desc { display: flex; align-items: center; gap: 12px; }
.category-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; text-transform: capitalize; background: var(--bg-glass); }
.type-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; text-transform: capitalize; }
.type-badge.income { background: rgba(16, 185, 129, 0.15); color: var(--primary); }
.type-badge.expense { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
td.income { color: var(--primary); font-weight: 600; }
td.expense { color: #ef4444; font-weight: 600; }
.action-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 8px; }
.action-btn:hover { color: #ef4444; }
`;
document.head.appendChild(style);

renderTransactions();
