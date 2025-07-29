// Google Apps Script integration module for Balcão da Cidadania
// Handles all communication with Google Sheets via Google Apps Script Web App
class FlowManager {
    constructor() {
        this.baseUrl = CONFIG.googleAppsScript.webAppUrl;
        this.endpoints = CONFIG.googleAppsScript.endpoints;
        this.spreadsheetId = CONFIG.googleAppsScript.spreadsheetId;
    }

    // Send data to Google Apps Script (without automatic loading)
    async sendToScriptSilent(endpoint, data) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    timestamp: new Date().toISOString(),
                    userInfo: (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : null,
                    spreadsheetId: this.spreadsheetId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return { success: true, data: result };

        } catch (error) {
            console.error('Google Apps Script error:', error);
            throw error;
        }
    }

    // Send data to Google Apps Script
    async sendToScript(endpoint, data) {
        try {
            console.log('🌐 Enviando para Google Apps Script...');
            console.log('📍 URL:', this.baseUrl);
            console.log('📦 Dados:', data);
            
            Helpers.showLoading('Enviando dados...');

            const requestBody = {
                ...data,
                timestamp: new Date().toISOString(),
                userInfo: (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : null,
                spreadsheetId: this.spreadsheetId
            };
            
            console.log('📤 Request body completo:', requestBody);

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 Response status:', response.status);
            console.log('📥 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Response result:', result);
            
            Helpers.hideLoading();
            
            return { success: true, data: result };

        } catch (error) {
            Helpers.hideLoading();
            console.error('❌ Google Apps Script error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            throw error;
        }
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
                userInfo: (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : null
            };

            const result = await this.sendToScript('', payload);
            return result;

        } catch (error) {
            console.error('Create ticket error:', error);
            return { success: false, error: error.message };
        }
    }

    // 📋 Buscar categorias de serviços
    async getCategorias() {
        try {
            const payload = {
                action: 'getCategorias'
            };

            const result = await this.sendToScript('', payload);
            
            if (result.success && result.data.success) {
                return {
                    success: true,
                    categorias: result.data.categorias
                };
            } else {
                throw new Error(result.data?.error || 'Erro ao buscar categorias');
            }

        } catch (error) {
            console.error('Buscar categorias error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update existing ticket
    async updateTicket(ticketId, updateData) {
        try {
            const user = (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : null;
            const payload = {
                action: 'updateTicket',
                ticketId: ticketId,
                ...updateData,
                userInfo: user || { name: 'Sistema', email: '' }
            };

            const result = await this.sendToScript('', payload);
            
            if (result.success) {
                Helpers.showToast('Chamado atualizado com sucesso!', 'success');
                return result;
            } else {
                throw new Error(result.error || 'Erro ao atualizar chamado');
            }

        } catch (error) {
            console.error('Update ticket error:', error);
            Helpers.showToast('Erro ao atualizar chamado: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Delete ticket (logical deletion)
    async deleteTicket(ticketId, reason = '') {
        try {
            const user = (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : null;
            const payload = {
                action: 'deleteTicket',
                ticketId: ticketId,
                motivo: reason,
                userInfo: user || { name: 'Sistema', email: '' }
            };

            const result = await this.sendToScript('', payload);
            
            if (result.success) {
                Helpers.showToast('Chamado excluído com sucesso!', 'success');
                return result;
            } else {
                throw new Error(result.error || 'Erro ao excluir chamado');
            }

        } catch (error) {
            console.error('Delete ticket error:', error);
            Helpers.showToast('Erro ao excluir chamado: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Create new user
    async createUser(userData) {
        try {
            console.log('🔄 Criando usuário com dados:', userData);
            
            const payload = {
                action: 'newUser',
                nomeCompleto: userData.nome,
                email: userData.email,
                senha: userData.senha || 'Arimateia1', // Senha padrão
                telefone: userData.telefone,
                cargo: userData.cargo,
                igreja: userData.igreja,
                regiao: userData.regiao,
                userInfo: (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : { name: 'Sistema', email: '' }
            };

            console.log('📤 Enviando payload para Google Apps Script:', payload);
            console.log('🌐 URL sendo usada:', this.baseUrl);
            
            // Para Google Apps Script, enviar diretamente sem endpoint adicional
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log('📥 Response status:', response.status);
            console.log('📥 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Response result:', result);
            
            if (result.success) {
                return result;
            } else {
                throw new Error(result.error || 'Erro ao criar usuário');
            }

        } catch (error) {
            console.error('Create user error:', error);
            return { success: false, error: error.message };
        }
    }

    // Validate user credentials
    async validateUser(email, password) {
        try {
            const payload = {
                action: 'validateUser',
                email: email,
                password: password
            };

            const result = await this.sendToScript('', payload);
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

            const result = await this.sendToScript('', payload);
            return result;

        } catch (error) {
            console.error('Get tickets error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get users with filters
    async getUsers(filters = {}) {
        try {
            const payload = {
                action: 'getUsers',
                filters: filters
            };

            const result = await this.sendToScript('', payload);
            return result;

        } catch (error) {
            console.error('Get users error:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate reports
    async generateReport(reportType, filters = {}) {
        try {
            const payload = {
                action: 'generateReport',
                reportType: reportType,
                filters: filters,
                generatedBy: (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser()?.name : 'Sistema',
                generatedAt: new Date().toISOString()
            };

            const result = await this.sendToScript('', payload);
            return result;

        } catch (error) {
            console.error('Generate report error:', error);
            return { success: false, error: error.message };
        }
    }

    // 👥 Buscar usuários com filtros (para coordenador)
    async buscarUsuarios(filtros = {}) {
        try {
            const payload = {
                action: 'buscarUsuarios',
                ...filtros,
                requestedBy: (typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : null
            };

            const result = await this.sendToScript('', payload);
            
            if (result.success && result.data.success) {
                return {
                    success: true,
                    usuarios: result.data.usuarios
                };
            } else {
                throw new Error(result.data?.error || 'Erro ao buscar usuários');
            }

        } catch (error) {
            console.error('Buscar usuários error:', error);
            return { success: false, error: error.message };
        }
    }

    // 🔄 Atualizar status de usuário (para coordenador)
    async atualizarStatusUsuario(dadosAlteracao) {
        try {
            const payload = {
                action: 'atualizarStatusUsuario',
                userId: dadosAlteracao.userId,
                novoStatus: dadosAlteracao.novoStatus,
                novoCargo: dadosAlteracao.novoCargo,
                observacoes: dadosAlteracao.observacoes,
                userInfo: dadosAlteracao.userInfo || ((typeof auth !== 'undefined' && auth.getCurrentUser) ? auth.getCurrentUser() : null),
                timestamp: new Date().toISOString()
            };

            const result = await this.sendToScript('', payload);
            
            if (result.success && result.data.success) {
                return {
                    success: true,
                    message: result.data.message
                };
            } else {
                throw new Error(result.data?.error || 'Erro ao atualizar usuário');
            }

        } catch (error) {
            console.error('Atualizar status usuário error:', error);
            return { success: false, error: error.message };
        }
    }
    // Buscar igrejas e regiões da planilha
    async getIgrejasRegioes() {
        try {
            const result = await this.sendToScriptSilent('', {
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

// Initialize flow manager
const flowManager = new FlowManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowManager;
}
