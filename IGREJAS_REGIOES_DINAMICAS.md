# 🏛️ Atualização: Busca Dinâmica de Igrejas e Regiões

## 📋 **Objetivo**
Implementar busca dinâmica de igrejas e regiões diretamente da planilha Google Sheets (aba IGREJAS_REGIOES) no formulário de cadastro.

## ✅ **Implementações Realizadas**

### 1. **Google Apps Script - Nova Função**
- ✅ **Função `getIgrejasRegioes()`** criada
- ✅ **Endpoint `/getIgrejasRegioes`** adicionado
- ✅ **Busca dados** das colunas `NOME_IGREJA` e `REGIAO`
- ✅ **Filtra igrejas ativas** (Status != 'Inativa')
- ✅ **Retorna dados organizados** por região

### 2. **Frontend - Cadastro.html**
- ✅ **Função `loadRegioesFromSheet()`** implementada
- ✅ **Busca dinâmica** na planilha via API
- ✅ **Fallback** para config.js em caso de erro
- ✅ **Seleção hierárquica** atualizada
- ✅ **Loading state** durante carregamento

### 3. **Flow.js - Nova Integração**
- ✅ **Método `getIgrejasRegioes()`** no FlowManager
- ✅ **Tratamento de erros** robusto
- ✅ **Comunicação** com Google Apps Script

### 4. **Config.js - Novo Endpoint**
- ✅ **Endpoint `getIgrejasRegioes`** adicionado
- ✅ **Integração** com sistema existente

## 📊 **Estrutura de Dados Retornada**

```javascript
{
  success: true,
  data: {
    regioes: ["Região A", "Região B", "Região C"],
    igrejasPorRegiao: {
      "Região A": [
        { nome: "Igreja 1", status: "Ativa" },
        { nome: "Igreja 2", status: "Ativa" }
      ],
      "Região B": [
        { nome: "Igreja 3", status: "Ativa" }
      ]
    },
    total: {
      regioes: 3,
      igrejas: 5
    }
  }
}
```

## 🔧 **Como Funciona**

1. **Usuário acessa** cadastro.html
2. **Sistema carrega** regiões da planilha automaticamente
3. **Usuário seleciona** uma região
4. **Sistema popula** dropdown de igrejas da região selecionada
5. **Dados atualizados** sempre que a planilha for modificada

## 🎯 **Benefícios**

- ✅ **Dados sempre atualizados** (vem direto da planilha)
- ✅ **Sem necessidade** de alterar código para novas igrejas
- ✅ **Administração centralizada** na planilha Google Sheets
- ✅ **Fallback resiliente** se houver problemas de conectividade
- ✅ **Performance otimizada** com carregamento único

## 📝 **Próximos Passos**

1. **Fazer deploy** do código atualizado no Google Apps Script
2. **Testar** o formulário de cadastro
3. **Verificar** se os dados estão sendo carregados corretamente
4. **Aplicar** a mesma lógica em outros formulários se necessário

## 🚀 **Status: Implementado e Pronto para Teste**
