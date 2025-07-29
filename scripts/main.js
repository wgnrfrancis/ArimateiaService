// Main application logic for Balcão da Cidadania
class App {
    constructor() {
        this.currentPage = window.location.pathname;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        // Initialize page based on current location
        this.initializePage();
        
        // Setup global event listeners
        this.setupGlobalListeners();
        
        // Setup navigation
        this.setupNavigation();
    }

    initializePage() {
        const page = this.getCurrentPageName();
        
        switch (page) {
            case 'index':
                this.initLoginPage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
            case 'balcao':
                this.initBalcaoPage();
                break;
            case 'secretaria':
                this.initSecretariaPage();
                break;
            case 'coordenador':
                this.initCoordenadorPage();
                break;
            default:
                console.warn('Unknown page:', page);
        }
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '');
    }

    // Initialize login page
    initLoginPage() {
        // Check if user is already logged in
        if (auth.isAuthenticated()) {
            auth.redirectTo('/dashboard.html');
            return;
        }

        const loginForm = document.querySelector('#login-form');
        if (loginForm) {
            Helpers.setupFormValidation(loginForm);
            
            loginForm.addEventListener('validSubmit', async (e) => {
                const { email, password } = e.detail;
                
                Helpers.showLoading('Fazendo login...');
                const result = await auth.login(email, password);
                Helpers.hideLoading();
                
                if (!result.success) {
                    Helpers.showToast(result.error, 'error');
                }
            });
        }

        // Setup input formatting
        this.setupInputFormatting();
    }

    // Initialize dashboard page
    initDashboardPage() {
        // Protect page
        if (!auth.protectPage()) return;

        // Load user data and setup interface
        userManager.loadUserData();
        
        // Setup logout button
        const logoutBtn = document.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => userManager.logout());
        }

        // Setup profile button
        const profileBtn = document.querySelector('#profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => userManager.showProfileModal());
        }

        // Setup permission-based visibility
        this.setupPermissionBasedVisibility();
    }

    // Initialize Balcão page
    initBalcaoPage() {
        // Protect page
        if (!auth.protectPage('balcao_view')) return;

        // Load tickets
        this.loadTickets();
        
        // Setup new ticket form
        this.setupNewTicketForm();
        
        // Setup filters
        this.setupTicketFilters();
        
        // Setup search
        this.setupTicketSearch();
    }

    // Initialize Secretaria page
    initSecretariaPage() {
        // Protect page
        if (!auth.protectPage('secretaria_view')) return;

        // Load tickets with edit capabilities
        this.loadTickets(true);
        
        // Setup filters (pre-select user's region)
        this.setupTicketFilters(true);
        
        // Setup edit modal
        this.setupEditTicketModal();
        
        // Setup delete functionality
        this.setupDeleteTicketFunctionality();
    }

    // Initialize Coordenador page
    initCoordenadorPage() {
        // Protect page
        if (!auth.protectPage('coordenador_view')) return;

        // Setup management sections
        this.setupManagementSections();
        
        // Load reports
        this.loadReports();
        
        // Setup user management
        this.setupUserManagement();
    }

    // Load tickets
    async loadTickets(enableEdit = false) {
        try {
            Helpers.showLoading('Carregando chamados...');
            
            const filters = this.getActiveFilters();
            const result = await flowManager.getTickets(filters);
            
            Helpers.hideLoading();
            
            if (result.success) {
                this.displayTickets(result.data, enableEdit);
            } else {
                Helpers.showToast('Erro ao carregar chamados', 'error');
            }
        } catch (error) {
            Helpers.hideLoading();
            console.error('Load tickets error:', error);
            Helpers.showToast('Erro ao carregar chamados', 'error');
        }
    }

    // Display tickets in the interface
    displayTickets(tickets, enableEdit = false) {
        const container = document.querySelector('#tickets-container');
        if (!container) return;

        if (tickets.length === 0) {
            container.innerHTML = `
                <div class="text-center">
                    <p>Nenhum chamado encontrado.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = tickets.map(ticket => this.createTicketCard(ticket, enableEdit)).join('');
        
        // Setup card event listeners
        this.setupTicketCardListeners();
    }

    // Create ticket card HTML
    createTicketCard(ticket, enableEdit = false) {
        const user = auth.getCurrentUser();
        const canEdit = enableEdit && auth.hasPermission('balcao_edit');
        const canDelete = enableEdit && auth.hasPermission('balcao_delete');
        
        return `
            <div class="card ticket-card" data-ticket-id="${ticket.id}" data-region="${ticket.regiao}">
                <div class="card-header">
                    <div class="flex justify-between items-center">
                        <h3 class="card-title">${Helpers.sanitizeHTML(ticket.nome)}</h3>
                        ${Helpers.getStatusBadge(ticket.status)}
                    </div>
                </div>
                <div class="ticket-info">
                    <div class="grid grid-2">
                        <div>
                            <strong>CPF:</strong> ${Helpers.formatCPF(ticket.cpf)}
                        </div>
                        <div>
                            <strong>Contato:</strong> ${Helpers.formatPhone(ticket.contato)}
                        </div>
                        <div>
                            <strong>Igreja:</strong> ${Helpers.sanitizeHTML(ticket.igreja)}
                        </div>
                        <div>
                            <strong>Região:</strong> ${Helpers.sanitizeHTML(ticket.regiao)}
                        </div>
                    </div>
                    <div class="mt-3">
                        <strong>Descrição:</strong>
                        <p>${Helpers.sanitizeHTML(ticket.descricao)}</p>
                    </div>
                    <div class="mt-2">
                        <small class="text-light">
                            Criado em ${Helpers.formatDate(ticket.dataAbertura, true)} por ${Helpers.sanitizeHTML(ticket.criadoPor)}
                        </small>
                    </div>
                </div>
                <div class="ticket-actions mt-3">
                    <button class="btn btn-outline view-ticket-btn" data-ticket-id="${ticket.id}">
                        🔍 Visualizar
                    </button>
                    ${canEdit ? `
                        <button class="btn btn-primary edit-ticket-btn" data-ticket-id="${ticket.id}">
                            ✏️ Editar
                        </button>
                    ` : ''}
                    ${canDelete ? `
                        <button class="btn btn-danger delete-ticket-btn" data-ticket-id="${ticket.id}">
                            ❌ Excluir
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Setup new ticket form
    setupNewTicketForm() {
        const form = document.querySelector('#new-ticket-form');
        if (!form) return;

        Helpers.setupFormValidation(form);
        
        form.addEventListener('validSubmit', async (e) => {
            const formData = e.detail;
            
            const result = await flowManager.createTicket(formData);
            
            if (result.success) {
                form.reset();
                this.loadTickets(); // Reload tickets
                
                // Close modal if it exists
                const modal = document.querySelector('#new-ticket-modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });

        // Setup input formatting
        this.setupInputFormatting(form);
    }

    // Setup ticket filters
    setupTicketFilters(preselectRegion = false) {
        const filtersContainer = document.querySelector('.filters');
        if (!filtersContainer) return;

        // Pre-select user's region for non-coordinators
        if (preselectRegion && !auth.hasRole('COORDENADOR')) {
            const user = auth.getCurrentUser();
            const regionFilter = document.querySelector('#region-filter');
            if (regionFilter && user.region) {
                regionFilter.value = user.region;
            }
        }

        // Setup filter change listeners
        const filterInputs = filtersContainer.querySelectorAll('input, select');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.loadTickets(this.getCurrentPageName() === 'secretaria');
            });
        });
    }

    // Setup ticket search
    setupTicketSearch() {
        const searchInput = document.querySelector('#ticket-search');
        if (!searchInput) return;

        const debouncedSearch = Helpers.debounce(() => {
            this.loadTickets(this.getCurrentPageName() === 'secretaria');
        }, 500);

        searchInput.addEventListener('input', debouncedSearch);
    }

    // Get active filters
    getActiveFilters() {
        const filters = {};
        
        const regionFilter = document.querySelector('#region-filter');
        if (regionFilter && regionFilter.value) {
            filters.regiao = regionFilter.value;
        }
        
        const statusFilter = document.querySelector('#status-filter');
        if (statusFilter && statusFilter.value) {
            filters.status = statusFilter.value;
        }
        
        const churchFilter = document.querySelector('#church-filter');
        if (churchFilter && churchFilter.value) {
            filters.igreja = churchFilter.value;
        }
        
        const searchInput = document.querySelector('#ticket-search');
        if (searchInput && searchInput.value.trim()) {
            filters.search = searchInput.value.trim();
        }

        return filters;
    }

    // Setup ticket card listeners
    setupTicketCardListeners() {
        // View ticket buttons
        document.querySelectorAll('.view-ticket-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ticketId = e.target.getAttribute('data-ticket-id');
                this.viewTicket(ticketId);
            });
        });

        // Edit ticket buttons
        document.querySelectorAll('.edit-ticket-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ticketId = e.target.getAttribute('data-ticket-id');
                this.editTicket(ticketId);
            });
        });

        // Delete ticket buttons
        document.querySelectorAll('.delete-ticket-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const ticketId = e.target.getAttribute('data-ticket-id');
                await this.deleteTicket(ticketId);
            });
        });
    }

    // View ticket details
    viewTicket(ticketId) {
        // Implementation for viewing ticket details
        console.log('Viewing ticket:', ticketId);
        Helpers.showToast('Funcionalidade de visualização em desenvolvimento', 'info');
    }

    // Edit ticket
    editTicket(ticketId) {
        // Implementation for editing ticket
        console.log('Editing ticket:', ticketId);
        const modal = document.querySelector('#edit-ticket-modal');
        if (modal) {
            modal.classList.add('active');
            // Load ticket data into modal
        }
    }

    // Delete ticket
    async deleteTicket(ticketId) {
        const confirmed = await Helpers.confirm(
            'Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.',
            'Confirmar Exclusão'
        );

        if (confirmed) {
            const result = await flowManager.deleteTicket(ticketId, 'Excluído pelo usuário');
            
            if (result.success) {
                this.loadTickets(true); // Reload tickets
            }
        }
    }

    // Setup input formatting
    setupInputFormatting(container = document) {
        // CPF formatting
        const cpfInputs = container.querySelectorAll('input[data-format="cpf"]');
        cpfInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            });
        });

        // Phone formatting
        const phoneInputs = container.querySelectorAll('input[data-format="phone"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            });
        });
    }

    // Setup global event listeners
    setupGlobalListeners() {
        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }
        });
    }

    // Setup navigation
    setupNavigation() {
        // Back to dashboard buttons
        document.querySelectorAll('.back-to-dashboard').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = '/dashboard.html';
            });
        });
    }

    // Setup edit ticket modal
    setupEditTicketModal() {
        const modal = document.querySelector('#edit-ticket-modal');
        const form = document.querySelector('#edit-ticket-form');
        
        if (!modal || !form) return;

        Helpers.setupFormValidation(form);
        
        form.addEventListener('validSubmit', async (e) => {
            const formData = e.detail;
            const ticketId = form.getAttribute('data-ticket-id');
            
            const result = await flowManager.updateTicket(ticketId, formData);
            
            if (result.success) {
                modal.classList.remove('active');
                this.loadTickets(true); // Reload tickets
            }
        });
    }

    // Setup delete ticket functionality
    setupDeleteTicketFunctionality() {
        // Already handled in setupTicketCardListeners
    }

    // Setup management sections
    setupManagementSections() {
        // Implementation for coordinator management sections
        console.log('Setting up management sections');
    }

    // Load reports
    async loadReports() {
        try {
            const result = await flowManager.generateReport('general');
            
            if (result.success) {
                this.displayReports(result.data);
            }
        } catch (error) {
            console.error('Load reports error:', error);
        }
    }

    // Display reports
    displayReports(reportData) {
        // Implementation for displaying reports
        console.log('Displaying reports:', reportData);
    }

    // Setup user management
    setupUserManagement() {
        // Implementation for user management
        console.log('Setting up user management');
    }

    // Setup permission-based visibility
    setupPermissionBasedVisibility() {
        const user = auth.getCurrentUser();
        if (!user) return;

        // Hide/show elements based on permissions
        const permissionElements = document.querySelectorAll('[data-permission]');
        
        permissionElements.forEach(element => {
            const requiredPermission = element.getAttribute('data-permission');
            let hasPermission = false;

            switch(requiredPermission) {
                case 'coordenador_only':
                    hasPermission = user.role === 'COORDENADOR';
                    break;
                case 'secretaria_view':
                    hasPermission = user.role === 'COORDENADOR' || user.role === 'SECRETARIA';
                    break;
                case 'volunteer_view':
                    hasPermission = true; // All authenticated users
                    break;
                default:
                    hasPermission = true;
            }

            if (hasPermission) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }
}

// Initialize app when script loads
const app = new App();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
