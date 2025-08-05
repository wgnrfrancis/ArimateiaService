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
            // ✅ MÉTODO CORRETO para Google Apps Script
            const payload = {
                ...data,
                timestamp: new Date().toISOString(),
                clientOrigin: window.location.origin
            };

            console.log('📤 Payload completo:', payload);

            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload),
                redirect: 'follow'
            });

            console.log('📡 Response status:', response.status);

            if (response.ok) {
                const responseText = await response.text();
                console.log('📄 Resposta recebida:', responseText);
                
                try {
                    const result = JSON.parse(responseText);
                    console.log('✅ Resposta final:', result);
                    return result;
                } catch (parseError) {
                    console.error('❌ Erro ao fazer parse do JSON:', parseError);
                    throw new Error(`Resposta inválida: ${responseText.substring(0, 100)}...`);
                }
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

    // ✅ LOGIN REAL via Google Apps Script
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

    // ✅ VERIFICAR SE USUÁRIO JÁ EXISTE
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

    // ✅ BUSCAR REGIÕES E IGREJAS DA PLANILHA
    async getRegioesIgrejas() {
        try {
            // Se já temos no cache, retornar
            if (this.regioesIgrejas) {
                console.log('📋 Usando regiões/igrejas do cache');
                return { success: true, data: this.regioesIgrejas };
            }

            console.log('🔍 Buscando regiões e igrejas da planilha...');
            
            const result = await this.sendToScript({
                action: 'getIgrejasRegioes'
            });

            if (result.success && result.data) {
                // Salvar no cache
                this.regioesIgrejas = result.data;
                console.log('✅ Regiões e igrejas carregadas:', this.regioesIgrejas);
                return result;
            } else {
                throw new Error(result.error || 'Erro ao buscar regiões e igrejas');
            }

        } catch (error) {
            console.error('❌ Erro ao buscar regiões/igrejas:', error);
            
            // ✅ FALLBACK: usar dados do CONFIG se a planilha falhar
            console.log('⚠️ Usando regiões do CONFIG como fallback');
            return {
                success: true,
                data: CONFIG.regions,
                fallback: true
            };
        }
    }

    // ✅ CRIAR USUÁRIO REAL (com validações completas)
    async createUser(userData) {
        try {
            console.log('👤 Criando usuário:', userData);

            // Validar dados obrigatórios
            if (!userData.nome || userData.nome.trim().length < 2) {
                throw new Error('Nome deve ter pelo menos 2 caracteres');
            }

            if (!userData.email || !this.validateEmail(userData.email)) {
                throw new Error('Email inválido');
            }

            if (!userData.telefone || userData.telefone.length < 10) {
                throw new Error('Telefone deve ter pelo menos 10 dígitos');
            }

            if (!userData.cargo) {
                throw new Error('Cargo é obrigatório');
            }

            if (!userData.igreja) {
                throw new Error('Igreja é obrigatória');
            }

            if (!userData.regiao) {
                throw new Error('Região é obrigatória');
            }

            // Verificar se email já existe
            console.log('🔍 Verificando se email já existe...');
            const existingUser = await this.checkUserExists(userData.email);
            
            if (existingUser.exists) {
                throw new Error('Já existe um usuário cadastrado com este email');
            }

            // Obter usuário atual (quem está cadastrando)
            const currentUser = authManager.getCurrentUser();
            
            // Criar usuário na planilha
            const result = await this.sendToScript({
                action: 'newUser',
                nomeCompleto: userData.nome.trim(),
                email: userData.email.trim(),
                telefone: userData.telefone.trim(),
                cargo: userData.cargo,
                igreja: userData.igreja,
                regiao: userData.regiao,
                observacoes: userData.observacoes || '',
                userInfo: {
                    name: currentUser ? currentUser.nome : 'Sistema',
                    email: currentUser ? currentUser.email : 'sistema@balcao.org'
                }
            });

            console.log('📊 Resultado do cadastro:', result);
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

    // ✅ CRIAR CHAMADO REAL
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

    // ✅ BUSCAR CHAMADOS REAIS
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

    // ✅ ATUALIZAR CHAMADO REAL
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

    // ✅ BUSCAR USUÁRIOS REAIS
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

    // ✅ BUSCAR ESTATÍSTICAS
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

    // ✅ BUSCAR IGREJAS POR REGIÃO ESPECÍFICA
    async getIgrejasByRegiao(regiao) {
        try {
            console.log('🔍 Buscando igrejas da região:', regiao);
            
            // Buscar dados completos se não temos no cache
            const regioesData = await this.getRegioesIgrejas();
            
            if (regioesData.success && regioesData.data[regiao]) {
                const igrejas = regioesData.data[regiao].churches || [];
                console.log('⛪ Igrejas encontradas para', regiao, ':', igrejas);
                
                return {
                    success: true,
                    data: igrejas
                };
            } else {
                console.log('⚠️ Região não encontrada:', regiao);
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
}

// Inicializar globalmente
window.flowManager = new FlowManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowManager;
}

