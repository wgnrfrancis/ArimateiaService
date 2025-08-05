// Configurações globais do sistema
const CONFIG = {
    // Google Apps Script Web App URL
    googleAppsScript: {
        webAppUrl: 'https://script.google.com/macros/s/AKfycbzKdHQdnSDJnWjWkpSvNGBfKJAJpSLiw4vLF9PGHfHWJbODbj5v5LcxBLwLDfQStTJZ/exec'
    },

    // Configurações do sistema
    system: {
        name: 'Balcão da Cidadania',
        version: '2.0.0',
        environment: 'production'
    },

    // Regiões e igrejas (fallback se planilha falhar)
    regions: {
        'CATEDRAL': {
            name: 'CATEDRAL',
            churches: [
                'Catedral São Sebastião',
                'Igreja do Rosário',
                'Capela Santa Rita'
            ]
        },
        'ZONA_NORTE': {
            name: 'ZONA NORTE',
            churches: [
                'Igreja São João',
                'Capela Nossa Senhora',
                'Igreja Santo Antônio'
            ]
        },
        'ZONA_SUL': {
            name: 'ZONA SUL',
            churches: [
                'Igreja São Pedro',
                'Capela São José',
                'Igreja Santa Maria'
            ]
        }
    },

    // Configurações de UI
    ui: {
        itemsPerPage: 10,
        autoRefreshInterval: 30000, // 30 segundos
        showWelcomeMessage: true
    }
};

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}