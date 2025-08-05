/**
 * Balcão da Cidadania Management System
 * Handles ticket creation, management and interface for volunteers
 * Version: 2.0.0
 */

'use strict';

class BalcaoManager {
    constructor() {
        this.user = null;
        this.tickets = [];
        this.filteredTickets = [];
        this.categories = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.viewMode = 'cards'; // 'cards' or 'list'
        this.filters = {
            region: '',
            status: '',
            church: '',
            priority: '',
            search: ''
        };
        
        this.init();
    }

    /**
     * Initialize balcao manager
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthentication();
            this.setupElements();
            this.setupEventListeners();
            this.loadInitialData();
            
            console.log('✅ BalcaoManager inicializado');
        });
    }

    /**
     * Check if user is authenticated and has permission
     */
    checkAuthentication() {
        if (!window.authManager?.isAuthenticated()) {
            console.log('❌ Usuário não autenticado, redirecionando...');
            window.location.href = 'index.html';
            return;
        }

        this.user = window.authManager.getCurrentUser();
        
        // Check if user has permission to access balcao
        const allowedRoles = ['VOLUNTARIO', 'SECRETARIA', 'COORDENADOR_LOCAL', 'COORDENADOR_GERAL'];
        const userRole = this.user.cargo || this.user.role;
        
        if (!allowedRoles.includes(userRole)) {
            console.log('❌ Usuário sem permissão para acessar o balcão');
            window.location.href = 'dashboard.html';
            return;
        }

        console.log('👤 Usuário autenticado no balcão:', this.user);
    }

