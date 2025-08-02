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

            // ✅ TENTAR COM CORS PRIMEIRO (já que reimplantamos)
            const response = await fetch(CONFIG.googleAppsScript.webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload),
                mode: 'cors',  // ✅ MUDANÇA AQUI - usar CORS agora
                cache: 'no-cache'
            });

            // Verificar se a resposta é válida
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Tentar ler como texto primeiro
            const responseText = await response.text();
            console.log('📄 Resposta bruta:', responseText);

            // Verificar se é JSON válido
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ Erro ao fazer parse do JSON:', parseError);
                console.error('📄 Resposta recebida:', responseText);
                throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}...`);
            }

            console.log('✅ Resposta do Google Apps Script:', result);
            return result;

        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            throw error;
        }
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
