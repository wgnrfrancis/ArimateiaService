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
            console.log('📱 Inicializando página:', this.currentPage);

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
        
        // Verificar se authManager existe e está carregado
        if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
            console.log('✅ Usuário já logado, redirecionando para dashboard...');
            window.location.href = 'dashboard.html';
            return;
        }

        // Setup do formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            console.log('📝 Configurando formulário de login...');
            
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('📤 Formulário de login submetido');
                
                const email = document.getElementById('email')?.value?.trim();
                const password = document.getElementById('password')?.value;
                
                console.log('📧 Email:', email);
                
                if (!email || !password) {
                    this.showMessage('Preencha todos os campos', 'warning');
                    return;
                }

                try {
                    this.showLoading(true);
                    
                    console.log('🔐 Tentando fazer login...');
                    
                    // Verificar se authManager existe antes de usar
                    if (typeof authManager === 'undefined') {
                        throw new Error('Sistema de autenticação não carregado. Recarregue a página.');
                    }
                    
                    const result = await authManager.login(email, password);
                    
                    console.log('📋 Resultado do login:', result);
                    
                    if (result.success) {
                        this.showMessage(`Bem-vindo, ${result.user.nome}!`, 'success');
                        
                        console.log('✅ Login bem-sucedido, redirecionando...');
                        
                        // Redirecionar após pequeno delay para mostrar a mensagem
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1500);
                    } else {
                        throw new Error(result.error || 'Erro no login');
                    }
                    
                } catch (error) {
                    console.error('❌ Erro no login:', error);
                    this.showMessage(error.message || 'Erro ao fazer login', 'error');
                } finally {
                    this.showLoading(false);
                }
            });
        } else {
            console.warn('⚠️ Formulário de login não encontrado');
        }

        // Link para cadastro
        const cadastroLink = document.getElementById('cadastro-link');
        if (cadastroLink) {
            cadastroLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📝 Redirecionando para cadastro...');
                window.location.href = 'cadastro.html';
            });
        }

        // Focar no campo email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
        }
    }

    // Método próprio para mostrar mensagens (fallback se Helpers não existir)
    showMessage(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        if (typeof Helpers !== 'undefined' && Helpers.showToast) {
            Helpers.showToast(message, type);
        } else {
            // Fallback simples
            alert(message);
        }
    }

    // Método próprio para loading (fallback se Helpers não existir)
    showLoading(show = true) {
        console.log('⏳ Loading:', show);
        
        if (typeof Helpers !== 'undefined') {
            if (show && Helpers.showLoading) {
                Helpers.showLoading();
            } else if (!show && Helpers.hideLoading) {
                Helpers.hideLoading();
            }
        }
        // Se não tiver Helpers, não faz nada (loading silencioso)
    }

    initCadastroPage() {
        console.log('📝 Inicializando página de cadastro...');
        // O cadastro já tem sua própria lógica no cadastro.html
    }

    initDashboardPage() {
        console.log('📊 Inicializando dashboard...');
        
        // Verificar authManager
        if (typeof authManager === 'undefined') {
            console.error('❌ AuthManager não carregado');
            window.location.href = 'index.html';
            return;
        }
        
        if (!authManager.requireAuth()) {
            return;
        }

        this.loadDashboardData();
        this.setupDashboardEvents();
    }

    initBalcaoPage() {
        console.log('🎫 Inicializando balcão...');
        
        // Verificar authManager
        if (typeof authManager === 'undefined') {
            console.error('❌ AuthManager não carregado');
            window.location.href = 'index.html';
            return;
        }
        
        if (!authManager.requireAuth()) {
            return;
        }

        this.loadBalcaoData();
        this.setupBalcaoEvents();
    }

    initSecretariaPage() {
        console.log('📋 Inicializando secretaria...');
        
        // Verificar authManager
        if (typeof authManager === 'undefined') {
            console.error('❌ AuthManager não carregado');
            window.location.href = 'index.html';
            return;
        }
        
        if (!authManager.requireAuth()) {
            return;
        }

        // Verificar permissão de secretaria
        if (!authManager.hasPermission('secretaria_view')) {
            this.showMessage('Acesso negado. Você não tem permissão para acessar esta página.', 'error');
            window.location.href = 'dashboard.html';
            return;
        }

        this.loadSecretariaData();
        this.setupSecretariaEvents();
    }

    initCoordenadorPage() {
        console.log('👑 Inicializando coordenador...');
        
        // Verificar authManager
        if (typeof authManager === 'undefined') {
            console.error('❌ AuthManager não carregado');
            window.location.href = 'index.html';
            return;
        }
        
        if (!authManager.requireAuth()) {
            return;
        }

        // Verificar permissão de coordenador
        if (!authManager.hasPermission('coordenador_view')) {
            this.showMessage('Acesso negado. Você não tem permissão para acessar esta página.', 'error');
            window.location.href = 'dashboard.html';
            return;
        }

        this.loadCoordenadorData();
        this.setupCoordenadorEvents();
    }

    async loadDashboardData() {
        try {
            this.showLoading(true);
            
            // Carregar dados do dashboard
            const user = authManager.getCurrentUser();
            
            if (user) {
                console.log('👤 Usuário logado:', user.nome);
                // Atualizar informações do usuário na tela
                this.updateUserInfo(user);
                
                // Carregar estatísticas
                await this.loadDashboardStats(user);
            }
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            this.showMessage('Erro ao carregar dados do dashboard', 'error');
        } finally {
            this.showLoading(false);
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
            // Verificar se flowManager existe
            if (typeof flowManager === 'undefined') {
                console.warn('⚠️ FlowManager não carregado, usando dados mock');
                this.updateDashboardStats({
                    totalChamados: 0,
                    chamadosPendentes: 0,
                    chamadosResolvidos: 0,
                    taxaResolucao: 0
                });
                return;
            }

            // Buscar estatísticas do usuário
            const stats = await flowManager.sendToScript({
                action: 'getUserStats',
                userId: user.id,
                regiao: user.regiao,
                igreja: user.igreja
            });

            if (stats.success && stats.data) {
                this.updateDashboardStats(stats.data);
            } else {
                // Usar dados padrão se não conseguir carregar
                this.updateDashboardStats({
                    totalChamados: 0,
                    chamadosPendentes: 0,
                    chamadosResolvidos: 0,
                    taxaResolucao: 0
                });
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            // Usar dados padrão em caso de erro
            this.updateDashboardStats({
                totalChamados: 0,
                chamadosPendentes: 0,
                chamadosResolvidos: 0,
                taxaResolucao: 0
            });
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
        this.setupNavigationLinks();
    }

    setupSecretariaEvents() {
        this.setupNavigationLinks();
    }

    setupCoordenadorEvents() {
        this.setupNavigationLinks();
    }

    setupNavigationLinks() {
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
        const confirmLogout = () => {
            if (typeof authManager !== 'undefined') {
                authManager.logout();
            } else {
                // Fallback manual
                localStorage.removeItem('balcao_session');
                window.location.href = 'index.html';
            }
        };

        if (confirm('Tem certeza que deseja sair?')) {
            confirmLogout();
        }
    }

    loadBalcaoData() {
        console.log('📋 Carregando dados do balcão...');
    }

    loadSecretariaData() {
        console.log('📋 Carregando dados da secretaria...');
    }

    loadCoordenadorData() {
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
