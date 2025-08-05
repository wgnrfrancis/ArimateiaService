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
        this.scriptUrl = window.CONFIG?.API?.BASE_URL || null;
        this.retryAttempts = window.CONFIG?.API?.RETRY_ATTEMPTS || 3;
        this.retryDelay = 1000;
        this.regioesIgrejas = null; // Cache das regiões/igrejas
        
        if (!this.scriptUrl) {
            console.log('⚠️ URL do Google Apps Script não configurada - usando modo fallback');
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
                version: window.CONFIG?.SYSTEM?.version || '2.0.0'
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

    /**
     * Enviar dados sem mostrar loading (para ações silenciosas)
     * @param {Object} data - Dados a serem enviados
     * @returns {Promise<Object>} Resposta do servidor
     */
    async sendToScriptSilent(data) {
        return this.sendToScript(data);
    }

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
     * Verificar se usuário existe
     * @param {string} email - Email para verificar
     * @returns {Promise<Object>} Resultado da verificação
     */
    async checkUserExists(email) {
        try {
            const result = await this.sendToScript({
                action: 'checkUserExists',
                email: email
            });
            return result;
        } catch (error) {
            console.error('Check user exists error:', error);
            return { success: false, exists: false, error: error.message };
        }
    }

    /**
     * Buscar regiões e igrejas da planilha
     * @returns {Promise<Object>} Dados das regiões e igrejas
     */
    async getRegioesIgrejas() {
        try {
            if (this.regioesIgrejas) {
                return { success: true, data: this.regioesIgrejas };
            }

            const result = await this.sendToScript({
                action: 'getIgrejasRegioes'
            });

            if (result.success && result.data) {
                this.regioesIgrejas = result.data;
                return result;
            } else {
                throw new Error(result.error || 'Erro ao buscar regiões e igrejas');
            }

        } catch (error) {
            console.error('❌ Erro ao buscar regiões/igrejas:', error);
            // Fallback para CONFIG
            return {
                success: true,
                data: {
                    regioes: window.CONFIG?.REGIONS || [],
                    igrejasPorRegiao: {
                        'Norte': window.CONFIG?.CHURCHES?.slice(0, 3) || [],
                        'Sul': window.CONFIG?.CHURCHES?.slice(3, 6) || [],
                        'Centro': window.CONFIG?.CHURCHES?.slice(6, 9) || [],
                        'Leste': window.CONFIG?.CHURCHES?.slice(9, 12) || [],
                        'Oeste': window.CONFIG?.CHURCHES?.slice(12) || []
                    }
                },
                fallback: true
            };
        }
    }

    /**
     * Buscar igrejas por região específica
     * @param {string} regiao - Nome da região
     * @returns {Promise<Object>} Lista de igrejas
     */
    async getIgrejasByRegiao(regiao) {
        try {
            const regioesData = await this.getRegioesIgrejas();
            
            if (regioesData.success && regioesData.data?.igrejasPorRegiao?.[regiao]) {
                const igrejas = regioesData.data.igrejasPorRegiao[regiao];
                return {
                    success: true,
                    data: igrejas
                };
            } else {
                return {
                    success: false,
                    error: 'Região não encontrada',
                    data: []
                };
            }

        } catch (error) {
            console.error('❌ Erro ao buscar igrejas por região:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    /**
     * Criar novo usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise<Object>} Resultado da criação
     */
    async createUser(userData) {
        try {
            console.log('👤 Criando usuário:', userData);

            // Validações
            if (!userData.nome || userData.nome.trim().length < 2) {
                throw new Error('Nome deve ter pelo menos 2 caracteres');
            }
            if (!userData.email || !this.validateEmail(userData.email)) {
                throw new Error('Email inválido');
            }
            if (!userData.telefone || userData.telefone.length < 10) {
                throw new Error('Telefone deve ter pelo menos 10 dígitos');
            }

            // Verificar se email já existe
            const existingUser = await this.checkUserExists(userData.email);
            if (existingUser.exists) {
                throw new Error('Já existe um usuário cadastrado com este email');
            }

            const currentUser = authManager?.getCurrentUser();
            
            const result = await this.sendToScript({
                action: 'newUser',
                nomeCompleto: userData.nome.trim(),
                email: userData.email.trim(),
                telefone: userData.telefone.trim(),
                cargo: userData.cargo,
                igreja: userData.igreja,
                regiao: userData.regiao,
                observacoes: userData.observacoes || '',
                senha: userData.senha || 'minhaflor',
                userInfo: {
                    name: currentUser ? currentUser.nome : 'Sistema',
                    email: currentUser ? currentUser.email : 'sistema@balcao.org'
                }
            });

            return result;

        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Validar email
     * @param {string} email - Email para validação
     * @returns {boolean} True se válido
     */
    validateEmail(email) {
        return Helpers?.validateEmail(email) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Criar novo chamado
     * @param {Object} ticketData - Dados do chamado
     * @returns {Promise<Object>} Resultado da criação
     */
    async createTicket(ticketData) {
        try {
            const user = authManager?.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            // Validações
            if (!ticketData.nome || ticketData.nome.trim().length < 2) {
                throw new Error('Nome do cidadão deve ter pelo menos 2 caracteres');
            }
            if (!ticketData.contato || ticketData.contato.trim().length < 8) {
                throw new Error('Contato inválido');
            }
            if (!ticketData.descricao || ticketData.descricao.trim().length < 10) {
                throw new Error('Descrição deve ter pelo menos 10 caracteres');
            }

            const result = await this.sendToScript({
                action: 'newTicket',
                nomeCidadao: ticketData.nome.trim(),
                cpf: ticketData.cpf || '',
                contato: ticketData.contato.trim(),
                email: ticketData.email || '',
                igreja: user.igreja,
                regiao: user.regiao,
                descricao: ticketData.descricao.trim(),
                prioridade: ticketData.prioridade || 'MEDIA',
                categoria: ticketData.categoria || 'OUTROS',
                demanda: ticketData.demanda || '',
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

    /**
     * Buscar chamados
     * @param {Object} filters - Filtros para busca
     * @returns {Promise<Object>} Lista de chamados
     */
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

    /**
     * Atualizar chamado
     * @param {string|number} ticketId - ID do chamado
     * @param {Object} updateData - Dados para atualização
     * @returns {Promise<Object>} Resultado da atualização
     */
    async updateTicket(ticketId, updateData) {
        try {
            const user = authManager?.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

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

    /**
     * Buscar usuários
     * @param {Object} filters - Filtros para busca
     * @returns {Promise<Object>} Lista de usuários
     */
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

    /**
     * Obter estatísticas do usuário
     * @param {string} userId - ID do usuário
     * @param {string} regiao - Região do usuário
     * @returns {Promise<Object>} Estatísticas
     */
    async getUserStats(userId, regiao) {
        try {
            const result = await this.sendToScript({
                action: 'getUserStats',
                userId: userId,
                regiao: regiao
            });
            return result;
        } catch (error) {
            console.error('Get user stats error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Testar conexão com Google Apps Script
     * @returns {Promise<Object>} Resultado do teste
     */
    async testConnection() {
        try {
            const result = await this.sendToScript({
                action: 'testConnection'
            });
            return result;
        } catch (error) {
            console.error('Test connection error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obter dados do dashboard
     * @param {Object} filters - Filtros para busca
     * @returns {Promise<Object>} Dados do dashboard
     */
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

