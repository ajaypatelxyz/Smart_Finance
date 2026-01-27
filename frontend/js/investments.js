// Investments page JavaScript
if (!localStorage.getItem('token')) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('userName').textContent = user.name || 'User';

let investments = JSON.parse(localStorage.getItem('investments') || '[]');
let riskProfile = localStorage.getItem('riskProfile');

// Demo data
if (investments.length === 0) {
    investments = [
        { id: 1, type: 'mutual-fund', name: 'HDFC Top 100 Fund', amount: 50000, currentValue: 58000, date: '2025-06-15' },
        { id: 2, type: 'stocks', name: 'Reliance Industries', amount: 25000, currentValue: 31000, date: '2025-08-10' },
        { id: 3, type: 'fd', name: 'SBI Fixed Deposit', amount: 100000, currentValue: 106000, date: '2025-01-01' }
    ];
    localStorage.setItem('investments', JSON.stringify(investments));
}

// Check risk profile
if (riskProfile) document.getElementById('riskBanner').style.display = 'none';

// Calculate portfolio stats
function updatePortfolio() {
    const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
    const currentValue = investments.reduce((sum, i) => sum + (i.currentValue || i.amount), 0);
    const returns = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100).toFixed(1) : 0;

    document.getElementById('totalInvested').textContent = formatCurrency(totalInvested);
    document.getElementById('currentValue').textContent = formatCurrency(currentValue);
    document.getElementById('totalReturns').textContent = `+${returns}%`;
    document.getElementById('totalReturns').className = returns >= 0 ? 'stat-value positive' : 'stat-value negative';
}

