// Google Apps Script integration module for Balcão da Cidadania
class FlowManager {
    constructor() {
        this.scriptUrl = CONFIG.googleAppsScript.webAppUrl;
        this.isOnline = navigator.onLine;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        this.regioesIgrejas = null; // Cache das regiões/igrejas
    }

    async sendToScript(data) {
        console.log('🌐 Enviando para Google Apps Script...');
        console.log('📍 URL:', this.scriptUrl);
        console.log('📦 Dados:', data);

        try {
            const payload = {
                ...data,
                timestamp: new Date().toISOString(),
                clientOrigin: window.location.origin
            };

            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload),
                redirect: 'follow'
            });

            if (response.ok) {
                const responseText = await response.text();
                const result = JSON.parse(responseText);
                console.log('✅ Resposta final:', result);
                return result;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            return { 
                success: false, 
                error: `Erro de conexão: ${error.message}` 
            };
        }
    }

    // ✅ LOGIN
    async validateUser(email, password) {
        try {
            const result = await this.sendToScript({
                action: 'validateUser',
                email: email,
                password: password
            });
            return result;
        } catch (error) {
            console.error('Validate user error:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ VERIFICAR SE USUÁRIO EXISTE
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

    // ✅ BUSCAR REGIÕES E IGREJAS
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
            return {
                success: true,
                data: CONFIG.regions,
                fallback: true
            };
        }
    }

    // ✅ BUSCAR IGREJAS POR REGIÃO
    async getIgrejasByRegiao(regiao) {
        try {
            const regioesData = await this.getRegioesIgrejas();
            
            if (regioesData.success && regioesData.data[regiao]) {
                const igrejas = regioesData.data[regiao].churches || [];
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

    // ✅ CRIAR USUÁRIO
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

            const currentUser = authManager.getCurrentUser();
            
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

    // ✅ VALIDAR EMAIL
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ✅ CRIAR CHAMADO
    async createTicket(ticketData) {
        try {
            const user = authManager.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const result = await this.sendToScript({
                action: 'newTicket',
                nomeCidadao: ticketData.nome,
                cpf: ticketData.cpf || '',
                contato: ticketData.contato,
                email: ticketData.email || '',
                igreja: user.igreja,
                regiao: user.regiao,
                descricao: ticketData.descricao,
                prioridade: ticketData.prioridade || 'MEDIA',
                categoria: ticketData.categoria || 'OUTROS',
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

    // ✅ BUSCAR CHAMADOS
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

    // ✅ ATUALIZAR CHAMADO
    async updateTicket(ticketId, updateData) {
        try {
            const user = authManager.getCurrentUser();
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

    // ✅ BUSCAR USUÁRIOS
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

    // ✅ ESTATÍSTICAS
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

    // ✅ TESTAR CONEXÃO
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
}

// Inicializar globalmente
window.flowManager = new FlowManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowManager;
}

