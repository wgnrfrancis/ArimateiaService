// Configuration file for Balcão da Cidadania application
const CONFIG = {
    // Authentication settings
    auth: {
        sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    },

    // Google Apps Script integration
    googleAppsScript: {
        // URL do Google Apps Script V2 (novo e limpo)
        webAppUrl: 'https://script.google.com/macros/s/AKfycbzW0ZE0J-1RceoEWF9Gn_dnVx29z54RWVoi0RLSso9qhguPCeZpJ2xo2THEUNFDMsv_/exec' // ⚠️ Atualize com a nova URL
    },

    // Estrutura das abas da planilha (para referência)
    spreadsheetTabs: {
        CHAMADOS: {
            name: 'CHAMADOS',
            columns: ['ID', 'DATA_ABERTURA', 'NOME_CIDADAO', 'CONTATO', 'EMAIL', 'IGREJA', 'REGIAO', 'DESCRICAO_DEMANDA', 'STATUS', 'PRIORIDADE', 'CATEGORIA', 'CRIADO_POR', 'CRIADO_POR_EMAIL', 'RESPONSAVEL_ATUAL', 'DATA_ULTIMA_ATUALIZACAO', 'OBSERVACOES', 'ANEXOS', 'TEMPO_RESOLUCAO', 'SATISFACAO_CIDADAO']
        },
        OBSERVACOES_CHAMADOS: {
            name: 'OBSERVACOES_CHAMADOS',
            columns: ['ID_OBSERVACAO', 'ID_CHAMADO', 'DATA_HORA', 'USUARIO', 'USUARIO_EMAIL', 'TIPO_ACAO', 'STATUS_ANTERIOR', 'STATUS_NOVO', 'OBSERVACAO', 'ANEXOS']
        },
        CHAMADOS_EXCLUIDOS: {
            name: 'CHAMADOS_EXCLUIDOS',
            columns: ['ID_ORIGINAL', 'DATA_EXCLUSAO', 'EXCLUIDO_POR', 'EXCLUIDO_POR_EMAIL', 'MOTIVO_EXCLUSAO', 'DADOS_ORIGINAIS']
        },
        USUARIOS: {
            name: 'USUARIOS',
            columns: ['ID', 'NOME_COMPLETO', 'EMAIL', 'SENHA', 'TELEFONE', 'CARGO', 'IGREJA', 'REGIAO', 'DATA_CADASTRO', 'STATUS', 'ULTIMO_ACESSO', 'TOTAL_CHAMADOS', 'CHAMADOS_RESOLVIDOS', 'TAXA_RESOLUCAO', 'CRIADO_POR', 'OBSERVACOES']
        },
        CATEGORIAS_SERVICOS: {
            name: 'CATEGORIAS_SERVICOS',
            columns: ['ID', 'NOME_CATEGORIA', 'DESCRICAO', 'COR_IDENTIFICACAO', 'ICONE', 'ATIVA', 'ORDEM_EXIBICAO']
        },
        IGREJAS_REGIOES: {
            name: 'IGREJAS_REGIOES',
            columns: ['ID', 'NOME_IGREJA', 'REGIAO', 'OBREIROS', 'VOLUNTARIOS_DOS_GRUPOS', 'MEMBROS_DOMINGO', 'TOTAL', 'COORDENADOR_LOCAL', 'TOTAL_VOLUNTARIOS', 'TOTAL_ATENDIMENTOS', 'STATUS']
        },
        RELATORIOS_MENSAIS: {
            name: 'RELATORIOS_MENSAIS',
            columns: ['ANO_MES', 'TOTAL_CHAMADOS', 'CHAMADOS_RESOLVIDOS', 'TAXA_RESOLUCAO', 'TEMPO_MEDIO_RESOLUCAO', 'TOTAL_VOLUNTARIOS_ATIVOS', 'IGREJA_MAIS_ATIVA', 'CATEGORIA_MAIS_DEMANDADA', 'SATISFACAO_MEDIA']
        },
        PROFISSIONAIS_LIBERAIS: {
            name: 'PROFISSIONAIS_LIBERAIS',
            columns: ['NOME', 'TELEFONE', 'PROFISSAO', 'CIDADE']
        },
        ASSESSORES: {
            name: 'ASSESSORES',
            columns: ['ASSESSOR', 'TELEFONE', 'PARLAMENTAR', 'GABINETE']
        },
        ELEICOES_DEPUTADOS: {
            name: 'ELEICOES_DEPUTADOS',
            columns: ['REGIAO', 'IGREJAS', 'MUNICIPIO', 'ENDERECOS', 'HABITANTES', 'OBREIROS', 'GRUPOS', 'POVO_GERAL', 'QUANTIDADE_ARIMATEIA_OBREIROS', 'TOTAL_GERAL_ARIMATEIA', 'VOTOS_DF_2018', 'VOTOS_DF_2022', 'VOTOS_DE_2018', 'VOTOS_DE_2022']
        },
        ELEICOES_VEREADORES: {
            name: 'ELEICOES_VEREADORES',
            columns: ['REGIAO', 'IGREJAS', 'MUNICIPIO', 'NOME_2024', 'CONTATO', 'FUNCAO', 'PARTIDO', 'ELEITO_NAO_ELEITO_2024', 'QUAL_MANDATO_ESTA', 'SUPLENTE_2024', 'VOTOS_2016', 'VOTOS_2020', 'VOTOS_2024', 'TOTAL_CADEIRAS', 'MAIOR_VOTACAO_ELEITO_2016', 'MENOR_VOTACAO_ELEITO_2016', 'MAIOR_VOTACAO_ELEITO_2020', 'MENOR_VOTACAO_ELEITO_2020', 'MAIOR_VOTACAO_ELEITO_2024', 'MENOR_VOTACAO_ELEITO_2024']
        },
        ELEICOES_CONSELHO: {
            name: 'ELEICOES_CONSELHO',
            columns: ['REGIAO', 'IGREJAS', 'MUNICIPIO', 'NOMES_2023', 'CONTATO', 'FUNCAO', 'VOTOS_2019', 'ELEITO_NAO_ELEITO_2023', 'VOTOS_2023', 'POSICAO_2023']
        }
    },

    // User roles and permissions
    roles: {
        VOLUNTARIO: {
            name: "Voluntário",
            permissions: ["dashboard", "balcao_view", "balcao_create"]
        },
        SECRETARIA: {
            name: "Secretaria",
            permissions: ["dashboard", "balcao_view", "balcao_create", "balcao_edit", "secretaria_view", "secretaria_edit"]
        },
        COORDENADOR: {
            name: "Coordenador",
            permissions: ["dashboard", "balcao_view", "balcao_create", "balcao_edit", "balcao_delete", "secretaria_view", "secretaria_edit", "coordenador_view", "coordenador_manage"]
        }
    },

    // Available regions
    regions: [
        "CATEDRAL",
        "Presidente Prudente",
        "Pirapozinho",
        "Presidente Venceslau",
        "Rancharia",
        "Andradina",
        "Tupã",
        "Assis",
        "Dracena"
    ],

    // Churches organized by region with IDs
    igrejasPorRegiao: {
        "CATEDRAL": [
            { id: "IGR001", nome: "CATEDRAL DA FÉ" }
        ],
        "Presidente Prudente": [
            { id: "IGR002", nome: "Cecap" },
            { id: "IGR003", nome: "Humberto Salvador" },
            { id: "IGR004", nome: "Santo Expedito" },
            { id: "IGR005", nome: "Montalvão" },
            { id: "IGR006", nome: "Indiana" },
            { id: "IGR007", nome: "Ana Jacinta" },
            { id: "IGR008", nome: "Alvares Machado" },
            { id: "IGR009", nome: "Pinheiros" },
            { id: "IGR010", nome: "Taciba" },
            { id: "IGR011", nome: "Regente Feijo" }
        ],
        "Pirapozinho": [
            { id: "IGR012", nome: "Pirapozinho" },
            { id: "IGR013", nome: "Anhumas" },
            { id: "IGR014", nome: "Tarabai" },
            { id: "IGR015", nome: "Teodoro Sampaio" },
            { id: "IGR016", nome: "Mirante" },
            { id: "IGR017", nome: "Primavera" },
            { id: "IGR018", nome: "Rosana" },
            { id: "IGR019", nome: "Euclides da Cunha" }
        ],
        "Presidente Venceslau": [
            { id: "IGR020", nome: "Presidente Venceslau" },
            { id: "IGR021", nome: "Presidente Epitácio" },
            { id: "IGR022", nome: "Presidente Bernardes" },
            { id: "IGR023", nome: "Santo Anastácio" },
            { id: "IGR024", nome: "Piquerobi" }
        ],
        "Rancharia": [
            { id: "IGR025", nome: "RANCHARIA" },
            { id: "IGR026", nome: "Martinopólis" },
            { id: "IGR027", nome: "Quatá" },
            { id: "IGR028", nome: "Iepe" },
            { id: "IGR029", nome: "Paraguaçu Paulista" }
        ],
        "Andradina": [
            { id: "IGR030", nome: "ANDRADINA" },
            { id: "IGR031", nome: "Mirandopolis" },
            { id: "IGR032", nome: "Castilho" },
            { id: "IGR033", nome: "Guaracaí" }
        ],
        "Tupã": [
            { id: "IGR034", nome: "TUPÃ" },
            { id: "IGR035", nome: "Bastos" },
            { id: "IGR036", nome: "Quintana" },
            { id: "IGR037", nome: "Queiroz" },
            { id: "IGR038", nome: "Osvaldo Cruz" },
            { id: "IGR039", nome: "Parapuã" },
            { id: "IGR040", nome: "Salmourão" },
            { id: "IGR041", nome: "Herculândia" }
        ],
        "Assis": [
            { id: "IGR042", nome: "ASSIS" },
            { id: "IGR043", nome: "Tarumã" },
            { id: "IGR044", nome: "Prudenciana" },
            { id: "IGR045", nome: "Echaporã" },
            { id: "IGR046", nome: "Candido Mota" },
            { id: "IGR047", nome: "Palmital" },
            { id: "IGR048", nome: "Ibirarema" }
        ],
        "Dracena": [
            { id: "IGR049", nome: "DRACENA" },
            { id: "IGR050", nome: "Junqueiropolis" },
            { id: "IGR051", nome: "Panorama" },
            { id: "IGR052", nome: "Tupi Paulista" },
            { id: "IGR053", nome: "Irapuru" },
            { id: "IGR054", nome: "Paraiso" },
            { id: "IGR055", nome: "Adamantina" },
            { id: "IGR056", nome: "Lucélia" }
        ]
    },

    // Flat list of all churches (for backward compatibility)
    churches: [
        "CATEDRAL DA FÉ", "Cecap", "Humberto Salvador", "Santo Expedito", "Montalvão", 
        "Indiana", "Ana Jacinta", "Alvares Machado", "Pinheiros", "Taciba", "Regente Feijo",
        "Pirapozinho", "Anhumas", "Tarabai", "Teodoro Sampaio", "Mirante", "Primavera", 
        "Rosana", "Euclides da Cunha", "Presidente Venceslau", "Presidente Epitácio", 
        "Presidente Bernardes", "Santo Anastácio", "Piquerobi", "RANCHARIA", "Martinopólis", 
        "Quatá", "Iepe", "Paraguaçu Paulista", "ANDRADINA", "Mirandopolis", "Castilho", 
        "Guaracaí", "TUPÃ", "Bastos", "Quintana", "Queiroz", "Osvaldo Cruz", "Parapuã", 
        "Salmourão", "Herculândia", "ASSIS", "Tarumã", "Prudenciana", "Echaporã", 
        "Candido Mota", "Palmital", "Ibirarema", "DRACENA", "Junqueiropolis", "Panorama", 
        "Tupi Paulista", "Irapuru", "Paraiso", "Adamantina", "Lucélia"
    ],

    // Ticket status options
    ticketStatus: [
        { value: "aberto", label: "Aberto", color: "warning" },
        { value: "em_andamento", label: "Em Andamento", color: "primary" },
        { value: "aguardando", label: "Aguardando Retorno", color: "secondary" },
        { value: "resolvido", label: "Resolvido", color: "success" },
        { value: "cancelado", label: "Cancelado", color: "danger" }
    ],

    // Form validation rules
    validation: {
        cpf: {
            required: true,
            pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            required: true,
            pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/
        }
    },

    // UI settings
    ui: {
        itemsPerPage: 20,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedFileTypes: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm"
    },

    // Application metadata
    app: {
        name: "Balcão da Cidadania",
        version: "1.0.0",
        description: "Sistema de Gestão de Atendimento ao Cidadão",
        organization: "Arimateia"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
