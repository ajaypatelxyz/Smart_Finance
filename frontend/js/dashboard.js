// Dashboard JavaScript

// Check authentication
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Load user info
const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('userName').textContent = user.name || 'User';
document.querySelector('.user-avatar').textContent = (user.name || 'U').substring(0, 2).toUpperCase();

// Sample data for demo
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

// If no transactions, add demo data
if (transactions.length === 0) {
    transactions = [
        { id: 1, type: 'income', amount: 75000, category: 'salary', description: 'Salary Credit', date: '2026-01-01' },
        { id: 2, type: 'expense', amount: 15000, category: 'bills', description: 'Rent Payment', date: '2026-01-02' },
        { id: 3, type: 'expense', amount: 5000, category: 'food', description: 'Groceries', date: '2026-01-05' },
        { id: 4, type: 'expense', amount: 2499, category: 'shopping', description: 'Online Shopping', date: '2026-01-10' },
        { id: 5, type: 'expense', amount: 3000, category: 'entertainment', description: 'Movie & Dining', date: '2026-01-15' },
        { id: 6, type: 'expense', amount: 1500, category: 'transport', description: 'Fuel', date: '2026-01-18' },
        { id: 7, type: 'investment', amount: 10000, category: 'investment', description: 'Mutual Fund SIP', date: '2026-01-05' }
    ];
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Calculate totals
function calculateTotals() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const investments = transactions.filter(t => t.type === 'investment' || t.category === 'investment').reduce((sum, t) => sum + t.amount, 0);
    const savings = income - expenses;

    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpenses').textContent = formatCurrency(expenses);
    document.getElementById('netSavings').textContent = formatCurrency(savings);
    document.getElementById('totalInvestments').textContent = formatCurrency(investments);
}

// Initialize charts
function initCharts() {
    // Main Chart - Income vs Expenses
    const mainCtx = document.getElementById('mainChart').getContext('2d');
    new Chart(mainCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Income',
                data: [0, 0, 75000, 0, 0, 0, 0],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Expenses',
                data: [2000, 1500, 15000, 3000, 4500, 2000, 5000],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'bottom', labels: { color: '#a1a1aa', usePointStyle: true } } },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a', callback: v => '₹' + v / 1000 + 'k' } }
            }
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryData = getCategoryData();
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.values,
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { display: false } }
        }
    });

    // Render legend
    const legendHtml = categoryData.labels.map((label, i) =>
        `<div class="legend-item"><div class="legend-color" style="background: ${['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'][i]}"></div>${label}</div>`
    ).join('');
    document.getElementById('categoryLegend').innerHTML = legendHtml;
}

function getCategoryData() {
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return { labels: Object.keys(categories), values: Object.values(categories) };
}

// Modal functions
window.openModal = function (id) { document.getElementById(id).classList.add('active'); };
window.closeModal = function (id) { document.getElementById(id).classList.remove('active'); };

// Toggle buttons
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('transactionType').value = btn.dataset.value;
    });
});

// Transaction form
document.getElementById('transactionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newTransaction = {
        id: Date.now(),
        type: document.getElementById('transactionType').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };
    transactions.unshift(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    closeModal('transactionModal');
    e.target.reset();
    showNotification('Transaction added successfully!');
    calculateTotals();
    renderRecentTransactions();
});

// Render recent transactions
function renderRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    const recent = transactions.slice(0, 5);
    container.innerHTML = recent.map(t => `
        <div class="transaction-item">
            <div class="transaction-icon ${t.category}"><i class="fas fa-${getCategoryIcon(t.category)}"></i></div>
            <div class="transaction-info">
                <span class="transaction-title">${t.description || t.category}</span>
                <span class="transaction-date">${formatDate(t.date)}</span>
            </div>
            <span class="transaction-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</span>
        </div>
    `).join('');
}

function getCategoryIcon(category) {
    const icons = { food: 'utensils', salary: 'briefcase', shopping: 'shopping-bag', transport: 'car', entertainment: 'film', bills: 'file-invoice', health: 'heart', investment: 'chart-line', other: 'ellipsis-h' };
    return icons[category] || 'circle';
}

// Mobile menu toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Initialize
calculateTotals();
initCharts();
renderRecentTransactions();

// Notification and Profile Dropdown Functionality
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const userMenuBtn = document.getElementById('userMenuBtn');
const profileDropdown = document.getElementById('profileDropdown');
const markAllReadBtn = document.getElementById('markAllRead');

// Toggle notification dropdown
notificationBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
    profileDropdown?.classList.remove('active');
});

// Toggle profile dropdown
userMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    notificationDropdown?.classList.remove('active');
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationDropdown?.contains(e.target) && !notificationBtn?.contains(e.target)) {
        notificationDropdown?.classList.remove('active');
    }
    if (!profileDropdown?.contains(e.target) && !userMenuBtn?.contains(e.target)) {
        profileDropdown?.classList.remove('active');
    }
});

// Mark all notifications as read
markAllReadBtn?.addEventListener('click', () => {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.style.display = 'none';
    }
    showNotification('All notifications marked as read');
});

// Update user info in dropdowns
function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (user.name || 'U').substring(0, 2).toUpperCase();

    // Update avatar and name in topbar
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    if (userAvatar) userAvatar.textContent = initials;
    if (userName) userName.textContent = user.name || 'User';

    // Update dropdown user info
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    if (dropdownAvatar) dropdownAvatar.textContent = initials;
    if (dropdownUserName) dropdownUserName.textContent = user.name || 'User';
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || 'user@email.com';
}

// Call updateUserInfo on load
updateUserInfo();
