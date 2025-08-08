/**
 * Sistema de Configuração - Balcão da Cidadania
 * Configuração exclusiva para Power Automate
 * Version: 3.0.0 - Power Automate Edition
 */

'use strict';

// Configurações principais do sistema para Power Automate
window.CONFIG = {
    // Informações do sistema
    SYSTEM: {
        name: 'Balcão da Cidadania',
        version: '3.0.0-PowerAutomate',
        organization: 'Igreja Evangélica Pentecostal Arimateia',
        description: 'Sistema de gestão para atendimento social e cidadania - Power Automate Edition',
        supportEmail: 'suporte@arimateia.org.br',
        supportPhone: '(11) 99999-0000'
    },

    // URLs da API Power Automate
    API: {
        // Power Automate Flow URLs - CONFIGURAÇÃO ATIVA
        BASE_URL: 'https://prod-xx.westus2.logic.azure.com:443/workflows/arimateia-api-gateway/triggers/manual/paths/invoke',
        
        // Flows específicos (use se não usar gateway)
        FLOWS: {
            AUTH: 'https://prod-xx.westus2.logic.azure.com:443/workflows/arimateia-auth/triggers/manual/paths/invoke',
            USERS: 'https://prod-xx.westus2.logic.azure.com:443/workflows/arimateia-users/triggers/manual/paths/invoke',
            TICKETS: 'https://prod-xx.westus2.logic.azure.com:443/workflows/arimateia-tickets/triggers/manual/paths/invoke',
            CONFIG: 'https://prod-xx.westus2.logic.azure.com:443/workflows/arimateia-config/triggers/manual/paths/invoke',
            REPORTS: 'https://prod-xx.westus2.logic.azure.com:443/workflows/arimateia-reports/triggers/manual/paths/invoke'
        },
        
        // Headers específicos para Power Automate
        HEADERS: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'ArimateiaService/3.0.0-PA'
        },
        
        ENDPOINTS: {
            auth: '/auth',
            login: '/auth/login',
            logout: '/auth/logout',
            users: '/users',
            tickets: '/tickets',
            professionals: '/professionals',
            volunteers: '/volunteers',
            categories: '/categories',
            reports: '/reports',
            notifications: '/notifications'
        },
        
        TIMEOUT: 45000, // 45 segundos (Power Automate pode ser mais lento)
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 2000 // 2 segundos entre tentativas
    },

    // Mapeamento de ações para Power Automate
    ACTION_MAPPING: {
        // Autenticação
        'validateUser': { flow: 'AUTH', method: 'POST', endpoint: '/validate' },
        
        // Usuários
        'newUser': { flow: 'USERS', method: 'POST', endpoint: '/create' },
        'getUsers': { flow: 'USERS', method: 'GET', endpoint: '/list' },
        'checkUserExists': { flow: 'USERS', method: 'GET', endpoint: '/check' },
        'updateUser': { flow: 'USERS', method: 'PUT', endpoint: '/update' },
        
        // Chamados
        'newTicket': { flow: 'TICKETS', method: 'POST', endpoint: '/create' },
        'updateTicket': { flow: 'TICKETS', method: 'PUT', endpoint: '/update' },
        'getTickets': { flow: 'TICKETS', method: 'GET', endpoint: '/list' },
        'deleteTicket': { flow: 'TICKETS', method: 'DELETE', endpoint: '/delete' },
        
        // Configurações
        'getIgrejasRegioes': { flow: 'CONFIG', method: 'GET', endpoint: '/churches-regions' },
        'getCategories': { flow: 'CONFIG', method: 'GET', endpoint: '/categories' },
        'getProfessionals': { flow: 'CONFIG', method: 'GET', endpoint: '/professionals' },
        'getVolunteers': { flow: 'CONFIG', method: 'GET', endpoint: '/volunteers' },
        
        // Relatórios
        'getDashboardData': { flow: 'REPORTS', method: 'GET', endpoint: '/dashboard' },
        'getUserStats': { flow: 'REPORTS', method: 'GET', endpoint: '/user-stats' },
        'generateReport': { flow: 'REPORTS', method: 'POST', endpoint: '/generate' },
        
        // Teste
        'testConnection': { flow: 'CONFIG', method: 'GET', endpoint: '/test' }
    },

    // Power Automate Configuration
    POWER_AUTOMATE: {
        // URLs dos Power Automate Flows (substitua pelas suas URLs reais)
        BASE_URL: 'https://prod-xx.westus.logic.azure.com/workflows',
        SHAREPOINT_URL: 'https://igrejauniversaldorei-my.sharepoint.com/sites/BalcaoCidadania',
        ONEDRIVE_URL: 'https://igrejauniversaldorei-my.sharepoint.com/:x:/g/personal/wagduarte_universal_org/EWjS3RVFYzZMiwuVhdxYoeYBOKTYSFe3P7a29TS9zn5qgw',
        
        // URLs dos Flows específicos - CONFIGURAR COM SUAS URLs REAIS
        ENDPOINTS: {
            VALIDAR_LOGIN: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_LOGIN/triggers/manual/paths/invoke',
            CRIAR_CHAMADO: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_CHAMADO/triggers/manual/paths/invoke',
            LISTAR_CHAMADOS: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_LISTAR/triggers/manual/paths/invoke',
            ATUALIZAR_CHAMADO: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_UPDATE/triggers/manual/paths/invoke',
            EXCLUIR_CHAMADO: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_DELETE/triggers/manual/paths/invoke',
            CRIAR_USUARIO: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_USER/triggers/manual/paths/invoke',
            OBTER_CONFIGURACOES: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_CONFIG/triggers/manual/paths/invoke',
            OBTER_IGREJAS: 'https://prod-xx.westus.logic.azure.com/workflows/FLOW_ID_IGREJAS/triggers/manual/paths/invoke'
        },
        ABAS: {
            CHAMADOS: 'CHAMADOS',
            OBSERVACOES_CHAMADOS: 'OBSERVACOES_CHAMADOS',
            CHAMADOS_EXCLUIDOS: 'CHAMADOS_EXCLUIDOS',
            USUARIOS: 'USUARIOS',
            CATEGORIAS_SERVICOS: 'CATEGORIAS_SERVICOS',
            IGREJAS_REGIOES: 'IGREJAS_REGIOES',
            RELATORIOS_MENSAIS: 'RELATORIOS_MENSAIS',
            PROFISSIONAIS_LIBERAIS: 'PROFISSIONAIS_LIBERAIS',
            ACESSORES: 'ACESSORES',
            ELEICOES_DEPUTADOS: 'ELEICOES_DEPUTADOS',
            ELEICOES_VEREADORES: 'ELEICOES_VEREADORES',
            ELEICOES_CONSELHO: 'ELEICOES_CONSELHO'
        }
    },

    // Regiões atendidas
    REGIONS: [
        'Norte',
        'Sul', 
        'Centro',
        'Leste',
        'Oeste',
        'Grande São Paulo',
        'ABC Paulista',
        'Baixada Santista',
        'Interior'
    ],

    // Igrejas parceiras
    CHURCHES: [
        'Igreja Central - Sede',
        'Igreja do Bairro Alto',
        'Igreja da Vila Nova',
        'Igreja São José',
        'Igreja Santa Maria',
        'Igreja do Centro',
        'Igreja da Penha',
        'Igreja de Itaquera',
        'Igreja de São Miguel',
        'Igreja da Mooca',
        'Igreja do Ipiranga',
        'Igreja de Pinheiros',
        'Igreja da Lapa',
        'Igreja de Santana',
        'Igreja da Vila Madalena'
    ],

    // Categorias de demandas
    CATEGORIES: [
        {
            id: 'documentos',
            nome: 'Documentos',
            icone: '📄',
            cor: '#007bff',
            descricao: 'Emissão e regularização de documentos pessoais',
            demandas: [
                'CPF - Cadastro de Pessoa Física',
                'RG - Registro Geral',
                'Certidão de Nascimento',
                'Certidão de Casamento',
                'Certidão de Óbito',
                'Título de Eleitor',
                'Carteira de Trabalho',
                'Passaporte',
                'Carteira de Identidade',
                'Certidão Negativa de Débitos'
            ]
        },
        {
            id: 'beneficios',
            nome: 'Benefícios Sociais',
            icone: '💰',
            cor: '#28a745',
            descricao: 'Auxílios e benefícios governamentais',
            demandas: [
                'Auxílio Brasil (antigo Bolsa Família)',
                'BPC - Benefício de Prestação Continuada',
                'LOAS - Lei Orgânica da Assistência Social',
                'Auxílio Emergencial',
                'Seguro Desemprego',
                'Salário Família',
                'Auxílio Maternidade',
                'Pensão por Morte',
                'Auxílio Doença',
                'Vale Gás'
            ]
        },
        {
            id: 'saude',
            nome: 'Saúde',
            icone: '🏥',
            cor: '#dc3545',
            descricao: 'Serviços de saúde e bem-estar',
            demandas: [
                'Consulta Médica Geral',
                'Consulta Especializada',
                'Exames Laboratoriais',
                'Exames de Imagem',
                'Medicamentos',
                'Cirurgias',
                'Fisioterapia',
                'Psicologia',
                'Nutrição',
                'Odontologia'
            ]
        },
        {
            id: 'juridico',
            nome: 'Jurídico',
            icone: '⚖️',
            cor: '#6f42c1',
            descricao: 'Orientação e assistência jurídica',
            demandas: [
                'Orientação Legal Geral',
                'Direito de Família',
                'Direito Trabalhista',
                'Direito Previdenciário',
                'Direito Civil',
                'Direito do Consumidor',
                'Elaboração de Contratos',
                'Divórcio',
                'Pensão Alimentícia',
                'Aposentadoria'
            ]
        },
        {
            id: 'trabalho',
            nome: 'Trabalho e Renda',
            icone: '💼',
            cor: '#fd7e14',
            descricao: 'Oportunidades de trabalho e geração de renda',
            demandas: [
                'Cadastro no Sistema Nacional de Emprego',
                'Qualificação Profissional',
                'Cursos Técnicos',
                'Microempreendedor Individual (MEI)',
                'Cooperativas',
                'Economia Solidária',
                'Orientação Profissional',
                'Elaboração de Currículo',
                'Preparação para Entrevistas',
                'Encaminhamento para Vagas'
            ]
        },
        {
            id: 'educacao',
            nome: 'Educação',
            icone: '📚',
            cor: '#20c997',
            descricao: 'Acesso à educação e capacitação',
            demandas: [
                'Matrícula em Escola Pública',
                'EJA - Educação de Jovens e Adultos',
                'Cursos Técnicos',
                'Cursos Superiores',
                'Bolsas de Estudo',
                'Material Escolar',
                'Transporte Escolar',
                'Alfabetização de Adultos',
                'Cursos Profissionalizantes',
                'Certificação de Competências'
            ]
        },
        {
            id: 'habitacao',
            nome: 'Habitação',
            icone: '🏠',
            cor: '#6610f2',
            descricao: 'Moradia e habitação social',
            demandas: [
                'Programa Minha Casa Minha Vida',
                'Regularização Fundiária',
                'Financiamento Habitacional',
                'Reforma de Habitação',
                'Auxílio Aluguel',
                'Cadastro Habitacional',
                'Documentação Imobiliária',
                'Usucapião',
                'IPTU Social',
                'Melhorias Habitacionais'
            ]
        }
    ],

    // Status dos chamados
    TICKET_STATUS: [
        {
            id: 'aberto',
            nome: 'Aberto',
            icone: '🟢',
            cor: '#28a745',
            descricao: 'Chamado recém-criado, aguardando atendimento'
        },
        {
            id: 'em_andamento',
            nome: 'Em Andamento',
            icone: '🟡',
            cor: '#ffc107',
            descricao: 'Chamado sendo atendido'
        },
        {
            id: 'aguardando',
            nome: 'Aguardando Retorno',
            icone: '🟠',
            cor: '#fd7e14',
            descricao: 'Aguardando retorno do cidadão ou documentação'
        },
        {
            id: 'resolvido',
            nome: 'Resolvido',
            icone: '✅',
            cor: '#28a745',
            descricao: 'Chamado finalizado com sucesso'
        },
        {
            id: 'cancelado',
            nome: 'Cancelado',
            icone: '❌',
            cor: '#dc3545',
            descricao: 'Chamado cancelado'
        }
    ],

    // Níveis de prioridade
    PRIORITIES: [
        {
            id: 'baixa',
            nome: 'Baixa',
            icone: '🟢',
            cor: '#28a745',
            descricao: 'Pode aguardar alguns dias',
            sla: 7 // dias
        },
        {
            id: 'media',
            nome: 'Média',
            icone: '🟡',
            cor: '#ffc107',
            descricao: 'Necessita atenção em breve',
            sla: 3 // dias
        },
        {
            id: 'alta',
            nome: 'Alta',
            icone: '🟠',
            cor: '#fd7e14',
            descricao: 'Precisa ser resolvido rapidamente',
            sla: 1 // dia
        },
        {
            id: 'urgente',
            nome: 'Urgente',
            icone: '🔴',
            cor: '#dc3545',
            descricao: 'Requer ação imediata',
            sla: 0.5 // meio dia
        }
    ],

    // Cargos/Perfis de usuário
    USER_ROLES: [
        {
            id: 'COORDENADOR_GERAL',
            nome: 'Coordenador Geral',
            descricao: 'Acesso completo ao sistema',
            permissions: ['*']
        },
        {
            id: 'COORDENADOR_LOCAL',
            nome: 'Coordenador Local',
            descricao: 'Coordenação de região específica',
            permissions: ['read', 'write', 'manage_local']
        },
        {
            id: 'SECRETARIA',
            nome: 'Secretaria',
            descricao: 'Gestão administrativa e atendimento',
            permissions: ['read', 'write', 'assign', 'export']
        },
        {
            id: 'VOLUNTARIO',
            nome: 'Voluntário',
            descricao: 'Atendimento básico e criação de chamados',
            permissions: ['read', 'create', 'update_own']
        },
        {
            id: 'PROFISSIONAL',
            nome: 'Profissional',
            descricao: 'Especialista em área específica',
            permissions: ['read', 'update_assigned']
        }
    ],

    // Configurações de paginação
    PAGINATION: {
        DEFAULT_ITEMS_PER_PAGE: 20,
        OPTIONS: [10, 20, 50, 100],
        MAX_ITEMS_PER_PAGE: 100
    },

    // Configurações de upload
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: [
            'image/jpeg',
            'image/png', 
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        MAX_FILES: 5
    },

    // Configurações de notificação
    NOTIFICATIONS: {
        AUTO_REFRESH_INTERVAL: 30000, // 30 segundos
        SHOW_TOAST_DURATION: 5000, // 5 segundos
        MAX_NOTIFICATIONS: 50
    },

    // Configurações de exportação
    EXPORT: {
        FORMATS: ['CSV', 'PDF', 'XLSX'],
        MAX_RECORDS: 10000,
        FILENAME_PREFIX: 'balcao_cidadania'
    },

    // Validações de campos
    VALIDATION: {
        CPF: {
            pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            message: 'CPF deve estar no formato 000.000.000-00'
        },
        PHONE: {
            pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
            message: 'Telefone deve estar no formato (11) 99999-9999'
        },
        EMAIL: {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Email deve ter um formato válido'
        }
    },

    // Configurações de interface
    UI: {
        THEME: {
            PRIMARY_COLOR: '#00c6ff',
            SECONDARY_COLOR: '#6c757d',
            SUCCESS_COLOR: '#28a745',
            WARNING_COLOR: '#ffc107',
            DANGER_COLOR: '#dc3545',
            INFO_COLOR: '#17a2b8'
        },
        ANIMATIONS: {
            DURATION: 300,
            EASING: 'ease-in-out'
        },
        BREAKPOINTS: {
            MOBILE: 480,
            TABLET: 768,
            DESKTOP: 1024,
            LARGE: 1200
        }
    },

    // Configurações de cache
    CACHE: {
        TTL: 300000, // 5 minutos
        KEYS: {
            USER_DATA: 'user_data',
            CATEGORIES: 'categories',
            PROFESSIONALS: 'professionals',
            VOLUNTEERS: 'volunteers'
        }
    },

    // Configurações de logging
    LOGGING: {
        LEVEL: 'info', // debug, info, warn, error
        CONSOLE: true,
        REMOTE: false,
        MAX_LOGS: 1000
    },

    // URLs de redirecionamento
    ROUTES: {
        LOGIN: 'index.html',
        DASHBOARD: 'dashboard.html',
        SECRETARIA: 'secretaria.html',
        PROFISSIONAIS: 'profissionais.html',
        ASSESSORES: 'assessores.html',
        RELATORIOS: 'relatorios.html',
        PERFIL: 'perfil.html'
    },

    // Textos e mensagens do sistema
    MESSAGES: {
        SUCCESS: {
            TICKET_CREATED: 'Chamado criado com sucesso!',
            TICKET_UPDATED: 'Chamado atualizado com sucesso!',
            PROFESSIONAL_ASSIGNED: 'Profissional atribuído com sucesso!',
            DATA_EXPORTED: 'Dados exportados com sucesso!',
            LOGIN_SUCCESS: 'Login realizado com sucesso!'
        },
        ERROR: {
            GENERIC: 'Ocorreu um erro inesperado. Tente novamente.',
            NETWORK: 'Erro de conexão. Verifique sua internet.',
            UNAUTHORIZED: 'Você não tem permissão para esta ação.',
            VALIDATION: 'Por favor, verifique os dados informados.',
            NOT_FOUND: 'Recurso não encontrado.'
        },
        LOADING: {
            TICKETS: 'Carregando chamados...',
            PROFESSIONALS: 'Carregando profissionais...',
            CATEGORIES: 'Carregando categorias...',
            SAVING: 'Salvando...',
            EXPORTING: 'Exportando dados...'
        }
    },

    // Configurações de desenvolvimento (removidas em produção)
    DEV: {
        MOCK_DATA: false,
        DEBUG_MODE: false, // Desabilitado em produção
        SHOW_LOGS: false,
        BYPASS_AUTH: false
    }
};

