// Configuration file for Balcão da Cidadania

const CONFIG = {
    // Google Apps Script Web App configuration
    googleAppsScript: {
        // ✅ NOVA URL da implantação atualizada  
        webAppUrl: 'https://script.google.com/macros/s/AKfycbwCBrg0zu3Uq09vTtAn8XTd5KwpZaU7Rsc-AqS9muA7zdpPTIGdBrIL4f9u1tm8qhJt/exec',
        spreadsheetId: '1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc'
    },

    // Authentication settings
    auth: {
        sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000 // 15 minutes
    },

    // User roles and permissions
    roles: {
        'COORDENADOR_GERAL': {
            name: 'Coordenador Geral',
            permissions: [
                'coordenador_view',
                'secretaria_view',
                'balcao_view',
                'dashboard_view',
                'user_manage',
                'reports_full',
                'system_admin'
            ]
        },
        'COORDENADOR_LOCAL': {
            name: 'Coordenador Local',
            permissions: [
                'coordenador_view',
                'secretaria_view',
                'balcao_view',
                'dashboard_view',
                'reports_local'
            ]
        },
        'SECRETARIA': {
            name: 'Secretaria',
            permissions: [
                'secretaria_view',
                'balcao_view',
                'dashboard_view',
                'reports_basic'
            ]
        },
        'VOLUNTARIO': {
            name: 'Voluntário',
            permissions: [
                'balcao_view',
                'dashboard_view'
            ]
        }
    },

    // Application settings
    app: {
        name: 'Balcão da Cidadania',
        version: '1.0.0',
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
        defaultRegion: 'CATEDRAL'
    },

    // Ticket priorities
    priorities: {
        'BAIXA': {
            name: 'Baixa',
            color: '#28a745',
            order: 1
        },
        'MEDIA': {
            name: 'Média',
            color: '#ffc107',
            order: 2
        },
        'ALTA': {
            name: 'Alta',
            color: '#fd7e14',
            order: 3
        },
        'URGENTE': {
            name: 'Urgente',
            color: '#dc3545',
            order: 4
        }
    },

    // Ticket statuses
    statuses: {
        'ABERTO': {
            name: 'Aberto',
            color: '#007bff',
            canEdit: true
        },
        'EM_ANDAMENTO': {
            name: 'Em Andamento',
            color: '#ffc107',
            canEdit: true
        },
        'AGUARDANDO': {
            name: 'Aguardando',
            color: '#6c757d',
            canEdit: true
        },
        'RESOLVIDO': {
            name: 'Resolvido',
            color: '#28a745',
            canEdit: false
        },
        'CANCELADO': {
            name: 'Cancelado',
            color: '#dc3545',
            canEdit: false
        }
    },

    // Service categories
    categories: {
        'DOCUMENTACAO': {
            name: 'Documentação',
            subcategories: ['CPF', 'RG', 'Certidões', 'Passaporte', 'Carteira de Trabalho']
        },
        'BENEFICIOS': {
            name: 'Benefícios Sociais',
            subcategories: ['Auxílio Brasil', 'BPC', 'Seguro Desemprego', 'FGTS', 'PIS/PASEP']
        },
        'PREVIDENCIA': {
            name: 'Previdência',
            subcategories: ['INSS', 'Aposentadoria', 'Pensão', 'Auxílio Doença', 'Salário Maternidade']
        },
        'TRABALHISTA': {
            name: 'Direitos Trabalhistas',
            subcategories: ['Reclamação Trabalhista', 'Acordo', 'Consultoria', 'Orientação']
        },
        'FAMILIA': {
            name: 'Direito de Família',
            subcategories: ['Divórcio', 'Pensão Alimentícia', 'Guarda', 'Reconhecimento de União']
        },
        'CONSUMIDOR': {
            name: 'Direito do Consumidor',
            subcategories: ['Reclamação', 'Negativação Indevida', 'Produtos Defeituosos', 'Serviços']
        },
        'OUTROS': {
            name: 'Outros',
            subcategories: ['Orientação Geral', 'Encaminhamentos', 'Diversos']
        }
    },

    // Churches and regions (will be loaded from Google Sheets)
    regions: {
        'CATEDRAL': {
            name: 'Catedral da Fé',
            churches: ['CATEDRAL DA FÉ']
        },
        'PRESIDENTE_PRUDENTE': {
            name: 'Presidente Prudente',
            churches: ['Cecap', 'Humberto Salvador', 'Santo Expedito']
        },
        'PIRAPOZINHO': {
            name: 'Pirapozinho',
            churches: ['Pirapozinho']
        },
        'PRESIDENTE_VENCESLAU': {
            name: 'Presidente Venceslau',
            churches: ['Presidente Venceslau']
        },
        'RANCHARIA': {
            name: 'Rancharia',
            churches: ['RANCHARIA']
        },
        'ANDRADINA': {
            name: 'Andradina',
            churches: ['ANDRADINA']
        },
        'TUPA': {
            name: 'Tupã',
            churches: ['TUPÃ']
        },
        'ASSIS': {
            name: 'Assis',
            churches: ['ASSIS']
        },
        'DRACENA': {
            name: 'Dracena',
            churches: ['DRACENA']
        }
    },

    // UI settings
    ui: {
        itemsPerPage: 20,
        autoRefreshInterval: 30000, // 30 seconds
        toastDuration: 5000, // 5 seconds
        loadingTimeout: 30000 // 30 seconds
    },

    // API settings
    api: {
        timeout: 30000, // 30 seconds
        retries: 3,
        retryDelay: 1000 // 1 second
    }
};

// Make CONFIG available globally
window.CONFIG = CONFIG;

// For Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
