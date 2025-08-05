// Dashboard functionality
class DashboardManager {
    constructor() {
        this.stats = {
            totalChamados: 0,
            chamadosAbertos: 0,
            chamadosResolvidos: 0,
            chamadosUrgentes: 0
        };
        this.recentTickets = [];
        this.refreshInterval = null;
    }

    // ✅ INICIALIZAR DASHBOARD
    async init() {
        console.log('📊 Inicializando dashboard...');
        
        try {
            // Verificar autenticação
            if (!authManager.requireAuth()) {
                return;
            }

            // Configurar interface
            this.setupUI();
            
            // Carregar dados
            await this.loadDashboardData();
            
            // Auto-refresh
            this.startAutoRefresh();
            
            console.log('✅ Dashboard inicializado');

        } catch (error) {
            console.error('❌ Erro ao inicializar dashboard:', error);
            this.showMessage('Erro ao carregar dashboard', 'error');
        }
    }

    // ✅ CONFIGURAR INTERFACE
    setupUI() {
        // Botão de atualização
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }

        // Links de navegação rápida
        const newTicketBtn = document.getElementById('new-ticket-btn');
        if (newTicketBtn) {
            newTicketBtn.addEventListener('click', () => {
                window.location.href = 'chamados.html?action=new';
            });
        }

        const viewTicketsBtn = document.getElementById('view-tickets-btn');
        if (viewTicketsBtn) {
            viewTicketsBtn.addEventListener('click', () => {
                window.location.href = 'chamados.html';
            });
        }

        const manageUsersBtn = document.getElementById('manage-users-btn');
        if (manageUsersBtn) {
            manageUsersBtn.addEventListener('click', () => {
                window.location.href = 'usuarios.html';
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Deseja realmente sair?')) {
                    authManager.logout();
                }
            });
        }
    }

    // ✅ CARREGAR DADOS DO DASHBOARD
    async loadDashboardData() {
        try {
            console.log('🔄 Carregando dados do dashboard...');
            
            this.showLoading(true);
            
            const user = authManager.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            // Atualizar informações do usuário
            this.updateUserInfo(user);

            // Carregar estatísticas
            await this.loadStats(user);
            
            // Carregar chamados recentes
            await this.loadRecentTickets(user);
            
            console.log('✅ Dados do dashboard carregados');

        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            this.showMessage('Erro ao carregar dados: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // ✅ ATUALIZAR INFO DO USUÁRIO
    updateUserInfo(user) {
        const elements = {
            'user-name': user.name || user.nome,
            'user-role': user.role || user.cargo,
            'user-church': user.igreja,
            'user-region': user.regiao
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value) {
                element.textContent = value;
            }
        });

        // Mensagem de boas-vindas
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl && CONFIG.ui.showWelcomeMessage) {
            const hour = new Date().getHours();
            let greeting = 'Boa noite';
            if (hour < 12) greeting = 'Bom dia';
            else if (hour < 18) greeting = 'Boa tarde';
            
            welcomeEl.textContent = `${greeting}, ${user.name || user.nome}!`;
        }
    }

    // ✅ CARREGAR ESTATÍSTICAS
    async loadStats(user) {
        try {
            const result = await flowManager.getUserStats(user.id, user.regiao);
            
            if (result.success) {
                this.stats = result.data;
                this.renderStats();
            } else {
                console.warn('⚠️ Erro ao carregar estatísticas:', result.error);
                this.renderStats(); // Renderizar com valores zerados
            }

        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
            this.renderStats(); // Renderizar com valores zerados
        }
    }

    // ✅ RENDERIZAR ESTATÍSTICAS
    renderStats() {
        const statsElements = {
            'stat-total-chamados': this.stats.totalChamados || 0,
            'stat-chamados-abertos': this.stats.chamadosAbertos || 0,
            'stat-chamados-resolvidos': this.stats.chamadosResolvidos || 0,
            'stat-chamados-urgentes': this.stats.chamadosUrgentes || 0,
            'stat-taxa-resolucao': this.stats.taxaResolucao || '0%'
        };

        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                
                // Adicionar animação
                element.classList.add('stat-updated');
                setTimeout(() => {
                    element.classList.remove('stat-updated');
                }, 500);
            }
        });

        // Atualizar gráfico se existir
        this.updateCharts();
    }

    // ✅ CARREGAR CHAMADOS RECENTES
    async loadRecentTickets(user) {
        try {
            const result = await flowManager.getTickets({
                regiao: user.regiao,
                limit: 5
            });
            
            if (result.success) {
                this.recentTickets = result.data || [];
                this.renderRecentTickets();
            }

        } catch (error) {
            console.error('❌ Erro ao carregar chamados recentes:', error);
        }
    }

    // ✅ RENDERIZAR CHAMADOS RECENTES
    renderRecentTickets() {
        const recentTicketsEl = document.getElementById('recent-tickets');
        if (!recentTicketsEl) return;

        if (this.recentTickets.length === 0) {
            recentTicketsEl.innerHTML = `
                <div class="empty-state">
                    <p>📋 Nenhum chamado recente</p>
                </div>
            `;
            return;
        }

        const ticketsHTML = this.recentTickets.slice(0, 5).map(ticket => `
            <div class="recent-ticket-item" onclick="window.location.href='chamados.html?id=${ticket.id}'">
                <div class="ticket-header">
                    <span class="ticket-id">#${ticket.id}</span>
                    <span class="priority-badge ${ticket.prioridade?.toLowerCase() || 'media'}">${ticket.prioridade || 'MÉDIA'}</span>
                </div>
                <div class="ticket-info">
                    <h5>${this.escapeHtml(ticket.nomeCidadao)}</h5>
                    <p>${this.escapeHtml(ticket.descricao?.substring(0, 100) || '')}${ticket.descricao?.length > 100 ? '...' : ''}</p>
                </div>
                <div class="ticket-meta">
                    <span class="ticket-date">${this.formatDate(ticket.dataAbertura)}</span>
                    <span class="status-badge ${ticket.status?.toLowerCase() || 'aberto'}">${ticket.status || 'ABERTO'}</span>
                </div>
            </div>
        `).join('');

        recentTicketsEl.innerHTML = ticketsHTML;
    }

    // ✅ ATUALIZAR GRÁFICOS
    updateCharts() {
        // Implementar gráficos se necessário
        // Exemplo: Chart.js, D3.js, etc.
        console.log('📊 Atualizando gráficos...');
    }

    // ✅ AUTO-REFRESH
    startAutoRefresh() {
        // Limpar intervalo anterior se existir
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // Configurar novo intervalo
        this.refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refresh do dashboard...');
            this.loadDashboardData();
        }, CONFIG.ui.autoRefreshInterval);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // ✅ UTILITÁRIOS
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    }

    showLoading(show) {
        const loadingEl = document.getElementById('dashboard-loading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
    }

    showMessage(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        // Implementar sistema de notificações
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // ✅ CLEANUP
    destroy() {
        this.stopAutoRefresh();
        console.log('🧹 Dashboard cleanup concluído');
    }
}

// Inicializar
window.dashboardManager = new DashboardManager();

// Auto-inicializar na página do dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        dashboardManager.init();
    }
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    if (window.dashboardManager) {
        dashboardManager.destroy();
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}