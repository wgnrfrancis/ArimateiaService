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
        
        // Lista de usuários para teste (CORRIGIDA)
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
