// ✅ SIMULAÇÃO TEMPORÁRIA DE LOGIN para desenvolvimento
async simulateLogin(email, password) {
    console.log('🔐 Simulando login para desenvolvimento...');
    
    // Lista de usuários para teste (corrigida)
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
        },
        {
            id: 2,
            nome: 'Francis Oliveira', 
            email: 'wgnrfrancis@gmail.com',
            senha: 'minhaflor',
            cargo: 'COORDENADOR_LOCAL',
            igreja: 'CATEDRAL DA FÉ',
            regiao: 'CATEDRAL',
            telefone: '(18) 88888-8888'
        }
    ];
    // resto do código igual...
}