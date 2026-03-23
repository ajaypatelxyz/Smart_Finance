// AI Insights page JavaScript
(function() {
'use strict';
if (!localStorage.getItem('token')) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('userName').textContent = user.name || 'User';

const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
const riskProfile = localStorage.getItem('riskProfile') || 'Moderate';
document.getElementById('riskProfile').textContent = riskProfile;

// Calculate metrics
const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
const savingsRate = income > 0 ? Math.round((income - expenses) / income * 100) : 0;

document.getElementById('savingsRate').textContent = savingsRate + '%';
document.getElementById('savingsMeter').style.width = Math.min(savingsRate, 100) + '%';

// Health Score
const healthScore = Math.min(100, Math.max(0, 50 + savingsRate - (expenses > income ? 20 : 0)));
document.getElementById('healthScore').textContent = healthScore;

new Chart(document.getElementById('scoreChart'), {
    type: 'doughnut',
    data: { datasets: [{ data: [healthScore, 100 - healthScore], backgroundColor: [healthScore >= 70 ? '#10b981' : healthScore >= 40 ? '#f59e0b' : '#ef4444', 'rgba(255,255,255,0.1)'], borderWidth: 0 }] },
    options: { cutout: '80%', plugins: { legend: { display: false } }, rotation: -90, circumference: 180 }
});
document.querySelector('.score-label').textContent = healthScore >= 70 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Needs Work';

// Spending breakdown
const categories = {};
transactions.filter(t => t.type === 'expense').forEach(t => { categories[t.category] = (categories[t.category] || 0) + t.amount; });
const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);
const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

document.getElementById('spendingBreakdown').innerHTML = sorted.map(([cat, amt], i) =>
    `<div class="spending-item"><span class="spending-cat" style="--color: ${colors[i]}">${cat}</span><div class="spending-bar-wrapper"><div class="spending-bar" style="width: ${(amt / expenses * 100).toFixed(0)}%; background: ${colors[i]}"></div></div><span class="spending-amt">${formatCurrency(amt)}</span></div>`
).join('');

// Spending tip
const topCategory = sorted[0]?.[0];
const tips = { food: 'Try meal prepping to reduce food expenses by up to 30%.', shopping: 'Consider a 24-hour rule before impulse purchases.', entertainment: 'Look for free alternatives like parks and community events.', transport: 'Consider carpooling or public transport to save fuel costs.' };
document.getElementById('spendingTip').textContent = tips[topCategory] || 'Keep tracking your expenses to find more saving opportunities!';

// Comparison Chart
new Chart(document.getElementById('comparisonChart'), {
    type: 'bar',
    data: {
        labels: ['Income', 'Expenses', 'Savings', 'Investments'],
        datasets: [
            { label: 'This Month', data: [income, expenses, income - expenses, 10000], backgroundColor: ['#10b981', '#ef4444', '#3b82f6', '#8b5cf6'] },
            { label: 'Last Month', data: [70000, 25000, 45000, 8000], backgroundColor: ['rgba(16,185,129,0.4)', 'rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)', 'rgba(139,92,246,0.4)'] }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa' } } }, scales: { x: { grid: { display: false }, ticks: { color: '#71717a' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a', callback: v => '₹' + v / 1000 + 'k' } } } }
});

// Simple AI Chat
window.sendChat = function () {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chatPreview = document.querySelector('.chat-preview');
    chatPreview.innerHTML += `<div class="chat-message user"><p>${msg}</p></div>`;
    input.value = '';

    const responses = [
        "Based on your spending patterns, I recommend setting up automatic transfers to a savings account on payday.",
        "Your investment portfolio is well-diversified. Consider increasing your SIP amount by 10% annually.",
        "I notice your entertainment expenses increased this month. Would you like me to suggest a budget limit?",
        "Great question! With your current savings rate, you could reach ₹10 lakhs in approximately 18 months.",
        "Emergency funds should cover 6 months of expenses. You're at 4 months - keep building!"
    ];

    setTimeout(() => {
        chatPreview.innerHTML += `<div class="chat-message bot"><div class="chat-avatar"><i class="fas fa-robot"></i></div><p>${responses[Math.floor(Math.random() * responses.length)]}</p></div>`;
        chatPreview.scrollTop = chatPreview.scrollHeight;
    }, 1000);
};

document.getElementById('chatInput').addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });

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

// Notification and Profile Dropdown
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

// Update user info
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

// Styles
const style = document.createElement('style');
style.textContent = `
.health-score-card { display: flex; justify-content: space-between; align-items: center; padding: 32px; margin-bottom: 24px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1)); }
.health-content h3 { font-size: 1.5rem; margin-bottom: 8px; }
.health-score { text-align: center; }
.score-circle { position: relative; }
.score-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -20%); font-size: 2.5rem; font-weight: 700; }
.score-label { display: block; margin-top: 8px; font-size: 1rem; color: var(--primary); }
.insights-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px; }
.insight-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; }
.insight-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.insight-header .insight-icon { width: 44px; height: 44px; background: var(--bg-glass); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--primary); }
.insight-header h3 { font-size: 1.1rem; }
.spending-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.spending-cat { text-transform: capitalize; min-width: 80px; font-size: 0.875rem; }
.spending-bar-wrapper { flex: 1; height: 8px; background: var(--bg-glass); border-radius: 4px; overflow: hidden; }
.spending-bar { height: 100%; border-radius: 4px; }
.spending-amt { font-size: 0.875rem; font-weight: 500; min-width: 70px; text-align: right; }
.insight-tip { display: flex; gap: 12px; padding: 16px; background: var(--bg-glass); border-radius: var(--radius-md); margin-top: 16px; }
.insight-tip i { color: var(--accent-gold); flex-shrink: 0; margin-top: 2px; }
.insight-tip.positive i { color: var(--primary); }
.insight-tip p { font-size: 0.875rem; color: var(--text-secondary); }
.savings-meter { height: 12px; background: var(--bg-glass); border-radius: 6px; overflow: hidden; margin-bottom: 12px; }
.meter-fill { height: 100%; background: var(--gradient-primary); border-radius: 6px; }
.savings-text { font-size: 0.9rem; color: var(--text-secondary); }
.budget-rules { display: flex; flex-direction: column; gap: 16px; }
.budget-rule { display: flex; align-items: center; gap: 12px; }
.rule-category { min-width: 90px; font-size: 0.875rem; }
.rule-bar { flex: 1; height: 8px; background: var(--bg-glass); border-radius: 4px; overflow: hidden; }
.rule-fill { height: 100%; border-radius: 4px; }
.rule-fill.needs { background: var(--accent-blue); }
.rule-fill.wants { background: var(--accent-purple); }
.rule-fill.savings { background: var(--primary); }
.rule-status { min-width: 40px; text-align: right; font-size: 0.875rem; }
.rule-status.good { color: var(--primary); }
.rule-status.warning { color: var(--accent-gold); }
.advice-list { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
.advice-item { display: flex; align-items: flex-start; gap: 12px; font-size: 0.9rem; color: var(--text-secondary); }
.advice-item i { color: var(--primary); margin-top: 3px; flex-shrink: 0; }
.ai-chat-preview { margin-top: 24px; }
.chat-preview { max-height: 200px; overflow-y: auto; margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px; }
.chat-message { display: flex; gap: 12px; align-items: flex-start; }
.chat-message.user { justify-content: flex-end; }
.chat-message.user p { background: var(--primary); color: white; }
.chat-message p { background: var(--bg-glass); padding: 12px 16px; border-radius: 12px; max-width: 80%; font-size: 0.9rem; }
.chat-avatar { width: 32px; height: 32px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.chat-input-wrapper { display: flex; gap: 12px; }
.chat-input-wrapper input { flex: 1; padding: 12px 16px; background: var(--bg-glass); border: 1px solid var(--border-color); border-radius: var(--radius-full); color: var(--text-primary); }
@media (max-width: 900px) {
    .insights-grid { grid-template-columns: 1fr; }
    .health-score-card { flex-direction: column; text-align: center; gap: 24px; padding: 24px 20px; }
}
@media (max-width: 600px) {
    .health-score-card { padding: 20px 16px; }
    .health-content h3 { font-size: 1.25rem; }
    .score-value { font-size: 2rem; }
    .insight-card { padding: 20px 16px; }
    .insight-header h3 { font-size: 1rem; }
    .spending-item { gap: 8px; }
    .spending-cat { min-width: 70px; font-size: 0.8rem; }
    .spending-amt { min-width: 60px; font-size: 0.8rem; }
    .rule-category { min-width: 80px; font-size: 0.8rem; }
    .budget-rule { gap: 8px; }
    .insight-tip { padding: 12px; gap: 10px; }
    .insight-tip p { font-size: 0.8rem; }
    .chat-message p { max-width: 90%; font-size: 0.85rem; padding: 10px 14px; }
    .chat-input-wrapper input { padding: 10px 14px; font-size: 0.875rem; }
}
`;
document.head.appendChild(style);
})();
