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

    // Load data from Google Sheets
    async loadData() {
        try {
            // Simulate loading data (replace with actual API calls)
            this.data = {
                chamados: this.generateMockChamados(),
                usuarios: this.generateMockUsuarios(),
                observacoes: this.generateMockObservacoes()
            };
            
            // In production, use:
            // const chamadosResponse = await flow.getTickets({ period: this.currentPeriod });
            // const usuariosResponse = await flow.getUsers();
            // this.data.chamados = chamadosResponse.data.tickets || [];
            // this.data.usuarios = usuariosResponse.data.users || [];
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
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
        const satisfacaoMedia = 4.2; // Mock data
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
        // Mock data - replace with real calculations
        return {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            created: [12, 19, 15, 25, 22, 30],
            resolved: [10, 16, 13, 22, 20, 28]
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
        return [
            { name: 'Maria Silva', value: '45 chamados', trend: 'up' },
            { name: 'João Santos', value: '38 chamados', trend: 'up' },
            { name: 'Ana Costa', value: '32 chamados', trend: 'stable' },
            { name: 'Pedro Oliveira', value: '28 chamados', trend: 'down' },
            { name: 'Lucia Ferreira', value: '25 chamados', trend: 'up' }
        ];
    }

    getTopIgrejas() {
        return [
            { name: 'Igreja Central', value: '120 chamados', trend: 'up' },
            { name: 'Igreja do Bairro Alto', value: '95 chamados', trend: 'up' },
            { name: 'Igreja da Vila Nova', value: '78 chamados', trend: 'stable' },
            { name: 'Igreja do Centro', value: '65 chamados', trend: 'down' },
            { name: 'Igreja da Periferia', value: '52 chamados', trend: 'up' }
        ];
    }

    getTopCategorias() {
        return [
            { name: 'Documentação', value: '156 chamados', trend: 'up' },
            { name: 'Benefícios Sociais', value: '134 chamados', trend: 'up' },
            { name: 'Jurídico', value: '89 chamados', trend: 'stable' },
            { name: 'Saúde', value: '67 chamados', trend: 'down' },
            { name: 'Educação', value: '45 chamados', trend: 'up' }
        ];
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

    // Generate mock data for development
    generateMockChamados() {
        const statuses = ['Aberto', 'Em Andamento', 'Resolvido', 'Cancelado'];
        const regioes = ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'];
        const igrejas = ['Igreja Central', 'Igreja do Bairro Alto', 'Igreja da Vila Nova', 'Igreja do Centro'];
        const categorias = ['Documentação', 'Benefícios Sociais', 'Jurídico', 'Saúde', 'Educação'];
        const voluntarios = ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira', 'Lucia Ferreira'];
        
        return Array.from({length: 100}, (_, i) => ({
            id: `CH${String(i + 1).padStart(3, '0')}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            regiao: regioes[Math.floor(Math.random() * regioes.length)],
            igreja: igrejas[Math.floor(Math.random() * igrejas.length)],
            categoria: categorias[Math.floor(Math.random() * categorias.length)],
            criadoPor: voluntarios[Math.floor(Math.random() * voluntarios.length)],
            tempoResolucao: Math.floor(Math.random() * 10) + 1,
            dataAbertura: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }));
    }

    generateMockUsuarios() {
        return [
            { id: 'USR001', name: 'Maria Silva', status: 'Ativo', role: 'VOLUNTARIO' },
            { id: 'USR002', name: 'João Santos', status: 'Ativo', role: 'VOLUNTARIO' },
            { id: 'USR003', name: 'Ana Costa', status: 'Ativo', role: 'SECRETARIA' },
            { id: 'USR004', name: 'Pedro Oliveira', status: 'Ativo', role: 'COORDENADOR' },
            { id: 'USR005', name: 'Lucia Ferreira', status: 'Ativo', role: 'VOLUNTARIO' }
        ];
    }

    generateMockObservacoes() {
        return [];
    }
}

// Initialize analytics manager
const analytics = new AnalyticsManager();
