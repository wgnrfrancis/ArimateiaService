// Authentication manager for Balcão da Cidadania
// Version: 1.0.0
// Dependencies: CONFIG, flowManager, Helpers

'use strict';

/**
 * Gerenciador de autenticação do sistema
 * Controla login, logout, sessões e permissões de usuários
 */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = window.CONFIG?.CACHE?.KEYS?.USER_DATA || 'balcao_user_session';
        this.tokenKey = 'balcao_auth_token';
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 horas
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutos
        
        this.loginAttempts = this.getLoginAttempts();
        this.init();
    }

    /**
     * Inicializar AuthManager
     */
    init() {
        // Verificar se há sessão salva
        this.loadSession();
        
        // Configurar interceptador para requests
        this.setupRequestInterceptor();
        
        console.log('🔐 AuthManager inicializado');
    }

    /**
     * Configurar interceptador de requests para adicionar autenticação
     */
    setupRequestInterceptor() {
        // Monitor de inatividade
        this.setupInactivityMonitor();
    }

    /**
     * Monitor de inatividade do usuário
     */
    setupInactivityMonitor() {
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            if (this.isAuthenticated()) {
                inactivityTimer = setTimeout(() => {
                    console.log('⏰ Sessão expirada por inatividade');
                    if (window.Helpers?.showToast) {
                        window.Helpers.showToast('Sessão expirada por inatividade', 'warning');
                    }
                    this.logout();
                }, this.sessionTimeout);
            }
        };

        // Eventos que resetam o timer
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    /**
     * Realizar login do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} Resultado do login
     */
    async login(email, password) {
        try {
            console.log('🔐 Tentativa de login:', email);

            // 🔧 TEMPORÁRIO: Reset de tentativas para evitar lockout durante desenvolvimento
            this.resetLoginAttempts();

            // 🔧 TEMPORÁRIO: Desativado para testes - Verificar se está em lockout
            // if (this.isLockedOut()) {
            //     throw new Error('Muitas tentativas de login. Tente novamente em alguns minutos.');
            // }

            // Validar entrada
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            // Validar email usando CONFIG ou fallback
            const emailPattern = window.CONFIG?.VALIDATION?.EMAIL?.pattern || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                throw new Error(window.CONFIG?.VALIDATION?.EMAIL?.message || 'Email inválido');
            }

            // Chamar validação via flowManager com fallback para mock em desenvolvimento
            let result;
            
            if (window.flowManager && typeof window.flowManager.validateUser === 'function') {
                try {
                    console.log('🌐 Validando via Power Automate...');
                    result = await window.flowManager.validateUser(email, password);
                } catch (error) {
                    console.error('❌ Erro no Power Automate:', error.message);
                    throw error; // Re-lançar erro em produção
                }
            } else {
                throw new Error('Sistema de autenticação não configurado - flowManager não disponível');
            }

            if (result.success && result.user) {
                // Reset tentativas de login
                this.resetLoginAttempts();
                
                // Salvar usuário na sessão
                this.currentUser = result.user;
                this.saveSession();

                console.log('✅ Login realizado com sucesso:', this.currentUser.nome || this.currentUser.name);
                return {
                    success: true,
                    user: this.currentUser,
                    message: result.message || 'Login realizado com sucesso!'
                };
            } else {
                // Incrementar tentativas de login
                this.incrementLoginAttempts();
                throw new Error(result.error || 'Credenciais inválidas');
            }

        } catch (error) {
            console.error('❌ Erro no login:', error);
            
            // Incrementar tentativas de login
            this.incrementLoginAttempts();
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Realizar logout do usuário
     * @returns {Object} Resultado do logout
     */
    logout() {
        try {
            console.log('🚪 Fazendo logout...');
            
            this.currentUser = null;
            this.clearSession();
            
            // Redirecionar para login
            if (typeof window !== 'undefined') {
                window.location.href = 'index.html';
            }

            return { success: true };

        } catch (error) {
            console.error('❌ Erro no logout:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Verificar se usuário está autenticado
     * @returns {boolean} True se autenticado
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Obter usuário atual
     * @returns {Object|null} Dados do usuário atual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Salvar sessão no localStorage
     */
    saveSession() {
        try {
            if (typeof localStorage !== 'undefined' && this.currentUser) {
                const sessionData = {
                    user: this.currentUser,
                    timestamp: new Date().toISOString(),
                    expires: new Date(Date.now() + this.sessionTimeout).toISOString()
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
                localStorage.setItem(this.tokenKey, 'active');
                console.log('💾 Sessão salva');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar sessão:', error);
        }
    }

    /**
     * Carregar sessão do localStorage
     * @returns {boolean} True se sessão foi carregada com sucesso
     */
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
                        console.log('✅ Sessão carregada:', this.currentUser.nome || this.currentUser.name);
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

    /**
     * Limpar sessão do localStorage
     */
    /**
     * Limpar sessão do localStorage
     */
    clearSession() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(this.sessionKey);
                localStorage.removeItem(this.tokenKey);
                console.log('🗑️ Sessão limpa');
            }
        } catch (error) {
            console.error('❌ Erro ao limpar sessão:', error);
        }
    }

    /**
     * Verificar se usuário tem permissão específica
     * @param {string} permission - Permissão a verificar
     * @returns {boolean} True se tem permissão
     */
    hasPermission(permission) {
        if (!this.currentUser) return false;

        const userRole = this.currentUser.cargo || this.currentUser.role;
        
        // Usar CONFIG para verificar permissões
        if (window.CONFIG?.hasPermission) {
            return window.CONFIG.hasPermission(userRole, permission);
        }

        // Fallback para permissões básicas usando CONFIG.USER_ROLES
        const role = window.CONFIG?.USER_ROLES?.find(r => r.id === userRole);
        if (role) {
            return role.permissions.includes('*') || role.permissions.includes(permission);
        }

        // Fallback final para compatibilidade
        const permissions = {
            'COORDENADOR_GERAL': ['coordenador_view', 'secretaria_view', 'balcao_view', 'dashboard_view', 'user_manage', 'reports_full', 'system_admin'],
            'COORDENADOR_LOCAL': ['coordenador_view', 'secretaria_view', 'balcao_view', 'dashboard_view', 'reports_local'],
            'SECRETARIA': ['secretaria_view', 'balcao_view', 'dashboard_view', 'reports_basic'],
            'VOLUNTARIO': ['balcao_view', 'dashboard_view']
        };

        const userPermissions = permissions[userRole] || [];
        return userPermissions.includes(permission);
    }

    /**
     * Proteger página - redirecionar se não autenticado
     * @returns {boolean} True se autenticado
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            console.log('🚫 Acesso negado - usuário não autenticado');
            if (typeof window !== 'undefined') {
                window.location.href = 'index.html';
            }
            return false;
        }
        return true;
    }

    /**
     * Verificar página atual e redirecionar se necessário
     */
    checkCurrentPage() {
        if (typeof window === 'undefined') return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const publicPages = ['index.html', 'cadastro.html'];
        
        if (!publicPages.includes(currentPage) && !this.isAuthenticated()) {
            console.log('🚫 Redirecionando para login...');
            window.location.href = 'index.html';
        }
    }

    /**
     * Obter tentativas de login do localStorage
     * @returns {Object} Dados das tentativas de login
     */
    getLoginAttempts() {
        try {
            const attempts = localStorage.getItem('login_attempts');
            return attempts ? JSON.parse(attempts) : { count: 0, lastAttempt: null };
        } catch (error) {
            return { count: 0, lastAttempt: null };
        }
    }

    /**
     * Incrementar tentativas de login
     */
    incrementLoginAttempts() {
        try {
            const attempts = {
                count: this.loginAttempts.count + 1,
                lastAttempt: new Date().toISOString()
            };
            localStorage.setItem('login_attempts', JSON.stringify(attempts));
            this.loginAttempts = attempts;
        } catch (error) {
            console.error('Erro ao incrementar tentativas de login:', error);
        }
    }

    /**
     * Resetar tentativas de login
     */
    resetLoginAttempts() {
        try {
            localStorage.removeItem('login_attempts');
            this.loginAttempts = { count: 0, lastAttempt: null };
        } catch (error) {
            console.error('Erro ao resetar tentativas de login:', error);
        }
    }

    /**
     * Verificar se usuário está em lockout
     * @returns {boolean} True se em lockout
     */
    isLockedOut() {
        if (this.loginAttempts.count >= this.maxLoginAttempts) {
            const lastAttempt = new Date(this.loginAttempts.lastAttempt);
            const now = new Date();
            const timeDiff = now - lastAttempt;
            
            if (timeDiff < this.lockoutDuration) {
                return true;
            } else {
                // Lockout expirou, resetar tentativas
                this.resetLoginAttempts();
            }
        }
        return false;
    }

    /**
     * Obter nível de acesso do usuário atual
     * @returns {number} Nível de acesso (0-4)
     */
    /**
     * Obter nível de acesso do usuário atual
     * @returns {number} Nível de acesso (0-4)
     */
    getUserLevel() {
        if (!this.currentUser) return 0;
        
        const userRole = this.currentUser.cargo || this.currentUser.role;
        
        // Usar CONFIG.USER_ROLES para obter nível
        const role = window.CONFIG?.USER_ROLES?.find(r => r.id === userRole);
        if (role) {
            // Mapear roles para níveis numéricos
            const levelMap = {
                'COORDENADOR_GERAL': 4,
                'COORDENADOR_LOCAL': 3,
                'SECRETARIA': 2,
                'VOLUNTARIO': 1,
                'PROFISSIONAL': 1
            };
            return levelMap[userRole] || 0;
        }
        
        return 0;
    }

    /**
     * Verificar se o usuário tem acesso à funcionalidade
     * @param {string} feature - Nome da funcionalidade
     * @returns {boolean} True se tem acesso
     */
    canAccess(feature) {
        if (!this.isAuthenticated()) return false;
        
        const userLevel = this.getUserLevel();
        const featureRequirements = {
            'analytics': 3,
            'user_management': 4,
            'system_settings': 4,
            'reports': 2,
            'secretaria': 2,
            'coordenador': 3,
            'balcao': 1
        };
        
        const requiredLevel = featureRequirements[feature] || 1;
        return userLevel >= requiredLevel;
    }

    /**
     * Atualizar dados do usuário na sessão
     * @param {Object} userData - Novos dados do usuário
     */
    updateUser(userData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...userData };
            this.saveSession();
        }
    }
}

// Inicializar globalmente
window.authManager = new AuthManager();

// Verificar autenticação na carga da página
document.addEventListener('DOMContentLoaded', () => {
    authManager.checkCurrentPage();
});

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

console.log('✅ Auth.js carregado com sucesso');

