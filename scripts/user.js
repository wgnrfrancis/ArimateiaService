// User management module for Balcão da Cidadania
class UserManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = CONFIG.ui.itemsPerPage;
        this.users = [];
        this.filteredUsers = [];
    }

    // Initialize user management
    async init() {
        console.log('👥 Inicializando gerenciamento de usuários...');
        
        try {
            // Verificar autenticação
            if (!authManager.requireAuth()) {
                return;
            }

            // Configurar interface
            this.setupUI();
            
            // Carregar dados
            await this.loadUsers();
            
            console.log('✅ UserManager inicializado');

        } catch (error) {
            console.error('❌ Erro ao inicializar UserManager:', error);
            this.showMessage('Erro ao carregar página de usuários', 'error');
        }
    }

    // Setup user interface elements and event listeners
    setupUI() {
        // Botão de novo usuário
        const newUserBtn = document.getElementById('new-user-btn');
        if (newUserBtn) {
            newUserBtn.addEventListener('click', () => {
                window.location.href = 'cadastro.html';
            });
        }

        // Filtros
        const filterRegiao = document.getElementById('filter-regiao');
        const filterCargo = document.getElementById('filter-cargo');
        const filterStatus = document.getElementById('filter-status');

        if (filterRegiao) {
            filterRegiao.addEventListener('change', () => this.applyFilters());
        }
        if (filterCargo) {
            filterCargo.addEventListener('change', () => this.applyFilters());
        }
        if (filterStatus) {
            filterStatus.addEventListener('change', () => this.applyFilters());
        }

        // Busca
        const searchInput = document.getElementById('search-users');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchUsers(e.target.value);
            });
        }

        // Atualizar
        const refreshBtn = document.getElementById('refresh-users');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadUsers());
        }
    }

    // Load and display users from the server
    async loadUsers() {
        try {
            console.log('🔍 Carregando usuários...');
            
            this.showLoading(true);
            
            const result = await flowManager.getUsers();
            
            if (result.success) {
                this.users = result.data || [];
                this.filteredUsers = [...this.users];
                
                console.log('✅ Usuários carregados:', this.users.length);
                
                this.renderUsers();
                this.updateStats();
                this.populateFilters();
                
            } else {
                throw new Error(result.error || 'Erro ao carregar usuários');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar usuários:', error);
            this.showMessage('Erro ao carregar usuários: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Render user cards in the UI
    renderUsers() {
        const usersList = document.getElementById('users-list');
        if (!usersList) return;

        if (this.filteredUsers.length === 0) {
            usersList.innerHTML = `
                <div class="empty-state">
                    <h3>👥 Nenhum usuário encontrado</h3>
                    <p>Não há usuários que correspondam aos filtros aplicados.</p>
                </div>
            `;
            return;
        }

        // Paginação
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const usersToShow = this.filteredUsers.slice(startIndex, endIndex);

        usersList.innerHTML = usersToShow.map(user => `
            <div class="user-card" data-user-id="${user.id}">
                <div class="user-header">
                    <div class="user-info">
                        <h4>${this.escapeHtml(user.nome)}</h4>
                        <span class="user-email">${this.escapeHtml(user.email)}</span>
                    </div>
                    <div class="user-status">
                        <span class="status-badge ${user.status?.toLowerCase() || 'ativo'}">${user.status || 'ATIVO'}</span>
                    </div>
                </div>
                <div class="user-details">
                    <div class="detail-item">
                        <strong>Cargo:</strong> ${this.escapeHtml(user.cargo || 'N/A')}
                    </div>
                    <div class="detail-item">
                        <strong>Igreja:</strong> ${this.escapeHtml(user.igreja || 'N/A')}
                    </div>
                    <div class="detail-item">
                        <strong>Região:</strong> ${this.escapeHtml(user.regiao || 'N/A')}
                    </div>
                    <div class="detail-item">
                        <strong>Telefone:</strong> ${this.escapeHtml(user.telefone || 'N/A')}
                    </div>
                    <div class="detail-item">
                        <strong>Cadastrado em:</strong> ${this.formatDate(user.dataCadastro)}
                    </div>
                    <div class="detail-item">
                        <strong>Último acesso:</strong> ${this.formatDate(user.ultimoAcesso) || 'Nunca'}
                    </div>
                </div>
                <div class="user-stats">
                    <div class="stat-item">
                        <strong>${user.totalChamados || 0}</strong>
                        <span>Chamados</span>
                    </div>
                    <div class="stat-item">
                        <strong>${user.chamadosResolvidos || 0}</strong>
                        <span>Resolvidos</span>
                    </div>
                    <div class="stat-item">
                        <strong>${user.taxaResolucao || '0%'}</strong>
                        <span>Taxa</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn btn-sm btn-primary" onclick="userManager.viewUser('${user.id}')">
                        👤 Ver Detalhes
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="userManager.editUser('${user.id}')">
                        ✏️ Editar
                    </button>
                    ${user.status === 'ATIVO' ? 
                        `<button class="btn btn-sm btn-warning" onclick="userManager.deactivateUser('${user.id}')">
                            🚫 Desativar
                        </button>` : 
                        `<button class="btn btn-sm btn-success" onclick="userManager.activateUser('${user.id}')">
                            ✅ Ativar
                        </button>`
                    }
                </div>
            </div>
        `).join('');

        this.renderPagination();
    }

    // Render pagination controls
    renderPagination() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('users-pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Botão anterior
        if (this.currentPage > 1) {
            paginationHTML += `<button class="btn btn-sm btn-outline" onclick="userManager.goToPage(${this.currentPage - 1})">‹ Anterior</button>`;
        }

        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="btn btn-sm btn-primary">${i}</button>`;
            } else {
                paginationHTML += `<button class="btn btn-sm btn-outline" onclick="userManager.goToPage(${i})">${i}</button>`;
            }
        }

        // Botão próximo
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="btn btn-sm btn-outline" onclick="userManager.goToPage(${this.currentPage + 1})">Próximo ›</button>`;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    // Go to a specific page in the user list
    goToPage(page) {
        this.currentPage = page;
        this.renderUsers();
    }

    // Apply filters to the user list
    applyFilters() {
        const filterRegiao = document.getElementById('filter-regiao')?.value || '';
        const filterCargo = document.getElementById('filter-cargo')?.value || '';
        const filterStatus = document.getElementById('filter-status')?.value || '';

        this.filteredUsers = this.users.filter(user => {
            const matchRegiao = !filterRegiao || user.regiao === filterRegiao;
            const matchCargo = !filterCargo || user.cargo === filterCargo;
            const matchStatus = !filterStatus || user.status === filterStatus;

            return matchRegiao && matchCargo && matchStatus;
        });

        this.currentPage = 1;
        this.renderUsers();
        this.updateStats();
    }

    // Search users by query
    searchUsers(query) {
        if (!query.trim()) {
            this.applyFilters();
            return;
        }

        const searchTerm = query.toLowerCase();
        this.filteredUsers = this.users.filter(user => {
            return user.nome?.toLowerCase().includes(searchTerm) ||
                   user.email?.toLowerCase().includes(searchTerm) ||
                   user.igreja?.toLowerCase().includes(searchTerm) ||
                   user.cargo?.toLowerCase().includes(searchTerm);
        });

        this.currentPage = 1;
        this.renderUsers();
        this.updateStats();
    }

    // Populate filter options based on available data
    populateFilters() {
        // Regiões
        const filterRegiao = document.getElementById('filter-regiao');
        if (filterRegiao) {
            const regioes = [...new Set(this.users.map(u => u.regiao).filter(Boolean))];
            filterRegiao.innerHTML = '<option value="">Todas as regiões</option>' +
                regioes.map(regiao => `<option value="${regiao}">${regiao}</option>`).join('');
        }

        // Cargos
        const filterCargo = document.getElementById('filter-cargo');
        if (filterCargo) {
            const cargos = [...new Set(this.users.map(u => u.cargo).filter(Boolean))];
            filterCargo.innerHTML = '<option value="">Todos os cargos</option>' +
                cargos.map(cargo => `<option value="${cargo}">${cargo}</option>`).join('');
        }
    }

    // Update statistics displayed on the page
    updateStats() {
        const totalUsersEl = document.getElementById('total-users');
        const activeUsersEl = document.getElementById('active-users');
        const totalTicketsEl = document.getElementById('total-tickets-users');

        if (totalUsersEl) {
            totalUsersEl.textContent = this.filteredUsers.length;
        }

        if (activeUsersEl) {
            const activeUsers = this.filteredUsers.filter(u => u.status === 'ATIVO').length;
            activeUsersEl.textContent = activeUsers;
        }

        if (totalTicketsEl) {
            const totalTickets = this.filteredUsers.reduce((sum, u) => sum + (parseInt(u.totalChamados) || 0), 0);
            totalTicketsEl.textContent = totalTickets;
        }
    }

    // User action handlers
    viewUser(userId) {
        console.log('👤 Visualizar usuário:', userId);
        // Implementar modal ou página de detalhes
    }

    editUser(userId) {
        console.log('✏️ Editar usuário:', userId);
        // Implementar edição
    }

    async deactivateUser(userId) {
        if (confirm('Deseja realmente desativar este usuário?')) {
            console.log('🚫 Desativar usuário:', userId);
            // Implementar desativação
        }
    }

    async activateUser(userId) {
        console.log('✅ Ativar usuário:', userId);
        // Implementar ativação
    }

    // Utility functions
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleString('pt-BR');
        } catch {
            return dateString;
        }
    }

    showLoading(show) {
        const loadingEl = document.getElementById('users-loading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'block' : 'none';
        }
    }

    showMessage(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        // Implementar sistema de notificações
    }
}

// Initialize user manager
window.userManager = new UserManager();

// Auto-inicializar na página de usuários
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('usuarios.html')) {
        userManager.init();
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManager;
}

// Configuração de papéis e permissões
const CONFIG = {
    roles: {
        'COORDENADOR_GERAL': {
            name: 'Coordenador Geral',  // ✅ ESTE É O NOME QUE DEVE APARECER
            permissions: [
                'balcao_view',
                'balcao_create',
                'balcao_edit',
                'balcao_delete',
                'secretaria_view',
                'coordenador_view',
                'add_voluntario',
                'view_relatorios'
            ]
        },
        'COORDENADOR_LOCAL': {
            name: 'Coordenador Local',
            permissions: [
                'balcao_view',
                'balcao_create',
                'balcao_edit',
                'balcao_delete',
                'secretaria_view',
                'coordenador_view'
            ]
        },
        'VOLUNTARIO': {
            name: 'Voluntário',
            permissions: [
                'balcao_view',
                'balcao_create',
                'balcao_edit',
                'balcao_delete'
            ]
        },
        'SECRETARIA': {
            name: 'Secretaria',
            permissions: [
                'secretaria_view',
                'balcao_edit',
                'balcao_delete'
            ]
        }
    }
};
