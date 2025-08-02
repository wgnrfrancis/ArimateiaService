// Main application logic for Balcão da Cidadania
class App {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isLoading = false;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    }

    onDOMReady() {
        console.log('🚀 App inicializado na página:', this.currentPage);
        
        // Aguardar scripts carregarem completamente
        setTimeout(() => {
            this.initializePage();
        }, 100);
    }

    initializePage() {
        try {
            // Inicializar helpers primeiro
            if (typeof Helpers !== 'undefined') {
                Helpers.initializeCommonFeatures();
            }

            // Roteamento por página
            switch (this.currentPage) {
                case 'index.html':
                case '':
                    this.initLoginPage();
                    break;
                case 'cadastro.html':
                    this.initCadastroPage();
                    break;
                case 'dashboard.html':
                    this.initDashboardPage();
                    break;
                case 'balcao.html':
                    this.initBalcaoPage();
                    break;
                case 'secretaria.html':
                    this.initSecretariaPage();
                    break;
                case 'coordenador.html':
                    this.initCoordenadorPage();
                    break;
                default:
                    console.log('Página não reconhecida:', this.currentPage);
            }
        } catch (error) {
            console.error('Erro ao inicializar página:', error);
        }
    }

    initLoginPage() {
        console.log('🔑 Inicializando página de login...');
        
        // ✅ USAR authManager em vez de auth
        // Verificar se já está logado
        if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
            console.log('✅ Usuário já logado, redirecionando...');
            window.location.href = 'dashboard.html';
            return;
        }

        // Setup do formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                
                if (!email || !password) {
                    Helpers.showToast('Preencha todos os campos', 'warning');
                    return;
                }

                try {
                    Helpers.showLoading();
                    
                    // ✅ USAR authManager.login
                    const result = await authManager.login(email, password);
                    
                    if (result.success) {
                        Helpers.showToast(`Bem-vindo, ${result.user.nome}!`, 'success');
                        
                        // Redirecionar após pequeno delay para mostrar o toast
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1500);
                    } else {
                        throw new Error(result.error || 'Erro no login');
                    }
                    
                } catch (error) {
                    console.error('❌ Erro no login:', error);
                    Helpers.showToast(error.message || 'Erro ao fazer login', 'error');
                } finally {
                    Helpers.hideLoading();
                }
            });
        }

        // Link para cadastro
        const cadastroLink = document.getElementById('cadastro-link');
        if (cadastroLink) {
            cadastroLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'cadastro.html';
            });
        }

        // Focar no campo email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
        }
    }

    initCadastroPage() {
        console.log('📝 Inicializando página de cadastro...');
        // O cadastro já tem sua própria lógica no cadastro.html
    }

    initDashboardPage() {
        console.log('📊 Inicializando dashboard...');
        
        // ✅ USAR authManager
        if (typeof authManager === 'undefined' || !authManager.requireAuth()) {
            return;
        }

        this.loadDashboardData();
        this.setupDashboardEvents();
    }

    initBalcaoPage() {
        console.log('🎫 Inicializando balcão...');
        
        // ✅ USAR authManager
        if (typeof authManager === 'undefined' || !authManager.requireAuth()) {
            return;
        }

        this.loadBalcaoData();
        this.setupBalcaoEvents();
    }

    initSecretariaPage() {
        console.log('📋 Inicializando secretaria...');
        
        // ✅ USAR authManager
        if (typeof authManager === 'undefined' || !authManager.requireAuth()) {
            return;
        }

        // Verificar permissão de secretaria
        if (!authManager.hasPermission('secretaria_view')) {
            Helpers.showToast('Acesso negado. Você não tem permissão para acessar esta página.', 'error');
            window.location.href = 'dashboard.html';
            return;
        }

        this.loadSecretariaData();
        this.setupSecretariaEvents();
    }

    initCoordenadorPage() {
        console.log('👑 Inicializando coordenador...');
        
        // ✅ USAR authManager
        if (typeof authManager === 'undefined' || !authManager.requireAuth()) {
            return;
        }

        // Verificar permissão de coordenador
        if (!authManager.hasPermission('coordenador_view')) {
            Helpers.showToast('Acesso negado. Você não tem permissão para acessar esta página.', 'error');
            window.location.href = 'dashboard.html';
            return;
        }

        this.loadCoordenadorData();
        this.setupCoordenadorEvents();
    }

    async loadDashboardData() {
        try {
            Helpers.showLoading();
            
            // Carregar dados do dashboard
            const user = authManager.getCurrentUser();
            
            // Atualizar informações do usuário na tela
            this.updateUserInfo(user);
            
            // Carregar estatísticas
            await this.loadDashboardStats(user);
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            Helpers.showToast('Erro ao carregar dados do dashboard', 'error');
        } finally {
            Helpers.hideLoading();
        }
    }

    updateUserInfo(user) {
        const userNameElements = document.querySelectorAll('.user-name');
        const userEmailElements = document.querySelectorAll('.user-email');
        const userCargoElements = document.querySelectorAll('.user-cargo');
        const userIgrejaElements = document.querySelectorAll('.user-igreja');

        userNameElements.forEach(el => el.textContent = user.nome || '');
        userEmailElements.forEach(el => el.textContent = user.email || '');
        userCargoElements.forEach(el => el.textContent = user.cargo || '');
        userIgrejaElements.forEach(el => el.textContent = user.igreja || '');
    }

    async loadDashboardStats(user) {
        try {
            // Buscar estatísticas do usuário
            const stats = await flowManager.generateReport('userStats', {
                userId: user.id,
                regiao: user.regiao,
                igreja: user.igreja
            });

            if (stats.success && stats.data) {
                this.updateDashboardStats(stats.data);
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    updateDashboardStats(stats) {
        // Atualizar cards de estatísticas
        const elements = {
            'total-chamados': stats.totalChamados || 0,
            'chamados-pendentes': stats.chamadosPendentes || 0,
            'chamados-resolvidos': stats.chamadosResolvidos || 0,
            'taxa-resolucao': (stats.taxaResolucao || 0) + '%'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    setupDashboardEvents() {
        // Botão de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Links de navegação
        this.setupNavigationLinks();
    }

    setupBalcaoEvents() {
        // Setup específico do balcão
        this.setupNavigationLinks();
    }

    setupSecretariaEvents() {
        // Setup específico da secretaria
        this.setupNavigationLinks();
    }

    setupCoordenadorEvents() {
        // Setup específico do coordenador
        this.setupNavigationLinks();
    }

    setupNavigationLinks() {
        // Links de navegação comuns
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    window.location.href = page;
                }
            });
        });
    }

    handleLogout() {
        Helpers.showConfirm(
            'Sair do sistema',
            'Tem certeza que deseja sair?',
            () => {
                // ✅ USAR authManager.logout
                authManager.logout();
            }
        );
    }

    loadBalcaoData() {
        // Implementar carregamento de dados do balcão
        console.log('📋 Carregando dados do balcão...');
    }

    loadSecretariaData() {
        // Implementar carregamento de dados da secretaria
        console.log('📋 Carregando dados da secretaria...');
    }

    loadCoordenadorData() {
        // Implementar carregamento de dados do coordenador
        console.log('📋 Carregando dados do coordenador...');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    }
}

// Inicializar aplicação
const app = new App();
app.init();

// Export para uso global
window.app = app;
