document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const messageDiv = document.getElementById('message');
    const logoText = document.querySelector('.logo-text');

    // Add pulsing glow effect to logo
    let glowInterval;
    
    function startGlow() {
        logoText.style.animation = 'glow 2s infinite alternate';
    }
    
    function stopGlow() {
        logoText.style.animation = 'none';
    }
    
    // Start glow effect after 3 seconds
    setTimeout(startGlow, 3000);
    
    // Stop glow after 10 seconds
    setTimeout(() => {
        stopGlow();
        // Keep just the pulse animation
        logoText.style.animation = 'pulse 5s infinite';
    }, 10000);

    // Toggle between forms
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.form}Form`).classList.add('active');
            clearMessages();
        });
    });

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        toggleBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        
        document.querySelector('.toggle-btn[data-form="signup"]').classList.add('active');
        signupForm.classList.add('active');
        clearMessages();
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        toggleBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        
        document.querySelector('.toggle-btn[data-form="login"]').classList.add('active');
        loginForm.classList.add('active');
        clearMessages();
    });

    // Toggle password visibility
    function setupPasswordToggle(inputId, toggleId) {
        const passwordInput = document.getElementById(inputId);
        const toggleIcon = document.getElementById(toggleId);
        
        if (passwordInput && toggleIcon) {
            toggleIcon.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
                // Add animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }

    setupPasswordToggle('loginPassword', 'toggleLoginPassword');
    setupPasswordToggle('password', 'togglePassword');

    // Validate email format
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate password strength and update UI
    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        // Update icons
        document.getElementById('lengthIcon').className = requirements.length ? 'fas fa-check' : 'fas fa-times';
        document.getElementById('uppercaseIcon').className = requirements.uppercase ? 'fas fa-check' : 'fas fa-times';
        document.getElementById('lowercaseIcon').className = requirements.lowercase ? 'fas fa-check' : 'fas fa-times';
        document.getElementById('numberIcon').className = requirements.number ? 'fas fa-check' : 'fas fa-times';
        document.getElementById('specialIcon').className = requirements.special ? 'fas fa-check' : 'fas fa-times';
        
        // Calculate strength
        const strength = Object.values(requirements).filter(Boolean).length;
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        if (strength <= 2) {
            strengthBar.style.backgroundColor = '#e74c3c';
            strengthBar.style.width = '30%';
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#e74c3c';
        } else if (strength <= 4) {
            strengthBar.style.backgroundColor = '#f39c12';
            strengthBar.style.width = '60%';
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#f39c12';
        } else {
            strengthBar.style.backgroundColor = '#27ae60';
            strengthBar.style.width = '100%';
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#27ae60';
        }
        
        return Object.values(requirements).every(Boolean);
    }

    // Show message with animation
    function showMessage(type, text) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Add animation
        messageDiv.style.animation = 'fadeIn 0.5s ease';
    }

    // Clear messages
    function clearMessages() {
        messageDiv.style.display = 'none';
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Show error with animation
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add animation
        errorElement.style.animation = 'fadeIn 0.3s ease';
    }

    // Hide error
    function hideError(elementId) {
        document.getElementById(elementId).style.display = 'none';
    }

    // User storage (for demo only - in real app use server-side)
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate name
        const name = document.getElementById('name').value.trim();
        if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        } else {
            hideError('nameError');
        }
        
        // Validate email
        const email = document.getElementById('email').value.trim();
        if (!validateEmail(email)) {
            showError('emailError', 'Please enter a valid email (e.g., user@example.com)');
            isValid = false;
        } else if (users.some(user => user.email === email)) {
            showError('emailError', 'This email is already registered');
            isValid = false;
        } else {
            hideError('emailError');
        }
        
        // Validate password
        const password = document.getElementById('password').value;
        if (!validatePassword(password)) {
            showError('passwordError', 'Password does not meet all requirements');
            isValid = false;
        } else {
            hideError('passwordError');
        }
        
        // Validate password confirmation
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            showError('confirmError', 'Passwords do not match');
            isValid = false;
        } else {
            hideError('confirmError');
        }
        
        if (isValid) {
            // Save user (in real app, send to server)
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            showMessage('success', 'Account created successfully! Please login.');
            document.getElementById('signupForm').reset();
            
            // Switch to login form
            toggleBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            document.querySelector('.toggle-btn[data-form="login"]').classList.add('active');
            loginForm.classList.add('active');
            
            // Auto-fill login email
            document.getElementById('loginEmail').value = email;
        }
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate email
        const email = document.getElementById('loginEmail').value.trim();
        if (!validateEmail(email)) {
            showError('loginEmailError', 'Please enter a valid email address');
            isValid = false;
        } else if (!users.some(user => user.email === email)) {
            showError('loginEmailError', 'No account found. Please sign up first');
            isValid = false;
        } else {
            hideError('loginEmailError');
        }
        
        // Validate password
        const password = document.getElementById('loginPassword').value;
        const user = users.find(user => user.email === email);
        
        if (password.length < 8) {
            showError('loginPasswordError', 'Password must be at least 8 characters');
            isValid = false;
        } else if (user && user.password !== password) {
            showError('loginPasswordError', 'Invalid password. Please try again');
            isValid = false;
        } else {
            hideError('loginPasswordError');
        }
        
        if (isValid) {
            if (user && user.password === password) {
                showMessage('success', 'Login successful! Redirecting...');
                // In real app, you would set authentication token and redirect
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showMessage('error', 'Invalid email or password');
            }
        }
    });
    
    // Real-time validation for signup form
    document.getElementById('password').addEventListener('input', function() {
        validatePassword(this.value);
    });

    // Add focus effects to inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('label').style.color = '#f39c12';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.querySelector('label').style.color = '#2c3e50';
        });
    });
});