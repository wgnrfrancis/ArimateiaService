// Authentication module for Balcão da Cidadania
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'balcao_session';
        this.init();
    }

    init() {
        // Check for existing session on page load
        this.loadSession();
        
        // Set up session timeout
        this.setupSessionTimeout();
    }

    // Login with email and password
    async login(email, password) {
        try {
            // Validate input
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            if (!this.validateEmail(email)) {
                throw new Error('Email inválido');
            }

            // Check if it's first login with default password
            const isDefaultPassword = password === CONFIG.auth.defaultPassword;

            // Validate user against database/API
            const userData = await this.validateUser(email, password);
            
            if (!userData) {
                throw new Error('Email ou senha incorretos');
            }

            // Create session
            this.currentUser = {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                region: userData.region,
                church: userData.church,
                avatar: userData.avatar || '/assets/default-avatar.png',
                loginTime: new Date().toISOString(),
                isFirstLogin: isDefaultPassword
            };

            // Save session
            this.saveSession();

            // Redirect based on role and first login status
            if (isDefaultPassword) {
                this.redirectTo('/change-password.html');
            } else {
                this.redirectTo('/dashboard.html');
            }

            return { success: true, user: this.currentUser };

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Validate user credentials (mock implementation - replace with actual API call)
    async validateUser(email, password) {
        try {
            // In a real implementation, this would call your Power Automate flow
            // or Google Sheets API to validate the user
            
            // Mock user data for demonstration
            const mockUsers = [
                {
                    id: 1,
                    email: 'voluntario@arimateia.org',
                    name: 'João Silva',
                    role: 'VOLUNTARIO',
                    region: 'Norte',
                    church: 'Igreja Central',
                    password: CONFIG.auth.defaultPassword
                },
                {
                    id: 2,
                    email: 'secretaria@arimateia.org',
                    name: 'Maria Santos',
                    role: 'SECRETARIA',
                    region: 'Sul',
                    church: 'Igreja do Bairro Alto',
                    password: CONFIG.auth.defaultPassword
                },
                {
                    id: 3,
                    email: 'coordenador@arimateia.org',
                    name: 'Pedro Oliveira',
                    role: 'COORDENADOR',
                    region: 'Centro',
                    church: 'Igreja Central',
                    password: CONFIG.auth.defaultPassword
                }
            ];

            const user = mockUsers.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Remove password from returned data
                const { password: _, ...userData } = user;
                return userData;
            }

            return null;

        } catch (error) {
            console.error('User validation error:', error);
            return null;
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionKey);
        this.redirectTo('/index.html');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user has specific permission
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const userRole = CONFIG.roles[this.currentUser.role];
        return userRole && userRole.permissions.includes(permission);
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Get current user data
    getCurrentUser() {
        return this.currentUser;
    }

    // Save session to localStorage
    saveSession() {
        if (this.currentUser) {
            const sessionData = {
                user: this.currentUser,
                timestamp: Date.now()
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        }
    }

    // Load session from localStorage
    loadSession() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            if (sessionData) {
                const { user, timestamp } = JSON.parse(sessionData);
                
                // Check if session is still valid (not expired)
                const now = Date.now();
                const sessionAge = now - timestamp;
                
                if (sessionAge < CONFIG.auth.sessionTimeout) {
                    this.currentUser = user;
                    return true;
                }
            }
        } catch (error) {
            console.error('Session load error:', error);
        }
        
        // Clear invalid session
        localStorage.removeItem(this.sessionKey);
        return false;
    }

    // Setup session timeout
    setupSessionTimeout() {
        setInterval(() => {
            if (this.currentUser) {
                const sessionData = localStorage.getItem(this.sessionKey);
                if (sessionData) {
                    const { timestamp } = JSON.parse(sessionData);
                    const now = Date.now();
                    const sessionAge = now - timestamp;
                    
                    if (sessionAge >= CONFIG.auth.sessionTimeout) {
                        this.logout();
                        alert('Sua sessão expirou. Faça login novamente.');
                    }
                }
            }
        }, 60000); // Check every minute
    }

    // Protect page (redirect to login if not authenticated)
    protectPage(requiredPermission = null) {
        if (!this.isAuthenticated()) {
            this.redirectTo('/index.html');
            return false;
        }

        if (requiredPermission && !this.hasPermission(requiredPermission)) {
            alert('Você não tem permissão para acessar esta página.');
            this.redirectTo('/dashboard.html');
            return false;
        }

        return true;
    }

    // Redirect to specific page
    redirectTo(url) {
        window.location.href = url;
    }

    // Validate email format
    validateEmail(email) {
        return CONFIG.validation.email.pattern.test(email);
    }

    // Format CPF
    formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Validate CPF format
    validateCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
    }

    // Format phone number
    formatPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 11) {
            return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleanPhone.length === 10) {
            return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }

    // Validate phone format
    validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    // Change password (for first login)
    async changePassword(currentPassword, newPassword, confirmPassword) {
        try {
            if (!this.currentUser) {
                throw new Error('Usuário não autenticado');
            }

            if (currentPassword !== CONFIG.auth.defaultPassword) {
                throw new Error('Senha atual incorreta');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('Nova senha e confirmação não coincidem');
            }

            if (newPassword.length < 6) {
                throw new Error('Nova senha deve ter pelo menos 6 caracteres');
            }

            // In a real implementation, update password in database
            // For now, just update the session
            this.currentUser.isFirstLogin = false;
            this.saveSession();

            return { success: true, message: 'Senha alterada com sucesso!' };

        } catch (error) {
            console.error('Password change error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize auth manager
const auth = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
