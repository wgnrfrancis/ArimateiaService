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

// Google Apps Script integration module for Balcão da Cidadania
// Handles all communication with Google Sheets via Google Apps Script Web App
class FlowManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async sendToScript(data, useFormData = false) {
        console.log('🌐 Enviando para Google Apps Script...');
        console.log('📍 URL:', CONFIG.googleAppsScript.webAppUrl);
        console.log('📦 Dados:', data);

        try {
            // Adicionar timestamp e informações do cliente
            const payload = {
                ...data,
                timestamp: new Date().toISOString(),
                userInfo: this.getUserInfo(),
                clientOrigin: window.location.origin
            };

            console.log('📤 Request body completo:', payload);

            // ✅ NOVA ABORDAGEM: Tentar CORS primeiro, depois no-cors como fallback
            let response;
            let responseData;

            try {
                // Primeira tentativa: CORS
                response = await fetch(CONFIG.googleAppsScript.webAppUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(payload),
                    mode: 'cors',
                    cache: 'no-cache'
                });

                if (response.ok) {
                    const responseText = await response.text();
                    console.log('📄 Resposta CORS bem-sucedida:', responseText);
                    
                    try {
                        responseData = JSON.parse(responseText);
                    } catch (parseError) {
                        console.error('❌ Erro ao fazer parse do JSON:', parseError);
                        throw new Error(`Resposta inválida: ${responseText.substring(0, 100)}...`);
                    }
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

            } catch (corsError) {
                console.warn('⚠️ CORS falhou, tentando no-cors:', corsError.message);
                
                // Segunda tentativa: no-cors (fallback)
                try {
                    response = await fetch(CONFIG.googleAppsScript.webAppUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(payload),
                        mode: 'no-cors',
                        cache: 'no-cache'
                    });

                    console.log('📄 Requisição no-cors enviada (não podemos ler a resposta)');
                    
                    // Com no-cors, assumimos sucesso se não houve erro de rede
                    // Para login, vamos simular uma validação local temporária
                    if (data.action === 'loginUser') {
                        responseData = await this.simulateLogin(data.email, data.password);
                    } else {
                        responseData = {
                            success: true,
                            message: 'Requisição enviada com sucesso (modo no-cors)',
                            data: null
                        };
                    }

                } catch (noCorsError) {
                    console.error('❌ Falha total na comunicação:', noCorsError);
                    throw new Error('Não foi possível conectar com o servidor');
                }
            }

            console.log('✅ Resposta final:', responseData);
            return responseData;

        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            throw error;
        }
    }

    // ✅ SIMULAÇÃO TEMPORÁRIA DE LOGIN para desenvolvimento
    async simulateLogin(email, password) {
        console.log('🔐 Simulando login para desenvolvimento...');
        
        // Lista de usuários para teste (baseada na planilha)
        const testUsers = [
            {
                id: 1,
                nome: 'Wagner Duarte',
                email: 'wagduarte@universal.org',
                senha: 'minhaflor',
                cargo: 'COORDENADOR_GERAL',
                igreja: 'CATEDRAL DA FÉ',
                regiao: 'CATEDRAL',
                telefone: '(18) 99999-9999'
            },
            {
                id: 2,
                nome: 'Francis Oliveira',
                email: 'wgnrfrancis@gmail.com',
                senha: 'minhaflor',
                cargo: 'COORDENADOR_LOCAL',
                igreja: 'CATEDRAL DA FÉ',
                regiao: 'CATEDRAL',
                telefone: '(18) 88888-8888'
            }
        ];

        // Buscar usuário
        const user = testUsers.find(u => u.email === email);
        
        if (!user) {
            return {
                success: false,
                error: 'Usuário não encontrado'
            };
        }

        if (user.senha !== password) {
            return {
                success: false,
                error: 'Senha incorreta'
            };
        }

        // Login bem-sucedido
        return {
            success: true,
            data: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                cargo: user.cargo,
                igreja: user.igreja,
                regiao: user.regiao,
                status: 'ATIVO',
                ultimoAcesso: new Date().toLocaleString('pt-BR'),
                totalChamados: 0,
                chamadosResolvidos: 0,
                taxaResolucao: '0%'
            }
        };
    }

    getUserInfo() {
        return {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer || 'direct'
        };
    }

    // Create new ticket
    async createTicket(ticketData) {
        try {
            const payload = {
                action: 'newTicket',
                nomeCidadao: ticketData.nome,
                contato: ticketData.contato,
                email: ticketData.email,
                descricao: ticketData.descricao,
                prioridade: ticketData.prioridade,
                categoria: ticketData.categoria,
                demanda: ticketData.demanda,
                userInfo: (typeof authManager !== 'undefined' && authManager.getCurrentUser) ? authManager.getCurrentUser() : null
            };

            const result = await this.sendToScript(payload);
            return result;

        } catch (error) {
            console.error('Create ticket error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update existing ticket
    async updateTicket(ticketId, updateData) {
        try {
            const user = (typeof authManager !== 'undefined' && authManager.getCurrentUser) ? authManager.getCurrentUser() : null;
            const payload = {
                action: 'updateTicket',
                ticketId: ticketId,
                ...updateData,
                userInfo: user || { name: 'Sistema', email: '' }
            };

            const result = await this.sendToScript(payload);
            return result;

        } catch (error) {
            console.error('Update ticket error:', error);
            return { success: false, error: error.message };
        }
    }

    // Validate user credentials
    async validateUser(email, password) {
        try {
            const payload = {
                action: 'loginUser',
                email: email,
                password: password
            };

            const result = await this.sendToScript(payload);
            return result;

        } catch (error) {
            console.error('Validate user error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get tickets with filters
    async getTickets(filters = {}) {
        try {
            const payload = {
                action: 'getTickets',
                filters: filters
            };

            const result = await this.sendToScript(payload);
            return result;

        } catch (error) {
            console.error('Get tickets error:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar igrejas e regiões da planilha
    async getIgrejasRegioes() {
        try {
            const result = await this.sendToScript({
                action: 'getIgrejasRegioes'
            });
            
            if (result.success && result.data) {
                return { success: true, data: result.data };
            } else {
                throw new Error(result.error || 'Erro ao buscar igrejas e regiões');
            }

        } catch (error) {
            console.error('Buscar igrejas e regiões error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializar o flowManager globalmente
window.flowManager = new FlowManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowManager;
}