// ===== FUNÇÕES ESPECÍFICAS PARA POWER AUTOMATE =====

// Função para obter URL do flow específico
window.CONFIG.getFlowUrl = function(action) {
    const mapping = this.ACTION_MAPPING[action];
    if (!mapping) {
        console.warn(`Ação '${action}' não encontrada no mapeamento`);
        return this.API.BASE_URL; // Fallback para gateway
    }
    
    // Se usar gateway, sempre retorna BASE_URL
    if (this.API.BASE_URL.includes('api-gateway')) {
        return this.API.BASE_URL;
    }
    
    // Senão, retorna URL do flow específico
    return this.API.FLOWS[mapping.flow] || this.API.BASE_URL;
};

// Função para obter configuração completa da ação
window.CONFIG.getActionConfig = function(action) {
    const mapping = this.ACTION_MAPPING[action];
    if (!mapping) {
        return null;
    }
    
    return {
        url: this.getFlowUrl(action),
        method: mapping.method,
        endpoint: mapping.endpoint,
        timeout: this.getTimeoutForAction(action)
    };
};

// Função para determinar timeout baseado no tipo de operação
window.CONFIG.getTimeoutForAction = function(action) {
    if (action.includes('validate') || action.includes('auth')) return 30000; // 30s
    if (action.includes('get') || action.includes('list')) return 45000; // 45s
    if (action.includes('generate') || action.includes('report')) return 120000; // 2min
    return 60000; // 60s padrão
};

