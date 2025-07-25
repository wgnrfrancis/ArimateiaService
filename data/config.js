// Configuration file for Balcão da Cidadania application
const CONFIG = {
    // Authentication settings
    auth: {
        defaultPassword: "Arimateia1",
        sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    },

    // Google Apps Script integration
    googleAppsScript: {
        // URL real do Google Apps Script Web App implantado
        webAppUrl: "https://script.google.com/macros/s/AKfycbwt1Phi-BhEe-F6K5qv7fzMd2MJ-ctEhTrI0cRCRad-c4_Mr6y3LuOvktvQG31G3pKj/exec",
        // Spreadsheet ID (extraído da URL fornecida)
        spreadsheetId: "1awSUcZPlvM0Ci5ecKWCG4uwDbR3ZT5ZeDOuVdOIGMuc",
        endpoints: {
            newTicket: "?action=newTicket",
            updateTicket: "?action=updateTicket",
            deleteTicket: "?action=deleteTicket",
            newUser: "?action=newUser",
            validateUser: "?action=validateUser",
            getTickets: "?action=getTickets",
            getUsers: "?action=getUsers",
            generateReport: "?action=generateReport"
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
        "Norte",
        "Sul", 
        "Leste",
        "Oeste",
        "Centro",
        "Grande ABC",
        "Interior"
    ],

    // Churches list (can be expanded)
    churches: [
        "Igreja Central",
        "Igreja do Bairro Alto",
        "Igreja da Vila Nova",
        "Igreja do Centro",
        "Igreja São João",
        "Igreja Santa Maria",
        "Igreja do Jardim",
        "Igreja da Paz",
        "Igreja Esperança",
        "Igreja Vida Nova"
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
