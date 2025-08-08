// Power Automate integration module for Balcão da Cidadania
// Version: 3.0.0 - Power Automate Edition
// Dependencies: CONFIG, authManager, Helpers

'use strict';

/**
 * FlowManager Power Automate - Comunicação exclusiva com Power Automate Flows
 * Esta classe gerencia toda comunicação com os Power Automate Flows
 */
class FlowExtensions {
    constructor() {
        this.config = window.CONFIG || {};
        this.baseUrl = this.config.API?.BASE_URL || null;
        this.retryAttempts = this.config.API?.RETRY_ATTEMPTS || 3;
        this.retryDelay = this.config.API?.RETRY_DELAY || 2000;
        this.cache = new Map(); // Cache local para otimização
        
        // Configuração de monitoramento
        this.monitoring = {
            enabled: this.config.POWER_AUTOMATE?.MONITORING?.enabled || false,
            logLevel: this.config.POWER_AUTOMATE?.MONITORING?.logLevel || 'INFO',
            startTime: Date.now()
        };
        
        if (!this.baseUrl) {
            console.warn('⚠️ URL do Power Automate não configurada');
        } else {
            console.log('🚀 FlowManager Power Automate inicializado');
            console.log('🌐 Base URL:', this.baseUrl);
        }
    }

    /**
     * Método principal para comunicação com Power Automate
     * @param {Object} data - Dados a serem enviados
     * @returns {Promise<Object>} Resposta do Power Automate
     */
    async sendToScript(data) {
        console.log('🔄 [PA] Enviando para Power Automate...');
        this.logDebug('Dados enviados:', data);

        if (!this.baseUrl) {
            return { success: false, error: 'URL do Power Automate não configurada' };
        }

        try {
            const startTime = Date.now();
            
            // Preparar payload com metadados
            const payload = {
                ...data,
                metadata: {
                    timestamp: new Date().toISOString(),
                    clientOrigin: window.location.origin,
                    version: this.config.SYSTEM?.version || '3.0.0',
                    userAgent: navigator.userAgent,
                    sessionId: this.generateSessionId()
                }
            };

            // Fazer requisição com retry
            const response = await this.makeRequestWithRetry(payload, data.action);
            const result = await this.processResponse(response);
            
            // Log de performance
            const duration = Date.now() - startTime;
            this.logPerformance(data.action, duration, result.success);
            
            return result;

        } catch (error) {
            console.error('❌ [PA] Erro na requisição:', error);
            this.logError(data.action, error);
            
            return { 
                success: false, 
                error: `Erro de conexão Power Automate: ${error.message}`,
                errorCode: 'PA_CONNECTION_ERROR'
            };
        }
    }

    /**
     * Fazer requisição com retry automático
     * @param {Object} payload - Dados a serem enviados
     * @param {string} action - Ação sendo executada
     * @returns {Promise<Response>} Resposta da requisição
     */
    async makeRequestWithRetry(payload, action) {
        let lastError;
        const actionConfig = this.config.getActionConfig?.(action);
        const timeout = actionConfig?.timeout || this.config.API?.TIMEOUT || 45000;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`🔄 [PA] Tentativa ${attempt}/${this.retryAttempts} para ação: ${action}`);
                
                // Determinar URL (gateway ou flow específico)
                const flowUrl = this.config.getFlowUrl?.(action) || this.baseUrl;
                
                // Preparar headers
                const headers = {
                    ...this.config.API?.HEADERS,
                    'X-Arimateia-Action': action,
                    'X-Arimateia-Attempt': attempt.toString(),
                    'X-Arimateia-Timestamp': Date.now().toString()
                };

