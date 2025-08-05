/**
 * Login Script - Balcão da Cidadania
 * Gerencia o formulário de login e interação com o AuthManager
 * Version: 2.0.0
 */

'use strict';

class LoginManager {
    constructor() {
        this.form = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.loginBtn = null;
        this.isLoading = false;
        
        this.init();
    }

    /**
     * Inicializar LoginManager
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.setupEventListeners();
            this.checkExistingSession();
            
            console.log('🔐 LoginManager inicializado');
        });
    }

    /**
     * Configurar elementos DOM
     */
    setupElements() {
        this.form = document.getElementById('login-form');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.getElementById('login-btn');
        this.statusDiv = document.getElementById('login-status');

        if (!this.form || !this.emailInput || !this.passwordInput || !this.loginBtn) {
            console.error('❌ Elementos essenciais do formulário não encontrados');
            return;
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        if (!this.form) return;

        // Submit do formulário
        this.form.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Validação em tempo real
        this.emailInput?.addEventListener('blur', () => {
            this.validateField(this.emailInput, 'email');
        });

        this.passwordInput?.addEventListener('blur', () => {
            this.validateField(this.passwordInput, 'password');
        });

        // Limpar erros ao digitar
        this.emailInput?.addEventListener('input', () => {
            this.clearFieldError(this.emailInput);
        });

        this.passwordInput?.addEventListener('input', () => {
            this.clearFieldError(this.passwordInput);
        });

        // Link "Esqueceu sua senha"
        const forgotPasswordBtn = document.getElementById('forgot-password');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Enter nos campos
        this.emailInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.passwordInput?.focus();
            }
        });

        this.passwordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.form?.dispatchEvent(new Event('submit'));
            }
        });
    }

    /**
     * Verificar se já existe sessão ativa
     */
    checkExistingSession() {
        if (window.authManager?.isAuthenticated()) {
            console.log('✅ Usuário já autenticado, redirecionando...');
            this.redirectToDashboard();
        }
    }

    /**
     * Manipular submit do formulário
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isLoading) return;

        const email = this.emailInput?.value?.trim();
        const password = this.passwordInput?.value?.trim();

        // Validar campos
        if (!this.validateForm(email, password)) {
            return;
        }

        try {
            this.setLoading(true);
            this.clearStatus();

            // Fazer login via AuthManager
            const result = await window.authManager.login(email, password);

            if (result.success) {
                this.showSuccess('Login realizado com sucesso! Redirecionando...');
                
                // Redirecionar após pequeno delay
                setTimeout(() => {
                    this.redirectToDashboard(result.user);
                }, 1500);
                
            } else {
                this.showError(result.error || 'Erro ao fazer login. Tente novamente.');
            }

        } catch (error) {
            console.error('❌ Erro no login:', error);
            this.showError('Erro inesperado. Tente novamente mais tarde.');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Validar formulário
     */
    validateForm(email, password) {
        let isValid = true;

        // Validar email
        if (!email) {
            this.showFieldError(this.emailInput, 'Email é obrigatório');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError(this.emailInput, 'Email inválido');
            isValid = false;
        } else {
            this.clearFieldError(this.emailInput);
        }

        // Validar senha
        if (!password) {
            this.showFieldError(this.passwordInput, 'Senha é obrigatória');
            isValid = false;
        } else if (password.length < 3) {
            this.showFieldError(this.passwordInput, 'Senha deve ter pelo menos 3 caracteres');
            isValid = false;
        } else {
            this.clearFieldError(this.passwordInput);
        }

        return isValid;
    }

    /**
     * Validar campo individual
     */
    validateField(field, type) {
        if (!field) return;

        const value = field.value.trim();
        
        switch (type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Email inválido');
                    return false;
                }
                break;
            case 'password':
                if (value && value.length < 3) {
                    this.showFieldError(field, 'Senha deve ter pelo menos 3 caracteres');
                    return false;
                }
                break;
        }

        this.clearFieldError(field);
        return true;
    }

    /**
     * Validar email
     */
    isValidEmail(email) {
        return window.Helpers?.validateEmail(email) || 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Mostrar erro no campo
     */
    showFieldError(field, message) {
        if (!field) return;

        field.classList.add('error');
        
        const errorId = field.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /**
     * Limpar erro do campo
     */
    clearFieldError(field) {
        if (!field) return;

        field.classList.remove('error');
        
        const errorId = field.id + '-error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /**
     * Definir estado de loading
     */
    setLoading(loading) {
        this.isLoading = loading;
        
        if (!this.loginBtn) return;

        const btnText = this.loginBtn.querySelector('.btn-text');
        const spinner = this.loginBtn.querySelector('.loading-spinner');

        if (loading) {
            this.loginBtn.disabled = true;
            this.loginBtn.classList.add('loading');
            
            if (btnText) btnText.textContent = 'Entrando...';
            if (spinner) spinner.classList.remove('hidden');
            
            // Desabilitar campos do formulário
            if (this.emailInput) this.emailInput.disabled = true;
            if (this.passwordInput) this.passwordInput.disabled = true;
            
        } else {
            this.loginBtn.disabled = false;
            this.loginBtn.classList.remove('loading');
            
            if (btnText) btnText.textContent = 'Entrar';
            if (spinner) spinner.classList.add('hidden');
            
            // Reabilitar campos do formulário
            if (this.emailInput) this.emailInput.disabled = false;
            if (this.passwordInput) this.passwordInput.disabled = false;
        }
    }

    /**
     * Mostrar mensagem de sucesso
     */
    showSuccess(message) {
        if (window.Helpers?.showToast) {
            window.Helpers.showToast(message, 'success');
        }
        
        this.showStatus(message, 'success');
    }

    /**
     * Mostrar mensagem de erro
     */
    showError(message) {
        if (window.Helpers?.showToast) {
            window.Helpers.showToast(message, 'error');
        }
        
        this.showStatus(message, 'error');
    }

    /**
     * Mostrar status no formulário
     */
    showStatus(message, type) {
        if (!this.statusDiv) return;

        this.statusDiv.className = `alert alert-${type}`;
        this.statusDiv.textContent = message;
        this.statusDiv.classList.remove('hidden');

        // Auto-hide após 5 segundos
        setTimeout(() => {
            this.clearStatus();
        }, 5000);
    }

    /**
     * Limpar mensagem de status
     */
    clearStatus() {
        if (this.statusDiv) {
            this.statusDiv.classList.add('hidden');
            this.statusDiv.textContent = '';
        }
    }

    /**
     * Redirecionar para dashboard baseado no cargo do usuário
     */
    redirectToDashboard(user = null) {
        try {
            const currentUser = user || window.authManager?.getCurrentUser();
            
            if (!currentUser) {
                console.warn('⚠️ Usuário não encontrado para redirecionamento');
                window.location.href = 'dashboard.html';
                return;
            }

            const userRole = currentUser.cargo || currentUser.role;
            
            // Definir redirecionamento baseado no cargo
            let redirectUrl = 'dashboard.html'; // Default
            
            switch (userRole) {
                case 'COORDENADOR_GERAL':
                    redirectUrl = 'dashboard.html';
                    break;
                case 'COORDENADOR_LOCAL':
                    redirectUrl = 'dashboard.html';
                    break;
                case 'SECRETARIA':
                    redirectUrl = 'secretaria.html';
                    break;
                case 'VOLUNTARIO':
                    redirectUrl = 'dashboard.html';
                    break;
                default:
                    redirectUrl = 'dashboard.html';
            }

            console.log(`🔄 Redirecionando ${userRole} para ${redirectUrl}`);
            window.location.href = redirectUrl;
            
        } catch (error) {
            console.error('❌ Erro no redirecionamento:', error);
            window.location.href = 'dashboard.html';
        }
    }

    /**
     * Manipular "Esqueceu sua senha"
     */
    handleForgotPassword() {
        if (window.Helpers?.showToast) {
            window.Helpers.showToast('Entre em contato com o administrador do sistema para recuperar sua senha.', 'info', 8000);
        } else {
            alert('Entre em contato com o administrador do sistema para recuperar sua senha.');
        }
    }

    /**
     * Preencher campos para desenvolvimento (DEBUG)
     */
    fillDemoCredentials(role = 'secretaria') {
        if (!window.CONFIG?.DEV?.DEBUG_MODE) return;

        const credentials = {
            coordenador: {
                email: 'coordenador@arimateia.org.br',
                password: '123456'
            },
            secretaria: {
                email: 'secretaria@arimateia.org.br',
                password: '123456'
            },
            voluntario: {
                email: 'voluntario@arimateia.org.br',
                password: '123456'
            },
            local: {
                email: 'coordenador.local@arimateia.org.br',
                password: '123456'
            }
        };

        const cred = credentials[role];
        if (cred) {
            if (this.emailInput) this.emailInput.value = cred.email;
            if (this.passwordInput) this.passwordInput.value = cred.password;
            
            console.log(`🔧 Credenciais de ${role} preenchidas para desenvolvimento`);
        }
    }
}

// Inicializar LoginManager
window.loginManager = new LoginManager();

// Funções globais para debug (desenvolvimento)
if (window.CONFIG?.DEV?.DEBUG_MODE) {
    window.fillDemo = (role) => window.loginManager?.fillDemoCredentials(role);
    console.log('🔧 Modo DEBUG: Use fillDemo("secretaria"), fillDemo("coordenador"), etc.');
}

console.log('✅ Login.js carregado com sucesso');