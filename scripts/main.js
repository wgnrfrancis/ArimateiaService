// Main application controller
class App {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isInitialized = false;
    }

    // ✅ INICIALIZAR APLICAÇÃO
    async init() {
        try {
            console.log('🚀 Inicializando aplicação...');
            
            // Aguardar dependências
            await this.waitForDependencies();
            
            // Inicializar página específica
            await this.initializePage();
            
            this.isInitialized = true;
            console.log('✅ Aplicação inicializada com sucesso');

        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.showError('Erro ao carregar aplicação: ' + error.message);
        }
    }

    // ✅ AGUARDAR DEPENDÊNCIAS
    async waitForDependencies() {
        const maxAttempts = 50;
        let attempts = 0;

        while (attempts < maxAttempts) {
            if (window.CONFIG && window.authManager && window.flowManager) {
                console.log('✅ Dependências carregadas');
                return;
            }
            
            console.log(`⏳ Aguardando dependências... (${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        throw new Error('Timeout: Dependências não carregaram');
    }

    // ✅ INICIALIZAR PÁGINA ESPECÍFICA
    async initializePage() {
        try {
            console.log('📄 Inicializando página:', this.currentPage);

            switch (this.currentPage) {
                case 'index.html':
                case '':
                    await this.initIndexPage();
                    break;
                case 'login.html':
                    await this.initLoginPage();
                    break;
                case 'cadastro.html':
                    await this.initCadastroPage();
                    break;
                case 'dashboard.html':
                    await this.initDashboardPage();
                    break;
                case 'chamados.html':
                    await this.initChamadosPage();
                    break;
                case 'usuarios.html':
                    await this.initUsuariosPage();
                    break;
                default:
                    console.log('📄 Página não reconhecida:', this.currentPage);
            }

        } catch (error) {
            console.error('❌ Erro ao inicializar página:', error);
            throw error;
        }
    }

    // ✅ PÁGINA INDEX
    async initIndexPage() {
        console.log('🏠 Inicializando página inicial...');
        
        // Se já está logado, redirecionar para dashboard
        if (authManager.isAuthenticated()) {
            console.log('✅ Usuário já autenticado, redirecionando...');
            window.location.href = 'dashboard.html';
            return;
        }

        // Configurar botões da página inicial
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                window.location.href = 'cadastro.html';
            });
        }

        console.log('✅ Página inicial configurada');
    }

    // ✅ PÁGINA LOGIN
    async initLoginPage() {
        console.log('🔐 Inicializando página de login...');
        
        // Se já está logado, redirecionar para dashboard
        if (authManager.isAuthenticated()) {
            console.log('✅ Usuário já autenticado, redirecionando...');
            window.location.href = 'dashboard.html';
            return;
        }

        // Configurar formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }

        // Botão de cadastro
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                window.location.href = 'cadastro.html';
            });
        }

        console.log('✅ Página de login configurada');
    }

    // ✅ PÁGINA CADASTRO
    async initCadastroPage() {
        console.log('📝 Inicializando página de cadastro...');

        // Carregar regiões e configurar selects
        await this.setupCadastroForm();

        console.log('✅ Página de cadastro configurada');
    }

    // ✅ PÁGINA DASHBOARD
    async initDashboardPage() {
        console.log('📊 Inicializando dashboard...');
        
        // Verificar autenticação
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Inicializar dashboard manager se existir
        if (window.dashboardManager) {
            await dashboardManager.init();
        }

        console.log('✅ Dashboard configurado');
    }

    // ✅ PÁGINA CHAMADOS
    async initChamadosPage() {
        console.log('🎫 Inicializando página de chamados...');
        
        // Verificar autenticação
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Inicializar gerenciador de chamados se existir
        if (window.ticketManager) {
            await ticketManager.init();
        }

        console.log('✅ Página de chamados configurada');
    }

    // ✅ PÁGINA USUÁRIOS
    async initUsuariosPage() {
        console.log('👥 Inicializando página de usuários...');
        
        // Verificar autenticação
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Inicializar gerenciador de usuários se existir
        if (window.userManager) {
            await userManager.init();
        }

        console.log('✅ Página de usuários configurada');
    }

    // ✅ PROCESSAR LOGIN
    async handleLogin() {
        try {
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            console.log('🔐 Tentando fazer login...');
            
            // Mostrar loading
            this.showLoading(true);
            
            // Fazer login
            const result = await authManager.login(email, password);
            
            if (result.success) {
                console.log('✅ Login realizado com sucesso');
                this.showMessage('Login realizado com sucesso!', 'success');
                
                // Redirecionar após 1 segundo
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } else {
                throw new Error(result.error || 'Erro ao fazer login');
            }

        } catch (error) {
            console.error('❌ Erro no login:', error);
            this.showMessage(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // ✅ CONFIGURAR FORMULÁRIO DE CADASTRO
    async setupCadastroForm() {
        try {
            const regiaoSelect = document.getElementById('regiao');
            const igrejaSelect = document.getElementById('igreja');
            
            if (!regiaoSelect || !igrejaSelect) {
                console.log('⚠️ Selects de região/igreja não encontrados');
                return;
            }

            // Carregar regiões
            console.log('🔍 Carregando regiões para cadastro...');
            
            regiaoSelect.innerHTML = '<option value="">Carregando regiões...</option>';
            regiaoSelect.disabled = true;

            const result = await flowManager.getRegioesIgrejas();
            
            if (result.success && result.data) {
                // Limpar e popular regiões
                regiaoSelect.innerHTML = '<option value="">Selecione a região</option>';
                
                result.data.regioes.forEach(regiao => {
                    const option = document.createElement('option');
                    option.value = regiao;
                    option.textContent = regiao;
                    regiaoSelect.appendChild(option);
                });
                
                regiaoSelect.disabled = false;
                
                // Armazenar dados das igrejas para uso posterior
                window.igrejasDataMain = result.data.igrejasPorRegiao;
                
                // Configurar listener para mudança de região
                regiaoSelect.addEventListener('change', (e) => {
                    const regiao = e.target.value;
                    
                    if (!regiao) {
                        igrejaSelect.innerHTML = '<option value="">Primeiro selecione uma região</option>';
                        igrejaSelect.disabled = true;
                        return;
                    }

                    // Carregar igrejas da região
                    igrejaSelect.innerHTML = '<option value="">Selecione a igreja</option>';
                    
                    const igrejasRegiao = window.igrejasDataMain[regiao] || [];
                    
                    if (igrejasRegiao.length > 0) {
                        igrejasRegiao.forEach(igreja => {
                            const option = document.createElement('option');
                            const nomeIgreja = igreja.nome || igreja;
                            option.value = nomeIgreja;
                            option.textContent = nomeIgreja;
                            igrejaSelect.appendChild(option);
                        });
                        
                        igrejaSelect.disabled = false;
                    } else {
                        igrejaSelect.innerHTML = '<option value="">Nenhuma igreja disponível</option>';
                        igrejaSelect.disabled = true;
                    }
                });

                console.log('✅ Regiões carregadas para cadastro');
                
            } else {
                throw new Error(result.error || 'Erro ao carregar regiões');
            }

            // Configurar formulário de cadastro
            const cadastroForm = document.getElementById('cadastro-form');
            if (cadastroForm) {
                cadastroForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.handleCadastro();
                });
            }

        } catch (error) {
            console.error('❌ Erro ao configurar cadastro:', error);
            const regiaoSelect = document.getElementById('regiao');
            if (regiaoSelect) {
                regiaoSelect.innerHTML = '<option value="">Erro ao carregar regiões</option>';
                regiaoSelect.disabled = false;
            }
        }
    }

    // ✅ PROCESSAR CADASTRO
    async handleCadastro() {
        try {
            // Coletar dados do formulário
            const formData = {
                nome: document.getElementById('nome')?.value?.trim(),
                email: document.getElementById('email')?.value?.trim(),
                telefone: document.getElementById('telefone')?.value?.trim(),
                cargo: document.getElementById('cargo')?.value,
                regiao: document.getElementById('regiao')?.value,
                igreja: document.getElementById('igreja')?.value,
                observacoes: document.getElementById('observacoes')?.value?.trim() || '',
                senha: document.getElementById('senha')?.value
            };

            // Validar dados
            const requiredFields = ['nome', 'email', 'telefone', 'cargo', 'regiao', 'igreja', 'senha'];
            for (const field of requiredFields) {
                if (!formData[field]) {
                    throw new Error(`Campo ${field} é obrigatório`);
                }
            }

            // Verificar confirmação de senha
            const confirmarSenha = document.getElementById('confirmar-senha')?.value;
            if (formData.senha !== confirmarSenha) {
                throw new Error('Senhas não coincidem');
            }

            console.log('👤 Criando usuário...');
            
            // Mostrar loading
            this.showLoading(true);
            
            // Criar usuário
            const result = await flowManager.createUser(formData);
            
            if (result.success) {
                console.log('✅ Usuário criado com sucesso');
                this.showMessage('Usuário cadastrado com sucesso!', 'success');
                
                // Limpar formulário
                document.getElementById('cadastro-form').reset();
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } else {
                throw new Error(result.error || 'Erro ao cadastrar usuário');
            }

        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            this.showMessage(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // ✅ UTILITÁRIOS
    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    showLoading(show) {
        const loadingElements = document.querySelectorAll('.loading, #loading');
        loadingElements.forEach(el => {
            el.style.display = show ? 'flex' : 'none';
        });

        // Desabilitar botões de submit
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(btn => {
            btn.disabled = show;
            if (show) {
                btn.textContent = '⏳ Processando...';
            } else {
                // Restaurar texto original (seria melhor salvar o texto original)
                if (btn.id === 'login-btn') btn.textContent = 'Entrar';
                if (btn.id === 'cadastro-btn') btn.textContent = 'Cadastrar';
            }
        });
    }

    showMessage(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        // Remover mensagem anterior
        const existingMessage = document.querySelector('.app-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Criar nova mensagem
        const messageEl = document.createElement('div');
        messageEl.className = `app-message ${type}`;
        messageEl.textContent = message;

        // Estilos inline básicos
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            z-index: 10000;
            max-width: 300px;
            font-weight: 500;
            ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
            ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
            ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
        `;

        document.body.appendChild(messageEl);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }
}

// ✅ INICIALIZAR APLICAÇÃO
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.app = new App();
        await app.init();
    } catch (error) {
        console.error('❌ Erro fatal na inicialização:', error);
        
        // Mostrar erro na tela
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #721c24; background: #f8d7da;">
                <h2>❌ Erro ao carregar aplicação</h2>
                <p>${error.message}</p>
                <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem;">
                    🔄 Recarregar Página
                </button>
            </div>
        `;
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