// Charts
function initCharts() {
    // Performance Chart
    new Chart(document.getElementById('performanceChart'), {
        type: 'line',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            datasets: [{ label: 'Portfolio Value', data: [150000, 155000, 160000, 158000, 170000, 185000, 195000], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4, fill: true }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a', callback: v => '₹' + v / 1000 + 'k' } } } }
    });

    // Allocation Chart
    const types = {};
    investments.forEach(i => { types[i.type] = (types[i.type] || 0) + i.currentValue; });
    new Chart(document.getElementById('allocationChart'), {
        type: 'doughnut',
        data: { labels: Object.keys(types), datasets: [{ data: Object.values(types), backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa', usePointStyle: true } } } }
    });
}

// Render investments
function renderInvestments() {
    const container = document.getElementById('investmentsList');
    container.innerHTML = investments.map(i => {
        const returns = ((i.currentValue - i.amount) / i.amount * 100).toFixed(1);
        return `<div class="investment-item"><div class="investment-icon ${i.type}"><i class="fas fa-${getTypeIcon(i.type)}"></i></div><div class="investment-info"><span class="investment-name">${i.name}</span><span class="investment-type">${i.type.replace('-', ' ')}</span></div><div class="investment-amounts"><span class="invested">Invested: ${formatCurrency(i.amount)}</span><span class="current">Current: ${formatCurrency(i.currentValue)}</span></div><span class="investment-return ${returns >= 0 ? 'positive' : 'negative'}">${returns >= 0 ? '+' : ''}${returns}%</span></div>`;
    }).join('') || '<p style="text-align:center;color:var(--text-muted);">No investments yet</p>';
}

function getTypeIcon(type) { return { 'mutual-fund': 'layer-group', 'stocks': 'chart-bar', 'fd': 'university', 'gold': 'coins', 'crypto': 'bitcoin-sign' }[type] || 'chart-pie'; }

// Risk Assessment
const riskQuestions = [
    { q: 'What is your investment time horizon?', options: ['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years'] },
    { q: 'How would you react if your investment dropped 20%?', options: ['Sell immediately', 'Sell some', 'Hold', 'Buy more'] },
    { q: 'What is your primary investment goal?', options: ['Capital preservation', 'Regular income', 'Growth', 'Aggressive growth'] }
];

window.showRiskAssessment = function () {
    let html = riskQuestions.map((q, i) => `<div class="question"><p><strong>${i + 1}. ${q.q}</strong></p><div class="options">${q.options.map((o, j) => `<label class="option"><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join('')}</div></div>`).join('') + '<button type="button" class="btn btn-primary" style="width:100%;margin-top:24px;" onclick="submitRisk()">Submit Assessment</button>';
    document.getElementById('riskQuestions').innerHTML = html;
    openModal('riskModal');
};

window.submitRisk = function () {
    let score = 0;
    riskQuestions.forEach((_, i) => { const selected = document.querySelector(`input[name="q${i}"]:checked`); if (selected) score += parseInt(selected.value); });
    const profile = score <= 3 ? 'Conservative' : score <= 6 ? 'Moderate' : 'Aggressive';
    localStorage.setItem('riskProfile', profile);
    riskProfile = profile;
    closeModal('riskModal');
    document.getElementById('riskBanner').style.display = 'none';
    showNotification(`Your risk profile: ${profile}`);
};

// Add Investment
document.getElementById('investForm').addEventListener('submit', e => {
    e.preventDefault();
    investments.push({ id: Date.now(), type: document.getElementById('investType').value, name: document.getElementById('investName').value, amount: parseFloat(document.getElementById('investAmount').value), currentValue: parseFloat(document.getElementById('investValue').value) || parseFloat(document.getElementById('investAmount').value), date: document.getElementById('investDate').value });
    localStorage.setItem('investments', JSON.stringify(investments));
    closeModal('investModal');
    e.target.reset();
    showNotification('Investment added!');
    updatePortfolio();
    renderInvestments();
});

window.openModal = id => document.getElementById(id).classList.add('active');
window.closeModal = id => document.getElementById(id).classList.remove('active');
document.querySelector('.menu-toggle')?.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('active'));

// Styles
const style = document.createElement('style');
style.textContent = `
.risk-banner { display: flex; align-items: center; gap: 24px; padding: 24px; margin-bottom: 24px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.1)); border-color: rgba(139, 92, 246, 0.3); }
.risk-icon { width: 60px; height: 60px; background: var(--accent-purple); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.risk-content { flex: 1; }
.risk-content h3 { margin-bottom: 4px; }
.risk-content p { color: var(--text-secondary); }
.suggestions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.suggestion-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: var(--bg-glass); border-radius: var(--radius-lg); border: 1px solid var(--border-color); }
.suggestion-icon { width: 50px; height: 50px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
.suggestion-icon.stocks { background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); }
.suggestion-icon.funds { background: rgba(16, 185, 129, 0.15); color: var(--primary); }
.suggestion-icon.fd { background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); }
.suggestion-info { flex: 1; }
.suggestion-info h4 { margin-bottom: 4px; }
.suggestion-info p { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 8px; }
.expected-return { font-size: 0.75rem; color: var(--primary); }
.investments-list { display: flex; flex-direction: column; gap: 16px; }
.investment-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-glass); border-radius: var(--radius-md); }
.investment-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.investment-icon.mutual-fund { background: rgba(16, 185, 129, 0.15); color: var(--primary); }
.investment-icon.stocks { background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); }
.investment-icon.fd { background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); }
.investment-info { flex: 1; }
.investment-name { display: block; font-weight: 500; }
.investment-type { font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize; }
.investment-amounts { display: flex; flex-direction: column; gap: 4px; text-align: right; font-size: 0.875rem; }
.invested { color: var(--text-muted); }
.investment-return { font-weight: 600; padding: 4px 12px; border-radius: 20px; }
.investment-return.positive { background: rgba(16, 185, 129, 0.15); color: var(--primary); }
.investment-return.negative { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.question { margin-bottom: 24px; }
.question p { margin-bottom: 12px; }
.options { display: flex; flex-direction: column; gap: 8px; }
.option { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-glass); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition-fast); }
.option:hover { background: var(--bg-glass-hover); }
.option input:checked + span { color: var(--primary); }
`;
document.head.appendChild(style);

updatePortfolio();
initCharts();
renderInvestments();
