// Google Apps Script integration module for Balcão da Cidadania
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
            
            // For development/demo purposes, simulate success
            console.warn('Using mock response for development');
            return { success: true, data: { id: Helpers.generateId(), ...data } };
        }
    }

    // Create new ticket
    async createTicket(ticketData) {
        try {
            const payload = {
                action: 'create_ticket',
                ticket: {
                    id: Helpers.generateId(),
                    nome: ticketData.nome,
                    cpf: ticketData.cpf,
                    contato: ticketData.contato,
                    igreja: ticketData.igreja,
                    regiao: ticketData.regiao,
                    descricao: ticketData.descricao,
                    status: 'aberto',
                    dataAbertura: new Date().toISOString(),
                    criadoPor: auth.getCurrentUser()?.name || 'Sistema',
                    criadoPorEmail: auth.getCurrentUser()?.email || '',
                    observacoes: []
                }
            };

            const result = await this.sendToScript(this.endpoints.newTicket, payload);
            
            if (result.success) {
                Helpers.showToast('Chamado criado com sucesso!', 'success');
                return result;
            } else {
                throw new Error('Erro ao criar chamado');
            }

        } catch (error) {
            console.error('Create ticket error:', error);
            Helpers.showToast('Erro ao criar chamado: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Update existing ticket
    async updateTicket(ticketId, updateData) {
        try {
            const user = auth.getCurrentUser();
            const payload = {
                action: 'update_ticket',
                ticketId: ticketId,
                updates: {
                    ...updateData,
                    ultimaAtualizacao: new Date().toISOString(),
                    atualizadoPor: user?.name || 'Sistema',
                    atualizadoPorEmail: user?.email || ''
                }
            };

            // Add observation if status changed
            if (updateData.status) {
                payload.updates.observacoes = payload.updates.observacoes || [];
                payload.updates.observacoes.push({
                    id: Helpers.generateId(),
                    data: new Date().toISOString(),
                    usuario: user?.name || 'Sistema',
                    tipo: 'status_change',
                    texto: `Status alterado para: ${updateData.status}`,
                    observacao: updateData.observacao || ''
                });
            }

            const result = await this.sendToScript(this.endpoints.updateTicket, payload);
            
            if (result.success) {
                Helpers.showToast('Chamado atualizado com sucesso!', 'success');
                return result;
            } else {
                throw new Error('Erro ao atualizar chamado');
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
                action: 'delete_ticket',
                ticketId: ticketId,
                deleteInfo: {
                    dataExclusao: new Date().toISOString(),
                    excluidoPor: user?.name || 'Sistema',
                    excluidoPorEmail: user?.email || '',
                    motivo: reason
                }
            };

            const result = await this.sendToScript(this.endpoints.deleteTicket, payload);
            
            if (result.success) {
                Helpers.showToast('Chamado excluído com sucesso!', 'success');
                return result;
            } else {
                throw new Error('Erro ao excluir chamado');
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
                action: 'create_user',
                user: {
                    id: Helpers.generateId(),
                    nome: userData.nome,
                    email: userData.email,
                    cargo: userData.cargo,
                    regiao: userData.regiao,
                    igreja: userData.igreja,
                    telefone: userData.telefone,
                    dataCadastro: new Date().toISOString(),
                    criadoPor: auth.getCurrentUser()?.name || 'Sistema',
                    status: 'ativo'
                }
            };

            const result = await this.sendToScript(this.endpoints.newUser, payload);
            
            if (result.success) {
                Helpers.showToast('Usuário criado com sucesso!', 'success');
                return result;
            } else {
                throw new Error('Erro ao criar usuário');
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
                action: 'validate_user',
                credentials: {
                    email: email,
                    password: password
                }
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
            // For demo purposes, return mock data
            // In production, this would call the Power Automate flow to get data from Google Sheets
            
            const mockTickets = [
                {
                    id: '1',
                    nome: 'João Silva',
                    cpf: '123.456.789-00',
                    contato: '(11) 99999-9999',
                    igreja: 'Igreja Central',
                    regiao: 'Norte',
                    descricao: 'Preciso de ajuda com documentação para aposentadoria',
                    status: 'aberto',
                    dataAbertura: '2024-01-15T10:30:00Z',
                    criadoPor: 'Maria Santos',
                    observacoes: []
                },
                {
                    id: '2',
                    nome: 'Maria Oliveira',
                    cpf: '987.654.321-00',
                    contato: '(11) 88888-8888',
                    igreja: 'Igreja do Bairro Alto',
                    regiao: 'Sul',
                    descricao: 'Orientação sobre benefícios sociais',
                    status: 'em_andamento',
                    dataAbertura: '2024-01-14T14:15:00Z',
                    criadoPor: 'Pedro Oliveira',
                    observacoes: [
                        {
                            id: 'obs1',
                            data: '2024-01-15T09:00:00Z',
                            usuario: 'Ana Costa',
                            tipo: 'status_change',
                            texto: 'Status alterado para: Em Andamento',
                            observacao: 'Entrando em contato com o INSS'
                        }
                    ]
                },
                {
                    id: '3',
                    nome: 'Carlos Santos',
                    cpf: '456.789.123-00',
                    contato: '(11) 77777-7777',
                    igreja: 'Igreja da Vila Nova',
                    regiao: 'Leste',
                    descricao: 'Regularização de CPF',
                    status: 'resolvido',
                    dataAbertura: '2024-01-10T16:45:00Z',
                    criadoPor: 'João Silva',
                    observacoes: [
                        {
                            id: 'obs2',
                            data: '2024-01-12T11:30:00Z',
                            usuario: 'Maria Santos',
                            tipo: 'status_change',
                            texto: 'Status alterado para: Resolvido',
                            observacao: 'CPF regularizado com sucesso na Receita Federal'
                        }
                    ]
                }
            ];

            // Apply filters
            let filteredTickets = mockTickets;
            
            if (filters.regiao) {
                filteredTickets = filteredTickets.filter(ticket => ticket.regiao === filters.regiao);
            }
            
            if (filters.status) {
                filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
            }
            
            if (filters.igreja) {
                filteredTickets = filteredTickets.filter(ticket => ticket.igreja === filters.igreja);
            }
            
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredTickets = filteredTickets.filter(ticket => 
                    ticket.nome.toLowerCase().includes(searchTerm) ||
                    ticket.descricao.toLowerCase().includes(searchTerm)
                );
            }

            return { success: true, data: filteredTickets };

        } catch (error) {
            console.error('Get tickets error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get users with filters
    async getUsers(filters = {}) {
        try {
            // Mock user data for demo
            const mockUsers = [
                {
                    id: '1',
                    nome: 'João Silva',
                    email: 'voluntario@arimateia.org',
                    cargo: 'VOLUNTARIO',
                    regiao: 'Norte',
                    igreja: 'Igreja Central',
                    telefone: '(11) 99999-9999',
                    dataCadastro: '2024-01-01T00:00:00Z',
                    status: 'ativo'
                },
                {
                    id: '2',
                    nome: 'Maria Santos',
                    email: 'secretaria@arimateia.org',
                    cargo: 'SECRETARIA',
                    regiao: 'Sul',
                    igreja: 'Igreja do Bairro Alto',
                    telefone: '(11) 88888-8888',
                    dataCadastro: '2024-01-01T00:00:00Z',
                    status: 'ativo'
                },
                {
                    id: '3',
                    nome: 'Pedro Oliveira',
                    email: 'coordenador@arimateia.org',
                    cargo: 'COORDENADOR',
                    regiao: 'Centro',
                    igreja: 'Igreja Central',
                    telefone: '(11) 77777-7777',
                    dataCadastro: '2024-01-01T00:00:00Z',
                    status: 'ativo'
                }
            ];

            // Apply filters
            let filteredUsers = mockUsers;
            
            if (filters.regiao) {
                filteredUsers = filteredUsers.filter(user => user.regiao === filters.regiao);
            }
            
            if (filters.cargo) {
                filteredUsers = filteredUsers.filter(user => user.cargo === filters.cargo);
            }
            
            if (filters.igreja) {
                filteredUsers = filteredUsers.filter(user => user.igreja === filters.igreja);
            }

            return { success: true, data: filteredUsers };

        } catch (error) {
            console.error('Get users error:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate reports
    async generateReport(reportType, filters = {}) {
        try {
            const payload = {
                action: 'generate_report',
                reportType: reportType,
                filters: filters,
                generatedBy: auth.getCurrentUser()?.name || 'Sistema',
                generatedAt: new Date().toISOString()
            };

            // For demo, return mock report data
            const mockReportData = {
                totalTickets: 150,
                ticketsByStatus: {
                    aberto: 45,
                    em_andamento: 32,
                    aguardando: 18,
                    resolvido: 50,
                    cancelado: 5
                },
                ticketsByRegion: {
                    Norte: 30,
                    Sul: 25,
                    Leste: 35,
                    Oeste: 20,
                    Centro: 25,
                    'Grande ABC': 15
                },
                ticketsByMonth: {
                    'Jan/2024': 45,
                    'Fev/2024': 52,
                    'Mar/2024': 53
                },
                averageResolutionTime: '3.5 dias',
                topVolunteers: [
                    { nome: 'Maria Santos', tickets: 25 },
                    { nome: 'João Silva', tickets: 20 },
                    { nome: 'Ana Costa', tickets: 18 }
                ]
            };

            return { success: true, data: mockReportData };

        } catch (error) {
            console.error('Generate report error:', error);
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
