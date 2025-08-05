// Authentication manager for Balcão da Cidadania
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'balcao_user_session';
        this.init();
    }

    init() {
        // Verificar se há sessão salva
        this.loadSession();
        console.log('🔐 AuthManager inicializado');
    }

    // ✅ LOGIN
    async login(email, password) {
        try {
            console.log('🔐 Tentativa de login:', email);

            // Validar entrada
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            // Chamar validação via Google Apps Script
            const result = await flowManager.validateUser(email, password);

            if (result.success && result.user) {
                // Salvar usuário na sessão
                this.currentUser = result.user;
                this.saveSession();

                console.log('✅ Login realizado com sucesso:', this.currentUser);
                return {
                    success: true,
                    user: this.currentUser,
                    message: result.message || 'Login realizado com sucesso!'
                };
            } else {
                throw new Error(result.error || 'Erro ao fazer login');
            }

        } catch (error) {
            console.error('❌ Erro no login:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ✅ LOGOUT
    logout() {
        try {
            console.log('🚪 Fazendo logout...');
            
            this.currentUser = null;
            this.clearSession();
            
            // Redirecionar para login
            if (typeof window !== 'undefined') {
                window.location.href = 'login.html';
            }

            return { success: true };

        } catch (error) {
            console.error('❌ Erro no logout:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ VERIFICAR SE ESTÁ LOGADO
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // ✅ OBTER USUÁRIO ATUAL
    getCurrentUser() {
        return this.currentUser;
    }

    // ✅ SALVAR SESSÃO
    saveSession() {
        try {
            if (typeof localStorage !== 'undefined' && this.currentUser) {
                const sessionData = {
                    user: this.currentUser,
                    timestamp: new Date().toISOString(),
                    expires: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString() // 24 horas
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
                console.log('💾 Sessão salva');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar sessão:', error);
        }
    }

    // ✅ CARREGAR SESSÃO
    loadSession() {
        try {
            if (typeof localStorage !== 'undefined') {
                const sessionData = localStorage.getItem(this.sessionKey);
                
                if (sessionData) {
                    const parsed = JSON.parse(sessionData);
                    const now = new Date();
                    const expires = new Date(parsed.expires);

                    if (now < expires && parsed.user) {
                        this.currentUser = parsed.user;
                        console.log('✅ Sessão carregada:', this.currentUser.name);
                        return true;
                    } else {
                        console.log('⚠️ Sessão expirada');
                        this.clearSession();
                    }
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar sessão:', error);
            this.clearSession();
        }
        return false;
    }

    // ✅ LIMPAR SESSÃO
    clearSession() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(this.sessionKey);
                console.log('🗑️ Sessão limpa');
            }
        } catch (error) {
            console.error('❌ Erro ao limpar sessão:', error);
        }
    }

    // ✅ VERIFICAR PERMISSÕES
    hasPermission(permission) {
        if (!this.currentUser) return false;

        const userRole = this.currentUser.role || this.currentUser.cargo;
        
        // Definir permissões por cargo
        const permissions = {
            'ADMIN': ['all'],
            'COORDENADOR': ['manage_users', 'manage_tickets', 'view_reports'],
            'VOLUNTARIO': ['create_tickets', 'view_tickets'],
            'ASSISTENTE': ['create_tickets']
        };

        const userPermissions = permissions[userRole] || [];
        
        return userPermissions.includes('all') || userPermissions.includes(permission);
    }

    // ✅ PROTEGER PÁGINA
    requireAuth() {
        if (!this.isAuthenticated()) {
            console.log('🚫 Acesso negado - usuário não autenticado');
            if (typeof window !== 'undefined') {
                window.location.href = 'login.html';
            }
            return false;
        }
        return true;
    }

    // ✅ VERIFICAR PÁGINA ATUAL
    checkCurrentPage() {
        if (typeof window === 'undefined') return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const publicPages = ['index.html', 'login.html', 'cadastro.html'];
        
        if (!publicPages.includes(currentPage) && !this.isAuthenticated()) {
            console.log('🚫 Redirecionando para login...');
            window.location.href = 'login.html';
        }
    }
}

// Inicializar globalmente
window.authManager = new AuthManager();

// Verificar autenticação na carga da página
document.addEventListener('DOMContentLoaded', () => {
    authManager.checkCurrentPage();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

