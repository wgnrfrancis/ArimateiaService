// Authentication module for Balcão da Cidadania
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = CONFIG.auth.sessionTimeout;
        this.initializeAuth();
    }

    initializeAuth() {
        // Verificar se há sessão salva
        const savedSession = localStorage.getItem('balcao_session');
        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);
                if (this.isSessionValid(sessionData)) {
                    this.currentUser = sessionData.user;
                    console.log('✅ Sessão restaurada:', this.currentUser.nome);
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Erro ao restaurar sessão:', error);
                this.logout();
            }
        }
    }

    // Login with email and password
    async login(email, password) {
        try {
            console.log('🔐 Tentando fazer login:', email);
            
            // Validar campos
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            // Chamar API via flowManager.sendToScript
            const result = await this.validateUser(email, password);
            
            if (result.success) {
                console.log('✅ Login bem-sucedido:', result.data);
                
                // Salvar usuário e sessão
                this.currentUser = result.data;
                this.saveSession();
                
                return {
                    success: true,
                    user: this.currentUser
                };
            } else {
                throw new Error(result.error || 'Email ou senha incorretos');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Validate user credentials (via Google Apps Script)
    async validateUser(email, password) {
        try {
            console.log('🔍 Validando usuário no Google Apps Script...');
            
            // ✅ CORRIGIDO: usar 'loginUser' em vez de 'validateUser'
            const result = await flowManager.sendToScript({
                action: 'loginUser',
                email: email,
                password: password
            });

            console.log('📋 Resultado da validação:', result);
            return result;
            
        } catch (error) {
            console.error('Erro ao validar usuário na API:', error);
            return {
                success: false,
                error: error.message || 'Erro de conexão'
            };
        }
    }

    // Logout user
    logout() {
        console.log('🚪 Fazendo logout...');
        
        this.currentUser = null;
        localStorage.removeItem('balcao_session');
        
        // Redirecionar para login
        window.location.href = 'index.html';
    }

    // Save session to localStorage
    saveSession() {
        const sessionData = {
            user: this.currentUser,
            timestamp: Date.now()
        };
        
        localStorage.setItem('balcao_session', JSON.stringify(sessionData));
        console.log('💾 Sessão salva');
    }

    // Check if session is valid (not expired)
    isSessionValid(sessionData) {
        if (!sessionData || !sessionData.timestamp) {
            return false;
        }
        
        const timeElapsed = Date.now() - sessionData.timestamp;
        return timeElapsed < this.sessionTimeout;
    }

    // Get current user data
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Check if user has specific permission
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const userRole = this.currentUser.cargo;
        const roleConfig = CONFIG.roles[userRole];
        
        return roleConfig && roleConfig.permissions.includes(permission);
    }

    // Protect page (redirect to login if not authenticated)
    requireAuth() {
        if (!this.isLoggedIn()) {
            console.log('⚠️ Usuário não autenticado, redirecionando...');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    // Get user info for display
    getUserInfo() {
        return this.currentUser ? {
            id: this.currentUser.id,
            nome: this.currentUser.nome,
            email: this.currentUser.email,
            cargo: this.currentUser.cargo,
            igreja: this.currentUser.igreja,
            regiao: this.currentUser.regiao
        } : null;
    }

    // Método para atualizar dados do usuário na sessão
    updateUserData(userData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...userData };
            this.saveSession();
        }
    }
}

// Inicializar gerenciador de autenticação globalmente
window.authManager = new AuthManager();

// Verificar autenticação em páginas protegidas
document.addEventListener('DOMContentLoaded', function() {
    // Lista de páginas que requerem autenticação
    const protectedPages = ['dashboard.html', 'balcao.html', 'secretaria.html', 'coordenador.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!authManager.requireAuth()) {
            return; // Usuário será redirecionado
        }
        
        console.log('✅ Usuário autenticado:', authManager.getCurrentUser());
    }
});

// ✅ FIM DO ARQUIVO - nada mais depois desta linha
