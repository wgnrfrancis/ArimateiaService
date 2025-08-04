// User management module for Balcão da Cidadania
class UserManager {
    constructor() {
        this.init();
    }

    init() {
        // Load user data when page loads
        this.loadUserData();
        
        // Set up user interface based on role
        this.setupUserInterface();
    }

    // Load and display user data in the interface
    loadUserData() {
        const user = authManager.getCurrentUser();  // ✅ CORRIGIDO: auth → authManager
        if (!user) return;

        // Update user info in header
        this.updateUserHeader(user);
        
        // Update dashboard based on user role
        this.updateDashboard(user);
    }

    // Update user information in the header
    updateUserHeader(user) {
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        const userRegion = document.querySelector('.user-region');

        if (userAvatar) {
            // ✅ Usar placeholder para evitar 404
            userAvatar.src = user.avatar || 'https://via.placeholder.com/40x40/007bff/ffffff?text=' + (user.nome ? user.nome.charAt(0) : 'U');
            userAvatar.alt = user.nome || user.name;
        }

        if (userName) {
            userName.textContent = user.nome || user.name;
        }

        if (userRole) {
            const roleName = CONFIG.roles[user.cargo || user.role]?.name || user.cargo || user.role;
            userRole.textContent = roleName;
        }

        if (userRegion) {
            userRegion.textContent = user.regiao || user.region;
        }
    }

    // Update dashboard based on user role and permissions
    updateDashboard(user) {
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (!dashboardGrid) return;

        // Clear existing content
        dashboardGrid.innerHTML = '';

        // Create dashboard cards based on user permissions
        const cards = this.getDashboardCards(user);
        
        cards.forEach(card => {
            const cardElement = this.createDashboardCard(card);
            dashboardGrid.appendChild(cardElement);
        });
    }

    // Get dashboard cards based on user role
    getDashboardCards(user) {
        const cards = [];

        // Balcão da Cidadania - Available to all roles
        if (authManager.hasPermission('balcao_view')) {  // ✅ CORRIGIDO
            cards.push({
                title: 'Balcão da Cidadania',
                description: 'Gerenciar atendimentos e chamados',
                icon: '🏛️',
                url: 'balcao.html',  // ✅ CORRIGIDO: remover / inicial
                color: 'primary'
            });
        }

        // Secretaria - Available to Secretaria and Coordenador
        if (authManager.hasPermission('secretaria_view')) {  // ✅ CORRIGIDO
            cards.push({
                title: 'Secretaria',
                description: 'Visualizar e editar chamados',
                icon: '📋',
                url: 'secretaria.html',  // ✅ CORRIGIDO
                color: 'secondary'
            });
        }

        // Coordenador - Available only to Coordenador
        if (authManager.hasPermission('coordenador_view')) {  // ✅ CORRIGIDO
            cards.push({
                title: 'Coordenação',
                description: 'Gestão completa do sistema',
                icon: '⚙️',
                url: 'coordenador.html',  // ✅ CORRIGIDO
                color: 'success'
            });
        }

        // Additional cards for Coordenador
        if (authManager.hasRole('COORDENADOR_GERAL') || authManager.hasRole('COORDENADOR_LOCAL')) {  // ✅ CORRIGIDO
            cards.push(
                {
                    title: 'Adicionar Voluntário',
                    description: 'Cadastrar novos voluntários',
                    icon: '👥',
                    url: 'add-voluntario.html',  // ✅ CORRIGIDO
                    color: 'warning'
                },
                {
                    title: 'Relatórios',
                    description: 'Visualizar relatórios e estatísticas',
                    icon: '📊',
                    url: 'relatorios.html',  // ✅ CORRIGIDO
                    color: 'info'
                }
            );
        }

        return cards;
    }

    // Create dashboard card element
    createDashboardCard(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'dashboard-card';
        cardElement.innerHTML = `
            <div class="dashboard-icon">${card.icon}</div>
            <h3 class="card-title">${card.title}</h3>
            <p class="card-description">${card.description}</p>
            <a href="${card.url}" class="btn btn-${card.color} btn-large">
                Acessar
            </a>
        `;

        return cardElement;
    }

    // Setup user interface based on permissions
    setupUserInterface() {
        const user = authManager.getCurrentUser();  // ✅ CORRIGIDO
        if (!user) return;

        // Hide/show navigation items based on permissions
        this.setupNavigation(user);
        
        // Setup page-specific functionality
        this.setupPageFunctionality(user);
    }

    // Setup navigation based on user permissions
    setupNavigation(user) {
        const navItems = document.querySelectorAll('[data-permission]');
        
        navItems.forEach(item => {
            const requiredPermission = item.getAttribute('data-permission');
            if (!authManager.hasPermission(requiredPermission)) {  // ✅ CORRIGIDO
                item.style.display = 'none';
            }
        });

        // Setup role-specific navigation
        const roleItems = document.querySelectorAll('[data-role]');
        
        roleItems.forEach(item => {
            const requiredRole = item.getAttribute('data-role');
            if (!authManager.hasRole(requiredRole)) {  // ✅ CORRIGIDO
                item.style.display = 'none';
            }
        });
    }

