// Google Apps Script integration module for Balcão da Cidadania
class FlowManager {
    constructor() {
        this.scriptUrl = CONFIG.googleAppsScript.webAppUrl;
        this.isOnline = navigator.onLine;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async sendToScript(data) {
        console.log('🌐 Enviando para Google Apps Script...');
        console.log('📍 URL:', this.scriptUrl);
        console.log('📦 Dados:', data);

        try {
            // ✅ USAR URLSearchParams para Google Apps Script
            const formData = new URLSearchParams();
            
            // Adicionar action como parâmetro
            formData.append('action', data.action);
            
            // Adicionar dados como JSON no body
            formData.append('data', JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                clientOrigin: window.location.origin
            }));

            console.log('📤 FormData enviado:', Object.fromEntries(formData));

            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            });

            console.log('📡 Response status:', response.status);

            if (response.ok) {
                const responseText = await response.text();
                console.log('📄 Resposta recebida:', responseText);
                
                try {
                    const result = JSON.parse(responseText);
                    console.log('✅ Resposta final:', result);
                    return result;
                } catch (parseError) {
                    console.error('❌ Erro ao fazer parse do JSON:', parseError);
                    throw new Error(`Resposta inválida: ${responseText.substring(0, 100)}...`);
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            return { 
                success: false, 
                error: `Erro de conexão: ${error.message}` 
            };
        }
    }

    // ✅ LOGIN REAL via Google Apps Script
    async validateUser(email, password) {
        try {
            const result = await this.sendToScript({
                action: 'validateUser',
                email: email,
                password: password
            });

            return result;

        } catch (error) {
            console.error('Validate user error:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ CRIAR CHAMADO REAL
    async createTicket(ticketData) {
        try {
            const user = authManager.getCurrentUser();
            const result = await this.sendToScript({
                action: 'newTicket',
                nomeCidadao: ticketData.nome,
                cpf: ticketData.cpf,
                contato: ticketData.contato,
                email: ticketData.email,
                igreja: user.igreja,
                regiao: user.regiao,
                descricao: ticketData.descricao,
                prioridade: ticketData.prioridade,
                categoria: ticketData.categoria,
                userInfo: {
                    name: user.nome,
                    email: user.email
                }
            });

            return result;

        } catch (error) {
            console.error('Create ticket error:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ BUSCAR CHAMADOS REAIS
    async getTickets(filters = {}) {
        try {
            const result = await this.sendToScript({
                action: 'getTickets',
                filters: filters
            });

            return result;

        } catch (error) {
            console.error('Get tickets error:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ ATUALIZAR CHAMADO REAL
    async updateTicket(ticketId, updateData) {
        try {
            const user = authManager.getCurrentUser();
            const result = await this.sendToScript({
                action: 'updateTicket',
                ticketId: ticketId,
                ...updateData,
                userInfo: {
                    name: user.nome,
                    email: user.email
                }
            });

            return result;

        } catch (error) {
            console.error('Update ticket error:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ BUSCAR USUÁRIOS REAIS
    async getUsers(filters = {}) {
        try {
            const result = await this.sendToScript({
                action: 'getUsers',
                filters: filters
            });

            return result;

        } catch (error) {
            console.error('Get users error:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ CRIAR USUÁRIO REAL
    async createUser(userData) {
        try {
            const currentUser = authManager.getCurrentUser();
            const result = await this.sendToScript({
                action: 'newUser',
                nomeCompleto: userData.nome,
                email: userData.email,
                telefone: userData.telefone,
                cargo: userData.cargo,
                igreja: userData.igreja,
                regiao: userData.regiao,
                observacoes: userData.observacoes,
                userInfo: {
                    name: currentUser.nome,
                    email: currentUser.email
                }
            });

            return result;

        } catch (error) {
            console.error('Create user error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializar globalmente
window.flowManager = new FlowManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowManager;
}
