/**
 * Google Apps Script Flow Manager
 * Gerencia todas as comunicações com o Google Apps Script
 * Version: 1.0.0
 */

'use strict';

class GoogleAppsScriptManager {
    constructor() {
        this.webAppUrl = null;
        this.spreadsheetId = null;
        this.actions = {};
        this.isReady = false;
        
        this.init();
    }

    /**
     * Inicializa o manager com configurações
     */
    init() {
        try {
            if (typeof window.CONFIG !== 'undefined' && window.CONFIG.GOOGLE_APPS_SCRIPT) {
                this.webAppUrl = window.CONFIG.GOOGLE_APPS_SCRIPT.WEB_APP_URL;
                this.spreadsheetId = window.CONFIG.GOOGLE_APPS_SCRIPT.SPREADSHEET_ID;
                this.actions = window.CONFIG.GOOGLE_APPS_SCRIPT.ACTIONS || {};
                
                if (this.webAppUrl && this.spreadsheetId) {
                    this.isReady = true;
                    console.log('✅ GoogleAppsScriptManager inicializado');
                } else {
                    console.error('❌ Configuração incompleta do Google Apps Script');
                }
            } else {
                console.error('❌ Configuração do Google Apps Script não encontrada');
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar GoogleAppsScriptManager:', error);
        }
    }

    /**
     * Envia dados para o Google Apps Script
     */
    async sendToScript(action, data = {}) {
        if (!this.isReady) {
            throw new Error('Google Apps Script não está configurado');
        }

        try {
            const payload = {
                action: action,
                ...data
            };

            console.log('🚀 Enviando para Google Apps Script:', action, payload);

            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Resposta do Google Apps Script:', result);

            return result;

        } catch (error) {
            console.error('❌ Erro na comunicação com Google Apps Script:', error);
            throw new Error(`Erro ao comunicar com Google Apps Script: ${error.message}`);
        }
    }

    /**
     * Valida credenciais do usuário
     */
    async validateUser(email, password) {
        try {
            const response = await this.sendToScript(this.actions.VALIDAR_USUARIO, {
                email: email,
                senha: password
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: response.message
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Email ou senha incorretos'
                };
            }
        } catch (error) {
            console.error('❌ Erro na validação do usuário:', error);
            return {
                success: false,
                message: 'Erro ao validar credenciais'
            };
        }
    }

    /**
     * Cria novo usuário
     */
    async createUser(userData) {
        try {
            const response = await this.sendToScript(this.actions.CRIAR_USUARIO, userData);

            return {
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error);
            return {
                success: false,
                message: 'Erro ao criar usuário'
            };
        }
    }

    /**
     * Busca igrejas e regiões
     */
    async getChurchesAndRegions() {
        try {
            const response = await this.sendToScript(this.actions.GET_IGREJAS_REGIOES);

            if (response.success) {
                return {
                    success: true,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Erro ao carregar igrejas e regiões'
                };
            }
        } catch (error) {
            console.error('❌ Erro ao buscar igrejas e regiões:', error);
            return {
                success: false,
                message: 'Erro ao carregar dados'
            };
        }
    }

    /**
     * Cria novo chamado
     */
    async createTicket(ticketData) {
        try {
            const response = await this.sendToScript(this.actions.CRIAR_CHAMADO, ticketData);

            return {
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Erro ao criar chamado:', error);
            return {
                success: false,
                message: 'Erro ao criar chamado'
            };
        }
    }

    /**
     * Busca chamados com filtros
     */
    async getTickets(filters = {}) {
        try {
            const response = await this.sendToScript(this.actions.GET_CHAMADOS, { filtros: filters });

            if (response.success) {
                return {
                    success: true,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Erro ao carregar chamados'
                };
            }
        } catch (error) {
            console.error('❌ Erro ao buscar chamados:', error);
            return {
                success: false,
                message: 'Erro ao carregar chamados'
            };
        }
    }

    /**
     * Busca usuários
     */
    async getUsers() {
        try {
            const response = await this.sendToScript(this.actions.GET_USUARIOS);

            if (response.success) {
                return {
                    success: true,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Erro ao carregar usuários'
                };
            }
        } catch (error) {
            console.error('❌ Erro ao buscar usuários:', error);
            return {
                success: false,
                message: 'Erro ao carregar usuários'
            };
        }
    }

    /**
     * Testa conexão com Google Apps Script
     */
    async testConnection() {
        try {
            const response = await fetch(this.webAppUrl, {
                method: 'GET'
            });

            if (response.ok) {
                console.log('✅ Conexão com Google Apps Script funcionando');
                return true;
            } else {
                console.error('❌ Erro na conexão com Google Apps Script');
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao testar conexão:', error);
            return false;
        }
    }
}

// Inicializar o manager globalmente
let flowManager;

// Aguarda o DOM estar pronto e as configurações carregadas
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que CONFIG está disponível
    setTimeout(() => {
        flowManager = new GoogleAppsScriptManager();
        
        // Testa a conexão
        if (flowManager.isReady) {
            flowManager.testConnection();
        }
    }, 100);
});

// Exporta para uso global
window.GoogleAppsScriptManager = GoogleAppsScriptManager;
