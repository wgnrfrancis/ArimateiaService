// Authentication module for Balcão da Cidadania
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'balcao_session';
        this.init();
    }

    init() {
        // Verifica a sessão existente ao carregar a página
        this.loadSession();

        // Configura o timeout da sessão
        this.setupSessionTimeout();
    }

    // Login com email e senha
    async login(email, password) {
        try {
            // Valida a entrada
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            if (!this.validateEmail(email)) {
                throw new Error('Email inválido');
            }

            // Verifica se é o primeiro login com senha padrão
            const isDefaultPassword = password === CONFIG.auth.defaultPassword;

            // Valida o usuário contra o banco de dados/API
            const userData = await this.validateUser(email, password);

            if (!userData) {
                throw new Error('Email ou senha incorretos');
            }

            // Cria a sessão
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

            // Salva a sessão
            this.saveSession();

            // Redireciona com base na função e no status do primeiro login
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

    // Valida as credenciais do usuário (implementação real usando Apps Script)
    async validateUser(email, password) {
        try {
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'login',
                    email: email.trim(),
                    password: password.trim()
                })
            });

            // Adiciona uma verificação para o status da resposta e o tipo de conteúdo
            if (!response.ok) {
                // Se a resposta não for bem-sucedida (ex: 405 Method Not Allowed),
                // tenta ler como texto para obter a mensagem de erro do servidor
                const errorText = await response.text();
                console.error('Erro de validação do usuário: Resposta do servidor não OK', response.status, errorText);
                throw new Error(`Erro do servidor: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Se a resposta não for JSON, lê como texto e reporta o erro
                const errorText = await response.text();
                console.error('Erro de validação do usuário: Resposta não é JSON', errorText);
                throw new Error('Resposta inesperada do servidor. Esperava JSON.');
            }

            const result = await response.json();

            if (result.success) {
                return result.user;
            } else {
                // Se o JSON for válido, mas 'success' for falso, usa a mensagem do servidor
                return null;
            }

        } catch (error) {
            console.error('Erro de validação do usuário:', error);
            return null;
        }
    }

    // Método dummy para validar e-mail (substitua por uma validação mais robusta se necessário)
    validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    // Salva a sessão no localStorage
    saveSession() {
        if (this.currentUser) {
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
        }
    }

    // Carrega a sessão do localStorage
    loadSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        if (sessionData) {
            this.currentUser = JSON.parse(sessionData);
        }
    }

    // Configura o timeout da sessão
    setupSessionTimeout() {
        // Implemente a lógica de timeout aqui
        // Exemplo: verificar a cada 5 minutos se a sessão expirou
        setInterval(() => {
            if (this.currentUser && this.isSessionExpired()) {
                this.logout();
                alert('Sua sessão expirou. Faça login novamente.');
                this.redirectTo('/login.html');
            }
        }, 5 * 60 * 1000); // 5 minutos
    }

    // Verifica se a sessão expirou (exemplo: 1 hora de validade)
    isSessionExpired() {
        if (!this.currentUser || !this.currentUser.loginTime) {
            return true;
        }
        const loginTime = new Date(this.currentUser.loginTime).getTime();
        const currentTime = new Date().getTime();
        const sessionDuration = 60 * 60 * 1000; // 1 hora
        return (currentTime - loginTime) > sessionDuration;
    }

    // Logout do usuário
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        this.redirectTo('/login.html');
    }

    // Obtém o usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Redireciona para um URL
    redirectTo(url) {
        window.location.href = url;
    }
}

// Assumindo que CONFIG está definido globalmente ou importado
// Exemplo de como CONFIG poderia ser definido:
// const CONFIG = {
//     SCRIPT_URL: 'SEU_URL_DO_GOOGLE_APPS_SCRIPT_AQUI',
//     auth: {
//         defaultPassword: 'senha_padrao'
//     }
// };

// Instancia o gerenciador de autenticação
// const authManager = new AuthManager();

// Exporta para ser usado em outros módulos se estiver usando ES Modules
// export default AuthManager;

        /*
        // Mock user data for demonstration (DESATIVADO)
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
            const { password: _, ...userData } = user;
            return userData;
        }
        return null;
        */
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
        }, 60000);
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

            // Em produção: aqui você deve atualizar a senha na planilha (Apps Script)
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
