// Helper utilities for Balcão da Cidadania
// Version: 1.0.0
// Dependencies: CONFIG object

'use strict';

/**
 * Classe utilitária com funções helper para o sistema
 * Contém métodos para formatação, validação, UI e manipulação de dados
 */
class Helpers {
    /**
     * Formatar data para o padrão brasileiro
     * @param {Date|string} date - Data a ser formatada
     * @param {boolean} includeTime - Incluir horário na formatação
     * @returns {string} Data formatada (dd/mm/aaaa ou dd/mm/aaaa hh:mm)
     */
    static formatDate(date, includeTime = false) {
        if (!date) return '';
        
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';
            
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            
            let formatted = `${day}/${month}/${year}`;
            
            if (includeTime) {
                const hours = d.getHours().toString().padStart(2, '0');
                const minutes = d.getMinutes().toString().padStart(2, '0');
                formatted += ` ${hours}:${minutes}`;
            }
            
            return formatted;
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return '';
        }
    }

    /**
     * Formatar CPF para o padrão brasileiro
     * @param {string} cpf - CPF para formatação
     * @returns {string} CPF formatado (000.000.000-00)
     */
    static formatCPF(cpf) {
        if (!cpf) return '';
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    /**
     * Formatar telefone para o padrão brasileiro
     * @param {string} phone - Telefone para formatação
     * @returns {string} Telefone formatado ((00) 00000-0000 ou (00) 0000-0000)
     */
    static formatPhone(phone) {
        if (!phone) return '';
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 11) {
            return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleanPhone.length === 10) {
            return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }

    /**
     * Validar CPF usando algoritmo oficial
     * @param {string} cpf - CPF para validação
     * @returns {boolean} True se CPF for válido
     */
    static validateCPF(cpf) {
        if (!cpf) return false;
        
        const cleanCPF = cpf.replace(/\D/g, '');
        
        if (cleanCPF.length !== 11) return false;
        
        // Check for repeated digits
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
        
        // Validate check digits
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
        }
        let digit1 = 11 - (sum % 11);
        if (digit1 > 9) digit1 = 0;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
        }
        let digit2 = 11 - (sum % 11);
        if (digit2 > 9) digit2 = 0;
        
        return (parseInt(cleanCPF.charAt(9)) === digit1 && parseInt(cleanCPF.charAt(10)) === digit2);
    }

    /**
     * Validar email usando regex do CONFIG
     * @param {string} email - Email para validação
     * @returns {boolean} True se email for válido
     */
    static validateEmail(email) {
        if (!email) return false;
        
        try {
            // Usar o padrão do CONFIG.VALIDATION
            const emailPattern = window.CONFIG?.VALIDATION?.EMAIL?.pattern || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        } catch (error) {
            console.warn('Erro na validação de email:', error);
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }

    /**
     * Validar telefone brasileiro
     * @param {string} phone - Telefone para validação
     * @returns {boolean} True se telefone for válido
     */
    static validatePhone(phone) {
        if (!phone) return false;
        
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    /**
     * Gerar ID único
     * @returns {string} ID único baseado em timestamp + random
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Sanitizar HTML para prevenir XSS
     * @param {string} str - String a ser sanitizada
     * @returns {string} String segura
     */
    static sanitizeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Mostrar notificação toast
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo do toast (info, success, warning, error)
     * @param {number} duration - Duração em milliseconds
     */
    static showToast(message, type = 'info', duration = 5000) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${this.sanitizeHTML(message)}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()" aria-label="Fechar notificação">×</button>
            </div>
        `;

        // Add toast styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    min-width: 300px;
                    max-width: 500px;
                    padding: 1rem;
                    border-radius: 6px;
                    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
                    z-index: 9999;
                    animation: slideIn 0.3s ease-out;
                }
                .toast-info { background: #3b82f6; color: white; }
                .toast-success { background: #10b981; color: white; }
                .toast-warning { background: #f59e0b; color: white; }
                .toast-error { background: #ef4444; color: white; }
                .toast-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }

    /**
     * Mostrar spinner de loading
     * @param {string} message - Mensagem a ser exibida
     */
    static showLoading(message = 'Carregando...') {
        const existing = document.querySelector('#loading-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">${this.sanitizeHTML(message)}</div>
            </div>
        `;

        // Add loading styles if not already present
        if (!document.querySelector('#loading-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loading-styles';
            styles.textContent = `
                #loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                .loading-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: var(--shadow-lg);
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                .loading-message {
                    color: var(--text-dark);
                    font-weight: 500;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(overlay);
    }

    /**
     * Esconder spinner de loading
     */
    static hideLoading() {
        const overlay = document.querySelector('#loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Mostrar diálogo de confirmação
     * @param {string} message - Mensagem de confirmação
     * @param {string} title - Título do modal
     * @returns {Promise<boolean>} Promise que resolve com true/false
     */
    static confirm(message, title = 'Confirmação') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${this.sanitizeHTML(title)}</h3>
                    </div>
                    <div class="modal-body">
                        <p>${this.sanitizeHTML(message)}</p>
                    </div>
                    <div class="modal-footer" style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button class="btn btn-outline" onclick="resolveConfirm(false)">Cancelar</button>
                        <button class="btn btn-primary" onclick="resolveConfirm(true)">Confirmar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            window.resolveConfirm = (result) => {
                modal.remove();
                delete window.resolveConfirm;
                resolve(result);
            };
        });
    }

    /**
     * Função de debounce para otimizar performance
     * @param {Function} func - Função a ser executada
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function} Função com debounce
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Filtrar array de objetos
     * @param {Array} data - Array de dados
     * @param {Object} filters - Filtros a aplicar
     * @returns {Array} Array filtrado
     */
    static filterData(data, filters) {
        if (!Array.isArray(data)) return [];
        
        return data.filter(item => {
            return Object.keys(filters).every(key => {
                const filterValue = filters[key];
                if (!filterValue || filterValue === '') return true;
                
                const itemValue = item[key];
                if (typeof itemValue === 'string') {
                    return itemValue.toLowerCase().includes(filterValue.toLowerCase());
                }
                return itemValue === filterValue;
            });
        });
    }

    /**
     * Ordenar array de objetos
     * @param {Array} data - Array de dados
     * @param {string} sortBy - Campo para ordenação
     * @param {string} sortOrder - Ordem (asc/desc)
     * @returns {Array} Array ordenado
     */
    static sortData(data, sortBy, sortOrder = 'asc') {
        if (!Array.isArray(data)) return [];
        
        return [...data].sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            // Handle null/undefined values
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return sortOrder === 'desc' ? 1 : -1;
            if (bVal == null) return sortOrder === 'desc' ? -1 : 1;

            // Handle dates
            if (aVal instanceof Date || (typeof aVal === 'string' && !isNaN(Date.parse(aVal)))) {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            // Handle strings
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortOrder === 'desc') {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            } else {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            }
        });
    }

    /**
     * Paginar dados
     * @param {Array} data - Array de dados
     * @param {number} page - Página atual
     * @param {number} itemsPerPage - Itens por página
     * @returns {Object} Objeto com dados paginados
     */
    static paginateData(data, page = 1, itemsPerPage = null) {
        if (!Array.isArray(data)) return { data: [], currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 0 };
        
        const perPage = itemsPerPage || window.CONFIG?.ui?.itemsPerPage || 20;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        
        return {
            data: data.slice(startIndex, endIndex),
            currentPage: page,
            totalPages: Math.ceil(data.length / perPage),
            totalItems: data.length,
            itemsPerPage: perPage
        };
    }

    /**
     * Exportar dados para CSV
     * @param {Array} data - Array de dados
     * @param {string} filename - Nome do arquivo
     */
    static exportToCSV(data, filename = 'export.csv') {
        if (!Array.isArray(data) || !data.length) {
            console.warn('Dados inválidos para exportação CSV');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Limpeza de memória
        }
    }

    /**
     * Obter badge de status
     * @param {string} status - Status para renderizar
     * @returns {string} HTML do badge
     */
    static getStatusBadge(status) {
        try {
            const statusConfig = window.CONFIG?.statuses?.[status];
            if (!statusConfig) {
                return `<span class="status-badge">${this.sanitizeHTML(status)}</span>`;
            }
            
            return `<span class="status-badge" style="color: ${statusConfig.color}; background-color: ${statusConfig.bgColor}">${this.sanitizeHTML(statusConfig.name)}</span>`;
        } catch (error) {
            console.warn('Erro ao obter badge de status:', error);
            return `<span class="status-badge">${this.sanitizeHTML(status)}</span>`;
        }
    }

    /**
     * Configurar validação de formulário
     * @param {HTMLFormElement} form - Formulário para configurar validação
     */
    static setupFormValidation(form) {
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Trigger custom form submit event
                form.dispatchEvent(new CustomEvent('validSubmit', { detail: data }));
            }
        });
    }

    /**
     * Validar campo individual
     * @param {HTMLElement} field - Campo para validar
     * @returns {boolean} True se válido
     */
    static validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        this.clearFieldError(field);

        // Required validation
        if (required && !value) {
            this.showFieldError(field, 'Este campo é obrigatório');
            return false;
        }

        if (!value) return true; // Skip other validations if field is empty and not required

        // Type-specific validations
        switch (type) {
            case 'email':
                if (!this.validateEmail(value)) {
                    this.showFieldError(field, 'Email inválido');
                    return false;
                }
                break;
            case 'tel':
                if (!this.validatePhone(value)) {
                    this.showFieldError(field, 'Telefone inválido');
                    return false;
                }
                break;
        }

        // Custom validations based on data attributes
        if (field.dataset.validation === 'cpf' && !this.validateCPF(value)) {
            this.showFieldError(field, 'CPF inválido');
            return false;
        }

        return true;
    }

    /**
     * Mostrar erro no campo
     * @param {HTMLElement} field - Campo com erro
     * @param {string} message - Mensagem de erro
     */
    static showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;

        // Add error styles if not present
        if (!document.querySelector('#validation-styles')) {
            const styles = document.createElement('style');
            styles.id = 'validation-styles';
            styles.textContent = `
                .form-input.error,
                .form-select.error,
                .form-textarea.error {
                    border-color: var(--danger-color);
                    box-shadow: 0 0 0 3px rgb(220 38 38 / 0.1);
                }
                .field-error {
                    color: var(--danger-color);
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    /**
     * Limpar erro do campo
     * @param {HTMLElement} field - Campo para limpar erro
     */
    static clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Formatar moeda brasileira
     * @param {number} value - Valor para formatação
     * @returns {string} Valor formatado em R$
     */
    static formatCurrency(value) {
        if (isNaN(value)) return 'R$ 0,00';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    /**
     * Calcular diferença de tempo legível
     * @param {Date|string} date - Data para calcular diferença
     * @returns {string} Diferença de tempo em formato legível
     */
    static timeAgo(date) {
        if (!date) return '';
        
        try {
            const now = new Date();
            const past = new Date(date);
            const diffInSeconds = Math.floor((now - past) / 1000);

            if (diffInSeconds < 60) return 'agora mesmo';
            
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
            
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `${diffInHours}h atrás`;
            
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 30) return `${diffInDays} dias atrás`;
            
            const diffInMonths = Math.floor(diffInDays / 30);
            if (diffInMonths < 12) return `${diffInMonths} meses atrás`;
            
            const diffInYears = Math.floor(diffInMonths / 12);
            return `${diffInYears} anos atrás`;
        } catch (error) {
            console.error('Erro ao calcular tempo:', error);
            return '';
        }
    }
}

// Tornar Helpers disponível globalmente
window.Helpers = Helpers;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Helpers;
}

console.log('✅ Helpers.js carregado com sucesso');
