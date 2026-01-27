// Auth JavaScript - Login & Register functionality

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// Password strength checker
const passwordInput = document.getElementById('password');
if (passwordInput && document.querySelector('.password-strength')) {
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const fill = document.querySelector('.strength-fill');
        const text = document.querySelector('.strength-text');

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9!@#$%^&*]/.test(password)) strength += 25;

        fill.style.width = strength + '%';

        if (strength <= 25) {
            fill.style.background = '#ef4444';
            text.textContent = 'Weak password';
        } else if (strength <= 50) {
            fill.style.background = '#f59e0b';
            text.textContent = 'Fair password';
        } else if (strength <= 75) {
            fill.style.background = '#3b82f6';
            text.textContent = 'Good password';
        } else {
            fill.style.background = '#10b981';
            text.textContent = 'Strong password';
        }
    });
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button[type="submit"]');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        try {
            // For demo, simulate login (replace with actual API call)
            // const response = await apiRequest('/auth/login', 'POST', { email, password });

            // Demo: Store mock user data
            const mockUser = { id: '1', name: 'Demo User', email: email };
            localStorage.setItem('token', 'demo-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(mockUser));

            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (error) {
            showNotification(error.message || 'Login failed', 'error');
            btn.disabled = false;
            btn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
        }
    });
}

// Register form handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const btn = registerForm.querySelector('button[type="submit"]');

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (!terms) {
            showNotification('Please accept the terms and conditions', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

        try {
            // For demo, simulate registration (replace with actual API call)
            // const response = await apiRequest('/auth/register', 'POST', { name, email, password });

            // Demo: Store mock user data
            const mockUser = { id: '1', name: name, email: email };
            localStorage.setItem('token', 'demo-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(mockUser));

            showNotification('Account created successfully! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (error) {
            showNotification(error.message || 'Registration failed', 'error');
            btn.disabled = false;
            btn.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
        }
    });
}

// Note: Remove token check to allow users to access login/register pages
// If you want to force logout before login, uncomment below:
// localStorage.removeItem('token');
// localStorage.removeItem('user');
