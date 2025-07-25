// Helper utilities for Balcão da Cidadania
class Helpers {
    // Format date to Brazilian format
    static formatDate(date, includeTime = false) {
        if (!date) return '';
        
        const d = new Date(date);
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
    }

    // Format CPF
    static formatCPF(cpf) {
        if (!cpf) return '';
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Format phone number
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

    // Validate CPF
    static validateCPF(cpf) {
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

    // Validate email
    static validateEmail(email) {
        return CONFIG.validation.email.pattern.test(email);
    }

    // Validate phone
    static validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    // Generate unique ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Sanitize HTML to prevent XSS
    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Show toast notification
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
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
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
                    box-shadow: var(--shadow-lg);
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

    // Show loading spinner
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

    // Hide loading spinner
    static hideLoading() {
        const overlay = document.querySelector('#loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Confirm dialog
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

    // Debounce function
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

    // Filter array of objects
    static filterData(data, filters) {
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

    // Sort array of objects
    static sortData(data, sortBy, sortOrder = 'asc') {
        return [...data].sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

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

    // Paginate data
    static paginateData(data, page = 1, itemsPerPage = CONFIG.ui.itemsPerPage) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return {
            data: data.slice(startIndex, endIndex),
            currentPage: page,
            totalPages: Math.ceil(data.length / itemsPerPage),
            totalItems: data.length,
            itemsPerPage: itemsPerPage
        };
    }

    // Export data to CSV
    static exportToCSV(data, filename = 'export.csv') {
        if (!data.length) return;

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
        }
    }

    // Get status badge HTML
    static getStatusBadge(status) {
        const statusConfig = CONFIG.ticketStatus.find(s => s.value === status);
        if (!statusConfig) return `<span class="status-badge">${status}</span>`;
        
        return `<span class="status-badge status-${statusConfig.color}">${statusConfig.label}</span>`;
    }

    // Setup form validation
    static setupFormValidation(form) {
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

    // Validate individual field
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

    // Show field error
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

    // Clear field error
    static clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Helpers;
}
