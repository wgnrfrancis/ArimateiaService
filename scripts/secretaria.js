/**
 * Secretaria Management System
 * Handles advanced ticket management and administration features
 * Version: 2.0.0
 */

'use strict';

class SecretariaManager {
    constructor() {
        this.user = null;
        this.tickets = [];
        this.filteredTickets = [];
        this.volunteers = [];
        this.professionals = [];
        this.categories = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.viewMode = 'cards'; // 'cards', 'table', 'kanban'
        this.sortField = 'dataAbertura';
        this.sortDirection = 'desc';
        this.currentEditingTicketId = null;
        this.currentAssigningTicketId = null;
        this.filters = {
            region: '',
            status: '',
            church: '',
            volunteer: '',
            priority: '',
            date: '',
            category: '',
            search: '',
            dateFrom: '',
            dateTo: '',
            ageGroup: ''
        };
        
        this.init();
    }

    /**
     * Initialize secretaria manager
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthentication();
            this.setupElements();
            this.setupEventListeners();
            this.loadInitialData();
            
            console.log('✅ SecretariaManager inicializado');
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
        
        // Check if user has permission to access secretaria
        const allowedRoles = ['SECRETARIA', 'COORDENADOR_LOCAL', 'COORDENADOR_GERAL'];
        const userRole = this.user.cargo || this.user.role;
        
        if (!allowedRoles.includes(userRole)) {
            console.log('❌ Usuário sem permissão para acessar a secretaria');
            window.location.href = 'dashboard.html';
            return;
        }

        console.log('👤 Usuário autenticado na secretaria:', this.user);
    }

    /**
     * Setup DOM elements
     */
    setupElements() {
        this.elements = {
            // Header elements
            userNameElements: document.querySelectorAll('.user-name'),
            userRoleElements: document.querySelectorAll('.user-role'),
            notificationBadge: document.querySelector('.notification-badge'),
            
            // Navigation
            notificationsBtn: document.getElementById('notifications-btn'),
            backToDashboard: document.getElementById('back-to-dashboard'),
            logoutBtn: document.getElementById('logout-btn'),
            
            // Action buttons
            newTicketBtn: document.getElementById('new-ticket-btn'),
            profissionaisBtn: document.getElementById('profissionais-btn'),
            assessoresBtn: document.getElementById('assessores-btn'),
            relatoriosBtn: document.getElementById('relatorios-btn'),
            exportTicketsBtn: document.getElementById('export-tickets-btn'),
            refreshTicketsBtn: document.getElementById('refresh-tickets-btn'),
            
            // Filters
            regionFilter: document.getElementById('region-filter'),
            statusFilter: document.getElementById('status-filter'),
            churchFilter: document.getElementById('church-filter'),
            volunteerFilter: document.getElementById('volunteer-filter'),
            priorityFilter: document.getElementById('priority-filter'),
            dateFilter: document.getElementById('date-filter'),
            ticketSearch: document.getElementById('ticket-search'),
            advancedFiltersBtn: document.getElementById('advanced-filters-btn'),
            advancedFiltersPanel: document.getElementById('advanced-filters-panel'),
            categoryFilter: document.getElementById('category-filter'),
            dateFrom: document.getElementById('date-from'),
            dateTo: document.getElementById('date-to'),
            ageGroupFilter: document.getElementById('age-group-filter'),
            
            // Stats
            totalTickets: document.getElementById('total-tickets'),
            openTickets: document.getElementById('open-tickets'),
            progressTickets: document.getElementById('progress-tickets'),
            resolvedTickets: document.getElementById('resolved-tickets'),
            urgentTickets: document.getElementById('urgent-tickets'),
            avgResolutionTime: document.getElementById('avg-resolution-time'),
            
            // View controls
            cardViewBtn: document.getElementById('card-view-btn'),
            tableViewBtn: document.getElementById('table-view-btn'),
            kanbanViewBtn: document.getElementById('kanban-view-btn'),
            ticketsCount: document.getElementById('tickets-count'),
            
            // Containers
            ticketsCardView: document.getElementById('tickets-card-view'),
            ticketsTableView: document.getElementById('tickets-table-view'),
            ticketsKanbanView: document.getElementById('tickets-kanban-view'),
            ticketsTableBody: document.getElementById('tickets-table-body'),
            pagination: document.getElementById('pagination'),
            
            // Modals
            newTicketModal: document.getElementById('new-ticket-modal'),
            editTicketModal: document.getElementById('edit-ticket-modal'),
            viewTicketModal: document.getElementById('view-ticket-modal'),
            assignProfessionalModal: document.getElementById('assign-professional-modal'),
            
            // Forms
            newTicketForm: document.getElementById('new-ticket-form'),
            editTicketForm: document.getElementById('edit-ticket-form'),
            assignProfessionalForm: document.getElementById('assign-professional-form'),
            ticketDetails: document.getElementById('ticket-details'),
            
            // Form fields (new ticket)
            nomeInput: document.getElementById('nome'),
            contatoInput: document.getElementById('contato'),
            emailInput: document.getElementById('email'),
            cpfInput: document.getElementById('cpf'),
            igrejaSelect: document.getElementById('igreja'),
            regiaoSelect: document.getElementById('regiao'),
            categoriaSelect: document.getElementById('categoria'),
            prioridadeSelect: document.getElementById('prioridade'),
            demandaSelect: document.getElementById('demanda'),
            demandaContainer: document.getElementById('demanda-container'),
            descricaoTextarea: document.getElementById('descricao'),
            
            // Professional assignment
            professionalSelect: document.getElementById('professional-select'),
            assignmentNotes: document.getElementById('assignment-notes')
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

        if (this.elements.notificationsBtn) {
            this.elements.notificationsBtn.addEventListener('click', () => {
                this.openNotificationsModal();
            });
        }

        // Action buttons
        this.setupActionButtonListeners();

        // View controls
        this.setupViewControlListeners();

        // Filters
        this.setupFilterListeners();

        // Forms
        this.setupFormListeners();

        // Sort buttons
        this.setupSortListeners();

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Phone and CPF formatting
        this.setupFieldFormatting();

        // Category change handler
        if (this.elements.categoriaSelect) {
            this.elements.categoriaSelect.addEventListener('change', (e) => {
                this.loadDemandas(e.target.value);
            });
        }
    }

    /**
     * Setup action button listeners
     */
    setupActionButtonListeners() {
        if (this.elements.newTicketBtn) {
            this.elements.newTicketBtn.addEventListener('click', () => {
                this.openNewTicketModal();
            });
        }

        if (this.elements.profissionaisBtn) {
            this.elements.profissionaisBtn.addEventListener('click', () => {
                window.location.href = 'profissionais.html';
            });
        }

        if (this.elements.assessoresBtn) {
            this.elements.assessoresBtn.addEventListener('click', () => {
                window.location.href = 'assessores.html';
            });
        }

        if (this.elements.relatoriosBtn) {
            this.elements.relatoriosBtn.addEventListener('click', () => {
                window.location.href = 'relatorios.html';
            });
        }

        if (this.elements.exportTicketsBtn) {
            this.elements.exportTicketsBtn.addEventListener('click', () => {
                this.exportTickets();
            });
        }

        if (this.elements.refreshTicketsBtn) {
            this.elements.refreshTicketsBtn.addEventListener('click', () => {
                this.refreshTickets();
            });
        }

        if (this.elements.advancedFiltersBtn) {
            this.elements.advancedFiltersBtn.addEventListener('click', () => {
                this.toggleAdvancedFilters();
            });
        }
    }

    /**
     * Setup view control listeners
     */
    setupViewControlListeners() {
        if (this.elements.cardViewBtn) {
            this.elements.cardViewBtn.addEventListener('click', () => {
                this.setViewMode('cards');
            });
        }

        if (this.elements.tableViewBtn) {
            this.elements.tableViewBtn.addEventListener('click', () => {
                this.setViewMode('table');
            });
        }

        if (this.elements.kanbanViewBtn) {
            this.elements.kanbanViewBtn.addEventListener('click', () => {
                this.setViewMode('kanban');
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
            this.elements.volunteerFilter,
            this.elements.priorityFilter,
            this.elements.dateFilter,
            this.elements.categoryFilter,
            this.elements.ageGroupFilter
        ];

        filterElements.forEach(element => {
            if (element) {
                element.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });

        // Date range filters
        if (this.elements.dateFrom) {
            this.elements.dateFrom.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (this.elements.dateTo) {
            this.elements.dateTo.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Search input with debounce
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

        if (this.elements.assignProfessionalForm) {
            this.elements.assignProfessionalForm.addEventListener('submit', (e) => {
                this.handleAssignProfessionalSubmit(e);
            });
        }
    }

    /**
     * Setup sort listeners
     */
    setupSortListeners() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const field = e.target.closest('.sort-btn').getAttribute('data-sort');
                this.sortTickets(field);
            });
        });
    }

    /**
     * Setup field formatting
     */
    setupFieldFormatting() {
        // Phone formatting
        if (this.elements.contatoInput) {
            this.elements.contatoInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }

        // CPF formatting
        if (this.elements.cpfInput) {
            this.elements.cpfInput.addEventListener('input', (e) => {
                this.formatCPF(e.target);
            });
        }
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        try {
            console.log('📊 Carregando dados iniciais da secretaria...');
            
            // Update user info
            this.updateUserInfo();
            
            // Load initial data in parallel
            await Promise.all([
                this.loadCategories(),
                this.loadFilterOptions(),
                this.loadProfessionals(),
                this.loadTickets()
            ]);
            
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
            if (window.flowManager) {
                const result = await window.flowManager.getCategories();
                if (result?.success && result.data) {
                    this.categories = result.data;
                    this.populateCategoriesSelect();
                    this.populateCategoryFilter();
                    return;
                }
            }

            // Fallback to config categories
            if (window.CONFIG?.CATEGORIES) {
                this.categories = window.CONFIG.CATEGORIES;
            } else {
                // Default categories
                this.categories = [
                    { id: 'documentos', nome: 'Documentos', demandas: ['CPF', 'RG', 'Certidões', 'Título de Eleitor'] },
                    { id: 'beneficios', nome: 'Benefícios Sociais', demandas: ['Bolsa Família', 'Auxílio Brasil', 'BPC', 'LOAS'] },
                    { id: 'saude', nome: 'Saúde', demandas: ['Consultas', 'Exames', 'Medicamentos', 'Cirurgias'] },
                    { id: 'juridico', nome: 'Jurídico', demandas: ['Orientação Legal', 'Documentos Jurídicos', 'Aposentadoria'] },
                    { id: 'trabalho', nome: 'Trabalho e Renda', demandas: ['Seguro Desemprego', 'Qualificação Profissional', 'MEI'] },
                    { id: 'educacao', nome: 'Educação', demandas: ['Matrícula Escolar', 'EJA', 'Cursos Técnicos'] }
                ];
            }
            
            this.populateCategoriesSelect();
            this.populateCategoryFilter();
            
        } catch (error) {
            console.error('❌ Erro ao carregar categorias:', error);
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
     * Populate category filter
     */
    populateCategoryFilter() {
        if (!this.elements.categoryFilter) return;

        const options = this.categories.map(cat => 
            `<option value="${cat.id}">${cat.nome}</option>`
        ).join('');

        this.elements.categoryFilter.innerHTML = `
            <option value="">Todas as categorias</option>
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
            console.log('🔍 Carregando opções de filtro...');
            
            // Tentar carregar da planilha primeiro
            if (window.flowManager) {
                const result = await window.flowManager.getRegioesIgrejas();
                
                if (result?.success && result.data) {
                    const { regioes, igrejasPorRegiao } = result.data;
                    
                    // Load regions for filter
                    if (this.elements.regionFilter && regioes) {
                        const regionOptions = regioes.map(region => 
                            `<option value="${region}">${region}</option>`
                        ).join('');
                        
                        this.elements.regionFilter.innerHTML += regionOptions;
                    }

                    // Load regions for new ticket form
                    if (this.elements.regiaoSelect && regioes) {
                        const regionOptions = regioes.map(region => 
                            `<option value="${region}">${region}</option>`
                        ).join('');
                        
                        this.elements.regiaoSelect.innerHTML = `
                            <option value="">Selecione a região</option>
                            ${regionOptions}
                        `;
                    }

                    // Load all churches for filter
                    if (this.elements.churchFilter && igrejasPorRegiao) {
                        const allIgrejas = [];
                        Object.values(igrejasPorRegiao).forEach(igrejas => {
                            igrejas.forEach(igreja => {
                                const nomeIgreja = igreja.nome || igreja;
                                allIgrejas.push(nomeIgreja);
                            });
                        });
                        
                        const churchOptions = allIgrejas.map(church => 
                            `<option value="${church}">${church}</option>`
                        ).join('');
                        
                        this.elements.churchFilter.innerHTML += churchOptions;
                    }

                    // Setup hierarchical selection for new ticket form
                    if (this.elements.regiaoSelect && this.elements.igrejaSelect) {
                        this.elements.regiaoSelect.addEventListener('change', (e) => {
                            const regiao = e.target.value;
                            const igrejaSelect = this.elements.igrejaSelect;
                            
                            if (!regiao) {
                                igrejaSelect.innerHTML = '<option value="">Primeiro selecione uma região</option>';
                                return;
                            }
                            
                            const igrejasRegiao = igrejasPorRegiao[regiao] || [];
                            const churchOptions = igrejasRegiao.map(igreja => {
                                const nomeIgreja = igreja.nome || igreja;
                                return `<option value="${nomeIgreja}">${nomeIgreja}</option>`;
                            }).join('');
                            
                            igrejaSelect.innerHTML = `
                                <option value="">Selecione a igreja</option>
                                ${churchOptions}
                            `;
                        });
                    }
                    
                    console.log('✅ Opções carregadas da planilha');
                    
                } else {
                    throw new Error('Dados não disponíveis da planilha');
                }
            } else {
                throw new Error('FlowManager não disponível');
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar da planilha, usando fallback:', error);
            
            // Fallback para CONFIG
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

                // Also populate new ticket form
                if (this.elements.igrejaSelect) {
                    this.elements.igrejaSelect.innerHTML = `
                        <option value="">Selecione a igreja</option>
                        ${churchOptions}
                    `;
                }
            }

            // Load regions for new ticket form
            if (this.elements.regiaoSelect && window.CONFIG?.REGIONS) {
                const regionOptions = window.CONFIG.REGIONS.map(region => 
                    `<option value="${region}">${region}</option>`
                ).join('');
                
                this.elements.regiaoSelect.innerHTML = `
                    <option value="">Selecione a região</option>
                    ${regionOptions}
                `;
            }
        }

        try {
            // Load volunteers
            await this.loadVolunteers();
        } catch (error) {
            console.error('❌ Erro ao carregar voluntários:', error);
        }
    }

    /**
     * Load volunteers for filter
     */
    async loadVolunteers() {
        try {
            if (window.flowManager) {
                const result = await window.flowManager.getVolunteers();
                if (result?.success && result.data) {
                    this.volunteers = result.data;
                    this.populateVolunteerFilter();
                    return;
                }
            }

            // Mock volunteers for development
            this.volunteers = [
                { id: 1, nome: 'João Silva', igreja: 'Igreja Central' },
                { id: 2, nome: 'Maria Santos', igreja: 'Igreja do Bairro Alto' },
                { id: 3, nome: 'Pedro Oliveira', igreja: 'Igreja da Vila Nova' }
            ];
            
            this.populateVolunteerFilter();

        } catch (error) {
            console.error('❌ Erro ao carregar voluntários:', error);
        }
    }

    /**
     * Populate volunteer filter
     */
    populateVolunteerFilter() {
        if (!this.elements.volunteerFilter) return;

        const options = this.volunteers.map(volunteer => 
            `<option value="${volunteer.nome}">${volunteer.nome} - ${volunteer.igreja}</option>`
        ).join('');

        this.elements.volunteerFilter.innerHTML = `
            <option value="">Todos os voluntários</option>
            ${options}
        `;
    }

    /**
     * Load professionals for assignment
     */
    async loadProfessionals() {
        try {
            if (window.flowManager) {
                const result = await window.flowManager.getProfessionals();
                if (result?.success && result.data) {
                    this.professionals = result.data;
                    this.populateProfessionalsSelect();
                    return;
                }
            }

            // Mock professionals for development
            this.professionals = [
                { id: 1, nome: 'Dr. Ana Costa', especialidade: 'Clínica Geral', contato: '(11) 99999-0001' },
                { id: 2, nome: 'Dra. Carlos Lima', especialidade: 'Advogado', contato: '(11) 99999-0002' },
                { id: 3, nome: 'Psic. Fernanda Silva', especialidade: 'Psicologia', contato: '(11) 99999-0003' }
            ];
            
            this.populateProfessionalsSelect();

        } catch (error) {
            console.error('❌ Erro ao carregar profissionais:', error);
        }
    }

    /**
     * Populate professionals select
     */
    populateProfessionalsSelect() {
        if (!this.elements.professionalSelect) return;

        const options = this.professionals.map(prof => 
            `<option value="${prof.id}">${prof.nome} - ${prof.especialidade}</option>`
        ).join('');

        this.elements.professionalSelect.innerHTML = `
            <option value="">Selecione um profissional</option>
            ${options}
        `;
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
                    filters: this.filters,
                    includeAll: true // Secretaria can see all tickets
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
        const statuses = ['aberto', 'em_andamento', 'aguardando', 'resolvido', 'cancelado'];
        const priorities = ['Baixa', 'Média', 'Alta', 'Urgente'];
        const categories = ['Documentos', 'Benefícios Sociais', 'Saúde', 'Jurídico'];
        const volunteers = ['João Silva', 'Maria Santos', 'Pedro Oliveira'];
        const churches = ['Igreja Central', 'Igreja do Bairro Alto', 'Igreja da Vila Nova'];
        const regions = ['Norte', 'Sul', 'Centro'];

        for (let i = 1; i <= 50; i++) {
            const dataAbertura = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
            
            mockTickets.push({
                id: `#${2000 + i}`,
                nome: `Cidadão ${i}`,
                contato: `(11) 9999${i.toString().padStart(4, '0')}`,
                email: Math.random() > 0.3 ? `cidadao${i}@email.com` : '',
                cpf: this.generateMockCPF(),
                categoria: categories[Math.floor(Math.random() * categories.length)],
                prioridade: priorities[Math.floor(Math.random() * priorities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                descricao: `Descrição da demanda ${i} - necessidade específica do cidadão que requer atenção da secretaria.`,
                dataAbertura: dataAbertura,
                voluntario: volunteers[Math.floor(Math.random() * volunteers.length)],
                igreja: churches[Math.floor(Math.random() * churches.length)],
                regiao: regions[Math.floor(Math.random() * regions.length)],
                profissionalAtribuido: Math.random() > 0.7 ? this.professionals[Math.floor(Math.random() * this.professionals.length)]?.nome : null,
                dataResolucao: Math.random() > 0.6 ? new Date(dataAbertura.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null
            });
        }

        return mockTickets;
    }

    /**
     * Generate mock CPF
     */
    generateMockCPF() {
        const randomNum = () => Math.floor(Math.random() * 10);
        return `${randomNum()}${randomNum()}${randomNum()}.${randomNum()}${randomNum()}${randomNum()}.${randomNum()}${randomNum()}${randomNum()}-${randomNum()}${randomNum()}`;
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const containers = [
            this.elements.ticketsCardView,
            this.elements.ticketsTableView,
            this.elements.ticketsKanbanView
        ];

        containers.forEach(container => {
            if (container) {
                container.innerHTML = `
                    <div class="loading-placeholder">
                        <div class="spinner"></div>
                        <p>Carregando chamados...</p>
                    </div>
                `;
            }
        });
    }

    /**
     * Update statistics
     */
    updateStats() {
        const stats = {
            total: this.tickets.length,
            open: this.tickets.filter(t => t.status === 'aberto').length,
            progress: this.tickets.filter(t => t.status === 'em_andamento').length,
            resolved: this.tickets.filter(t => t.status === 'resolvido').length,
            urgent: this.tickets.filter(t => t.prioridade === 'Urgente').length
        };

        // Calculate average resolution time
        const resolvedTickets = this.tickets.filter(t => t.status === 'resolvido' && t.dataResolucao);
        let avgTime = 0;
        
        if (resolvedTickets.length > 0) {
            const totalTime = resolvedTickets.reduce((sum, ticket) => {
                const days = Math.floor((ticket.dataResolucao - ticket.dataAbertura) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0);
            avgTime = Math.round(totalTime / resolvedTickets.length);
        }

        // Update KPI cards
        this.updateKPICard('total-tickets', stats.total, '+5%');
        this.updateKPICard('open-tickets', stats.open, '-2%');
        this.updateKPICard('progress-tickets', stats.progress, '+12%');
        this.updateKPICard('resolved-tickets', stats.resolved, '+8%');
        this.updateKPICard('urgent-tickets', stats.urgent, stats.urgent > 5 ? '+15%' : '-3%');
        this.updateKPICard('avg-resolution-time', `${avgTime}d`, avgTime < 10 ? '-5%' : '+2%');
    }

    /**
     * Update KPI card
     */
    updateKPICard(elementId, value, trend) {
        const element = document.getElementById(elementId);
        const trendElement = document.getElementById(elementId.replace('-tickets', '-trend').replace('avg-resolution-time', 'time-trend'));
        
        if (element) {
            element.textContent = value;
        }
        
        if (trendElement) {
            trendElement.textContent = trend;
            trendElement.className = `kpi-trend ${trend.startsWith('+') ? 'positive' : 'negative'}`;
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
            volunteer: this.elements.volunteerFilter?.value || '',
            priority: this.elements.priorityFilter?.value || '',
            date: this.elements.dateFilter?.value || '',
            category: this.elements.categoryFilter?.value || '',
            search: this.elements.ticketSearch?.value.toLowerCase() || '',
            dateFrom: this.elements.dateFrom?.value || '',
            dateTo: this.elements.dateTo?.value || '',
            ageGroup: this.elements.ageGroupFilter?.value || ''
        };

        this.filteredTickets = this.tickets.filter(ticket => {
            // Basic filters
            const matchesRegion = !this.filters.region || ticket.regiao === this.filters.region;
            const matchesStatus = !this.filters.status || ticket.status === this.filters.status;
            const matchesChurch = !this.filters.church || ticket.igreja === this.filters.church;
            const matchesVolunteer = !this.filters.volunteer || ticket.voluntario === this.filters.volunteer;
            const matchesPriority = !this.filters.priority || ticket.prioridade === this.filters.priority;
            const matchesCategory = !this.filters.category || ticket.categoria === this.filters.category;
            
            // Search filter
            const matchesSearch = !this.filters.search || 
                ticket.nome.toLowerCase().includes(this.filters.search) ||
                ticket.descricao.toLowerCase().includes(this.filters.search) ||
                ticket.id.toLowerCase().includes(this.filters.search) ||
                (ticket.cpf && ticket.cpf.includes(this.filters.search));

            // Date filters
            let matchesDateRange = true;
            if (this.filters.dateFrom || this.filters.dateTo) {
                const ticketDate = new Date(ticket.dataAbertura);
                if (this.filters.dateFrom) {
                    matchesDateRange = matchesDateRange && ticketDate >= new Date(this.filters.dateFrom);
                }
                if (this.filters.dateTo) {
                    matchesDateRange = matchesDateRange && ticketDate <= new Date(this.filters.dateTo + 'T23:59:59');
                }
            }

            // Date period filter
            let matchesDatePeriod = true;
            if (this.filters.date) {
                const now = new Date();
                const ticketDate = new Date(ticket.dataAbertura);
                
                switch (this.filters.date) {
                    case 'today':
                        matchesDatePeriod = ticketDate.toDateString() === now.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        matchesDatePeriod = ticketDate >= weekAgo;
                        break;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        matchesDatePeriod = ticketDate >= monthAgo;
                        break;
                    case 'quarter':
                        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        matchesDatePeriod = ticketDate >= quarterAgo;
                        break;
                    case 'year':
                        matchesDatePeriod = ticketDate.getFullYear() === now.getFullYear();
                        break;
                }
            }

            return matchesRegion && matchesStatus && matchesChurch && matchesVolunteer && 
                   matchesPriority && matchesCategory && matchesSearch && matchesDateRange && matchesDatePeriod;
        });

        this.currentPage = 1;
        this.renderTickets();
        this.updateTicketsCount();
    }

    /**
     * Sort tickets
     */
    sortTickets(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }

        this.filteredTickets.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            // Handle different data types
            if (field === 'dataAbertura') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            let result = 0;
            if (aValue < bValue) result = -1;
            if (aValue > bValue) result = 1;

            return this.sortDirection === 'desc' ? -result : result;
        });

        this.renderTickets();
        this.updateSortIcons();
    }

    /**
     * Update sort icons
     */
    updateSortIcons() {
        document.querySelectorAll('.sort-btn .sort-icon').forEach(icon => {
            icon.textContent = '↕️';
        });

        const currentSortBtn = document.querySelector(`[data-sort="${this.sortField}"] .sort-icon`);
        if (currentSortBtn) {
            currentSortBtn.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
        }
    }

    /**
     * Set view mode
     */
    setViewMode(mode) {
        this.viewMode = mode;
        
        // Update button states
        this.elements.cardViewBtn?.classList.toggle('active', mode === 'cards');
        this.elements.tableViewBtn?.classList.toggle('active', mode === 'table');
        this.elements.kanbanViewBtn?.classList.toggle('active', mode === 'kanban');
        
        // Show/hide containers
        if (this.elements.ticketsCardView) {
            this.elements.ticketsCardView.style.display = mode === 'cards' ? 'block' : 'none';
        }
        if (this.elements.ticketsTableView) {
            this.elements.ticketsTableView.style.display = mode === 'table' ? 'block' : 'none';
        }
        if (this.elements.ticketsKanbanView) {
            this.elements.ticketsKanbanView.style.display = mode === 'kanban' ? 'block' : 'none';
        }
        
        this.renderTickets();
    }

    /**
     * Toggle advanced filters
     */
    toggleAdvancedFilters() {
        if (!this.elements.advancedFiltersPanel) return;

        const isVisible = this.elements.advancedFiltersPanel.style.display !== 'none';
        this.elements.advancedFiltersPanel.style.display = isVisible ? 'none' : 'block';
        
        // Update button text
        if (this.elements.advancedFiltersBtn) {
            const btnText = this.elements.advancedFiltersBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = isVisible ? 'Filtros Avançados' : 'Ocultar Filtros';
            }
        }
    }

    /**
     * Render tickets based on current view mode
     */
    renderTickets() {
        switch (this.viewMode) {
            case 'cards':
                this.renderCardsView();
                break;
            case 'table':
                this.renderTableView();
                break;
            case 'kanban':
                this.renderKanbanView();
                break;
        }
        
        this.renderPagination();
    }

    /**
     * Render cards view
     */
    renderCardsView() {
        if (!this.elements.ticketsCardView) return;

        if (this.filteredTickets.length === 0) {
            this.elements.ticketsCardView.innerHTML = `
                <div class="text-center text-secondary p-4">
                    <h4>Nenhum chamado encontrado</h4>
                    <p>Tente ajustar os filtros ou criar um novo chamado.</p>
                </div>
            `;
            return;
        }

        // Pagination for cards
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const ticketsToShow = this.filteredTickets.slice(startIndex, endIndex);

        const cardsHTML = ticketsToShow.map(ticket => this.renderTicketCard(ticket)).join('');
        this.elements.ticketsCardView.innerHTML = `<div class="tickets-container">${cardsHTML}</div>`;
    }

    /**
     * Render individual ticket card
     */
    renderTicketCard(ticket) {
        const priorityClass = `priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}`;
        const statusIcon = this.getStatusIcon(ticket.status);
        const hasAssignedProfessional = ticket.profissionalAtribuido;
        
        return `
            <div class="ticket-card" data-ticket-id="${ticket.id}" onclick="window.secretariaManager.viewTicket('${ticket.id}')">
                <div class="ticket-header">
                    <div>
                        <div class="ticket-title">${ticket.nome}</div>
                        <div class="ticket-id">${ticket.id}</div>
                        ${ticket.cpf ? `<div class="ticket-cpf">CPF: ${ticket.cpf}</div>` : ''}
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
                        <div class="info-label">Voluntário</div>
                        <div class="info-value">${ticket.voluntario}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Igreja</div>
                        <div class="info-value">${ticket.igreja}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Contato</div>
                        <div class="info-value">${ticket.contato}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Data</div>
                        <div class="info-value">${this.formatDate(ticket.dataAbertura)}</div>
                    </div>
                    ${hasAssignedProfessional ? `
                        <div class="info-item">
                            <div class="info-label">Profissional</div>
                            <div class="info-value">👨‍⚕️ ${ticket.profissionalAtribuido}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="ticket-description">
                    ${ticket.descricao.length > 120 ? ticket.descricao.substring(0, 120) + '...' : ticket.descricao}
                </div>
                
                <div class="ticket-actions">
                    <button class="btn btn-primary btn-small" onclick="window.secretariaManager.viewTicket('${ticket.id}'); event.stopPropagation();">
                        🔍 Ver Detalhes
                    </button>
                    <button class="btn btn-outline btn-small" onclick="window.secretariaManager.editTicket('${ticket.id}'); event.stopPropagation();">
                        ✏️ Editar
                    </button>
                    ${!hasAssignedProfessional ? `
                        <button class="btn btn-info btn-small" onclick="window.secretariaManager.assignProfessional('${ticket.id}'); event.stopPropagation();">
                            👨‍⚕️ Atribuir
                        </button>
                    ` : ''}
                    <button class="btn btn-success btn-small" onclick="window.secretariaManager.callCitizen('${ticket.contato}'); event.stopPropagation();">
                        📞 Ligar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render table view
     */
    renderTableView() {
        if (!this.elements.ticketsTableView || !this.elements.ticketsTableBody) return;

        if (this.filteredTickets.length === 0) {
            this.elements.ticketsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-secondary p-4">
                        <h4>Nenhum chamado encontrado</h4>
                        <p>Tente ajustar os filtros ou criar um novo chamado.</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Pagination for table
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const ticketsToShow = this.filteredTickets.slice(startIndex, endIndex);

        const rowsHTML = ticketsToShow.map(ticket => this.renderTicketRow(ticket)).join('');
        this.elements.ticketsTableBody.innerHTML = rowsHTML;
    }

    /**
     * Render individual ticket row
     */
    renderTicketRow(ticket) {
        const statusLabel = this.getStatusLabel(ticket.status);
        const statusClass = `status-${ticket.status}`;
        const priorityClass = `priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}`;
        const hasAssignedProfessional = ticket.profissionalAtribuido;
        
        return `
            <tr class="ticket-row" data-ticket-id="${ticket.id}" onclick="window.secretariaManager.viewTicket('${ticket.id}')">
                <td class="text-center">${ticket.id}</td>
                <td>${ticket.nome}</td>
                <td>${ticket.cpf || '-'}</td>
                <td>${ticket.igreja}</td>
                <td class="text-center">
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </td>
                <td class="text-center">
                    <span class="priority-badge ${priorityClass}">${ticket.prioridade}</span>
                </td>
                <td class="text-center">
                    ${hasAssignedProfessional ? `👨‍⚕️ ${ticket.profissionalAtribuido}` : '-'}
                </td>
                <td class="text-center">
                    <button class="btn btn-primary btn-small" onclick="window.secretariaManager.viewTicket('${ticket.id}'); event.stopPropagation();">
                        🔍
                    </button>
                    <button class="btn btn-outline btn-small" onclick="window.secretariaManager.editTicket('${ticket.id}'); event.stopPropagation();">
                        ✏️
                    </button>
                    ${!hasAssignedProfessional ? `
                        <button class="btn btn-info btn-small" onclick="window.secretariaManager.assignProfessional('${ticket.id}'); event.stopPropagation();">
                            👨‍⚕️
                        </button>
                    ` : ''}
                    <button class="btn btn-success btn-small" onclick="window.secretariaManager.callCitizen('${ticket.contato}'); event.stopPropagation();">
                        📞
                    </button>
                </td>
            </tr>
        `;
    }

    /**
     * Render kanban view
     */
    renderKanbanView() {
        if (!this.elements.ticketsKanbanView) return;

        // Group tickets by status
        const groupedTickets = this.filteredTickets.reduce((groups, ticket) => {
            if (!groups[ticket.status]) {
                groups[ticket.status] = [];
            }
            groups[ticket.status].push(ticket);
            return groups;
        }, {});

        const statuses = ['aberto', 'em_andamento', 'aguardando', 'resolvido', 'cancelado'];
        const columnsHTML = statuses.map(status => {
            const ticketsInStatus = groupedTickets[status] || [];
            return this.renderKanbanColumn(status, ticketsInStatus);
        }).join('');

        this.elements.ticketsKanbanView.innerHTML = `
            <div class="kanban-container">
                ${columnsHTML}
            </div>
        `;
    }

    /**
     * Render individual kanban column
     */
    renderKanbanColumn(status, tickets) {
        const statusLabel = this.getStatusLabel(status);
        const isEmpty = tickets.length === 0;
        
        return `
            <div class="kanban-column" data-status="${status}">
                <div class="kanban-header">
                    <div class="kanban-title">${statusLabel}</div>
                    <div class="kanban-count">${tickets.length}</div>
                </div>
                <div class="kanban-body">
                    ${isEmpty ? `
                        <div class="kanban-empty">
                            <p>Nenhum chamado neste status</p>
                        </div>
                    ` : tickets.map(ticket => this.renderKanbanCard(ticket)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render individual kanban card
     */
    renderKanbanCard(ticket) {
        const priorityClass = `priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}`;
        const statusIcon = this.getStatusIcon(ticket.status);
        const hasAssignedProfessional = ticket.profissionalAtribuido;
        
        return `
            <div class="kanban-card" data-ticket-id="${ticket.id}" onclick="window.secretariaManager.viewTicket('${ticket.id}')">
                <div class="kanban-card-header">
                    <div class="kanban-card-title">${ticket.nome}</div>
                    <div class="kanban-card-priority ${priorityClass}">
                        ${ticket.prioridade}
                    </div>
                </div>
                
                <div class="kanban-card-info">
                    <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value">${statusIcon} ${this.getStatusLabel(ticket.status)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Categoria</div>
                        <div class="info-value">${ticket.categoria}</div>
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
                        <div class="info-label">Contato</div>
                        <div class="info-value">${ticket.contato}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Data</div>
                        <div class="info-value">${this.formatDate(ticket.dataAbertura)}</div>
                    </div>
                    ${hasAssignedProfessional ? `
                        <div class="info-item">
                            <div class="info-label">Profissional</div>
                            <div class="info-value">👨‍⚕️ ${ticket.profissionalAtribuido}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="kanban-card-description">
                    ${ticket.descricao.length > 120 ? ticket.descricao.substring(0, 120) + '...' : ticket.descricao}
                </div>
            </div>
        `;
    }

    /**
     * Render pagination
     */
    renderPagination() {
        if (!this.elements.pagination) return;

        const totalPages = Math.ceil(this.filteredTickets.length / this.itemsPerPage);
        const isFirstPage = this.currentPage === 1;
        const isLastPage = this.currentPage === totalPages;

        // Previous button
        const prevButton = `
            <button class="pagination-btn" id="prev-page-btn" ${isFirstPage ? 'disabled' : ''}>
                ◀️
            </button>
        `;

        // Next button
        const nextButton = `
            <button class="pagination-btn" id="next-page-btn" ${isLastPage ? 'disabled' : ''}>
                ▶️
            </button>
        `;

        // Page numbers
        let pageNumbers = '';
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === this.currentPage;
            pageNumbers += `
                <button class="page-number ${isActive ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        this.elements.pagination.innerHTML = `
            <div class="pagination-container">
                ${prevButton}
                ${pageNumbers}
                ${nextButton}
            </div>
        `;

        // Pagination button listeners
        this.setupPaginationListeners();
    }

    /**
     * Setup pagination button listeners
     */
    setupPaginationListeners() {
        const pageButtons = document.querySelectorAll('.page-number');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.getAttribute('data-page'));
                if (!isNaN(page)) {
                    this.currentPage = page;
                    this.renderTickets();
                    this.updateTicketsCount();
                }
            });
        });

        // Previous page button
        const prevPageBtn = document.getElementById('prev-page-btn');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTickets();
                    this.updateTicketsCount();
                }
            });
        }

        // Next page button
        const nextPageBtn = document.getElementById('next-page-btn');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredTickets.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderTickets();
                    this.updateTicketsCount();
                }
            });
        }
    }

    /**
     * Open new ticket modal
     */
    openNewTicketModal() {
        this.resetForm(this.elements.newTicketForm);
        this.elements.newTicketModal.style.display = 'block';
    }

    /**
     * Open edit ticket modal
     */
    editTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        this.populateTicketForm(ticket, this.elements.editTicketForm);
        this.elements.editTicketModal.style.display = 'block';
    }

    /**
     * Open view ticket modal
     */
    viewTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        this.populateTicketDetails(ticket);
        this.elements.viewTicketModal.style.display = 'block';
    }

    /**
     * Open assign professional modal
     */
    assignProfessional(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        this.elements.professionalSelect.value = '';
        this.elements.assignmentNotes.value = '';
        this.populateProfessionalSelect(ticket.profissionalAtribuido);
        this.elements.assignProfessionalModal.style.display = 'block';
    }

    /**
     * Populate ticket form for editing
     */
    populateTicketForm(ticket, form) {
        if (!form) return;

        form.nome.value = ticket.nome || '';
        form.contato.value = ticket.contato || '';
        form.email.value = ticket.email || '';
        form.cpf.value = ticket.cpf || '';
        form.igreja.value = ticket.igreja || '';
        form.regiao.value = ticket.regiao || '';
        form.categoria.value = ticket.categoria || '';
        form.prioridade.value = ticket.prioridade || '';
        form.demanda.value = ticket.demanda || '';
        form.descricao.value = ticket.descricao || '';
    }

    /**
     * Populate ticket details in view modal
     */
    populateTicketDetails(ticket) {
        if (!this.elements.ticketDetails) return;

        this.elements.ticketDetails.innerHTML = `
            <div class="ticket-detail">
                <div class="detail-item">
                    <div class="detail-label">ID:</div>
                    <div class="detail-value">${ticket.id}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Nome:</div>
                    <div class="detail-value">${ticket.nome}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contato:</div>
                    <div class="detail-value">${ticket.contato}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${ticket.email || '-'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">CPF:</div>
                    <div class="detail-value">${ticket.cpf}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Igreja:</div>
                    <div class="detail-value">${ticket.igreja}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Região:</div>
                    <div class="detail-value">${ticket.regiao}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Categoria:</div>
                    <div class="detail-value">${ticket.categoria}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Prioridade:</div>
                    <div class="detail-value">${ticket.prioridade}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Demanda:</div>
                    <div class="detail-value">${ticket.demanda || '-'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Descrição:</div>
                    <div class="detail-value">${ticket.descricao}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value">${this.getStatusLabel(ticket.status)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Data de Abertura:</div>
                    <div class="detail-value">${this.formatDate(ticket.dataAbertura)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Data de Resolução:</div>
                    <div class="detail-value">${ticket.dataResolucao ? this.formatDate(ticket.dataResolucao) : '-'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Voluntário:</div>
                    <div class="detail-value">${ticket.voluntario}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Profissional Atribuído:</div>
                    <div class="detail-value">${ticket.profissionalAtribuido || '-'}</div>
                </div>
            </div>
        `;
    }

    /**
     * Populate professional select for assignment
     */
    populateProfessionalSelect(selectedProfessional) {
        if (!this.elements.professionalSelect) return;

        const options = this.professionals.map(prof => 
            `<option value="${prof.id}" ${prof.nome === selectedProfessional ? 'selected' : ''}>${prof.nome} - ${prof.especialidade}</option>`
        ).join('');

        this.elements.professionalSelect.innerHTML = `
            <option value="">Selecione um profissional</option>
            ${options}
        `;
    }

    /**
     * Handle new ticket submission
     */
    async handleNewTicketSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.elements.newTicketForm);
        const ticketData = Object.fromEntries(formData);

        try {
            this.showLoadingState();

            let result;
            if (window.flowManager) {
                result = await window.flowManager.createTicket(ticketData);
            }

            if (result?.success) {
                this.showSuccessMessage('Chamado criado com sucesso!');
                this.closeModal(this.elements.newTicketModal);
                this.loadTickets();
            } else {
                throw new Error('Erro ao criar chamado');
            }

        } catch (error) {
            console.error('❌ Erro ao criar chamado:', error);
            this.showErrorMessage('Erro ao criar chamado. Tente novamente mais tarde.');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Handle edit ticket submission
     */
    async handleEditTicketSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.elements.editTicketForm);
        const ticketData = Object.fromEntries(formData);
        ticketData.id = this.currentEditingTicketId;

        try {
            this.showLoadingState();

            let result;
            if (window.flowManager) {
                result = await window.flowManager.updateTicket(ticketData);
            }

            if (result?.success) {
                this.showSuccessMessage('Chamado atualizado com sucesso!');
                this.closeModal(this.elements.editTicketModal);
                this.loadTickets();
            } else {
                throw new Error('Erro ao atualizar chamado');
            }

        } catch (error) {
            console.error('❌ Erro ao atualizar chamado:', error);
            this.showErrorMessage('Erro ao atualizar chamado. Tente novamente mais tarde.');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Handle assign professional submission
     */
    async handleAssignProfessionalSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.elements.assignProfessionalForm);
        const assignmentData = Object.fromEntries(formData);
        assignmentData.ticketId = this.currentAssigningTicketId;

        try {
            this.showLoadingState();

            let result;
            if (window.flowManager) {
                result = await window.flowManager.assignProfessional(assignmentData);
            }

            if (result?.success) {
                this.showSuccessMessage('Profissional atribuído com sucesso!');
                this.closeModal(this.elements.assignProfessionalModal);
                this.loadTickets();
            } else {
                throw new Error('Erro ao atribuir profissional');
            }

        } catch (error) {
            console.error('❌ Erro ao atribuir profissional:', error);
            this.showErrorMessage('Erro ao atribuir profissional. Tente novamente mais tarde.');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Reset form fields
     */
    resetForm(form) {
        if (!form) return;

        form.reset();

        // Clear custom fields
        const customFields = ['categoria', 'demanda', 'igreja', 'regiao'];
        customFields.forEach(field => {
            const element = form.querySelector(`[name="${field}"]`);
            if (element) {
                element.innerHTML = '';
            }
        });
    }

    /**
     * Render table view
     */
    renderTableView() {
        if (!this.elements.ticketsTableView || !this.elements.ticketsTableBody) return;

        if (this.filteredTickets.length === 0) {
            this.elements.ticketsTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-secondary p-4">
                        <h4>Nenhum chamado encontrado</h4>
                        <p>Tente ajustar os filtros ou criar um novo chamado.</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Pagination for table
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const ticketsToShow = this.filteredTickets.slice(startIndex, endIndex);

        const rowsHTML = ticketsToShow.map(ticket => `
            <tr onclick="window.secretariaManager.viewTicket('${ticket.id}')" style="cursor: pointer;">
                <td><strong>${ticket.id}</strong></td>
                <td>
                    <div>${ticket.nome}</div>
                    ${ticket.cpf ? `<small class="text-muted">${ticket.cpf}</small>` : ''}
                </td>
                <td>${ticket.categoria}</td>
                <td><span class="ticket-priority priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}">${ticket.prioridade}</span></td>
                <td>${this.getStatusIcon(ticket.status)} ${this.getStatusLabel(ticket.status)}</td>
                <td>
                    <div>${ticket.voluntario}</div>
                    <small class="text-muted">${ticket.igreja}</small>
                </td>
                <td>${this.formatDate(ticket.dataAbertura)}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-primary btn-small" onclick="window.secretariaManager.viewTicket('${ticket.id}'); event.stopPropagation();" title="Ver detalhes">🔍</button>
                        <button class="btn btn-outline btn-small" onclick="window.secretariaManager.editTicket('${ticket.id}'); event.stopPropagation();" title="Editar">✏️</button>
                        ${!ticket.profissionalAtribuido ? `<button class="btn btn-info btn-small" onclick="window.secretariaManager.assignProfessional('${ticket.id}'); event.stopPropagation();" title="Atribuir profissional">👨‍⚕️</button>` : ''}
                        <button class="btn btn-success btn-small" onclick="window.secretariaManager.callCitizen('${ticket.contato}'); event.stopPropagation();" title="Ligar">📞</button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.elements.ticketsTableBody.innerHTML = rowsHTML;
    }

    /**
     * Render kanban view
     */
    renderKanbanView() {
        if (!this.elements.ticketsKanbanView) return;

        const statusColumns = ['aberto', 'em_andamento', 'aguardando', 'resolvido'];
        
        statusColumns.forEach(status => {
            const itemsContainer = document.getElementById(`kanban-${status}-items`);
            const countElement = document.getElementById(`kanban-${status}-count`);
            
            if (!itemsContainer || !countElement) return;

            const statusTickets = this.filteredTickets.filter(ticket => ticket.status === status);
            countElement.textContent = statusTickets.length;

            if (statusTickets.length === 0) {
                itemsContainer.innerHTML = `
                    <div class="text-center text-muted p-3">
                        <small>Nenhum chamado</small>
                    </div>
                `;
                return;
            }

            const itemsHTML = statusTickets.map(ticket => `
                <div class="kanban-item" onclick="window.secretariaManager.viewTicket('${ticket.id}')">
                    <div class="kanban-item-title">${ticket.nome}</div>
                    <div class="kanban-item-meta">
                        <span class="ticket-priority priority-${ticket.prioridade.toLowerCase().replace('ê', 'e').replace('í', 'i')}">${ticket.prioridade}</span>
                        <span class="text-muted">${ticket.id}</span>
                    </div>
                    <div class="text-muted" style="font-size: 0.8rem; margin-top: 0.5rem;">
                        ${ticket.categoria} • ${ticket.voluntario}
                    </div>
                </div>
            `).join('');

            itemsContainer.innerHTML = itemsHTML;
        });
    }

    /**
     * Render pagination
     */
    renderPagination() {
        if (!this.elements.pagination) return;

        // Hide pagination for kanban view
        if (this.viewMode === 'kanban') {
            this.elements.pagination.style.display = 'none';
            return;
        }

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
                    onclick="window.secretariaManager.goToPage(${this.currentPage - 1})"
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ‹
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="btn btn-outline" onclick="window.secretariaManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="btn ${i === this.currentPage ? 'btn-primary active' : 'btn-outline'}" 
                        onclick="window.secretariaManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="btn btn-outline" onclick="window.secretariaManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button class="btn btn-outline ${this.currentPage === totalPages ? 'btn-disabled' : ''}" 
                    onclick="window.secretariaManager.goToPage(${this.currentPage + 1})"
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
                        ${ticket.cpf ? `
                            <div class="info-item">
                                <div class="info-label">CPF</div>
                                <div class="info-value">${ticket.cpf}</div>
                            </div>
                        ` : ''}
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
                        ${ticket.profissionalAtribuido ? `
                            <div class="info-item">
                                <div class="info-label">Profissional Atribuído</div>
                                <div class="info-value">👨‍⚕️ ${ticket.profissionalAtribuido}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="ticket-description">
                    <div class="info-label">Descrição da Demanda</div>
                    <div class="description-content">${ticket.descricao}</div>
                </div>
                
                <div class="ticket-actions">
                    <button class="btn btn-primary" onclick="window.secretariaManager.editTicket('${ticket.id}')">
                        ✏️ Editar Chamado
                    </button>
                    ${!ticket.profissionalAtribuido ? `
                        <button class="btn btn-info" onclick="window.secretariaManager.assignProfessional('${ticket.id}')">
                            👨‍⚕️ Atribuir Profissional
                        </button>
                    ` : ''}
                    <button class="btn btn-success" onclick="window.secretariaManager.callCitizen('${ticket.contato}')">
                        📞 Ligar para Cidadão
                    </button>
                    <button class="btn btn-outline" onclick="window.secretariaManager.updateTicketStatus('${ticket.id}', 'em_andamento')">
                        🔄 Marcar em Andamento
                    </button>
                    <button class="btn btn-warning" onclick="window.secretariaManager.updateTicketStatus('${ticket.id}', 'resolvido')">
                        ✅ Marcar como Resolvido
                    </button>
                </div>
            </div>
        `;

        this.elements.ticketDetails.innerHTML = detailsHTML;
    }

    /**
     * Call citizen (open phone app)
     */
    callCitizen(phoneNumber) {
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        window.open(`tel:${cleanPhone}`, '_self');
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
            this.downloadCSV(csvContent, `chamados_secretaria_${new Date().toISOString().split('T')[0]}.csv`);
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
        const headers = [
            'ID', 'Nome', 'CPF', 'Telefone', 'Email', 'Categoria', 'Prioridade', 'Status', 
            'Descrição', 'Data Abertura', 'Voluntário', 'Igreja', 'Região', 'Profissional Atribuído'
        ];
        
        const rows = tickets.map(ticket => [
            ticket.id,
            ticket.nome,
            ticket.cpf || '',
            ticket.contato,
            ticket.email || '',
            ticket.categoria,
            ticket.prioridade,
            this.getStatusLabel(ticket.status),
            ticket.descricao,
            this.formatDate(ticket.dataAbertura),
            ticket.voluntario,
            ticket.igreja,
            ticket.regiao,
            ticket.profissionalAtribuido || ''
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
     * Validate ticket form
     */
    validateTicketForm(ticketData) {
        let isValid = true;
        
        // Required fields
        const requiredFields = {
            nome: 'Nome do cidadão é obrigatório',
            contato: 'Telefone é obrigatório',
            igreja: 'Igreja é obrigatória',
            regiao: 'Região é obrigatória',
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
        
        // CPF validation (if provided)
        if (ticketData.cpf && !this.validateCPF(ticketData.cpf)) {
            this.showFieldError('cpf', 'CPF inválido');
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
     * Validate CPF
     */
    validateCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
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
     * Format CPF
     */
    formatCPF(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        input.value = value;
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
            const totalOriginal = this.tickets.length;
            
            if (this.viewMode === 'kanban') {
                this.elements.ticketsCount.textContent = `${total} chamado(s) encontrado(s)`;
            } else {
                const showing = Math.min(this.itemsPerPage, total - (this.currentPage - 1) * this.itemsPerPage);
                const start = total > 0 ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
                const end = (this.currentPage - 1) * this.itemsPerPage + showing;
                
                this.elements.ticketsCount.textContent = `Mostrando ${start}-${end} de ${total} chamados (${totalOriginal} total)`;
            }
        }
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field}-error`) || document.getElementById(`edit-${field}-error`);
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
        const errorElement = document.getElementById(`${field}-error`) || document.getElementById(`edit-${field}-error`);
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
            if (btnText) {
                if (btnText.textContent.includes('Salvar')) {
                    btnText.textContent = 'Salvando...';
                } else if (btnText.textContent.includes('Atribuir')) {
                    btnText.textContent = 'Atribuindo...';
                }
            }
            if (spinner) spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (btnText) {
                if (btnText.textContent.includes('Salvando')) {
                    btnText.textContent = btnText.textContent.includes('Alterações') ? '💾 Salvar Alterações' : '💾 Salvar Chamado';
                } else if (btnText.textContent.includes('Atribuindo')) {
                    btnText.textContent = '💾 Atribuir Profissional';
                }
            }
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
    showSuccessMessage(message) {
        console.log('✅', message);
        // Implementation for showing success message UI
    }

    showErrorMessage(message) {
        console.error('❌', message);
        // Implementation for showing error message UI  
    }

    /**
     * Handle logout
     */
    handleLogout() {
        if (window.authManager) {
            window.authManager.logout();
        }
        window.location.href = 'index.html';
    }

    /**
     * Open notifications modal
     */
    openNotificationsModal() {
        console.log('📢 Abrindo notificações...');
        // Implementation for notifications modal
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        // Implementation to hide loading indicators
        console.log('🔄 Loading state hidden');
    }
}

// Initialize secretaria manager
window.secretariaManager = new SecretariaManager();

console.log('✅ Secretaria script carregado');