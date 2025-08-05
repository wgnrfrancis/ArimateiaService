// Google Apps Script integration module for Balcão da Cidadania
// Version: 1.0.0
// Dependencies: CONFIG, authManager, Helpers

'use strict';

/**
 * Extensão da classe FlowManager com métodos específicos da aplicação
 * Esta classe adiciona funcionalidades específicas ao FlowManager base
 */
class FlowExtensions {
    constructor() {
        this.scriptUrl = CONFIG?.googleAppsScript?.webAppUrl;
        this.retryAttempts = CONFIG?.api?.retries || 3;
        this.retryDelay = CONFIG?.api?.retryDelay || 1000;
        this.regioesIgrejas = null; // Cache das regiões/igrejas
        
        if (!this.scriptUrl) {
            console.error('❌ URL do Google Apps Script não configurada');
        }
    }

    /**
     * Enviar dados para Google Apps Script com retry e error handling
     * @param {Object} data - Dados a serem enviados
     * @returns {Promise<Object>} Resposta do servidor
     */
    async sendToScript(data) {
        console.log('🌐 Enviando para Google Apps Script...');
        console.log('📍 URL:', this.scriptUrl);
        console.log('📦 Dados:', data);

        if (!this.scriptUrl) {
            return { success: false, error: 'URL do Google Apps Script não configurada' };
        }

        try {
            const payload = {
                ...data,
                timestamp: new Date().toISOString(),
                clientOrigin: window.location.origin,
                version: CONFIG?.app?.version || '1.0.0'
            };

            const response = await this.makeRequestWithRetry(payload);
            return this.processResponse(response);

        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            return { 
                success: false, 
                error: `Erro de conexão: ${error.message}` 
            };
        }
    }

    /**
     * Fazer requisição com retry automático
     * @param {Object} payload - Dados a serem enviados
     * @returns {Promise<Response>} Resposta da requisição
     */
    async makeRequestWithRetry(payload) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`🔄 Tentativa ${attempt}/${this.retryAttempts}`);
                
                const response = await fetch(this.scriptUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(payload),
                    redirect: 'follow'
                });

                if (response.ok || response.type === 'opaque') {
                    return response;
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Tentativa ${attempt} falhou:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    console.log(`⏳ Aguardando ${this.retryDelay}ms antes da próxima tentativa...`);
                    await this.sleep(this.retryDelay);
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Processar resposta do servidor
     * @param {Response} response - Resposta da requisição
     * @returns {Promise<Object>} Dados processados
     */
    async processResponse(response) {
        if (response.type === 'opaque') {
            console.log('📄 Resposta no-cors (assumindo sucesso)');
            return { success: true, message: 'Requisição enviada com sucesso' };
        }

        try {
            const responseText = await response.text();
            console.log('📄 Resposta recebida:', responseText);

            const result = JSON.parse(responseText);
            console.log('✅ Resposta processada:', result);
            return result;

        } catch (parseError) {
            console.error('❌ Erro ao processar resposta:', parseError);
            return {
                success: false,
                error: 'Resposta inválida do servidor'
            };
        }
    }

    /**
     * Sleep/delay function
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} Promise que resolve após o delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ...existing methods...

    /**
     * Validar credenciais do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} Resultado da validação
     */
    async validateUser(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            if (!Helpers.validateEmail(email)) {
                throw new Error('Email inválido');
            }

            const result = await this.sendToScript({
                action: 'loginUser',
                email: email.toLowerCase().trim(),
                password: password
            });

            return result;
        } catch (error) {
            console.error('Validate user error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obter dados do dashboard
     * @param {Object} filters - Filtros para busca
     * @returns {Promise<Object>} Dados do dashboard
     */
    async getDashboardData(filters = {}) {
        try {
            const result = await this.sendToScript({
                action: 'getDashboardData',
                filters: filters,
                period: filters.period || '30days'
            });
            return result;
        } catch (error) {
            console.error('Get dashboard data error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializar globalmente
window.flowManager = new FlowExtensions();

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowExtensions;
}

console.log('✅ Flow.js carregado com sucesso');