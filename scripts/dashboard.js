/**
 * Dashboard Management System
 * Handles the main dashboard functionality and user interface
 * Version: 2.0.0
 */

'use strict';

class DashboardManager {
    constructor() {
        this.user = null;
        this.stats = {};
        this.activities = [];
        this.notifications = [];
        this.refreshInterval = null;
        
        this.init();
    }

    /**
     * Initialize dashboard
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthentication();
            this.setupElements();
            this.setupEventListeners();
            this.loadDashboardData();
            this.setupAutoRefresh();
            
            console.log('✅ DashboardManager inicializado');
        });
    }

    /**
     * Check if user is authenticated
     */
    checkAuthentication() {
        if (!window.authManager?.isAuthenticated()) {
            console.log('❌ Usuário não autenticado, redirecionando...');
            window.location.href = 'index.html';
            return;
        }

        this.user = window.authManager.getCurrentUser();
        console.log('👤 Usuário autenticado:', this.user);
    }

    /**
     * Setup DOM elements
     */
    setupElements() {
        this.elements = {
            // Header elements
            userNameElements: document.querySelectorAll('.user-name'),
            userRoleElements: document.querySelectorAll('.user-role'),
            userRegionElements: document.querySelectorAll('.user-region'),
            
            // Navigation
            navTabs: document.querySelectorAll('.nav-tab'),
            
            // Dashboard sections
            dashboardGrid: document.getElementById('dashboard-grid'),
            quickActions: document.getElementById('quick-actions'),
            recentActivities: document.getElementById('recent-activities'),
            systemStatus: document.getElementById('system-status'),
            
            // Stats elements
            totalTickets: document.getElementById('total-tickets'),
            openTickets: document.getElementById('open-tickets'),
            progressTickets: document.getElementById('progress-tickets'),
            resolvedTickets: document.getElementById('resolved-tickets'),
            
            // Buttons
            analyticsBtn: document.getElementById('analytics-btn'),
            profileBtn: document.getElementById('profile-btn'),
            notificationsBtn: document.getElementById('notifications-btn'),
            logoutBtn: document.getElementById('logout-btn'),
            
            // Modals
            profileModal: document.getElementById('profile-modal'),
            notificationsModal: document.getElementById('notifications-modal'),
            profileForm: document.getElementById('profile-form'),
            notificationsList: document.getElementById('notifications-list'),
            notificationBadge: document.querySelector('.notification-badge')
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        if (this.elements.analyticsBtn) {
            this.elements.analyticsBtn.addEventListener('click', () => {
                window.location.href = 'analytics.html';
            });
        }

        if (this.elements.profileBtn) {
            this.elements.profileBtn.addEventListener('click', () => {
                this.openProfileModal();
            });
        }

        if (this.elements.notificationsBtn) {
            this.elements.notificationsBtn.addEventListener('click', () => {
                this.openNotificationsModal();
            });
        }

        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Profile form
        if (this.elements.profileForm) {
            this.elements.profileForm.addEventListener('submit', (e) => {
                this.handleProfileUpdate(e);
            });
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Permission-based navigation visibility
        this.setupPermissionBasedNavigation();
    }

    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        try {
            console.log('📊 Carregando dados do dashboard...');
            
            // Update user info in header
            this.updateUserInfo();
            
            // Load role-based content
            await this.loadRoleBasedContent();
            
            // Load quick access cards
            this.generateQuickAccessCards();
            
            // Load quick actions
            this.generateQuickActions();
            
            // Load statistics (for coordinators)
            if (this.hasPermission('coordenador_view')) {
                await this.loadStatistics();
            }
            
            // Load recent activities
            if (this.hasPermission('secretaria_view')) {
                await this.loadRecentActivities();
            }
            
            // Load notifications
            await this.loadNotifications();
            
            // Update system status
            if (this.hasPermission('coordenador_view')) {
                this.updateSystemStatus();
            }
            
        } catch (error) {
            console.error('❌ Erro ao carregar dashboard:', error);
            this.showErrorMessage('Erro ao carregar dados do dashboard');
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

        // Update user region
        this.elements.userRegionElements.forEach(el => {
            el.textContent = this.user.regiao || this.user.region || 'N/A';
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
     * Load role-based content
     */
    async loadRoleBasedContent() {
        const userRole = this.user.cargo || this.user.role;
        
        // Show/hide sections based on role
        document.querySelectorAll('[data-role]').forEach(element => {
            const requiredRole = element.getAttribute('data-role');
            if (userRole.includes(requiredRole)) {
                element.style.display = 'block';
            }
        });

        // Show/hide sections based on permissions
        document.querySelectorAll('[data-permission]').forEach(element => {
            const permission = element.getAttribute('data-permission');
            if (this.hasPermission(permission)) {
                element.style.display = 'block';
            }
        });
    }

    /**
     * Generate quick access cards based on user role
     */
    generateQuickAccessCards() {
        if (!this.elements.dashboardGrid) return;

        const userRole = this.user.cargo || this.user.role;
        let cards = [];

        // Base cards for all users
        cards.push({
            title: 'Meu Perfil',
            description: 'Gerenciar informações pessoais',
            icon: '👤',
            action: () => this.openProfileModal(),
            color: 'primary'
        });

        // Role-specific cards
        switch (userRole) {
            case 'VOLUNTARIO':
                cards.push(
                    {
                        title: 'Novo Chamado',
                        description: 'Registrar novo atendimento',
                        icon: '📝',
                        action: () => window.location.href = 'balcao.html',
                        color: 'success'
                    },
                    {
                        title: 'Meus Chamados',
                        description: 'Visualizar chamados registrados',
                        icon: '📋',
                        action: () => window.location.href = 'balcao.html?view=meus',
                        color: 'info'
                    }
                );
                break;

            case 'SECRETARIA':
                cards.push(
                    {
                        title: 'Gerenciar Chamados',
                        description: 'Administrar todos os chamados',
                        icon: '📊',
                        action: () => window.location.href = 'secretaria.html',
                        color: 'primary'
                    },
                    {
                        title: 'Profissionais',
                        description: 'Gerenciar profissionais cadastrados',
                        icon: '👨‍⚕️',
                        action: () => window.location.href = 'profissionais.html',
                        color: 'info'
                    },
                    {
                        title: 'Assessores',
                        description: 'Gerenciar assessores cadastrados',
                        icon: '👨‍💼',
                        action: () => window.location.href = 'assessores.html',
                        color: 'warning'
                    }
                );
                break;

            case 'COORDENADOR_GERAL':
            case 'COORDENADOR_LOCAL':
                cards.push(
                    {
                        title: 'Visão Geral',
                        description: 'Estatísticas e relatórios',
                        icon: '📈',
                        action: () => window.location.href = 'coordenador.html',
                        color: 'primary'
                    },
                    {
                        title: 'Analytics',
                        description: 'Análises avançadas do sistema',
                        icon: '📊',
                        action: () => window.location.href = 'analytics.html',
                        color: 'info'
                    },
                    {
                        title: 'Relatórios',
                        description: 'Gerar relatórios detalhados',
                        icon: '📄',
                        action: () => window.location.href = 'relatorios.html',
                        color: 'success'
                    }
                );
                break;
        }

        // Render cards
        this.renderCards(cards);
    }

    /**
     * Render dashboard cards
     */
    renderCards(cards) {
        const grid = this.elements.dashboardGrid;
        if (!grid) return;

        const cardsHTML = cards.map(card => `
            <div class="dashboard-card" role="button" tabindex="0" 
                 data-action="${card.title}" 
                 onclick="window.dashboardManager.executeCardAction('${card.title}')"
                 onkeydown="if(event.key==='Enter'||event.key===' ') window.dashboardManager.executeCardAction('${card.title}')">
                <div class="dashboard-icon">${card.icon}</div>
                <h4>${card.title}</h4>
                <p>${card.description}</p>
            </div>
        `).join('');

        grid.innerHTML = cardsHTML;

        // Store card actions for later use
        this.cardActions = {};
        cards.forEach(card => {
            this.cardActions[card.title] = card.action;
        });
    }

    /**
     * Execute card action
     */
    executeCardAction(cardTitle) {
        const action = this.cardActions[cardTitle];
        if (action && typeof action === 'function') {
            action();
        }
    }

    /**
     * Generate quick actions
     */
    generateQuickActions() {
        if (!this.elements.quickActions) return;

        const actions = [
            {
                title: 'Buscar Chamado',
                description: 'Localizar chamado por número ou cidadão',
                icon: '🔍',
                action: () => this.openSearchModal()
            },
            {
                title: 'Ajuda',
                description: 'Documentação e suporte técnico',
                icon: '❓',
                action: () => this.openHelpModal()
            }
        ];

        const actionsHTML = actions.map(action => `
            <div class="card" role="button" tabindex="0" style="cursor: pointer;"
                 onclick="window.dashboardManager.executeQuickAction('${action.title}')"
                 onkeydown="if(event.key==='Enter'||event.key===' ') window.dashboardManager.executeQuickAction('${action.title}')">
                <div class="text-center">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">${action.icon}</div>
                    <h5>${action.title}</h5>
                    <p class="text-secondary">${action.description}</p>
                </div>
            </div>
        `).join('');

        this.elements.quickActions.innerHTML = actionsHTML;

        // Store actions
        this.quickActions = {};
        actions.forEach(action => {
            this.quickActions[action.title] = action.action;
        });
    }

    /**
     * Execute quick action
     */
    executeQuickAction(actionTitle) {
        const action = this.quickActions[actionTitle];
        if (action && typeof action === 'function') {
            action();
        }
    }

    /**
     * Load statistics for coordinators
     */
    async loadStatistics() {
        try {
            const stats = await window.flowManager?.getDashboardData({ 
                period: '30days',
                region: this.user.regiao 
            });

            if (stats?.success && stats.data) {
                this.updateStatistics(stats.data);
            } else {
                // Fallback to mock data
                this.updateStatistics({
                    totalTickets: 150,
                    openTickets: 45,
                    progressTickets: 32,
                    resolvedTickets: 73
                });
            }
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
        }
    }

    /**
     * Update statistics display
     */
    updateStatistics(stats) {
        if (this.elements.totalTickets) {
            this.elements.totalTickets.textContent = stats.totalTickets || 0;
        }
        if (this.elements.openTickets) {
            this.elements.openTickets.textContent = stats.openTickets || 0;
        }
        if (this.elements.progressTickets) {
            this.elements.progressTickets.textContent = stats.progressTickets || 0;
        }
        if (this.elements.resolvedTickets) {
            this.elements.resolvedTickets.textContent = stats.resolvedTickets || 0;
        }
    }

    /**
     * Load recent activities
     */
    async loadRecentActivities() {
        try {
            const activities = await this.fetchRecentActivities();
            this.renderActivities(activities);
        } catch (error) {
            console.error('❌ Erro ao carregar atividades:', error);
            this.renderActivities([]);
        }
    }

    /**
     * Fetch recent activities
     */
    async fetchRecentActivities() {
        // Mock data for now
        return [
            {
                id: 1,
                type: 'ticket_created',
                title: 'Novo chamado criado',
                description: 'Chamado #1001 - Solicitação de documentos',
                time: '2 minutos atrás',
                icon: '📝'
            },
            {
                id: 2,
                type: 'ticket_updated',
                title: 'Chamado atualizado',
                description: 'Chamado #998 - Status alterado para "Em andamento"',
                time: '15 minutos atrás',
                icon: '🔄'
            },
            {
                id: 3,
                type: 'user_registered',
                title: 'Novo usuário cadastrado',
                description: 'João Silva registrado como voluntário',
                time: '1 hora atrás',
                icon: '👤'
            }
        ];
    }

    /**
     * Render activities list
     */
    renderActivities(activities) {
        if (!this.elements.recentActivities) return;

        if (activities.length === 0) {
            this.elements.recentActivities.innerHTML = `
                <div class="text-center text-secondary">
                    <p>Nenhuma atividade recente encontrada.</p>
                </div>
            `;
            return;
        }

        const activitiesHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');

        this.elements.recentActivities.innerHTML = activitiesHTML;
    }

    /**
     * Load notifications
     */
    async loadNotifications() {
        try {
            // Mock notifications for now
            this.notifications = [
                {
                    id: 1,
                    title: 'Sistema atualizado',
                    message: 'Nova versão do sistema foi instalada com melhorias.',
                    type: 'info',
                    timestamp: new Date(Date.now() - 30000),
                    read: false
                },
                {
                    id: 2,
                    title: 'Chamado urgente',
                    message: 'Chamado #1005 marcado como urgente requer atenção.',
                    type: 'warning',
                    timestamp: new Date(Date.now() - 3600000),
                    read: false
                }
            ];

            this.updateNotificationBadge();
        } catch (error) {
            console.error('❌ Erro ao carregar notificações:', error);
        }
    }

    /**
     * Update notification badge
     */
    updateNotificationBadge() {
        if (!this.elements.notificationBadge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            this.elements.notificationBadge.textContent = unreadCount;
            this.elements.notificationBadge.classList.remove('hidden');
        } else {
            this.elements.notificationBadge.classList.add('hidden');
        }
    }

    /**
     * Update system status
     */
    updateSystemStatus() {
        if (!this.elements.systemStatus) return;

        // Test system connections
        this.testSystemConnections();
    }

    /**
     * Test system connections
     */
    async testSystemConnections() {
        try {
            // Test Google Apps Script connection
            const googleScriptStatus = await this.testGoogleScript();
            
            // Update status indicators
            const googleScriptIndicator = this.elements.systemStatus.querySelector('.status-indicator:nth-child(2)');
            if (googleScriptIndicator) {
                googleScriptIndicator.className = `status-indicator ${googleScriptStatus ? 'online' : 'offline'}`;
            }
        } catch (error) {
            console.error('❌ Erro ao testar conexões:', error);
        }
    }

    /**
     * Test Google Apps Script connection
     */
    async testGoogleScript() {
        try {
            const result = await window.flowManager?.testConnection();
            return result?.success || false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Setup permission-based navigation
     */
    setupPermissionBasedNavigation() {
        this.elements.navTabs.forEach(tab => {
            const permission = tab.getAttribute('data-permission');
            if (permission && !this.hasPermission(permission)) {
                tab.style.display = 'none';
            }
        });
    }

    /**
     * Check if user has permission
     */
    hasPermission(permission) {
        const userRole = this.user?.cargo || this.user?.role;
        
        const permissions = {
            'balcao_access': ['VOLUNTARIO', 'SECRETARIA', 'COORDENADOR_LOCAL', 'COORDENADOR_GERAL'],
            'secretaria_view': ['SECRETARIA', 'COORDENADOR_LOCAL', 'COORDENADOR_GERAL'],
            'coordenador_view': ['COORDENADOR_LOCAL', 'COORDENADOR_GERAL'],
            'relatorios_view': ['SECRETARIA', 'COORDENADOR_LOCAL', 'COORDENADOR_GERAL'],
            'analytics_view': ['COORDENADOR_LOCAL', 'COORDENADOR_GERAL']
        };

        return permissions[permission]?.includes(userRole) || false;
    }

    /**
     * Open profile modal
     */
    openProfileModal() {
        if (!this.elements.profileModal) return;

        // Populate form with current user data
        this.populateProfileForm();
        this.openModal(this.elements.profileModal);
    }

    /**
     * Populate profile form
     */
    populateProfileForm() {
        if (!this.user) return;

        const nameInput = document.getElementById('profile-name');
        const emailInput = document.getElementById('profile-email');
        const phoneInput = document.getElementById('profile-phone');
        const churchSelect = document.getElementById('profile-church');
        const regionSelect = document.getElementById('profile-region');

        if (nameInput) nameInput.value = this.user.nome || this.user.name || '';
        if (emailInput) emailInput.value = this.user.email || '';
        if (phoneInput) phoneInput.value = this.user.telefone || this.user.phone || '';
        if (churchSelect) churchSelect.value = this.user.igreja || this.user.church || '';
        if (regionSelect) regionSelect.value = this.user.regiao || this.user.region || '';
    }

    /**
     * Handle profile update
     */
    async handleProfileUpdate(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const profileData = Object.fromEntries(formData);

            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, true);

            // Update profile (mock for now)
            await this.updateProfile(profileData);

            // Show success message
            window.Helpers?.showToast('Perfil atualizado com sucesso!', 'success');

            // Close modal
            this.closeModal(this.elements.profileModal);

        } catch (error) {
            console.error('❌ Erro ao atualizar perfil:', error);
            window.Helpers?.showToast('Erro ao atualizar perfil. Tente novamente.', 'error');
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        // Mock update - in real implementation, call flowManager
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    /**
     * Open notifications modal
     */
    openNotificationsModal() {
        if (!this.elements.notificationsModal) return;

        this.renderNotifications();
        this.openModal(this.elements.notificationsModal);
    }

    /**
     * Render notifications
     */
    renderNotifications() {
        if (!this.elements.notificationsList) return;

        if (this.notifications.length === 0) {
            this.elements.notificationsList.innerHTML = `
                <div class="text-center text-secondary">
                    <p>Nenhuma notificação encontrada.</p>
                </div>
            `;
            return;
        }

        const notificationsHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                <div class="notification-content">
                    <h5>${notification.title}</h5>
                    <p>${notification.message}</p>
                    <small>${this.formatTimestamp(notification.timestamp)}</small>
                </div>
                ${!notification.read ? `
                    <button class="btn btn-small" onclick="window.dashboardManager.markAsRead(${notification.id})">
                        Marcar como lida
                    </button>
                ` : ''}
            </div>
        `).join('');

        this.elements.notificationsList.innerHTML = notificationsHTML;
    }

    /**
     * Mark notification as read
     */
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationBadge();
            this.renderNotifications();
        }
    }

    /**
     * Format timestamp
     */
    formatTimestamp(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days} dias atrás`;
        if (hours > 0) return `${hours} horas atrás`;
        if (minutes > 0) return `${minutes} minutos atrás`;
        return 'Agora mesmo';
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

    /**
     * Open modal
     */
    openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus first input
            const firstInput = modal.querySelector('input, select, textarea, button');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
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
            if (btnText) btnText.textContent = 'Salvar Alterações';
            if (spinner) spinner.classList.add('hidden');
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
     * Setup auto refresh
     */
    setupAutoRefresh() {
        // Refresh dashboard data every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.loadNotifications();
            if (this.hasPermission('coordenador_view')) {
                this.loadStatistics();
            }
        }, 300000); // 5 minutes
    }

    /**
     * Open search modal (placeholder)
     */
    openSearchModal() {
        alert('Funcionalidade de busca em desenvolvimento.');
    }

    /**
     * Open help modal (placeholder)
     */
    openHelpModal() {
        alert('Documentação em desenvolvimento.');
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Initialize dashboard manager
window.dashboardManager = new DashboardManager();

console.log('✅ Dashboard script carregado');