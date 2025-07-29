# 📊 Sistema de Relatórios Avançados - Balcão da Cidadania

## ✅ **Implementações Realizadas**

### 🔄 **Nova Aba RELATORIOS_MENSAIS**
- **19 colunas** com dados abrangentes por região/igreja
- **Análise de metas** automática (1% voluntários + 1 coordenador por igreja)
- **Destaque Título de Eleitor** como demanda prioritária
- **Dados proporcionais** baseados na aba IGREJAS_REGIOES

### 🏛️ **Estrutura de Dados Implementada**
- **56 igrejas** organizadas em **9 regiões** específicas
- **Auto-cálculo de metas**: 1% dos membros como voluntários
- **Coordenação obrigatória**: 1 coordenador por igreja
- **Proporções dinâmicas**: Dados puxados de OBREIROS + VOLUNTARIOS_DOS_GRUPOS + MEMBROS_DOMINGO

### 📈 **Google Apps Script - Função `generateAdvancedReport()`**

#### **Tipos de Relatório:**
1. **GERAL (BLOCO)**: Consolidado de todas as regiões
2. **REGIAO**: Dados específicos de uma região
3. **IGREJA**: Análise detalhada de igreja individual

#### **Análises Automáticas:**
- ✅ **Meta de Voluntários**: 1% do total de membros
- ✅ **Meta de Coordenadores**: 1 coordenador por igreja  
- ✅ **Status das Metas**: ATINGIDA, ABAIXO, ACIMA
- ✅ **Destaque Título de Eleitor**: Prioridade ALTA automática
- ✅ **Taxa de Resolução**: Proporção de chamados resolvidos
- ✅ **Dados Atuais**: Sempre com informações em tempo real

### 📊 **Interface Web - relatorios.html**
- **Filtros dinâmicos**: Por tipo (Geral/Região/Igreja)
- **Cards de resumo**: Métricas principais destacadas
- **Tabela detalhada**: Análise por linha de região/igreja
- **Exportação**: Dados em formato JSON
- **Responsivo**: Funciona em desktop e mobile

### 🎯 **Destaques do Sistema**

#### **Análise de Título de Eleitor:**
- Demanda **prioritária** com prioridade ALTA automática
- Rastreamento de **porcentagem** sobre total de chamados
- **Meta implícita**: Maior demanda do sistema
- Análise de **eficiência** na resolução

#### **Gestão de Metas por Igreja:**
```
IGREJA EXEMPLO:
- Total Membros: 190 (Obreiros: 15 + Vol.Grupos: 25 + Membros: 150)
- Meta Voluntários: 2 (1% de 190 = 1.9 → 2)
- Voluntários Cadastrados: 3 → STATUS: ATINGIDA ✅
- Meta Coordenadores: 1 (fixo por igreja)
- Coordenadores Ativos: 1 → STATUS: ATINGIDA ✅
```

#### **Relatório BLOCO GERAL:**
```
📊 RESUMO EXECUTIVO - BLOCO GERAL
=====================================
Total de Igrejas: 56
Total de Membros: 10.640
Total de Voluntários: 125 
Meta de Voluntários: 106 (1%)
Status: ACIMA DA META ✅

Total de Coordenadores: 56
Meta de Coordenadores: 56 (1 por igreja)  
Status: META ATINGIDA ✅

TÍTULO DE ELEITOR:
Total de Chamados: 450
Chamados Título: 135 (30% do total)
Taxa de Resolução: 95%
Tempo Médio: 2.1 dias
```

### 🔗 **Integração Completa**

#### **Navegação Atualizada:**
- Todos os arquivos HTML com menu agora incluem **"Relatórios"**
- Link direto para `relatorios.html` no menu principal
- Acesso fácil a partir de qualquer tela do sistema

#### **Fluxo de Dados:**
1. **IGREJAS_REGIOES** → Dados base (membros, voluntários, coordenadores)
2. **USUARIOS** → Contagem de voluntários/coordenadores por igreja
3. **CHAMADOS** → Estatísticas de atendimento e demandas
4. **RELATORIOS_MENSAIS** → Consolidação e análise automática

### 📋 **Estrutura Final da Aba RELATORIOS_MENSAIS**

| Coluna | Campo | Descrição |
|--------|--------|-----------|
| A | DATA_RELATORIO | Data de geração |
| B | TIPO_RELATORIO | GERAL, REGIAO, IGREJA |
| C | NOME_REGIAO_IGREJA | Nome específico |
| D | TOTAL_MEMBROS | Soma dos 3 tipos de membros |
| E | TOTAL_VOLUNTARIOS_SISTEMA | Voluntários cadastrados |
| F | META_VOLUNTARIOS | 1% dos membros (mínimo 1) |
| G | STATUS_META_VOLUNTARIOS | ATINGIDA/ABAIXO/ACIMA |
| H | TOTAL_COORDENADORES | Coordenadores ativos |
| I | META_COORDENADORES | 1 por igreja |
| J | STATUS_META_COORDENADORES | ATINGIDA/ABAIXO |
| K | TOTAL_CHAMADOS | Total de atendimentos |
| L | CHAMADOS_RESOLVIDOS | Chamados finalizados |
| M | CHAMADOS_TITULO_ELEITOR | Demanda prioritária |
| N | PORCENTAGEM_TITULO_ELEITOR | % sobre total |
| O | TAXA_RESOLUCAO | % de resolução |
| P | TEMPO_MEDIO_RESOLUCAO | Dias médios |
| Q | CATEGORIA_MAIS_DEMANDADA | Categoria principal |
| R | SATISFACAO_MEDIA | Nota média |
| S | OBSERVACOES | Análises textuais |

### 🚀 **Como Usar**

#### **1. Gerar Relatório Geral:**
```javascript
flowManager.generateAdvancedReport({
  tipo: "GERAL"
})
```

#### **2. Relatório de Região Específica:**
```javascript
flowManager.generateAdvancedReport({
  tipo: "REGIAO",
  filtroNome: "CATEDRAL"
})
```

#### **3. Análise de Igreja Individual:**
```javascript
flowManager.generateAdvancedReport({
  tipo: "IGREJA", 
  filtroNome: "CATEDRAL DA FÉ"
})
```

### 📈 **Benefícios Implementados**

✅ **Gestão por Metas**: Sistema automático de avaliação de performance  
✅ **Análise Proporcional**: Dados sempre atualizados baseados na realidade  
✅ **Destaque Prioritário**: Título de Eleitor como foco principal  
✅ **Visão Hierárquica**: Do geral (bloco) até o específico (igreja)  
✅ **Dados em Tempo Real**: Sempre reflete o estado atual do sistema  
✅ **Interface Intuitiva**: Filtros e visualizações amigáveis  
✅ **Exportação Fácil**: Dados prontos para análises externas  

O sistema agora possui **análise completa de performance** com foco em **metas objetivas** e **gestão eficiente** do Balcão da Cidadania! 🎉
