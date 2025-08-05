/**
 * Gerenciador de fluxo e comunicação com Google Apps Script
 * Handles all communication with Google Sheets via Google Apps Script Web App
 */
class FlowManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.retryAttempts = CONFIG.api.retries;
        this.retryDelay = CONFIG.api.retryDelay;
        this.requestQueue = [];
        this.isProcessingQueue = false;
        
        // Event listeners
        this.setupEventListeners();
        
        console.log('FlowManager inicializado');
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Monitor connection status
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Conexão restaurada');
            this.processQueue();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Conexão perdida');
        });
    }

    /**
     * Enviar dados para Google Apps Script
     * @param {Object} data - Dados a serem enviados
     * @param {boolean} useFormData - Usar FormData ao invés de URLSearchParams
     * @returns {Promise<Object>} Resposta do servidor
     */
    async sendToScript(data, useFormData = false) {
        console.log('🌐 Enviando para Google Apps Script...');
        console.log('📍 URL:', window.CONFIG?.API?.BASE_URL);
        console.log('📦 Dados:', data);

        // Verificar se está online
        if (!this.isOnline) {
            console.warn('⚠️ Sem conexão - adicionando à fila');
            return this.addToQueue(data);
        }

        try {
            // Preparar payload
            const payload = this.preparePayload(data);
            console.log('📤 Payload completo:', payload);

            // Tentar envio com retry
            const response = await this.sendWithRetry(payload, useFormData);
            
            // Processar resposta
            return this.processResponse(response);

        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            
            // Se for erro de rede, adicionar à fila
            if (this.isNetworkError(error)) {
                return this.addToQueue(data);
            }
            
            throw this.createError(error);
        }
    }

    /**
     * Enviar dados sem mostrar toast de loading (para ações silenciosas)
     * @param {Object} data - Dados a serem enviados
     * @returns {Promise<Object>} Resposta do servidor
     */
    async sendToScriptSilent(data) {
        return this.sendToScript(data);
    }

    /**
     * Preparar payload com metadados
     * @param {Object} data - Dados originais
     * @returns {Object} Payload completo
     */
    preparePayload(data) {
        return {
            ...data,
            timestamp: new Date().toISOString(),
            userInfo: this.getUserInfo(),
            clientOrigin: window.location.origin,
            version: CONFIG.app.version
        };
    }

    /**
     * Enviar requisição com retry automático
     * @param {Object} payload - Dados a serem enviados
     * @param {boolean} useFormData - Usar FormData
     * @returns {Promise<Response>} Resposta da requisição
     */
    async sendWithRetry(payload, useFormData = false) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`🔄 Tentativa ${attempt}/${this.retryAttempts}`);
                
                const response = await this.makeRequest(payload, useFormData);
                
                if (response.ok || response.type === 'opaque') {
                    return response;
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Tentativa ${attempt} falhou:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    const delay = this.calculateDelay(attempt);
                    console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Adicionar dados à fila para envio posterior
     * @param {Object} data - Dados a serem adicionados à fila
     */
    addToQueue(data) {
        this.requestQueue.push(data);
        console.log('📥 Dados adicionados à fila:', data);
        
        // Processar fila se não estiver já processando
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    /**
     * Processar a fila de requisições
     */
    async processQueue() {
        this.isProcessingQueue = true;
        
        while (this.requestQueue.length > 0) {
            const data = this.requestQueue.shift();
            console.log('📤 Processando da fila:', data);
            
            try {
                await this.sendToScript(data);
            } catch (error) {
                console.error('❌ Erro ao processar da fila:', error);
            }
        }
        
        this.isProcessingQueue = false;
    }

    /**
     * Verificar se o erro é um erro de rede
     * @param {Error} error - O erro a ser verificado
     * @returns {boolean} Verdadeiro se for um erro de rede, falso caso contrário
     */
    isNetworkError(error) {
        return !error.response;
    }

    /**
     * Criar um objeto de erro padronizado
     * @param {Error} error - O erro original
     * @returns {Object} Objeto de erro padronizado
     */
    createError(error) {
        return {
            message: error.message,
            stack: error.stack,
            name: error.name
        };
    }

    /**
     * Aguardar um determinado período
     * @param {number} ms - Tempo em milissegundos
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Calcular atraso exponencial para retry
     * @param {number} attempt - Tentativa atual
     * @returns {number} Atraso em milissegundos
     */
    calculateDelay(attempt) {
        return Math.min(1000 * Math.pow(2, attempt), 30000);
    }

    /**
     * Obter informações do usuário (mocked)
     * @returns {Object} Informações do usuário
     */
    getUserInfo() {
        // TODO: Implementar obtenção real das informações do usuário
        return {
            id: 'user-123',
            name: 'Usuário Exemplo',
            email: 'usuario@exemplo.com'
        };
    }

    /**
     * Fazer requisição para o Google Apps Script
     * @param {Object} payload - Dados a serem enviados
     * @param {boolean} useFormData - Usar FormData
     * @returns {Promise<Response>} Resposta da requisição
     */
    async makeRequest(payload, useFormData) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': useFormData ? 'application/x-www-form-urlencoded' : 'application/json',
            },
            body: useFormData ? this.toFormData(payload) : JSON.stringify(payload),
        };

        return fetch(window.CONFIG?.API?.BASE_URL, options);
    }

    /**
     * Converter objeto para FormData
     * @param {Object} obj - Objeto a ser convertido
     * @returns {FormData} FormData resultante
     */
    toFormData(obj) {
        const formData = new FormData();
        
        Object.keys(obj).forEach(key => {
            formData.append(key, obj[key]);
        });
        
        return formData;
    }

    /**
     * Processar resposta do servidor
     * @param {Response} response - Resposta da requisição
     * @returns {Object} Dados processados da resposta
     */
    processResponse(response) {
        // TODO: Implementar processamento real da resposta
        console.log('📬 Resposta recebida:', response);
        return response.json();
    }
}