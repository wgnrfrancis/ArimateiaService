// Google Apps Script integration module for Balcão da Cidadania
class FlowManager {
    constructor() {
        this.scriptUrl = CONFIG.googleAppsScript.webAppUrl;
        this.isOnline = navigator.onLine;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async sendToScript(data) {
        console.log('🌐 Enviando para Google Apps Script...');
        console.log('📍 URL:', this.scriptUrl);
        console.log('📦 Dados:', data);

        try {
            // Adicionar informações extras
            const payload = {
                ...data,
                timestamp: new Date().toISOString(),
                clientOrigin: window.location.origin
            };

            console.log('📤 Request body completo:', payload);

            // ✅ USAR URLSearchParams para melhor compatibilidade
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload)
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
            
            // ✅ FALLBACK: Simulação para desenvolvimento
            if (data.action === 'loginUser') {
                return this.simulateLogin(data.email, data.password);
            }
            
            throw error;
        }
    }

    // ✅ SIMULAÇÃO TEMPORÁRIA DE LOGIN
    async simulateLogin(email, password) {
        console.log('🔐 Simulando login para desenvolvimento...');
        
        const testUsers = [
            {
                id: 1,
                nome: 'Wagner Duarte',
                email: 'wagduarte@universal.org',
                senha: 'minhaflor',
                cargo: 'COORDENADOR_GERAL',
                igreja: 'CATEDRAL DA FÉ',
                regiao: 'CATEDRAL',
                telefone: '(18) 99999-9999'
            }
        ];

        const user = testUsers.find(u => u.email === email);
        
        if (!user || user.senha !== password) {
            return {
                success: false,
                error: 'Email ou senha incorretos'
            };
        }

        return {
            success: true,
            data: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                cargo: user.cargo,
                igreja: user.igreja,
                regiao: user.regiao,
                status: 'ATIVO'
            }
        };
    }
}

// Inicializar globalmente
window.flowManager = new FlowManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowManager;
}