    /**
     * Setup DOM elements
     */
    setupElements() {
        this.elements = {
            // Header elements
            userNameElements: document.querySelectorAll('.user-name'),
            userRoleElements: document.querySelectorAll('.user-role'),
            
            // Navigation
            backToDashboard: document.getElementById('back-to-dashboard'),
            logoutBtn: document.getElementById('logout-btn'),
            
            // Action buttons
            newTicketBtn: document.getElementById('new-ticket-btn'),
            refreshTicketsBtn: document.getElementById('refresh-tickets-btn'),
            exportTicketsBtn: document.getElementById('export-tickets-btn'),
            
            // Filters
            regionFilter: document.getElementById('region-filter'),
            statusFilter: document.getElementById('status-filter'),
            churchFilter: document.getElementById('church-filter'),
            priorityFilter: document.getElementById('priority-filter'),
            ticketSearch: document.getElementById('ticket-search'),
            
            // Stats
            totalTickets: document.getElementById('total-tickets'),
            openTickets: document.getElementById('open-tickets'),
            progressTickets: document.getElementById('progress-tickets'),
            urgentTickets: document.getElementById('urgent-tickets'),
            
            // View controls
            listViewBtn: document.getElementById('list-view-btn'),
            cardViewBtn: document.getElementById('card-view-btn'),
            ticketsCount: document.getElementById('tickets-count'),
            
            // Containers
            ticketsContainer: document.getElementById('tickets-container'),
            pagination: document.getElementById('pagination'),
            
            // Modals
            newTicketModal: document.getElementById('new-ticket-modal'),
            viewTicketModal: document.getElementById('view-ticket-modal'),
            editTicketModal: document.getElementById('edit-ticket-modal'),
            
            // Forms
            newTicketForm: document.getElementById('new-ticket-form'),
            editTicketForm: document.getElementById('edit-ticket-form'),
            ticketDetails: document.getElementById('ticket-details'),
            
            // Form fields
            nomeInput: document.getElementById('nome'),
            contatoInput: document.getElementById('contato'),
            emailInput: document.getElementById('email'),
            categoriaSelect: document.getElementById('categoria'),
            prioridadeSelect: document.getElementById('prioridade'),
            demandaSelect: document.getElementById('demanda'),
            demandaContainer: document.getElementById('demanda-container'),
            descricaoTextarea: document.getElementById('descricao')
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation
        if (this.elements.backToDashboard) {
            this.elements.backToDashboard.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }

        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Action buttons
        if (this.elements.newTicketBtn) {
            this.elements.newTicketBtn.addEventListener('click', () => {
                this.openNewTicketModal();
            });
        }

        if (this.elements.refreshTicketsBtn) {
            this.elements.refreshTicketsBtn.addEventListener('click', () => {
                this.refreshTickets();
            });
        }

        if (this.elements.exportTicketsBtn) {
            this.elements.exportTicketsBtn.addEventListener('click', () => {
                this.exportTickets();
            });
        }

        // View controls
        if (this.elements.listViewBtn) {
            this.elements.listViewBtn.addEventListener('click', () => {
                this.setViewMode('list');
            });
        }

        if (this.elements.cardViewBtn) {
            this.elements.cardViewBtn.addEventListener('click', () => {
                this.setViewMode('cards');
            });
        }

        // Filters
        this.setupFilterListeners();

        // Forms
        this.setupFormListeners();

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Phone formatting
        if (this.elements.contatoInput) {
            this.elements.contatoInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }

        // Category change handler
        if (this.elements.categoriaSelect) {
            this.elements.categoriaSelect.addEventListener('change', (e) => {
                this.loadDemandas(e.target.value);
            });
        }
    }

    /**
     * Setup filter listeners
     */
    setupFilterListeners() {
        const filterElements = [
            this.elements.regionFilter,
            this.elements.statusFilter,
            this.elements.churchFilter,
            this.elements.priorityFilter
        ];

        filterElements.forEach(element => {
            if (element) {
                element.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });

        if (this.elements.ticketSearch) {
            let searchTimeout;
            this.elements.ticketSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filters.search = e.target.value.toLowerCase();
                    this.applyFilters();
                }, 300);
            });
        }
    }

    /**
     * Setup form listeners
     */
    setupFormListeners() {
        if (this.elements.newTicketForm) {
            this.elements.newTicketForm.addEventListener('submit', (e) => {
                this.handleNewTicketSubmit(e);
            });
        }

        if (this.elements.editTicketForm) {
            this.elements.editTicketForm.addEventListener('submit', (e) => {
                this.handleEditTicketSubmit(e);
            });
        }
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        try {
            console.log('📊 Carregando dados iniciais...');
            
            // Update user info
            this.updateUserInfo();
            
            // Load categories and filter options
            await this.loadCategories();
            await this.loadFilterOptions();
            
            // Load tickets
            await this.loadTickets();
            
            console.log('✅ Dados iniciais carregados');
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
            this.showErrorMessage('Erro ao carregar dados. Tente recarregar a página.');
        }
    }

    /**
     * Update user info in header
     */
    updateUserInfo() {
        if (!this.user) return;

        // Update user name
        this.elements.userNameElements.forEach(el => {
            el.textContent = this.user.nome || this.user.name || 'Usuário';
        });

        // Update user role
        const roleText = this.getRoleDisplayName(this.user.cargo || this.user.role);
        this.elements.userRoleElements.forEach(el => {
            el.textContent = roleText;
        });
    }

    /**
     * Get display name for user role
     */
    getRoleDisplayName(role) {
        const roleMap = {
            'COORDENADOR_GERAL': 'Coordenador Geral',
            'COORDENADOR_LOCAL': 'Coordenador Local',
            'SECRETARIA': 'Secretaria',
            'VOLUNTARIO': 'Voluntário'
        };
        return roleMap[role] || role || 'Usuário';
    }

    /**
     * Load categories from config or API
     */
    async loadCategories() {
        try {
            // Try to load from flowManager first
            if (window.flowManager) {
                const result = await window.flowManager.getCategories();
                if (result?.success && result.data) {
                    this.categories = result.data;
                    this.populateCategoriesSelect();
                    return;
                }
            }

            // Fallback to config categories
            if (window.CONFIG?.CATEGORIES) {
                this.categories = window.CONFIG.CATEGORIES;
                this.populateCategoriesSelect();
            }
            
        } catch (error) {
            console.error('❌ Erro ao carregar categorias:', error);
            // Use default categories
            this.categories = [
                { id: 'documentos', nome: 'Documentos', demandas: ['CPF', 'RG', 'Certidões'] },
                { id: 'beneficios', nome: 'Benefícios Sociais', demandas: ['Bolsa Família', 'Auxílio Brasil', 'BPC'] },
                { id: 'saude', nome: 'Saúde', demandas: ['Consultas', 'Exames', 'Medicamentos'] },
                { id: 'juridico', nome: 'Jurídico', demandas: ['Orientação Legal', 'Documentos Jurídicos'] }
            ];
            this.populateCategoriesSelect();
        }
    }

    /**
     * Populate categories select
     */
    populateCategoriesSelect() {
        if (!this.elements.categoriaSelect) return;

        const options = this.categories.map(cat => 
            `<option value="${cat.id}">${cat.nome}</option>`
        ).join('');

        this.elements.categoriaSelect.innerHTML = `
            <option value="">Selecione a categoria</option>
            ${options}
        `;
    }

    /**
     * Load demandas based on category
     */
    loadDemandas(categoryId) {
        if (!this.elements.demandaSelect || !categoryId) {
            this.elements.demandaContainer.style.display = 'none';
            return;
        }

        const category = this.categories.find(cat => cat.id === categoryId);
        if (!category || !category.demandas) {
            this.elements.demandaContainer.style.display = 'none';
            return;
        }

        const options = category.demandas.map(demanda => 
            `<option value="${demanda}">${demanda}</option>`
        ).join('');

        this.elements.demandaSelect.innerHTML = `
            <option value="">Selecione a demanda específica</option>
            ${options}
        `;

        this.elements.demandaContainer.style.display = 'block';
    }

    /**
     * Load filter options
     */
    async loadFilterOptions() {
        try {
            // Load regions
            if (this.elements.regionFilter && window.CONFIG?.REGIONS) {
                const regionOptions = window.CONFIG.REGIONS.map(region => 
                    `<option value="${region}">${region}</option>`
                ).join('');
                
                this.elements.regionFilter.innerHTML += regionOptions;
            }

            // Load churches
            if (this.elements.churchFilter && window.CONFIG?.CHURCHES) {
                const churchOptions = window.CONFIG.CHURCHES.map(church => 
                    `<option value="${church}">${church}</option>`
                ).join('');
                
                this.elements.churchFilter.innerHTML += churchOptions;
            }

        } catch (error) {
            console.error('❌ Erro ao carregar opções de filtro:', error);
        }
    }

    /**
     * Load tickets from API
     */
    async loadTickets() {
        try {
            this.showLoadingState();

            let result;
            if (window.flowManager) {
                result = await window.flowManager.getTickets({
                    user: this.user,
                    filters: this.filters
                });
            }

            if (result?.success && result.data) {
                this.tickets = result.data;
            } else {
                // Fallback to mock data
                this.tickets = this.generateMockTickets();
            }

            this.filteredTickets = [...this.tickets];
            this.updateStats();
            this.renderTickets();
            this.updateTicketsCount();

        } catch (error) {
            console.error('❌ Erro ao carregar chamados:', error);
            this.tickets = this.generateMockTickets();
            this.filteredTickets = [...this.tickets];
            this.updateStats();
            this.renderTickets();
            this.updateTicketsCount();
        }
    }

    /**
     * Generate mock tickets for development
     */
    generateMockTickets() {
        const mockTickets = [];
        const statuses = ['aberto', 'em_andamento', 'aguardando', 'resolvido'];
        const priorities = ['Baixa', 'Média', 'Alta', 'Urgente'];
        const categories = ['Documentos', 'Benefícios Sociais', 'Saúde', 'Jurídico'];

        for (let i = 1; i <= 25; i++) {
            mockTickets.push({
                id: `#${1000 + i}`,
                nome: `Cidadão ${i}`,
                contato: `(11) 9999${i.toString().padStart(4, '0')}`,
                email: `cidadao${i}@email.com`,
                categoria: categories[Math.floor(Math.random() * categories.length)],
                prioridade: priorities[Math.floor(Math.random() * priorities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                descricao: `Descrição da demanda ${i} - necessidade específica do cidadão.`,
                dataAbertura: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                voluntario: this.user.nome || this.user.name,
                igreja: this.user.igreja || 'Igreja Central',
                regiao: this.user.regiao || 'Centro'
            });
        }

        return mockTickets;
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        if (this.elements.ticketsContainer) {
            this.elements.ticketsContainer.innerHTML = `
                <div class="loading-placeholder">
                    <div class="spinner"></div>
                    <p>Carregando chamados...</p>
                </div>
            `;
        }
    }

    /**
     * Update statistics
     */
    updateStats() {
        const stats = {
            total: this.tickets.length,
            open: this.tickets.filter(t => t.status === 'aberto').length,
            progress: this.tickets.filter(t => t.status === 'em_andamento').length,
            urgent: this.tickets.filter(t => t.prioridade === 'Urgente').length
        };

        if (this.elements.totalTickets) {
            this.elements.totalTickets.textContent = stats.total;
        }
        if (this.elements.openTickets) {
            this.elements.openTickets.textContent = stats.open;
        }
        if (this.elements.progressTickets) {
            this.elements.progressTickets.textContent = stats.progress;
        }
        if (this.elements.urgentTickets) {
            this.elements.urgentTickets.textContent = stats.urgent;
        }
    }

    /**
     * Apply filters to tickets
     */
    applyFilters() {
        this.filters = {
            region: this.elements.regionFilter?.value || '',
            status: this.elements.statusFilter?.value || '',
            church: this.elements.churchFilter?.value || '',
            priority: this.elements.priorityFilter?.value || '',
            search: this.elements.ticketSearch?.value.toLowerCase() || ''
        };

        this.filteredTickets = this.tickets.filter(ticket => {
            const matchesRegion = !this.filters.region || ticket.regiao === this.filters.region;
            const matchesStatus = !this.filters.status || ticket.status === this.filters.status;
            const matchesChurch = !this.filters.church || ticket.igreja === this.filters.church;
            const matchesPriority = !this.filters.priority || ticket.prioridade === this.filters.priority;
            const matchesSearch = !this.filters.search || 
                ticket.nome.toLowerCase().includes(this.filters.search) ||
                ticket.descricao.toLowerCase().includes(this.filters.search) ||
                ticket.id.toLowerCase().includes(this.filters.search);

            return matchesRegion && matchesStatus && matchesChurch && matchesPriority && matchesSearch;
        });

        this.currentPage = 1;
        this.renderTickets();
        this.updateTicketsCount();
    }

    /**
     * Set view mode (cards or list)
     */
    setViewMode(mode) {
        this.viewMode = mode;
        
        // Update button states
        this.elements.listViewBtn?.classList.toggle('active', mode === 'list');
        this.elements.cardViewBtn?.classList.toggle('active', mode === 'cards');
        
        // Update container class
        this.elements.ticketsContainer?.classList.toggle('list-view', mode === 'list');
        
        this.renderTickets();
    }

    /**
     * Render tickets based on current view mode
     */
    renderTickets() {
        if (!this.elements.ticketsContainer) return;

        if (this.filteredTickets.length === 0) {
            this.elements.ticketsContainer.innerHTML = `
                <div class="text-center text-secondary p-4">
                    <h4>Nenhum chamado encontrado</h4>
                    <p>Tente ajustar os filtros ou criar um novo chamado.</p>
                </div>
            `;
            return;
        }

        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const ticketsToShow = this.filteredTickets.slice(startIndex, endIndex);

        let ticketsHTML = '';
        
        if (this.viewMode === 'cards') {
            ticketsHTML = ticketsToShow.map(ticket => this.renderTicketCard(ticket)).join('');
        } else {
            ticketsHTML = this.renderTicketsList(ticketsToShow);
        }

        this.elements.ticketsContainer.innerHTML = ticketsHTML;
        this.renderPagination();
    }

    /**
     * Render individual ticket card
     */
    renderTicketCard(ticket) {
        const priorityClass = `priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}`;
        const statusIcon = this.getStatusIcon(ticket.status);
        
        return `
            <div class="ticket-card" data-ticket-id="${ticket.id}" onclick="window.balcaoManager.viewTicket('${ticket.id}')">
                <div class="ticket-header">
                    <div>
                        <div class="ticket-title">${ticket.nome}</div>
                        <div class="ticket-id">${ticket.id}</div>
                    </div>
                    <div class="ticket-priority ${priorityClass}">
                        ${ticket.prioridade}
                    </div>
                </div>
                
                <div class="ticket-info">
                    <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value">${statusIcon} ${this.getStatusLabel(ticket.status)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Categoria</div>
                        <div class="info-value">${ticket.categoria}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Contato</div>
                        <div class="info-value">${ticket.contato}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Data</div>
                        <div class="info-value">${this.formatDate(ticket.dataAbertura)}</div>
                    </div>
                </div>
                
                <div class="ticket-description">
                    ${ticket.descricao.length > 100 ? ticket.descricao.substring(0, 100) + '...' : ticket.descricao}
                </div>
                
                <div class="ticket-actions">
                    <button class="btn btn-primary btn-small" onclick="window.balcaoManager.viewTicket('${ticket.id}'); event.stopPropagation();">
                        🔍 Ver Detalhes
                    </button>
                    <button class="btn btn-outline btn-small" onclick="window.balcaoManager.editTicket('${ticket.id}'); event.stopPropagation();">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-success btn-small" onclick="window.balcaoManager.callCitizen('${ticket.contato}'); event.stopPropagation();">
                        📞 Ligar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render tickets in list view
     */
    renderTicketsList(tickets) {
        const tableHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cidadão</th>
                            <th>Categoria</th>
                            <th>Prioridade</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tickets.map(ticket => `
                            <tr onclick="window.balcaoManager.viewTicket('${ticket.id}')" style="cursor: pointer;">
                                <td><strong>${ticket.id}</strong></td>
                                <td>${ticket.nome}</td>
                                <td>${ticket.categoria}</td>
                                <td><span class="ticket-priority priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}">${ticket.prioridade}</span></td>
                                <td>${this.getStatusIcon(ticket.status)} ${this.getStatusLabel(ticket.status)}</td>
                                <td>${this.formatDate(ticket.dataAbertura)}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-primary btn-small" onclick="window.balcaoManager.viewTicket('${ticket.id}'); event.stopPropagation();" title="Ver detalhes">🔍</button>
                                        <button class="btn btn-outline btn-small" onclick="window.balcaoManager.editTicket('${ticket.id}'); event.stopPropagation();" title="Editar">✏️</button>
                                        <button class="btn btn-success btn-small" onclick="window.balcaoManager.callCitizen('${ticket.contato}'); event.stopPropagation();" title="Ligar">📞</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        return tableHTML;
    }

    /**
     * Get status icon
     */
    getStatusIcon(status) {
        const icons = {
            'aberto': '🟢',
            'em_andamento': '🟡',
            'aguardando': '🟠',
            'resolvido': '✅',
            'cancelado': '❌'
        };
        return icons[status] || '⚪';
    }

    /**
     * Get status label
     */
    getStatusLabel(status) {
        const labels = {
            'aberto': 'Aberto',
            'em_andamento': 'Em Andamento',
            'aguardando': 'Aguardando Retorno',
            'resolvido': 'Resolvido',
            'cancelado': 'Cancelado'
        };
        return labels[status] || status;
    }

    /**
     * Format date
     */
    formatDate(date) {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    }

    /**
     * Update tickets count display
     */
    updateTicketsCount() {
        if (this.elements.ticketsCount) {
            const total = this.filteredTickets.length;
            const showing = Math.min(this.itemsPerPage, total - (this.currentPage - 1) * this.itemsPerPage);
            const start = total > 0 ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
            const end = (this.currentPage - 1) * this.itemsPerPage + showing;
            
            this.elements.ticketsCount.textContent = `Mostrando ${start}-${end} de ${total} chamados`;
        }
    }

    /**
     * Render pagination
     */
    renderPagination() {
        if (!this.elements.pagination) return;

        const totalPages = Math.ceil(this.filteredTickets.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.elements.pagination.style.display = 'none';
            return;
        }

        this.elements.pagination.style.display = 'flex';

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="btn btn-outline ${this.currentPage === 1 ? 'btn-disabled' : ''}" 
                    onclick="window.balcaoManager.goToPage(${this.currentPage - 1})"
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ‹
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="btn btn-outline" onclick="window.balcaoManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="btn ${i === this.currentPage ? 'btn-primary active' : 'btn-outline'}" 
                        onclick="window.balcaoManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="btn btn-outline" onclick="window.balcaoManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button class="btn btn-outline ${this.currentPage === totalPages ? 'btn-disabled' : ''}" 
                    onclick="window.balcaoManager.goToPage(${this.currentPage + 1})"
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                ›
            </button>
        `;

        this.elements.pagination.innerHTML = paginationHTML;
    }

    /**
     * Go to specific page
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredTickets.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTickets();
        }
    }

    /**
     * Open new ticket modal
     */
    openNewTicketModal() {
        if (!this.elements.newTicketModal) return;

        this.resetNewTicketForm();
        this.openModal(this.elements.newTicketModal);
        
        // Focus first input
        setTimeout(() => {
            this.elements.nomeInput?.focus();
        }, 100);
    }

    /**
     * Reset new ticket form
     */
    resetNewTicketForm() {
        if (this.elements.newTicketForm) {
            this.elements.newTicketForm.reset();
        }
        
        // Hide demanda container
        if (this.elements.demandaContainer) {
            this.elements.demandaContainer.style.display = 'none';
        }
        
        // Clear error messages
        document.querySelectorAll('.field-error').forEach(error => {
            error.textContent = '';
            error.classList.add('hidden');
        });
        
        // Remove error classes
        document.querySelectorAll('.form-input.error, .form-select.error, .form-textarea.error').forEach(input => {
            input.classList.remove('error');
        });
    }

    /**
     * Handle new ticket form submission
     */
    async handleNewTicketSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const ticketData = Object.fromEntries(formData);
            
            // Validate form
            if (!this.validateTicketForm(ticketData)) {
                return;
            }
            
            // Add additional data
            ticketData.id = `#${Date.now()}`;
            ticketData.status = 'aberto';
            ticketData.dataAbertura = new Date();
            ticketData.voluntario = this.user.nome || this.user.name;
            ticketData.igreja = this.user.igreja || 'Igreja Central';
            ticketData.regiao = this.user.regiao || 'Centro';
            
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, true);
            
            // Save ticket
            const result = await this.saveTicket(ticketData);
            
            if (result.success) {
                this.showSuccessMessage('Chamado criado com sucesso!');
                this.closeModal(this.elements.newTicketModal);
                this.refreshTickets();
            } else {
                this.showErrorMessage(result.error || 'Erro ao criar chamado. Tente novamente.');
            }
            
        } catch (error) {
            console.error('❌ Erro ao criar chamado:', error);
            this.showErrorMessage('Erro inesperado. Tente novamente.');
        } finally {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, false);
        }
    }

    /**
     * Validate ticket form
     */
    validateTicketForm(ticketData) {
        let isValid = true;
        
        // Required fields
        const requiredFields = {
            nome: 'Nome do cidadão é obrigatório',
            contato: 'Telefone é obrigatório',
            categoria: 'Categoria é obrigatória',
            prioridade: 'Prioridade é obrigatória',
            descricao: 'Descrição é obrigatória'
        };
        
        Object.entries(requiredFields).forEach(([field, message]) => {
            if (!ticketData[field]?.trim()) {
                this.showFieldError(field, message);
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        // Email validation (if provided)
        if (ticketData.email && !window.Helpers?.validateEmail(ticketData.email)) {
            this.showFieldError('email', 'Email inválido');
            isValid = false;
        }
        
        // Phone validation
        if (ticketData.contato && !this.validatePhone(ticketData.contato)) {
            this.showFieldError('contato', 'Telefone inválido');
            isValid = false;
        }
        
        return isValid;
    }

    /**
     * Validate phone number
     */
    validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    /**
     * Save ticket
     */
    async saveTicket(ticketData) {
        try {
            if (window.flowManager) {
                return await window.flowManager.createTicket(ticketData);
            }
            
            // Mock save for development
            this.tickets.unshift(ticketData);
            return { success: true };
            
        } catch (error) {
            console.error('❌ Erro ao salvar chamado:', error);
            return { success: false, error: 'Erro ao salvar chamado' };
        }
    }

    /**
     * View ticket details
     */
    async viewTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        if (!this.elements.viewTicketModal || !this.elements.ticketDetails) return;

        // Show loading state
        this.elements.ticketDetails.innerHTML = `
            <div class="loading-placeholder">
                <div class="spinner"></div>
                <p>Carregando detalhes...</p>
            </div>
        `;

        this.openModal(this.elements.viewTicketModal);

        // Load ticket details
        setTimeout(() => {
            this.renderTicketDetails(ticket);
        }, 500);
    }

    /**
     * Render ticket details
     */
    renderTicketDetails(ticket) {
        const priorityClass = `priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}`;
        const statusIcon = this.getStatusIcon(ticket.status);
        
        const detailsHTML = `
            <div class="ticket-details">
                <div class="ticket-details-header">
                    <div class="ticket-title">${ticket.nome}</div>
                    <div class="ticket-id">${ticket.id}</div>
                    <div class="ticket-priority ${priorityClass}">${ticket.prioridade}</div>
                </div>
                
                <div class="ticket-details-info">
                    <div class="grid grid-2">
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value">${statusIcon} ${this.getStatusLabel(ticket.status)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Categoria</div>
                            <div class="info-value">${ticket.categoria}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Telefone</div>
                            <div class="info-value">
                                <a href="tel:${ticket.contato}" class="text-primary">${ticket.contato}</a>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value">
                                ${ticket.email ? `<a href="mailto:${ticket.email}" class="text-primary">${ticket.email}</a>` : 'Não informado'}
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Data de Abertura</div>
                            <div class="info-value">${this.formatDate(ticket.dataAbertura)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Voluntário</div>
                            <div class="info-value">${ticket.voluntario}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Igreja</div>
                            <div class="info-value">${ticket.igreja}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Região</div>
                            <div class="info-value">${ticket.regiao}</div>
                        </div>
                    </div>
                </div>
                
                <div class="ticket-description">
                    <div class="info-label">Descrição da Demanda</div>
                    <div class="description-content">${ticket.descricao}</div>
                </div>
                
                <div class="ticket-actions">
                    <button class="btn btn-primary" onclick="window.balcaoManager.editTicket('${ticket.id}')">
                        ✏️ Editar Chamado
                    </button>
                    <button class="btn btn-success" onclick="window.balcaoManager.callCitizen('${ticket.contato}')">
                        📞 Ligar para Cidadão
                    </button>
                    <button class="btn btn-outline" onclick="window.balcaoManager.updateTicketStatus('${ticket.id}', 'em_andamento')">
                        🔄 Marcar em Andamento
                    </button>
                    <button class="btn btn-warning" onclick="window.balcaoManager.updateTicketStatus('${ticket.id}', 'resolvido')">
                        ✅ Marcar como Resolvido
                    </button>
                </div>
            </div>
        `;

        this.elements.ticketDetails.innerHTML = detailsHTML;
    }

    /**
     * Edit ticket
     */
    editTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket || !this.elements.editTicketModal) return;

        // Close view modal if open
        this.closeModal(this.elements.viewTicketModal);

        // Populate edit form
        this.populateEditForm(ticket);
        this.openModal(this.elements.editTicketModal);
    }

    /**
     * Populate edit form with ticket data
     */
    populateEditForm(ticket) {
        // Create form if it doesn't exist
        if (this.elements.editTicketForm) {
            this.elements.editTicketForm.innerHTML = `
                <input type="hidden" name="ticketId" value="${ticket.id}">
                
                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="edit-nome" class="form-label">Nome do Cidadão *</label>
                        <input type="text" id="edit-nome" name="nome" class="form-input" value="${ticket.nome}" required>
                        <span class="field-error" role="alert" aria-live="polite"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-contato" class="form-label">Telefone/WhatsApp *</label>
                        <input type="tel" id="edit-contato" name="contato" class="form-input" value="${ticket.contato}" required>
                        <span class="field-error" role="alert" aria-live="polite"></span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="edit-email" class="form-label">Email</label>
                    <input type="email" id="edit-email" name="email" class="form-input" value="${ticket.email || ''}">
                    <span class="field-error" role="alert" aria-live="polite"></span>
                </div>
                
                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="edit-categoria" class="form-label">Categoria *</label>
                        <select id="edit-categoria" name="categoria" class="form-select" required>
                            <option value="">Selecione a categoria</option>
                            ${this.categories.map(cat => 
                                `<option value="${cat.id}" ${cat.id === ticket.categoria ? 'selected' : ''}>${cat.nome}</option>`
                            ).join('')}
                        </select>
                        <span class="field-error" role="alert" aria-live="polite"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-prioridade" class="form-label">Prioridade *</label>
                        <select id="edit-prioridade" name="prioridade" class="form-select" required>
                            <option value="">Selecione a prioridade</option>
                            <option value="Baixa" ${ticket.prioridade === 'Baixa' ? 'selected' : ''}>🟢 Baixa</option>
                            <option value="Média" ${ticket.prioridade === 'Média' ? 'selected' : ''}>🟡 Média</option>
                            <option value="Alta" ${ticket.prioridade === 'Alta' ? 'selected' : ''}>🟠 Alta</option>
                            <option value="Urgente" ${ticket.prioridade === 'Urgente' ? 'selected' : ''}>🔴 Urgente</option>
                        </select>
                        <span class="field-error" role="alert" aria-live="polite"></span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="edit-status" class="form-label">Status *</label>
                    <select id="edit-status" name="status" class="form-select" required>
                        <option value="aberto" ${ticket.status === 'aberto' ? 'selected' : ''}>🟢 Aberto</option>
                        <option value="em_andamento" ${ticket.status === 'em_andamento' ? 'selected' : ''}>🟡 Em Andamento</option>
                        <option value="aguardando" ${ticket.status === 'aguardando' ? 'selected' : ''}>🟠 Aguardando Retorno</option>
                        <option value="resolvido" ${ticket.status === 'resolvido' ? 'selected' : ''}>✅ Resolvido</option>
                        <option value="cancelado" ${ticket.status === 'cancelado' ? 'selected' : ''}>❌ Cancelado</option>
                    </select>
                    <span class="field-error" role="alert" aria-live="polite"></span>
                </div>
                
                <div class="form-group">
                    <label for="edit-descricao" class="form-label">Descrição da Demanda *</label>
                    <textarea id="edit-descricao" name="descricao" class="form-textarea" rows="4" required>${ticket.descricao}</textarea>
                    <span class="field-error" role="alert" aria-live="polite"></span>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">
                        <span class="btn-text">💾 Salvar Alterações</span>
                        <span class="loading-spinner hidden" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-outline modal-close">
                        Cancelar
                    </button>
                </div>
            `;
        }
    }

    /**
     * Handle edit ticket form submission
     */
    async handleEditTicketSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const ticketData = Object.fromEntries(formData);
            
            // Validate form
            if (!this.validateTicketForm(ticketData)) {
                return;
            }
            
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, true);
            
            // Update ticket
            const result = await this.updateTicket(ticketData.ticketId, ticketData);
            
            if (result.success) {
                this.showSuccessMessage('Chamado atualizado com sucesso!');
                this.closeModal(this.elements.editTicketModal);
                this.refreshTickets();
            } else {
                this.showErrorMessage(result.error || 'Erro ao atualizar chamado. Tente novamente.');
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar chamado:', error);
            this.showErrorMessage('Erro inesperado. Tente novamente.');
        } finally {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, false);
        }
    }

    /**
     * Update ticket
     */
    async updateTicket(ticketId, ticketData) {
        try {
            if (window.flowManager) {
                return await window.flowManager.updateTicket(ticketId, ticketData);
            }
            
            // Mock update for development
            const ticketIndex = this.tickets.findIndex(t => t.id === ticketId);
            if (ticketIndex !== -1) {
                this.tickets[ticketIndex] = { ...this.tickets[ticketIndex], ...ticketData };
                return { success: true };
            }
            
            return { success: false, error: 'Chamado não encontrado' };
            
        } catch (error) {
            console.error('❌ Erro ao atualizar chamado:', error);
            return { success: false, error: 'Erro ao atualizar chamado' };
        }
    }

    /**
     * Update ticket status
     */
    async updateTicketStatus(ticketId, newStatus) {
        try {
            const result = await this.updateTicket(ticketId, { status: newStatus });
            
            if (result.success) {
                this.showSuccessMessage(`Status atualizado para: ${this.getStatusLabel(newStatus)}`);
                this.closeModal(this.elements.viewTicketModal);
                this.refreshTickets();
            } else {
                this.showErrorMessage('Erro ao atualizar status do chamado.');
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
            this.showErrorMessage('Erro inesperado. Tente novamente.');
        }
    }

    /**
     * Call citizen (open phone app)
     */
    callCitizen(phoneNumber) {
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        window.open(`tel:${cleanPhone}`, '_self');
    }

    /**
     * Refresh tickets
     */
    async refreshTickets() {
        await this.loadTickets();
        this.showSuccessMessage('Lista de chamados atualizada!');
    }

    /**
     * Export tickets
     */
    exportTickets() {
        try {
            const csvContent = this.generateCSV(this.filteredTickets);
            this.downloadCSV(csvContent, 'chamados.csv');
            this.showSuccessMessage('Arquivo exportado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            this.showErrorMessage('Erro ao exportar arquivo.');
        }
    }

    /**
     * Generate CSV content
     */
    generateCSV(tickets) {
        const headers = ['ID', 'Nome', 'Telefone', 'Email', 'Categoria', 'Prioridade', 'Status', 'Descrição', 'Data', 'Voluntário', 'Igreja', 'Região'];
        
        const rows = tickets.map(ticket => [
            ticket.id,
            ticket.nome,
            ticket.contato,
            ticket.email || '',
            ticket.categoria,
            ticket.prioridade,
            this.getStatusLabel(ticket.status),
            ticket.descricao,
            this.formatDate(ticket.dataAbertura),
            ticket.voluntario,
            ticket.igreja,
            ticket.regiao
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        return csvContent;
    }

    /**
     * Download CSV file
     */
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    /**
     * Format phone number
     */
    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        
        input.value = value;
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field) || document.getElementById(`edit-${field}`);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field) || document.getElementById(`edit-${field}`);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    /**
     * Set button loading state
     */
    setButtonLoading(button, loading) {
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.loading-spinner');

        if (loading) {
            button.disabled = true;
            if (btnText) btnText.textContent = 'Salvando...';
            if (spinner) spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (btnText) btnText.textContent = btnText.textContent.includes('Salvar') ? '💾 Salvar Chamado' : '💾 Salvar Alterações';
            if (spinner) spinner.classList.add('hidden');
        }
    }

    /**
     * Open modal
     */
    openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        if (window.Helpers?.showToast) {
            window.Helpers.showToast(message, 'success');
        } else {
            alert(message);
        }
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        if (window.Helpers?.showToast) {
            window.Helpers.showToast(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * Handle logout
     */
    async handleLogout() {
        if (confirm('Tem certeza que deseja sair do sistema?')) {
            try {
                await window.authManager?.logout();
                window.location.href = 'index.html';
            } catch (error) {
                console.error('❌ Erro ao fazer logout:', error);
            }
        }
    }
}

// Initialize balcao manager
window.balcaoManager = new BalcaoManager();

console.log('✅ Balcao script carregado');