    // Setup page-specific functionality
    setupPageFunctionality(user) {
        const currentPage = window.location.pathname.split('/').pop(); // ✅ CORRIGIDO para pegar apenas o nome do arquivo

        switch (currentPage) {
            case 'balcao.html':
                this.setupBalcaoPage(user);
                break;
            case 'secretaria.html':
                this.setupSecretariaPage(user);
                break;
            case 'coordenador.html':
                this.setupCoordenadorPage(user);
                break;
        }
    }

    // Setup Balcão page functionality
    setupBalcaoPage(user) {
        // Enable/disable buttons based on permissions
        const newTicketBtn = document.querySelector('#new-ticket-btn');
        if (newTicketBtn && !authManager.hasPermission('balcao_create')) {  // ✅ CORRIGIDO
            newTicketBtn.style.display = 'none';
        }

        // Filter tickets by user region for Voluntários
        if (authManager.hasRole('VOLUNTARIO')) {  // ✅ CORRIGIDO
            this.filterTicketsByRegion(user.regiao || user.region);
        }
    }

    // Setup Secretaria page functionality
    setupSecretariaPage(user) {
        // Pre-select user's region in filters
        const regionFilter = document.querySelector('#region-filter');
        if (regionFilter && (user.regiao || user.region)) {
            regionFilter.value = user.regiao || user.region;
        }

        // Enable/disable edit buttons based on permissions
        const editButtons = document.querySelectorAll('.edit-ticket-btn');
        editButtons.forEach(btn => {
            if (!authManager.hasPermission('balcao_edit')) {  // ✅ CORRIGIDO
                btn.style.display = 'none';
            }
        });

        // Enable/disable delete buttons based on permissions
        const deleteButtons = document.querySelectorAll('.delete-ticket-btn');
        deleteButtons.forEach(btn => {
            if (!authManager.hasPermission('balcao_delete')) {  // ✅ CORRIGIDO
                btn.style.display = 'none';
            }
        });
    }

    // Setup Coordenador page functionality
    setupCoordenadorPage(user) {
        // Show all management options for Coordenador
        const managementSections = document.querySelectorAll('.management-section');
        managementSections.forEach(section => {
            section.style.display = 'block';
        });
    }

    // Filter tickets by region
    filterTicketsByRegion(region) {
        const tickets = document.querySelectorAll('.ticket-card');
        tickets.forEach(ticket => {
            const ticketRegion = ticket.getAttribute('data-region');
            if (ticketRegion && ticketRegion !== region) {
                ticket.style.display = 'none';
            }
        });
    }

    // Get user profile data
    getUserProfile() {
        return authManager.getCurrentUser();  // ✅ CORRIGIDO
    }

    // Update user profile
    async updateUserProfile(profileData) {
        try {
            const user = authManager.getCurrentUser();  // ✅ CORRIGIDO
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            // Validate profile data
            if (!profileData.name || profileData.name.trim().length < 2) {
                throw new Error('Nome deve ter pelo menos 2 caracteres');
            }

            if (!profileData.email || !authManager.validateEmail(profileData.email)) {  // ✅ CORRIGIDO
                throw new Error('Email inválido');
            }

            // Update user data
            const updatedUser = {
                ...user,
                nome: profileData.name.trim(),  // ✅ usar 'nome' em vez de 'name'
                email: profileData.email.trim(),
                igreja: profileData.church,
                regiao: profileData.region
            };

            // Save updated session
            authManager.currentUser = updatedUser;  // ✅ CORRIGIDO
            authManager.saveSession();  // ✅ CORRIGIDO

            // Update interface
            this.updateUserHeader(updatedUser);

            return { success: true, message: 'Perfil atualizado com sucesso!' };

        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout user
    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            authManager.logout();  // ✅ CORRIGIDO
        }
    }

    // Show user profile modal
    showProfileModal() {
        const user = authManager.getCurrentUser();  // ✅ CORRIGIDO
        if (!user) return;

        const modal = document.querySelector('#profile-modal');
        if (modal) {
            // Populate modal with user data
            const nameInput = modal.querySelector('#profile-name');
            const emailInput = modal.querySelector('#profile-email');
            const churchSelect = modal.querySelector('#profile-church');
            const regionSelect = modal.querySelector('#profile-region');

            if (nameInput) nameInput.value = user.nome || user.name;
            if (emailInput) emailInput.value = user.email;
            if (churchSelect) churchSelect.value = user.igreja || user.church;
            if (regionSelect) regionSelect.value = user.regiao || user.region;

            modal.classList.add('active');
        }
    }

    // Hide user profile modal
    hideProfileModal() {
        const modal = document.querySelector('#profile-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// Initialize user manager
const userManager = new UserManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManager;
}
