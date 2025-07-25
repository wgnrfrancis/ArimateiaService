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
        const user = auth.getCurrentUser();
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
            userAvatar.src = user.avatar;
            userAvatar.alt = user.name;
        }

        if (userName) {
            userName.textContent = user.name;
        }

        if (userRole) {
            const roleName = CONFIG.roles[user.role]?.name || user.role;
            userRole.textContent = roleName;
        }

        if (userRegion) {
            userRegion.textContent = user.region;
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
        if (auth.hasPermission('balcao_view')) {
            cards.push({
                title: 'Balcão da Cidadania',
                description: 'Gerenciar atendimentos e chamados',
                icon: '🏛️',
                url: '/balcao.html',
                color: 'primary'
            });
        }

        // Secretaria - Available to Secretaria and Coordenador
        if (auth.hasPermission('secretaria_view')) {
            cards.push({
                title: 'Secretaria',
                description: 'Visualizar e editar chamados',
                icon: '📋',
                url: '/secretaria.html',
                color: 'secondary'
            });
        }

        // Coordenador - Available only to Coordenador
        if (auth.hasPermission('coordenador_view')) {
            cards.push({
                title: 'Coordenação',
                description: 'Gestão completa do sistema',
                icon: '⚙️',
                url: '/coordenador.html',
                color: 'success'
            });
        }

        // Additional cards for Coordenador
        if (auth.hasRole('COORDENADOR')) {
            cards.push(
                {
                    title: 'Adicionar Voluntário',
                    description: 'Cadastrar novos voluntários',
                    icon: '👥',
                    url: '/add-voluntario.html',
                    color: 'warning'
                },
                {
                    title: 'Relatórios',
                    description: 'Visualizar relatórios e estatísticas',
                    icon: '📊',
                    url: '/relatorios.html',
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
        const user = auth.getCurrentUser();
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
            if (!auth.hasPermission(requiredPermission)) {
                item.style.display = 'none';
            }
        });

        // Setup role-specific navigation
        const roleItems = document.querySelectorAll('[data-role]');
        
        roleItems.forEach(item => {
            const requiredRole = item.getAttribute('data-role');
            if (!auth.hasRole(requiredRole)) {
                item.style.display = 'none';
            }
        });
    }

    // Setup page-specific functionality
    setupPageFunctionality(user) {
        const currentPage = window.location.pathname;

        switch (currentPage) {
            case '/balcao.html':
                this.setupBalcaoPage(user);
                break;
            case '/secretaria.html':
                this.setupSecretariaPage(user);
                break;
            case '/coordenador.html':
                this.setupCoordenadorPage(user);
                break;
        }
    }

    // Setup Balcão page functionality
    setupBalcaoPage(user) {
        // Enable/disable buttons based on permissions
        const newTicketBtn = document.querySelector('#new-ticket-btn');
        if (newTicketBtn && !auth.hasPermission('balcao_create')) {
            newTicketBtn.style.display = 'none';
        }

        // Filter tickets by user region for Voluntários
        if (auth.hasRole('VOLUNTARIO')) {
            this.filterTicketsByRegion(user.region);
        }
    }

    // Setup Secretaria page functionality
    setupSecretariaPage(user) {
        // Pre-select user's region in filters
        const regionFilter = document.querySelector('#region-filter');
        if (regionFilter && user.region) {
            regionFilter.value = user.region;
        }

        // Enable/disable edit buttons based on permissions
        const editButtons = document.querySelectorAll('.edit-ticket-btn');
        editButtons.forEach(btn => {
            if (!auth.hasPermission('balcao_edit')) {
                btn.style.display = 'none';
            }
        });

        // Enable/disable delete buttons based on permissions
        const deleteButtons = document.querySelectorAll('.delete-ticket-btn');
        deleteButtons.forEach(btn => {
            if (!auth.hasPermission('balcao_delete')) {
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
        return auth.getCurrentUser();
    }

    // Update user profile
    async updateUserProfile(profileData) {
        try {
            const user = auth.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            // Validate profile data
            if (!profileData.name || profileData.name.trim().length < 2) {
                throw new Error('Nome deve ter pelo menos 2 caracteres');
            }

            if (!profileData.email || !auth.validateEmail(profileData.email)) {
                throw new Error('Email inválido');
            }

            // Update user data
            const updatedUser = {
                ...user,
                name: profileData.name.trim(),
                email: profileData.email.trim(),
                church: profileData.church,
                region: profileData.region
            };

            // Save updated session
            auth.currentUser = updatedUser;
            auth.saveSession();

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
            auth.logout();
        }
    }

    // Show user profile modal
    showProfileModal() {
        const user = auth.getCurrentUser();
        if (!user) return;

        const modal = document.querySelector('#profile-modal');
        if (modal) {
            // Populate modal with user data
            const nameInput = modal.querySelector('#profile-name');
            const emailInput = modal.querySelector('#profile-email');
            const churchSelect = modal.querySelector('#profile-church');
            const regionSelect = modal.querySelector('#profile-region');

            if (nameInput) nameInput.value = user.name;
            if (emailInput) emailInput.value = user.email;
            if (churchSelect) churchSelect.value = user.church;
            if (regionSelect) regionSelect.value = user.region;

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