                // Controller para timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(flowUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: headers,
                    body: JSON.stringify(payload),
                    redirect: 'follow',
                    cache: 'no-cache',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // Verificar se resposta é válida
                if (response.ok || (response.status >= 200 && response.status < 300)) {
                    this.logDebug(`✅ [PA] Sucesso na tentativa ${attempt}`);
                    return response;
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            } catch (error) {
                lastError = error;
                this.logDebug(`⚠️ [PA] Tentativa ${attempt} falhou:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    const delay = this.calculateRetryDelay(attempt);
                    this.logDebug(`⏳ [PA] Aguardando ${delay}ms antes da próxima tentativa...`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Processar resposta do Power Automate
     * @param {Response} response - Resposta da requisição
     * @returns {Promise<Object>} Dados processados
     */
    async processResponse(response) {
        if (!response) {
            throw new Error('Resposta inválida ou nula');
        }

        try {
            const responseText = await response.text();
            this.logDebug('📄 [PA] Resposta recebida:', responseText.substring(0, 200) + '...');

            if (!responseText || responseText.trim() === '') {
                console.warn('⚠️ [PA] Resposta vazia do Power Automate');
                return {
                    success: false,
                    error: 'Resposta vazia do Power Automate'
                };
            }

            const result = JSON.parse(responseText);
            this.logDebug('✅ [PA] Resposta processada:', result);
            
            // Garantir estrutura mínima
            if (typeof result !== 'object') {
                throw new Error('Resposta não é um objeto JSON válido');
            }

            return result;

        } catch (parseError) {
            console.error('❌ [PA] Erro ao processar resposta:', parseError);
            
            return {
                success: false,
                error: 'Erro ao processar resposta do Power Automate: ' + parseError.message,
                errorCode: 'PA_PARSE_ERROR',
                responseStatus: response.status,
                responseStatusText: response.statusText
            };
        }
    }

    /**
     * Calcular delay para retry com backoff exponencial
     * @param {number} attempt - Número da tentativa
     * @returns {number} Delay em milliseconds
     */
    calculateRetryDelay(attempt) {
        const config = this.config.POWER_AUTOMATE?.RETRY_CONFIG;
        const baseDelay = config?.delay || this.retryDelay;
        const maxDelay = config?.maxDelay || 10000;
        
        if (config?.backoff === 'exponential') {
            return Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
        }
        
        return baseDelay;
    }

    /**
     * Função sleep para delays
     * @param {number} ms - Milliseconds para aguardar
     * @returns {Promise} Promise que resolve após o delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Gerar ID de sessão único
     * @returns {string} ID da sessão
     */
    generateSessionId() {
        return `pa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // ===== MÉTODOS DE CACHE =====

    /**
     * Verificar cache antes de fazer requisição
     * @param {string} key - Chave do cache
     * @returns {Object|null} Dados do cache ou null
     */
    getFromCache(key) {
        if (!this.config.POWER_AUTOMATE?.CACHE?.enabled) return null;
        
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const duration = this.config.POWER_AUTOMATE?.CACHE?.duration || 300000; // 5 min
        if (Date.now() - cached.timestamp > duration) {
            this.cache.delete(key);
            return null;
        }
        
        this.logDebug(`📋 [PA] Cache hit para: ${key}`);
        return cached.data;
    }

    /**
     * Salvar dados no cache
     * @param {string} key - Chave do cache
     * @param {Object} data - Dados para cache
     */
    setCache(key, data) {
        if (!this.config.POWER_AUTOMATE?.CACHE?.enabled) return;
        
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
        
        this.logDebug(`💾 [PA] Cache salvo para: ${key}`);
    }

    // ===== MÉTODOS DE AUTENTICAÇÃO =====

    /**
     * Validar usuário (login)
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} Resultado da validação
     */
    async validateUser(email, password) {
        console.log('🔐 [PA] Validando usuário:', email);
        
        try {
            const result = await this.sendToScript({
                action: 'validateUser',
                email: email,
                senha: password
            });

            if (result.success && result.user) {
                console.log('✅ [PA] Usuário validado:', result.user);
                return {
                    success: true,
                    user: {
                        id: result.user.id,
                        name: result.user.name,
                        email: result.user.email,
                        telefone: result.user.telefone,
                        cargo: result.user.role,
                        igreja: result.user.igreja,
                        regiao: result.user.regiao,
                        status: result.user.status,
                        ultimoAcesso: result.user.ultimoAcesso
                    },
                    message: result.message
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Erro na validação'
                };
            }

        } catch (error) {
            console.error('❌ [PA] Erro na validação:', error);
            return {
                success: false,
                error: error.message || 'Erro na validação do usuário'
            };
        }
    }

    // ===== MÉTODOS DE USUÁRIOS =====

    /**
     * Criar novo usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise<Object>} Resultado da criação
     */
    async createUser(userData) {
        try {
            console.log('👤 [PA] Criando usuário:', userData);

            // Validações locais
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
                data: JSON.stringify({
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
                })
            });

            return result;

        } catch (error) {
            console.error('❌ [PA] Erro ao criar usuário:', error);
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
                data: JSON.stringify({ email: email })
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro ao verificar usuário:', error);
            return { success: false, exists: false, error: error.message };
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
                data: JSON.stringify(filters)
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro ao buscar usuários:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== MÉTODOS DE CHAMADOS =====

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

            // Validações locais
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
                data: JSON.stringify({
                    nomeCidadao: ticketData.nome.trim(),
                    cpf: ticketData.cpf || '',
                    contato: ticketData.contato.trim(),
                    email: ticketData.email || '',
                    igreja: user.igreja,
                    regiao: user.regiao,
                    descricao: ticketData.descricao.trim(),
                    prioridade: ticketData.prioridade || 'MEDIA',
                    categoria: ticketData.categoria || 'OUTROS',
                    userInfo: {
                        name: user.nome,
                        email: user.email
                    }
                })
            });