// Configurações específicas do Power Automate
window.CONFIG.POWER_AUTOMATE = {
    // Configuração de retry específica
    RETRY_CONFIG: {
        attempts: 3,
        delay: 2000,
        backoff: 'exponential',
        maxDelay: 10000
    },
    
    // Timeout específico por tipo de operação
    TIMEOUTS: {
        auth: 30000,
        read: 45000,
        write: 60000,
        report: 120000
    },
    
    // Configuração de cache
    CACHE: {
        enabled: true,
        duration: 5 * 60 * 1000, // 5 minutos
        keys: {
            regions: 'pa_regions',
            churches: 'pa_churches',
            categories: 'pa_categories',
            professionals: 'pa_professionals',
            volunteers: 'pa_volunteers'
        }
    },
    
    // Monitoramento e logging
    MONITORING: {
        enabled: true,
        logLevel: 'INFO', // DEBUG, INFO, WARN, ERROR
        trackPerformance: true,
        trackErrors: true
    }
};

// Configurações de autenticação específicas para Power Automate
window.CONFIG.AUTH = {
    SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 horas em ms
    MAX_LOGIN_ATTEMPTS: 3,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos em ms
    PASSWORD_MIN_LENGTH: 6,
    STORAGE_KEY: 'arimateia_session_pa'
};

