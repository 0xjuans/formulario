// Configuración del formulario y validaciones
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const form = document.getElementById('registrationForm');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    
    // Referencias a elementos de validación
    const emailValidation = document.getElementById('email-validation');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    // Referencias a elementos de error
    const nombreError = document.getElementById('nombre-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    
    // Referencias a requisitos de contraseña
    const lengthReq = document.getElementById('length');
    const uppercaseReq = document.getElementById('uppercase');
    const lowercaseReq = document.getElementById('lowercase');
    const numberReq = document.getElementById('number');

    // Patrones de validación
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Estado del formulario
    let formState = {
        nombre: false,
        email: false,
        password: false
    };

    // Función para mostrar errores
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Función para ocultar errores
    function hideError(errorElement) {
        errorElement.classList.remove('show');
    }

    // Función para mostrar mensajes de éxito
    function showSuccess(inputElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success-state');
    }

    // Función para validar nombre
    function validateNombre() {
        const value = nombreInput.value.trim();
        
        if (value === '') {
            nombreInput.classList.add('error');
            showError(nombreError, 'El nombre es obligatorio');
            formState.nombre = false;
            return false;
        }
        
        if (value.length < 2) {
            nombreInput.classList.add('error');
            showError(nombreError, 'El nombre debe tener al menos 2 caracteres');
            formState.nombre = false;
            return false;
        }
        
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            nombreInput.classList.add('error');
            showError(nombreError, 'El nombre solo puede contener letras');
            formState.nombre = false;
            return false;
        }
        
        hideError(nombreError);
        showSuccess(nombreInput);
        formState.nombre = true;
        return true;
    }

    // Función para validar email
    function validateEmail() {
        const value = emailInput.value.trim();
        
        if (value === '') {
            emailInput.classList.add('error');
            emailValidation.innerHTML = '<i class="fas fa-times"></i>';
            emailValidation.className = 'validation-icon invalid';
            showError(emailError, 'El correo electrónico es obligatorio');
            formState.email = false;
            return false;
        }
        
        if (!emailPattern.test(value)) {
            emailInput.classList.add('error');
            emailValidation.innerHTML = '<i class="fas fa-times"></i>';
            emailValidation.className = 'validation-icon invalid';
            showError(emailError, 'Ingresa un correo electrónico válido (usuario@dominio.com)');
            formState.email = false;
            return false;
        }
        
        hideError(emailError);
        showSuccess(emailInput);
        emailValidation.innerHTML = '<i class="fas fa-check"></i>';
        emailValidation.className = 'validation-icon valid';
        formState.email = true;
        return true;
    }

    // Función para calcular la fuerza de la contraseña
    function calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };
        
        // Actualizar visualización de requisitos
        updatePasswordRequirements(checks);
        
        // Calcular puntuación
        if (checks.length) score += 1;
        if (checks.uppercase) score += 1;
        if (checks.lowercase) score += 1;
        if (checks.number) score += 1;
        if (checks.special) score += 1;
        
        return {
            score: score,
            checks: checks
        };
    }

    // Función para actualizar requisitos visuales
    function updatePasswordRequirements(checks) {
        const requirements = [
            { element: lengthReq, met: checks.length },
            { element: uppercaseReq, met: checks.uppercase },
            { element: lowercaseReq, met: checks.lowercase },
            { element: numberReq, met: checks.number }
        ];
        
        requirements.forEach(req => {
            if (req.met) {
                req.element.classList.add('met');
            } else {
                req.element.classList.remove('met');
            }
        });
    }

    // Función para actualizar la barra de fuerza
    function updateStrengthMeter(strength) {
        const { score } = strength;
        
        // Limpiar clases anteriores
        strengthFill.className = 'strength-fill';
        strengthText.className = 'strength-text';
        
        if (score === 0) {
            strengthText.textContent = 'Ingresa tu contraseña';
            return;
        }
        
        if (score <= 2) {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Contraseña débil';
        } else if (score === 3) {
            strengthFill.classList.add('fair');
            strengthText.classList.add('fair');
            strengthText.textContent = 'Contraseña regular';
        } else if (score === 4) {
            strengthFill.classList.add('good');
            strengthText.classList.add('good');
            strengthText.textContent = 'Contraseña buena';
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Contraseña fuerte';
        }
    }

    // Función para validar contraseña
    function validatePassword() {
        const value = passwordInput.value;
        
        if (value === '') {
            passwordInput.classList.add('error');
            showError(passwordError, 'La contraseña es obligatoria');
            formState.password = false;
            return false;
        }
        
        const strength = calculatePasswordStrength(value);
        updateStrengthMeter(strength);
        
        if (value.length < 8) {
            passwordInput.classList.add('error');
            showError(passwordError, 'La contraseña debe tener al menos 8 caracteres');
            formState.password = false;
            return false;
        }
        
        if (strength.score < 3) {
            passwordInput.classList.add('error');
            showError(passwordError, 'La contraseña debe cumplir más requisitos de seguridad');
            formState.password = false;
            return false;
        }
        
        hideError(passwordError);
        showSuccess(passwordInput);
        formState.password = true;
        return true;
    }

    // Función para actualizar estado del botón
    function updateSubmitButton() {
        const allValid = formState.nombre && formState.email && formState.password;
        submitBtn.disabled = !allValid;
        
        if (allValid) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    // Event Listeners para validación en tiempo real
    nombreInput.addEventListener('input', function() {
        if (nombreInput.value.length > 0) {
            validateNombre();
        } else {
            hideError(nombreError);
            nombreInput.classList.remove('error', 'success-state');
            formState.nombre = false;
        }
        updateSubmitButton();
    });

    nombreInput.addEventListener('blur', function() {
        validateNombre();
        updateSubmitButton();
    });

    emailInput.addEventListener('input', function() {
        if (emailInput.value.length > 0) {
            validateEmail();
        } else {
            hideError(emailError);
            emailInput.classList.remove('error', 'success-state');
            emailValidation.className = 'validation-icon';
            formState.email = false;
        }
        updateSubmitButton();
    });

    emailInput.addEventListener('blur', function() {
        validateEmail();
        updateSubmitButton();
    });

    passwordInput.addEventListener('input', function() {
        const value = passwordInput.value;
        
        if (value.length > 0) {
            const strength = calculatePasswordStrength(value);
            updateStrengthMeter(strength);
            
            if (value.length >= 8) {
                validatePassword();
            } else {
                hideError(passwordError);
                passwordInput.classList.remove('success-state');
                formState.password = false;
            }
        } else {
            hideError(passwordError);
            passwordInput.classList.remove('error', 'success-state');
            strengthFill.className = 'strength-fill';
            strengthText.className = 'strength-text';
            strengthText.textContent = 'Ingresa tu contraseña';
            updatePasswordRequirements({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false
            });
            formState.password = false;
        }
        updateSubmitButton();
    });

    passwordInput.addEventListener('blur', function() {
        if (passwordInput.value.length > 0) {
            validatePassword();
        }
        updateSubmitButton();
    });

    // Toggle para mostrar/ocultar contraseña
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos los campos
        const nombreValid = validateNombre();
        const emailValid = validateEmail();
        const passwordValid = validatePassword();
        
        if (nombreValid && emailValid && passwordValid) {
            // Simular envío del formulario
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
            
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
                submitBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
                
                // Mostrar mensaje de éxito
                setTimeout(() => {
                    alert('¡Formulario enviado exitosamente!\n\n' +
                          'Nombre: ' + nombreInput.value + '\n' +
                          'Email: ' + emailInput.value + '\n' +
                          'Contraseña: ' + '*'.repeat(passwordInput.value.length));
                    
                    // Resetear formulario
                    form.reset();
                    formState = { nombre: false, email: false, password: false };
                    updateSubmitButton();
                    
                    // Resetear elementos visuales
                    document.querySelectorAll('.error, .success-state').forEach(el => {
                        el.classList.remove('error', 'success-state');
                    });
                    
                    document.querySelectorAll('.error-message.show').forEach(el => {
                        el.classList.remove('show');
                    });
                    
                    emailValidation.className = 'validation-icon';
                    strengthFill.className = 'strength-fill';
                    strengthText.className = 'strength-text';
                    strengthText.textContent = 'Ingresa tu contraseña';
                    
                    updatePasswordRequirements({
                        length: false,
                        uppercase: false,
                        lowercase: false,
                        number: false
                    });
                    
                    // Resetear botón
                    setTimeout(() => {
                        submitBtn.innerHTML = '<span class="btn-text">Crear cuenta</span><i class="fas fa-arrow-right btn-icon"></i>';
                        submitBtn.style.background = '';
                    }, 2000);
                    
                }, 1000);
            }, 2000);
        } else {
            // Enfocar el primer campo con error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
        }
    });

    // Inicializar estado del botón
    updateSubmitButton();

    // Animación de entrada para los elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.input-group').forEach((el, index) => {
        el.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s both paused`;
        observer.observe(el);
    });
});