            return result;

        } catch (error) {
            console.error('❌ [PA] Erro ao criar chamado:', error);
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
                data: JSON.stringify(filters)
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro ao buscar chamados:', error);
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
                data: JSON.stringify({
                    ticketId: ticketId,
                    updateData: updateData,
                    userInfo: {
                        name: user.nome,
                        email: user.email
                    }
                })
            });

            return result;

        } catch (error) {
            console.error('❌ [PA] Erro ao atualizar chamado:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== MÉTODOS DE CONFIGURAÇÃO =====

    /**
     * Buscar regiões e igrejas
     * @returns {Promise<Object>} Dados das regiões e igrejas
     */
    async getRegioesIgrejas() {
        try {
            // Verificar cache primeiro
            const cacheKey = this.config.POWER_AUTOMATE?.CACHE?.keys?.regions || 'pa_regions';
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return { success: true, data: cached };
            }

            const result = await this.sendToScript({
                action: 'getIgrejasRegioes'
            });

            if (result.success && result.data) {
                this.setCache(cacheKey, result.data);
                return result;
            } else {
                throw new Error(result.error || 'Erro ao buscar regiões e igrejas');
            }

        } catch (error) {
            console.error('❌ [PA] Erro ao buscar regiões/igrejas:', error);
            // Fallback para CONFIG
            return {
                success: true,
                data: {
                    regioes: this.config.REGIONS || [],
                    igrejasPorRegiao: {
                        'Norte': this.config.CHURCHES?.slice(0, 3) || [],
                        'Sul': this.config.CHURCHES?.slice(3, 6) || [],
                        'Centro': this.config.CHURCHES?.slice(6, 9) || [],
                        'Leste': this.config.CHURCHES?.slice(9, 12) || [],
                        'Oeste': this.config.CHURCHES?.slice(12, 15) || []
                    }
                },
                fallback: true
            };
        }
    }

    /**
     * Buscar categorias
     * @returns {Promise<Object>} Lista de categorias
     */
    async getCategories() {
        try {
            // Verificar cache primeiro
            const cacheKey = this.config.POWER_AUTOMATE?.CACHE?.keys?.categories || 'pa_categories';
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return { success: true, data: cached };
            }

            const result = await this.sendToScript({
                action: 'getCategories'
            });

            if (result.success && result.data) {
                this.setCache(cacheKey, result.data);
                return result;
            }

            // Fallback para CONFIG
            return {
                success: true,
                data: this.config.CATEGORIES || [],
                fallback: true
            };
        } catch (error) {
            console.error('❌ [PA] Erro ao buscar categorias:', error);
            return {
                success: true,
                data: this.config.CATEGORIES || [],
                fallback: true
            };
        }
    }

    /**
     * Buscar profissionais
     * @returns {Promise<Object>} Lista de profissionais
     */
    async getProfessionals() {
        try {
            const result = await this.sendToScript({
                action: 'getProfessionals'
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro ao buscar profissionais:', error);
            return { 
                success: true, 
                data: [],
                fallback: true 
            };
        }
    }

    /**
     * Buscar voluntários
     * @returns {Promise<Object>} Lista de voluntários
     */
    async getVolunteers() {
        try {
            const result = await this.sendToScript({
                action: 'getVolunteers'
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro ao buscar voluntários:', error);
            return { 
                success: true, 
                data: [],
                fallback: true 
            };
        }
    }

    // ===== MÉTODOS DE RELATÓRIOS =====

    /**
     * Obter dados do dashboard
     * @param {Object} filters - Filtros para busca
     * @returns {Promise<Object>} Dados do dashboard
     */
    async getDashboardData(filters = {}) {
        try {
            const result = await this.sendToScript({
                action: 'getDashboardData',
                data: JSON.stringify({
                    filters: filters,
                    period: filters.period || '30days'
                })
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro ao buscar dados do dashboard:', error);
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
                data: JSON.stringify({ userId: userId, regiao: regiao })
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro ao buscar estatísticas:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Testar conexão com Power Automate
     * @returns {Promise<Object>} Resultado do teste
     */
    async testConnection() {
        try {
            const result = await this.sendToScript({
                action: 'testConnection'
            });
            return result;
        } catch (error) {
            console.error('❌ [PA] Erro no teste de conexão:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== MÉTODOS UTILITÁRIOS =====

    /**
     * Validar email
     * @param {string} email - Email para validação
     * @returns {boolean} True se válido
     */
    validateEmail(email) {
        return Helpers?.validateEmail(email) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== MÉTODOS DE LOGGING =====

    logDebug(message, data = null) {
        if (!this.monitoring.enabled) return;
        if (this.monitoring.logLevel === 'DEBUG') {
            console.log(`🔍 [PA-DEBUG] ${message}`, data || '');
        }
    }

    logError(action, error) {
        if (!this.monitoring.enabled) return;
        console.error(`❌ [PA-ERROR] Ação: ${action}, Erro:`, error);
    }

    logPerformance(action, duration, success) {
        if (!this.monitoring.enabled || !this.config.POWER_AUTOMATE?.MONITORING?.trackPerformance) return;
        
        const status = success ? '✅' : '❌';
        console.log(`⏱️ [PA-PERF] ${status} ${action}: ${duration}ms`);
        
        // Alerta para operações muito lentas
        if (duration > 10000) {
            console.warn(`🐌 [PA-PERF] Operação lenta detectada: ${action} (${duration}ms)`);
        }
    }
}

// Inicializar globalmente
window.flowManager = new FlowExtensions();

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowExtensions;
}

console.log('✅ FlowManager Power Automate carregado com sucesso');
console.log('🔄 Versão Power Automate:', window.CONFIG?.SYSTEM?.version || '3.0.0');