// Funções utilitárias de configuração
window.CONFIG.getCategory = function(id) {
    return this.CATEGORIES.find(cat => cat.id === id);
};

window.CONFIG.getStatus = function(id) {
    return this.TICKET_STATUS.find(status => status.id === id);
};

window.CONFIG.getPriority = function(id) {
    return this.PRIORITIES.find(priority => priority.id === id);
};

window.CONFIG.getRole = function(id) {
    return this.USER_ROLES.find(role => role.id === id);
};

window.CONFIG.hasPermission = function(userRole, permission) {
    const role = this.getRole(userRole);
    if (!role) return false;
    return role.permissions.includes('*') || role.permissions.includes(permission);
};

window.CONFIG.formatCurrency = function(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

window.CONFIG.formatDate = function(date, options = {}) {
    const defaultOptions = {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        ...options
    };
    return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(new Date(date));
};

window.CONFIG.formatDateTime = function(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
};

// Inicialização e logging
console.log('✅ Configuração do sistema carregada:', {
    system: window.CONFIG.SYSTEM.name,
    version: window.CONFIG.SYSTEM.version,
    categories: window.CONFIG.CATEGORIES.length,
    regions: window.CONFIG.REGIONS.length,
    churches: window.CONFIG.CHURCHES.length
});

// Export para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.CONFIG;
}
