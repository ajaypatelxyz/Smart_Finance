// Transactions page JavaScript
(function() {
'use strict';
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

function getCategoryIcon(cat) { return { food: 'utensils', salary: 'briefcase', shopping: 'shopping-bag', transport: 'car', entertainment: 'film', bills: 'file-invoice', health: 'heart', investment: 'chart-line', freelance: 'laptop', business: 'store', rental: 'home', interest: 'percentage', gift: 'gift', refund: 'undo', education: 'graduation-cap', other: 'ellipsis-h' }[cat] || 'circle'; }

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

// Category options for each type
const expenseCategories = [
    { value: '', label: 'Select category' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'transport', label: 'Transport' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
];

const incomeCategories = [
    { value: '', label: 'Select source' },
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'business', label: 'Business' },
    { value: 'investment', label: 'Investment Returns' },
    { value: 'rental', label: 'Rental Income' },
    { value: 'interest', label: 'Interest / Dividends' },
    { value: 'gift', label: 'Gift / Bonus' },
    { value: 'refund', label: 'Refund' },
    { value: 'other', label: 'Other' }
];

function updateFormForType(type) {
    const categorySelect = document.getElementById('category');
    const categoryLabel = document.getElementById('categoryLabel');
    const descriptionLabel = document.getElementById('descriptionLabel');
    const descriptionInput = document.getElementById('description');

    const categories = type === 'income' ? incomeCategories : expenseCategories;

    // Update category options
    categorySelect.innerHTML = categories.map(c =>
        `<option value="${c.value}">${c.label}</option>`
    ).join('');

    // Update labels and placeholders
    if (type === 'income') {
        categoryLabel.textContent = 'Source';
        descriptionLabel.textContent = 'Note';
        descriptionInput.placeholder = 'e.g. March salary, freelance project';
    } else {
        categoryLabel.textContent = 'Category';
        descriptionLabel.textContent = 'Description';
        descriptionInput.placeholder = 'What did you spend on?';
    }
}

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('transactionType').value = btn.dataset.value;
        updateFormForType(btn.dataset.value);
    });
});

document.getElementById('transactionForm').addEventListener('submit', e => {
    e.preventDefault();
    transactions.unshift({
        id: Date.now(),
        type: document.getElementById('transactionType').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    closeModal('transactionModal');
    e.target.reset();
    // Reset form back to expense mode
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.toggle-btn[data-value="expense"]').classList.add('active');
    document.getElementById('transactionType').value = 'expense';
    updateFormForType('expense');
    document.getElementById('date').valueAsDate = new Date();
    showNotification('Transaction added!');
    renderTransactions(getFilters());
});

document.getElementById('date').valueAsDate = new Date();

// Mobile menu toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');

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

// Notification and Profile Dropdown Functionality
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const userMenuBtn = document.getElementById('userMenuBtn');
const profileDropdown = document.getElementById('profileDropdown');
const markAllReadBtn = document.getElementById('markAllRead');

notificationBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
    profileDropdown?.classList.remove('active');
});

userMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    notificationDropdown?.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!notificationDropdown?.contains(e.target) && !notificationBtn?.contains(e.target)) {
        notificationDropdown?.classList.remove('active');
    }
    if (!profileDropdown?.contains(e.target) && !userMenuBtn?.contains(e.target)) {
        profileDropdown?.classList.remove('active');
    }
});

markAllReadBtn?.addEventListener('click', () => {
    document.querySelectorAll('.notification-item.unread').forEach(item => item.classList.remove('unread'));
    const badge = document.getElementById('notificationBadge');
    if (badge) badge.style.display = 'none';
    showNotification('All notifications marked as read');
});

// Update user info in dropdowns
function updateUserInfo() {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (u.name || 'U').substring(0, 2).toUpperCase();
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    if (userAvatar) userAvatar.textContent = initials;
    if (userName) userName.textContent = u.name || 'User';
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    if (dropdownAvatar) dropdownAvatar.textContent = initials;
    if (dropdownUserName) dropdownUserName.textContent = u.name || 'User';
    if (dropdownUserEmail) dropdownUserEmail.textContent = u.email || 'user@email.com';
}
updateUserInfo();

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
})();
