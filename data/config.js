/**
 * Sistema de Configuração - Balcão da Cidadania
 * Centraliza todas as configurações do sistema
 * Version: 2.0.0
 */

'use strict';

// Configurações principais do sistema
window.CONFIG = {
    // Informações do sistema
    SYSTEM: {
        name: 'Balcão da Cidadania',
        version: '2.0.0',
        organization: 'Igreja Evangélica Pentecostal Arimateia',
        description: 'Sistema de gestão para atendimento social e cidadania',
        supportEmail: 'suporte@arimateia.org.br',
        supportPhone: '(11) 99999-0000'
    },

    // URLs da API
    API: {
        // Google Apps Script Web App URL (PRODUÇÃO)
        BASE_URL: 'https://script.google.com/macros/s/AKfycbzKdHQdnSDJnWjWkpSvNGBfKJAJpSLiw4vLF9PGHfHWJbODbj5v5LcxBLwLDfQStTJZ/exec',
        
        // URL Local para desenvolvimento (descomente para usar localmente)
        // BASE_URL: 'http://localhost:3000/api',
        
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
        TIMEOUT: 30000, // 30 segundos
        RETRY_ATTEMPTS: 3
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

    // Configurações de desenvolvimento
    DEV: {
        MOCK_DATA: true,
        DEBUG_MODE: true,
        SHOW_LOGS: true,
        BYPASS_AUTH: false
    }
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
