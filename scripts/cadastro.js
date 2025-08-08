// Arquivo: scripts/cadastro.js
// Gerenciamento do formulário de cadastro de voluntários

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM carregado - Inicializando sistema de cadastro...');
    
    // Testar conexão primeiro
    testarConexao();
    
    // Carregar regiões e configurar seleção hierárquica
    loadRegioesFromSheet();
    setupHierarchicalSelection();
    
    // Setup form validation
    Helpers.setupFormValidation(document.getElementById('cadastro-form'));
    
    // Setup phone formatting
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length === 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length === 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            e.target.value = value;
        }
    });

    // Handle form submission
    document.getElementById('cadastro-form').addEventListener('submit', handleCadastro);
});

async function handleCadastro(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validar campos obrigatórios
    if (!data.nomeCompleto || !data.email || !data.telefone || !data.regiao || !data.igreja || !data.senha) {
        Helpers.showToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    // Validar senhas
    if (data.senha !== data.confirmarSenha) {
        Helpers.showToast('As senhas não coincidem', 'error');
        return;
    }

    // Validar aceite dos termos
    if (!data.termos) {
        Helpers.showToast('É necessário concordar com os termos', 'error');
        return;
    }

    try {
        Helpers.showLoading('Criando cadastro...');
        
        console.log('📤 Enviando dados para cadastro via Power Automate:', {
            nomeCompleto: data.nomeCompleto,
            email: data.email,
            telefone: data.telefone,
            regiao: data.regiao,
            igreja: data.igreja,
            cargo: 'VOLUNTARIO'
        });
        
        // Usar Power Automate para criar usuário
        const result = await window.flowManager.sendToFlow('CRIAR_USUARIO', {
            usuario: {
                nomeCompleto: data.nomeCompleto,
                email: data.email,
                senha: data.senha,
                telefone: data.telefone,
                cargo: 'VOLUNTARIO',
                igreja: data.igreja,
                regiao: data.regiao,
                dataCadastro: new Date().toISOString(),
                status: 'ATIVO'
            }
        });

        Helpers.hideLoading();
        
        console.log('📋 Resultado do cadastro:', result);

        if (result.success) {
            Helpers.showToast('Cadastro realizado com sucesso!', 'success');
            
            setTimeout(() => {
                alert(`Cadastro criado com sucesso!\n\n` +
                     `ID: ${result.data.id}\n` +
                     `Nome: ${data.nomeCompleto}\n` +
                     `Email: ${data.email}\n` +
                     `Igreja: ${data.igreja}\n` +
                     `Região: ${data.regiao}\n\n` +
                     `Seu perfil foi criado como VOLUNTÁRIO.\n` +
                     `Verifique sua conta na planilha!`);
                
                // Limpar formulário
                document.getElementById('cadastro-form').reset();
                
                // Redirecionar após 3 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }, 1000);
        } else {
            throw new Error(result.error || 'Erro desconhecido ao criar cadastro');
        }

    } catch (error) {
        Helpers.hideLoading();
        console.error('❌ Erro no cadastro:', error);
        
        let errorMessage = 'Erro ao criar cadastro';
        
        if (error.message.includes('CORS')) {
            errorMessage = 'Erro de conexão. Verifique se o Power Automate está configurado corretamente.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
        } else if (error.message.includes('Email já cadastrado')) {
            errorMessage = 'Este email já está cadastrado. Use outro email ou faça login.';
        } else {
            errorMessage = error.message;
        }
        
        Helpers.showToast(errorMessage, 'error');
        
        console.error('Detalhes do erro:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            dadosEnviados: data
        });
    }
}

async function testarConexao() {
    try {
        console.log('🧪 Testando conexão com Power Automate...');
        
        const result = await window.flowManager.sendToFlow('OBTER_CONFIGURACOES', {
            tipo: 'test'
        });
        
        console.log('✅ Teste de conexão Power Automate:', result);
        return result.success;
    } catch (error) {
        console.error('❌ Erro no teste de conexão Power Automate:', error);
        return false;
    }
}

async function loadRegioesFromSheet() {
    try {
        Helpers.showLoading('Carregando regiões...');
        
        console.log('🔍 Buscando regiões e igrejas via Power Automate...');
        
        // Usar o flowManager para buscar dados da aba IGREJAS_REGIOES
        const result = await window.flowManager.sendToFlow('OBTER_IGREJAS', {
            aba: 'IGREJAS_REGIOES',
            colunas: ['ID', 'NOME_IGREJA', 'REGIAO']
        });
        
        console.log('📋 Resultado obtido do Power Automate:', result);
        
        if (result.success && result.data) {
            const data = result.data;
            const regiaoSelect = document.getElementById('regiao');
            
            // Limpar opções existentes (exceto a primeira)
            regiaoSelect.innerHTML = '<option value="">Selecione a região</option>';
            
            // Processar dados da planilha
            const regioesUnicas = [...new Set(data.map(item => item.REGIAO))].filter(r => r);
            const igrejasPorRegiao = {};
            
            // Agrupar igrejas por região
            data.forEach(item => {
                if (item.REGIAO && item.NOME_IGREJA) {
                    if (!igrejasPorRegiao[item.REGIAO]) {
                        igrejasPorRegiao[item.REGIAO] = [];
                    }
                    igrejasPorRegiao[item.REGIAO].push({
                        id: item.ID,
                        nome: item.NOME_IGREJA
                    });
                }
            });
            
            // Adicionar regiões ao select
            regioesUnicas.forEach(regiao => {
                const option = document.createElement('option');
                option.value = regiao;
                option.textContent = regiao;
                regiaoSelect.appendChild(option);
            });
            
            // Armazenar dados para uso na seleção hierárquica
            window.igrejasData = igrejasPorRegiao;
            
            console.log(`✅ Carregadas ${regioesUnicas.length} regiões e ${data.length} igrejas do OneDrive`);
            Helpers.showToast('Regiões carregadas do OneDrive!', 'success');
            
        } else {
            throw new Error(result.error || 'Erro na resposta do Power Automate');
        }
        
    } catch (error) {
        console.error('⚠️ Erro ao carregar da planilha OneDrive:', error);
        console.log('🔄 Usando fallback do config.js...');
        
        // Fallback para regiões do config.js
        loadRegioes();
        
        Helpers.showToast('Usando dados locais. Algumas funcionalidades podem estar limitadas.', 'warning');
        
    } finally {
        Helpers.hideLoading();
    }
}

function loadRegioes() {
    try {
        const regiaoSelect = document.getElementById('regiao');
        
        // Adicionar regiões do config (fallback)
        Object.keys(CONFIG.igrejasPorRegiao).forEach(regiao => {
            const option = document.createElement('option');
            option.value = regiao;
            option.textContent = regiao;
            regiaoSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar regiões:', error);
    }
}

function setupHierarchicalSelection() {
    const regiaoSelect = document.getElementById('regiao');
    const igrejaSelect = document.getElementById('igreja');

    regiaoSelect.addEventListener('change', function() {
        // Limpar igrejas
        igrejaSelect.innerHTML = '<option value="">Selecione uma igreja</option>';
        
        const regiao = this.value;
        
        if (regiao) {
            let igrejas = [];
            
            // Usar dados da planilha se disponível
            if (window.igrejasData && window.igrejasData[regiao]) {
                igrejas = window.igrejasData[regiao];
            } 
            // Fallback para config.js
            else if (CONFIG.igrejasPorRegiao[regiao]) {
                igrejas = CONFIG.igrejasPorRegiao[regiao];
            }
            
            // Carregar igrejas da região selecionada
            igrejas.forEach(igreja => {
                const option = document.createElement('option');
                const nomeIgreja = igreja.nome || igreja;
                option.value = nomeIgreja;
                option.textContent = nomeIgreja;
                igrejaSelect.appendChild(option);
            });
            
            igrejaSelect.disabled = false;
        } else {
            igrejaSelect.disabled = true;
        }
    });
}