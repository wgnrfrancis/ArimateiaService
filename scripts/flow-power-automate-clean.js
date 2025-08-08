// Power Automate integration module for Balcão da Cidadania
// Version: 4.0.0 - Power Automate Complete Integration
// Dependencies: CONFIG, authManager, Helpers

'use strict';

/**
 * PowerAutomateManager - Comunicação completa com Power Automate Flows
 * Esta classe gerencia toda comunicação com os Microsoft Power Automate Flows
 */
class PowerAutomateManager {
    constructor() {
        this.config = window.CONFIG?.POWER_AUTOMATE || {};
        this.cache = new Map();
        this.retryDelay = 1000;
        this.maxRetries = 3;
        
        // Configuração de monitoramento
        this.monitoring = {
            enabled: true,
            logLevel: 'INFO',
            startTime: Date.now()
        };
        
        console.log('🚀 PowerAutomateManager inicializado');
        console.log('🌐 Endpoints configurados:', Object.keys(this.config.ENDPOINTS || {}));
    }

    /**
     * Método principal para enviar dados para Power Automate
     * @param {string} endpoint - Nome do endpoint
     * @param {Object} data - Dados a serem enviados
     * @returns {Promise<Object>} Resposta do Power Automate
     */
    async sendToFlow(endpoint, data) {
        const url = this.config.ENDPOINTS?.[endpoint];
        if (!url) {
            throw new Error(`Endpoint ${endpoint} não configurado`);
        }

        const requestData = {
            action: endpoint.toLowerCase(),
            timestamp: new Date().toISOString(),
            ...data
        };

        try {
            console.log(`🚀 Enviando para ${endpoint}:`, requestData);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'BalcaoCidadania/4.0.0'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log(`✅ Resposta de ${endpoint}:`, result);
            
            return result;
        } catch (error) {
            console.error(`❌ Erro em ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Método compatível com versão anterior (sendToScript)
     * @param {Object} data - Dados no formato antigo
     * @returns {Promise<Object>} Resposta formatada
     */
    async sendToScript(data) {
        console.log('🔄 [Compatibilidade] Convertendo chamada sendToScript para Power Automate...');
        
        try {
            // Mapear ações antigas para novos endpoints
            const actionMap = {
                'login': 'VALIDAR_LOGIN',
                'create_chamado': 'CRIAR_CHAMADO',
                'list_chamados': 'LISTAR_CHAMADOS',
                'update_chamado': 'ATUALIZAR_CHAMADO',
                'create_user': 'CRIAR_USUARIO',
                'get_config': 'OBTER_CONFIGURACOES',
                'test': 'OBTER_CONFIGURACOES'
            };

            const endpoint = actionMap[data.action];
            if (!endpoint) {
                throw new Error(`Ação não mapeada: ${data.action}`);
            }

            // Converter dados para novo formato
            const convertedData = this.convertLegacyData(data);
            const result = await this.sendToFlow(endpoint, convertedData);
            
            // Converter resposta para formato antigo se necessário
            return this.convertLegacyResponse(result);
            
        } catch (error) {
            console.error('❌ Erro na compatibilidade:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Converter dados do formato antigo para novo
     * @param {Object} legacyData - Dados no formato antigo
     * @returns {Object} Dados no novo formato
     */
    convertLegacyData(legacyData) {
        const { action, ...otherData } = legacyData;
        
        switch (action) {
            case 'login':
                return {
                    email: otherData.email,
                    senha: otherData.password || otherData.senha
                };
            case 'create_chamado':
                return {
                    chamado: otherData
                };
            case 'list_chamados':
                return {
                    filtros: otherData.filtros || {}
                };
            case 'update_chamado':
                return {
                    chamado_id: otherData.id,
                    updates: otherData.updates || otherData
                };
            case 'create_user':
                return {
                    usuario: otherData
                };
            default:
                return otherData;
        }
    }

    /**
     * Converter resposta para formato antigo se necessário
     * @param {Object} response - Resposta do Power Automate
     * @returns {Object} Resposta formatada
     */
    convertLegacyResponse(response) {
        // Manter compatibilidade com código existente
        if (response.success === undefined && response.user) {
            return { success: true, ...response };
        }
        return response;
    }

    /**
     * Validar login do usuário
     * @param {string} email - Email do usuário
     * @param {string} senha - Senha do usuário
     * @returns {Promise<Object>} Resultado do login
     */
    async validarLogin(email, senha) {
        return await this.sendToFlow('VALIDAR_LOGIN', {
            email: email.toLowerCase().trim(),
            senha: senha
        });
    }

    /**
     * Criar novo chamado
     * @param {Object} dadosChamado - Dados do chamado
     * @returns {Promise<Object>} Resultado da criação
     */
    async criarChamado(dadosChamado) {
        return await this.sendToFlow('CRIAR_CHAMADO', {
            chamado: dadosChamado
        });
    }

    /**
     * Listar chamados com filtros
     * @param {Object} filtros - Filtros para busca
     * @returns {Promise<Object>} Lista de chamados
     */
    async listarChamados(filtros = {}) {
        const cacheKey = `chamados_${JSON.stringify(filtros)}`;
        
        // Verificar cache
        if (this.cache.has(cacheKey)) {
            console.log('📋 Usando dados do cache para listar chamados');
            return this.cache.get(cacheKey);
        }

        const result = await this.sendToFlow('LISTAR_CHAMADOS', {
            filtros: filtros
        });

        // Cachear resultado por 30 segundos
        this.cache.set(cacheKey, result);
        setTimeout(() => this.cache.delete(cacheKey), 30000);

        return result;
    }

    /**
     * Atualizar chamado existente
     * @param {string} chamadoId - ID do chamado
     * @param {Object} updates - Dados para atualização
     * @returns {Promise<Object>} Resultado da atualização
     */
    async atualizarChamado(chamadoId, updates) {
        // Limpar cache relacionado
        this.clearChamadosCache();
        
        return await this.sendToFlow('ATUALIZAR_CHAMADO', {
            chamado_id: chamadoId,
            updates: updates
        });
    }

    /**
     * Criar novo usuário
     * @param {Object} dadosUsuario - Dados do usuário
     * @returns {Promise<Object>} Resultado da criação
     */
    async criarUsuario(dadosUsuario) {
        return await this.sendToFlow('CRIAR_USUARIO', {
            usuario: dadosUsuario
        });
    }

    /**
     * Obter configurações do sistema
     * @param {string} tipo - Tipo de configuração
     * @returns {Promise<Object>} Configurações
     */
    async obterConfiguracoes(tipo = 'todas') {
        const cacheKey = `config_${tipo}`;
        
        // Verificar cache (válido por 5 minutos)
        if (this.cache.has(cacheKey)) {
            console.log('⚙️ Usando configurações do cache');
            return this.cache.get(cacheKey);
        }

        const result = await this.sendToFlow('OBTER_CONFIGURACOES', {
            tipo: tipo
        });

        // Cachear configurações
        this.cache.set(cacheKey, result);
        setTimeout(() => this.cache.delete(cacheKey), 300000); // 5 minutos

        return result;
    }

    /**
     * Testar conexão com Power Automate
     * @returns {Promise<Object>} Status da conexão
     */
    async testConnection() {
        try {
            console.log('🧪 Testando conexão com Power Automate...');
            
            const startTime = Date.now();
            const result = await this.obterConfiguracoes('test');
            const duration = Date.now() - startTime;
            
            console.log(`✅ Conexão OK (${duration}ms)`);
            return { 
                success: true, 
                message: 'Conexão OK',
                duration: duration,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Falha na conexão:', error);
            return { 
                success: false, 
                message: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Limpar cache de chamados
     */
    clearChamadosCache() {
        for (const key of this.cache.keys()) {
            if (key.startsWith('chamados_')) {
                this.cache.delete(key);
            }
        }
        console.log('🗑️ Cache de chamados limpo');
    }

    /**
     * Limpar todo o cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache completo limpo');
    }

    /**
     * Obter estatísticas do sistema
     * @returns {Object} Estatísticas
     */
    getStats() {
        const uptime = Date.now() - this.monitoring.startTime;
        return {
            uptime: uptime,
            cacheSize: this.cache.size,
            endpointsConfigured: Object.keys(this.config.ENDPOINTS || {}).length,
            lastActivity: new Date().toISOString()
        };
    }

    /**
     * Log de debug
     * @param {string} message - Mensagem
     * @param {*} data - Dados adicionais
     */
    logDebug(message, data = null) {
        if (this.monitoring.logLevel === 'DEBUG') {
            console.log(`🐛 [PA Debug] ${message}`, data);
        }
    }

    /**
     * Log de informação
     * @param {string} message - Mensagem
     * @param {*} data - Dados adicionais
     */
    logInfo(message, data = null) {
        if (['INFO', 'DEBUG'].includes(this.monitoring.logLevel)) {
            console.log(`ℹ️ [PA Info] ${message}`, data);
        }
    }
}

// ===== COMPATIBILIDADE COM VERSÃO ANTERIOR =====

/**
 * FlowManager - Wrapper para compatibilidade
 * Mantém a interface antiga funcionando
 */
class FlowManager extends PowerAutomateManager {
    constructor() {
        super();
        console.log('🔄 FlowManager (modo compatibilidade) inicializado');
    }

    // Métodos de compatibilidade já implementados na classe pai
}

// ===== INICIALIZAÇÃO =====

// Substituir instância global
if (window.flowManager) {
    console.log('♻️ Substituindo flowManager por PowerAutomateManager');
}

window.flowManager = new FlowManager();
window.powerAutomateManager = window.flowManager; // Alias

// ===== EVENTOS =====

// Listener para quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM carregado - PowerAutomateManager pronto');
    
    // Testar conexão se configurado
    if (window.CONFIG?.POWER_AUTOMATE?.TEST_ON_LOAD) {
        window.flowManager.testConnection()
            .then(result => {
                if (result.success) {
                    console.log('✅ Teste de conexão automático: OK');
                } else {
                    console.warn('⚠️ Teste de conexão automático: FALHOU');
                }
            })
            .catch(error => {
                console.error('❌ Erro no teste automático:', error);
            });
    }
});

// Listener para erros globais
window.addEventListener('error', (event) => {
    if (event.message.includes('PowerAutomate') || event.message.includes('flow')) {
        console.error('❌ Erro global relacionado ao Power Automate:', event.error);
    }
});

// ===== EXPORTAÇÃO =====

// Para módulos ES6 (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PowerAutomateManager, FlowManager };
}

console.log('🎯 Power Automate integration carregado completamente');
console.log('📊 Estatísticas:', window.flowManager.getStats());
