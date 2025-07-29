// Google Apps Script integration module for Balcão da Cidadania
// Handles all communication with Google Sheets via Google Apps Script Web App
class FlowManager {
    constructor() {
        this.baseUrl = CONFIG.googleAppsScript.webAppUrl;
        this.endpoints = CONFIG.googleAppsScript.endpoints;
        this.spreadsheetId = CONFIG.googleAppsScript.spreadsheetId;
    }

    // Send data to Google Apps Script
    async sendToScript(endpoint, data) {
        try {
            Helpers.showLoading('Enviando dados...');

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    timestamp: new Date().toISOString(),
                    userInfo: auth.getCurrentUser(),
                    spreadsheetId: this.spreadsheetId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            Helpers.hideLoading();
            
            return { success: true, data: result };

        } catch (error) {
            Helpers.hideLoading();
            console.error('Google Apps Script error:', error);
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
                userInfo: auth.getCurrentUser()
            };

            const result = await this.sendToScript(this.endpoints.newTicket, payload);
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
            const user = auth.getCurrentUser();
            const payload = {
                action: 'updateTicket',
                ticketId: ticketId,
                ...updateData,
                userInfo: user || { name: 'Sistema', email: '' }
            };

            const result = await this.sendToScript(this.endpoints.updateTicket, payload);
            
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
            const user = auth.getCurrentUser();
            const payload = {
                action: 'deleteTicket',
                ticketId: ticketId,
                motivo: reason,
                userInfo: user || { name: 'Sistema', email: '' }
            };

            const result = await this.sendToScript(this.endpoints.deleteTicket, payload);
            
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
            const payload = {
                action: 'newUser',
                nomeCompleto: userData.nome,
                email: userData.email,
                senha: userData.senha || 'Arimateia1', // Senha padrão
                telefone: userData.telefone,
                cargo: userData.cargo,
                igreja: userData.igreja,
                regiao: userData.regiao,
                userInfo: auth.getCurrentUser() || { name: 'Sistema', email: '' }
            };

            const result = await this.sendToScript(this.endpoints.newUser, payload);
            
            if (result.success) {
                Helpers.showToast('Usuário criado com sucesso!', 'success');
                return result;
            } else {
                throw new Error(result.error || 'Erro ao criar usuário');
            }

        } catch (error) {
            console.error('Create user error:', error);
            Helpers.showToast('Erro ao criar usuário: ' + error.message, 'error');
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

            const result = await this.sendToScript(this.endpoints.validateUser, payload);
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

            const result = await this.sendToScript(this.endpoints.getTickets, payload);
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

            const result = await this.sendToScript(this.endpoints.getUsers, payload);
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
                generatedBy: auth.getCurrentUser()?.name || 'Sistema',
                generatedAt: new Date().toISOString()
            };

            const result = await this.sendToScript(this.endpoints.generateReport, payload);
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
                requestedBy: auth.getCurrentUser()
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
                userInfo: dadosAlteracao.userInfo || auth.getCurrentUser(),
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
}

// Initialize flow manager
const flowManager = new FlowManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowManager;
}
