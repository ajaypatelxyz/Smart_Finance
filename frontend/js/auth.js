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

// Helper: validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper: show inline field error
function showFieldError(inputId, message) {
    clearFieldError(inputId);
    const input = document.getElementById(inputId);
    if (!input) return;
    const wrapper = input.closest('.form-group') || input.closest('.input-wrapper');
    if (!wrapper) return;
    input.style.borderColor = '#ef4444';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.style.cssText = 'color: #ef4444; font-size: 0.8rem; margin-top: 4px; display: flex; align-items: center; gap: 6px;';
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    wrapper.appendChild(errorEl);
}

// Helper: clear inline field error
function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.style.borderColor = '';
    input.style.boxShadow = '';
    const wrapper = input.closest('.form-group') || input.closest('.input-wrapper');
    if (!wrapper) return;
    const existing = wrapper.querySelector('.field-error');
    if (existing) existing.remove();
}

// Helper: clear all field errors
function clearAllFieldErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.input-wrapper input').forEach(input => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
}

// Clear errors on input focus
document.querySelectorAll('.input-wrapper input').forEach(input => {
    input.addEventListener('focus', () => {
        clearFieldError(input.id);
    });
});

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllFieldErrors();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button[type="submit"]');

        // Client-side validation
        let hasError = false;

        if (!email) {
            showFieldError('email', 'Please enter your email address');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasError = true;
        }

        if (!password) {
            showFieldError('password', 'Please enter your password');
            hasError = true;
        }

        if (hasError) return;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        try {
            const response = await apiRequest('/auth/login', 'POST', { email, password });

            // Store real user data and token from backend
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (error) {
            const msg = error.message || 'Login failed. Please try again.';

            // Show specific field errors based on backend response
            if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('no account')) {
                showFieldError('email', msg);
            } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('incorrect')) {
                showFieldError('password', msg);
            } else if (msg.toLowerCase().includes('valid email')) {
                showFieldError('email', msg);
            } else {
                showNotification(msg, 'error');
            }

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
        clearAllFieldErrors();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const btn = registerForm.querySelector('button[type="submit"]');

        // Client-side validation
        let hasError = false;

        if (!name) {
            showFieldError('name', 'Please enter your full name');
            hasError = true;
        }

        if (!email) {
            showFieldError('email', 'Please enter your email address');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address (e.g. user@example.com)');
            hasError = true;
        }

        if (!phone) {
            showFieldError('phone', 'Please enter your mobile number');
            hasError = true;
        } else if (phone.replace(/[\s\-\+\(\)]/g, '').length < 10) {
            showFieldError('phone', 'Please enter a valid mobile number (at least 10 digits)');
            hasError = true;
        }

        if (!password) {
            showFieldError('password', 'Please create a password');
            hasError = true;
        } else if (password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters long');
            hasError = true;
        }

        if (!confirmPassword) {
            showFieldError('confirmPassword', 'Please confirm your password');
            hasError = true;
        } else if (password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
            hasError = true;
        }

        if (!terms) {
            showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
            hasError = true;
        }

        if (hasError) return;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

        try {
            const response = await apiRequest('/auth/register', 'POST', { name, email, phone, password });

            // Store real user data and token from backend
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            showNotification('Account created successfully! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (error) {
            const msg = error.message || 'Registration failed. Please try again.';

            // Show specific field errors based on backend response
            if (msg.toLowerCase().includes('email already') || msg.toLowerCase().includes('account with this email')) {
                showFieldError('email', msg);
            } else if (msg.toLowerCase().includes('valid email')) {
                showFieldError('email', msg);
            } else if (msg.toLowerCase().includes('password') && msg.toLowerCase().includes('6')) {
                showFieldError('password', msg);
            } else if (msg.toLowerCase().includes('name')) {
                showFieldError('name', msg);
            } else if (msg.toLowerCase().includes('mobile') || msg.toLowerCase().includes('phone')) {
                showFieldError('phone', msg);
            } else {
                showNotification(msg, 'error');
            }

            btn.disabled = false;
            btn.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
        }
    });
}
