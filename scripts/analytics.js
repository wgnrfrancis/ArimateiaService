// Analytics module for Arimateia Service Dashboard
class AnalyticsManager {
    constructor() {
        this.currentPeriod = 7; // dias
        this.charts = {};
        this.data = {
            chamados: [],
            usuarios: [],
            observacoes: []
        };
        this.colors = {
            primary: '#00c6ff',
            secondary: '#00bfff',
            success: '#4CAF50',
            warning: '#FF9800',
            danger: '#f44336',
            info: '#2196F3',
            gradient: ['#00c6ff', '#00bfff', '#0099cc', '#007acc', '#005999']
        };
    }

    // Initialize analytics dashboard
    async init() {
        try {
            Helpers.showLoading('Carregando analytics...');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load data
            await this.loadData();
            
            // Initialize charts
            this.initializeCharts();
            
            // Update KPIs
            this.updateKPIs();
            
            // Update top performers
            this.updateTopPerformers();
            
            // Generate insights
            this.generateInsights();
            
            Helpers.hideLoading();
            Helpers.showToast('Analytics carregado com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao inicializar analytics:', error);
            Helpers.hideLoading();
            Helpers.showToast('Erro ao carregar analytics', 'error');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Period selector buttons
        document.querySelectorAll('.btn-period').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-period').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = parseInt(e.target.dataset.period);
                this.refreshAnalytics();
            });
        });

        // Chart controls
        document.getElementById('chartPeriodType')?.addEventListener('change', () => {
            this.updateChamadosPeriodoChart();
        });

        document.getElementById('performanceMetric')?.addEventListener('change', () => {
            this.updateVoluntariosChart();
        });
    }

    // Load data from Google Apps Script
    async loadData() {
        try {
            // Load real data from Google Apps Script
            const chamadosResponse = await flowManager.getTickets({ period: this.currentPeriod });
            const usuariosResponse = await flowManager.getUsers();
            
            this.data = {
                chamados: chamadosResponse.success ? chamadosResponse.data : [],
                usuarios: usuariosResponse.success ? usuariosResponse.data : [],
                observacoes: []
            };
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.data = {
                chamados: [],
                usuarios: [],
                observacoes: []
            };
            throw error;
        }
    }

    // Initialize all charts
    initializeCharts() {
        this.initChamadosPeriodoChart();
        this.initStatusChamadosChart();
        this.initChamadosRegiaoChart();
        this.initCategoriasChart();
        this.initVoluntariosChart();
        this.initHeatmapChart();
    }

    // Chart: Chamados por Período
    initChamadosPeriodoChart() {
        const ctx = document.getElementById('chartChamadosPeriodo').getContext('2d');
        const data = this.getChamadosPeriodoData();
        
        this.charts.chamadosPeriodo = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Chamados Criados',
                    data: data.created,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Chamados Resolvidos',
                    data: data.resolved,
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.success + '20',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    },
                    y: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    }
                }
            }
        });
    }

    // Chart: Status dos Chamados
    initStatusChamadosChart() {
        const ctx = document.getElementById('chartStatusChamados').getContext('2d');
        const data = this.getStatusData();
        
        this.charts.statusChamados = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        this.colors.warning,  // Aberto
                        this.colors.info,     // Em Andamento
                        this.colors.success,  // Resolvido
                        this.colors.danger    // Cancelado
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#ffffff' }
                    }
                }
            }
        });
    }

    // Chart: Chamados por Região
    initChamadosRegiaoChart() {
        const ctx = document.getElementById('chartChamadosRegiao').getContext('2d');
        const data = this.getRegiaoData();
        
        this.charts.chamadosRegiao = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Chamados por Região',
                    data: data.values,
                    backgroundColor: this.colors.gradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    },
                    y: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    }
                }
            }
        });
    }

    // Chart: Categorias Mais Demandadas
    initCategoriasChart() {
        const ctx = document.getElementById('chartCategorias').getContext('2d');
        const data = this.getCategoriasData();
        
        this.charts.categorias = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Número de Chamados',
                    data: data.values,
                    backgroundColor: this.colors.gradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    },
                    y: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    }
                }
            }
        });
    }

    // Chart: Performance dos Voluntários
    initVoluntariosChart() {
        const ctx = document.getElementById('chartVoluntarios').getContext('2d');
        const data = this.getVoluntariosData();
        
        this.charts.voluntarios = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Chamados Atendidos',
                    data: data.values,
                    backgroundColor: this.colors.primary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    },
                    y: { 
                        ticks: { color: '#ffffff' },
                        grid: { color: '#ffffff20' }
                    }
                }
            }
        });
    }

    // Chart: Heatmap de Atendimentos
    initHeatmapChart() {
        const container = document.getElementById('heatmapContainer');
        const heatmapData = this.getHeatmapData();
        
        // Create custom heatmap visualization
        container.innerHTML = this.generateHeatmapHTML(heatmapData);
    }

    // Update KPIs
    updateKPIs() {
        const kpis = this.calculateKPIs();
        
        document.getElementById('totalChamados').textContent = kpis.totalChamados;
        document.getElementById('taxaResolucao').textContent = kpis.taxaResolucao + '%';
        document.getElementById('tempoMedio').textContent = kpis.tempoMedio;
        document.getElementById('voluntariosAtivos').textContent = kpis.voluntariosAtivos;
        document.getElementById('satisfacaoMedia').textContent = kpis.satisfacaoMedia;
        document.getElementById('igrejasAtivas').textContent = kpis.igrejasAtivas;

        // Update trends
        document.getElementById('trendChamados').textContent = kpis.trends.chamados;
        document.getElementById('trendResolucao').textContent = kpis.trends.resolucao;
        document.getElementById('trendTempo').textContent = kpis.trends.tempo;
        document.getElementById('trendVoluntarios').textContent = kpis.trends.voluntarios;
        document.getElementById('trendSatisfacao').textContent = kpis.trends.satisfacao;
        document.getElementById('trendIgrejas').textContent = kpis.trends.igrejas;
    }

    // Update top performers
    updateTopPerformers() {
        const topVoluntarios = this.getTopVoluntarios();
        const topIgrejas = this.getTopIgrejas();
        const topCategorias = this.getTopCategorias();

        document.getElementById('topVoluntarios').innerHTML = this.generatePerformersHTML(topVoluntarios);
        document.getElementById('topIgrejas').innerHTML = this.generatePerformersHTML(topIgrejas);
        document.getElementById('topCategorias').innerHTML = this.generatePerformersHTML(topCategorias);
    }

    // Generate automatic insights
    generateInsights() {
        const insights = this.calculateInsights();
        const container = document.getElementById('insightsContainer');
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                    <span class="insight-value">${insight.value}</span>
                </div>
            </div>
        `).join('');
    }

    // Calculate KPIs
    calculateKPIs() {
        const chamados = this.data.chamados;
        const usuarios = this.data.usuarios;
        
        const totalChamados = chamados.length;
        const chamadosResolvidos = chamados.filter(c => c.status === 'Resolvido').length;
        const taxaResolucao = totalChamados > 0 ? Math.round((chamadosResolvidos / totalChamados) * 100) : 0;
        
        const temposResolucao = chamados
            .filter(c => c.status === 'Resolvido' && c.tempoResolucao)
            .map(c => c.tempoResolucao);
        const tempoMedio = temposResolucao.length > 0 
            ? Math.round(temposResolucao.reduce((a, b) => a + b, 0) / temposResolucao.length)
            : 0;
        
        const voluntariosAtivos = usuarios.filter(u => u.status === 'Ativo').length;
        const satisfacaoMedia = this.calculateSatisfacaoMedia(chamados);
        const igrejasAtivas = [...new Set(chamados.map(c => c.igreja))].length;

        return {
            totalChamados,
            taxaResolucao,
            tempoMedio,
            voluntariosAtivos,
            satisfacaoMedia,
            igrejasAtivas,
            trends: {
                chamados: '+12%',
                resolucao: '+5%',
                tempo: '-8%',
                voluntarios: '+2',
                satisfacao: '+0.3',
                igrejas: '+1'
            }
        };
    }

    // Get data for charts
    getChamadosPeriodoData() {
        // Calculate real data from chamados
        const chamados = this.data.chamados;
        const monthlyData = this.groupChamadosByMonth(chamados);
        
        // Group by created and resolved
        const monthlyCreated = {};
        const monthlyResolved = {};
        
        chamados.forEach(chamado => {
            const createdDate = new Date(chamado.dataAbertura);
            const createdKey = createdDate.toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'short' 
            });
            monthlyCreated[createdKey] = (monthlyCreated[createdKey] || 0) + 1;
            
            if (chamado.status === 'resolvido' && chamado.dataResolucao) {
                const resolvedDate = new Date(chamado.dataResolucao);
                const resolvedKey = resolvedDate.toLocaleDateString('pt-BR', { 
                    year: 'numeric', 
                    month: 'short' 
                });
                monthlyResolved[resolvedKey] = (monthlyResolved[resolvedKey] || 0) + 1;
            }
        });
        
        const labels = Object.keys(monthlyCreated);
        
        return {
            labels: labels,
            created: labels.map(label => monthlyCreated[label] || 0),
            resolved: labels.map(label => monthlyResolved[label] || 0)
        };
    }

    getStatusData() {
        const statusCount = {};
        this.data.chamados.forEach(chamado => {
            statusCount[chamado.status] = (statusCount[chamado.status] || 0) + 1;
        });
        
        return {
            labels: Object.keys(statusCount),
            values: Object.values(statusCount)
        };
    }

    getRegiaoData() {
        const regiaoCount = {};
        this.data.chamados.forEach(chamado => {
            regiaoCount[chamado.regiao] = (regiaoCount[chamado.regiao] || 0) + 1;
        });
        
        return {
            labels: Object.keys(regiaoCount),
            values: Object.values(regiaoCount)
        };
    }

    getCategoriasData() {
        const categoriaCount = {};
        this.data.chamados.forEach(chamado => {
            categoriaCount[chamado.categoria] = (categoriaCount[chamado.categoria] || 0) + 1;
        });
        
        return {
            labels: Object.keys(categoriaCount),
            values: Object.values(categoriaCount)
        };
    }

    getVoluntariosData() {
        const voluntarioCount = {};
        this.data.chamados.forEach(chamado => {
            voluntarioCount[chamado.criadoPor] = (voluntarioCount[chamado.criadoPor] || 0) + 1;
        });
        
        return {
            labels: Object.keys(voluntarioCount),
            values: Object.values(voluntarioCount)
        };
    }

    getHeatmapData() {
        // Generate mock heatmap data
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const hours = Array.from({length: 24}, (_, i) => i);
        
        return days.map(day => 
            hours.map(hour => ({
                day,
                hour,
                value: Math.floor(Math.random() * 10)
            }))
        ).flat();
    }

    // Generate HTML for performers
    generatePerformersHTML(performers) {
        return performers.map((performer, index) => `
            <div class="performer-item">
                <div class="performer-rank">${index + 1}</div>
                <div class="performer-info">
                    <span class="performer-name">${performer.name}</span>
                    <span class="performer-value">${performer.value}</span>
                </div>
                <div class="performer-badge ${performer.trend}">
                    ${performer.trend === 'up' ? '↗️' : performer.trend === 'down' ? '↘️' : '➡️'}
                </div>
            </div>
        `).join('');
    }

    // Generate heatmap HTML
    generateHeatmapHTML(data) {
        const maxValue = Math.max(...data.map(d => d.value));
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const hours = Array.from({length: 24}, (_, i) => i);
        
        let html = '<div class="heatmap-grid">';
        
        // Header with hours
        html += '<div class="heatmap-header">';
        html += '<div class="heatmap-cell"></div>'; // Empty corner
        hours.forEach(hour => {
            html += `<div class="heatmap-cell heatmap-hour">${hour}h</div>`;
        });
        html += '</div>';
        
        // Rows with days
        days.forEach(day => {
            html += '<div class="heatmap-row">';
            html += `<div class="heatmap-cell heatmap-day">${day}</div>`;
            
            hours.forEach(hour => {
                const dataPoint = data.find(d => d.day === day && d.hour === hour);
                const intensity = dataPoint ? dataPoint.value / maxValue : 0;
                const opacity = Math.max(0.1, intensity);
                
                html += `<div class="heatmap-cell heatmap-data" 
                    style="background-color: ${this.colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}"
                    title="${day} ${hour}h: ${dataPoint ? dataPoint.value : 0} chamados">
                </div>`;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }

    // Get top performers
    getTopVoluntarios() {
        const usuarios = this.data.usuarios || [];
        const chamados = this.data.chamados || [];
        
        // Calculate real stats from data
        const voluntarioStats = usuarios.map(usuario => {
            const userTickets = chamados.filter(c => c.criadoPor === usuario.name || c.responsavel === usuario.name);
            return {
                name: usuario.name,
                value: `${userTickets.length} chamados`,
                trend: 'stable' // Could be calculated based on historical data
            };
        });
        
        return voluntarioStats
            .sort((a, b) => parseInt(b.value) - parseInt(a.value))
            .slice(0, 5);
    }

    getTopIgrejas() {
        const chamados = this.data.chamados || [];
        
        // Group tickets by church
        const igrejaStats = {};
        chamados.forEach(chamado => {
            if (chamado.igreja) {
                igrejaStats[chamado.igreja] = (igrejaStats[chamado.igreja] || 0) + 1;
            }
        });
        
        return Object.entries(igrejaStats)
            .map(([igreja, count]) => ({
                name: igreja,
                value: `${count} chamados`,
                trend: 'stable'
            }))
            .sort((a, b) => parseInt(b.value) - parseInt(a.value))
            .slice(0, 5);
    }

    getTopCategorias() {
        const chamados = this.data.chamados || [];
        
        // Group tickets by category
        const categoriaStats = {};
        chamados.forEach(chamado => {
            if (chamado.categoria) {
                categoriaStats[chamado.categoria] = (categoriaStats[chamado.categoria] || 0) + 1;
            }
        });
        
        return Object.entries(categoriaStats)
            .map(([categoria, count]) => ({
                name: categoria,
                value: `${count} chamados`,
                trend: 'stable'
            }))
            .sort((a, b) => parseInt(b.value) - parseInt(a.value))
            .slice(0, 5);
    }

    // Calculate insights
    calculateInsights() {
        return [
            {
                type: 'success',
                icon: '📈',
                title: 'Crescimento Positivo',
                description: 'Aumento de 12% nos chamados este mês',
                value: '+12%'
            },
            {
                type: 'warning',
                icon: '⏰',
                title: 'Pico de Demanda',
                description: 'Terças-feiras têm 30% mais chamados',
                value: '30%'
            },
            {
                type: 'info',
                icon: '🎯',
                title: 'Meta Atingida',
                description: 'Taxa de resolução acima da meta',
                value: '85%'
            },
            {
                type: 'success',
                icon: '⭐',
                title: 'Alta Satisfação',
                description: 'Satisfação média dos cidadãos',
                value: '4.2/5'
            }
        ];
    }

    // Refresh analytics
    async refreshAnalytics() {
        try {
            Helpers.showLoading('Atualizando analytics...');
            
            await this.loadData();
            
            // Update all charts
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
            
            this.initializeCharts();
            this.updateKPIs();
            this.updateTopPerformers();
            this.generateInsights();
            
            Helpers.hideLoading();
            Helpers.showToast('Analytics atualizado!', 'success');
            
        } catch (error) {
            console.error('Erro ao atualizar analytics:', error);
            Helpers.hideLoading();
            Helpers.showToast('Erro ao atualizar analytics', 'error');
        }
    }

    // Export report
    async exportReport() {
        try {
            Helpers.showLoading('Gerando relatório...');
            
            const reportData = {
                period: this.currentPeriod,
                kpis: this.calculateKPIs(),
                timestamp: new Date().toISOString(),
                user: auth.getCurrentUser()
            };
            
            // Generate CSV content
            const csvContent = this.generateCSVReport(reportData);
            
            // Download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `relatorio_analytics_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            Helpers.hideLoading();
            Helpers.showToast('Relatório exportado com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            Helpers.hideLoading();
            Helpers.showToast('Erro ao exportar relatório', 'error');
        }
    }

    // Generate CSV report
    generateCSVReport(data) {
        let csv = 'RELATÓRIO DE ANALYTICS - ARIMATEIA SERVICE\n\n';
        csv += `Período: ${data.period} dias\n`;
        csv += `Gerado em: ${new Date(data.timestamp).toLocaleString('pt-BR')}\n`;
        csv += `Usuário: ${data.user.name}\n\n`;
        
        csv += 'INDICADORES PRINCIPAIS\n';
        csv += 'Métrica,Valor,Tendência\n';
        csv += `Total de Chamados,${data.kpis.totalChamados},${data.kpis.trends.chamados}\n`;
        csv += `Taxa de Resolução,${data.kpis.taxaResolucao}%,${data.kpis.trends.resolucao}\n`;
        csv += `Tempo Médio,${data.kpis.tempoMedio} dias,${data.kpis.trends.tempo}\n`;
        csv += `Voluntários Ativos,${data.kpis.voluntariosAtivos},${data.kpis.trends.voluntarios}\n`;
        csv += `Satisfação Média,${data.kpis.satisfacaoMedia}/5,${data.kpis.trends.satisfacao}\n`;
        csv += `Igrejas Ativas,${data.kpis.igrejasAtivas},${data.kpis.trends.igrejas}\n`;
        
        return csv;
    }

    // Helper functions for data processing
    calculateSatisfacaoMedia(chamados) {
        const satisfacoes = chamados
            .filter(c => c.satisfacao && c.satisfacao > 0)
            .map(c => c.satisfacao);
        
        if (satisfacoes.length === 0) return 0;
        
        const soma = satisfacoes.reduce((acc, val) => acc + val, 0);
        return Math.round((soma / satisfacoes.length) * 10) / 10;
    }

    groupChamadosByMonth(chamados) {
        const monthlyData = {};
        
        chamados.forEach(chamado => {
            const date = new Date(chamado.dataAbertura);
            const monthKey = date.toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'short' 
            });
            
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
        });
        
        return monthlyData;
    }
}

// Initialize analytics manager
const analytics = new AnalyticsManager();
