# 🚀 Setup Inicial - Dados para Teste

## 🎯 **Sistema 100% Google - Pronto para Usar**

O Arimateia Service utiliza **exclusivamente tecnologias Google**:
- ✅ **Frontend**: Arquivos HTML/CSS/JS locais
- ✅ **Backend**: Google Apps Script (gratuito)
- ✅ **Banco de Dados**: Google Sheets (gratuito)
- ❌ **NÃO usa**: Power Automate, servidores externos, hospedagem paga

---

## 📋 **Dados Iniciais Recomendados**

### 👥 **ABA: USUARIOS (Primeiros usuários para teste)**

Adicione estes usuários na planilha para poder fazer login e testar o sistema:

| ID | NOME_COMPLETO | EMAIL | SENHA | TELEFONE | CARGO | IGREJA | REGIAO | DATA_CADASTRO | STATUS | ULTIMO_ACESSO | TOTAL_CHAMADOS | CHAMADOS_RESOLVIDOS | TAXA_RESOLUCAO | CRIADO_POR | OBSERVACOES |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| USR001 | Admin Sistema | admin@arimateia.org | Arimateia1 | (11) 99999-9999 | COORDENADOR | Igreja Central | Centro | 2024-01-01 | Ativo | | 0 | 0 | 0% | Sistema | Usuário administrador do sistema |
| USR002 | Maria Santos | maria@arimateia.org | Arimateia1 | (11) 98888-8888 | SECRETARIA | Igreja Central | Centro | 2024-01-01 | Ativo | | 0 | 0 | 0% | Sistema | Secretária principal |
| USR003 | João Silva | joao@arimateia.org | Arimateia1 | (11) 97777-7777 | VOLUNTARIO | Igreja do Bairro Alto | Norte | 2024-01-01 | Ativo | | 0 | 0 | 0% | Sistema | Voluntário experiente |

### 🏛️ **ABA: IGREJAS_REGIOES**

| ID | NOME_IGREJA | REGIAO | ENDERECO | TELEFONE | PASTOR_RESPONSAVEL | COORDENADOR_LOCAL | STATUS | TOTAL_VOLUNTARIOS | TOTAL_ATENDIMENTOS |
|---|---|---|---|---|---|---|---|---|---|
| IGR001 | Igreja Central | Centro | Rua Central, 123 | (11) 3333-3333 | Pastor João | Maria Santos | Ativa | 0 | 0 |
| IGR002 | Igreja do Bairro Alto | Norte | Av. Norte, 456 | (11) 3333-4444 | Pastor Pedro | João Silva | Ativa | 0 | 0 |
| IGR003 | Igreja da Vila Nova | Sul | Rua Sul, 789 | (11) 3333-5555 | Pastor Ana | - | Ativa | 0 | 0 |

### 📋 **ABA: CATEGORIAS_SERVICOS**

| ID | NOME_CATEGORIA | DESCRICAO | COR_IDENTIFICACAO | ICONE | ATIVA | ORDEM_EXIBICAO |
|---|---|---|---|---|---|---|
| CAT001 | Documentação | Auxílio com documentos pessoais | #3b82f6 | 📄 | TRUE | 1 |
| CAT002 | Benefícios Sociais | Orientação sobre benefícios | #10b981 | 💰 | TRUE | 2 |
| CAT003 | Jurídico | Orientação jurídica básica | #f59e0b | ⚖️ | TRUE | 3 |
| CAT004 | Saúde | Orientação sobre saúde | #ef4444 | 🏥 | TRUE | 4 |
| CAT005 | Educação | Auxílio educacional | #8b5cf6 | 📚 | TRUE | 5 |

---

## 🔧 **Como Adicionar os Dados**

### **Método 1: Manual**
1. Abra a planilha no Google Sheets
2. Vá para cada aba correspondente
3. Cole os dados nas respectivas colunas

### **Método 2: Importação (Recomendado)**
1. Copie cada tabela acima
2. No Google Sheets, selecione a aba desejada
3. Cole os dados a partir da linha 2 (primeira linha são os cabeçalhos)

---

## 🧪 **Teste do Sistema**

Após adicionar os dados:

1. **Faça login** com qualquer um dos usuários:
   - Email: `admin@arimateia.org` / Senha: `Arimateia1`
   - Email: `maria@arimateia.org` / Senha: `Arimateia1`
   - Email: `joao@arimateia.org` / Senha: `Arimateia1`

2. **Crie um chamado de teste**:
   - Nome: João da Silva
   - CPF: 123.456.789-00
   - Contato: (11) 99999-9999
   - Igreja: Igreja Central
   - Região: Centro
   - Descrição: Teste de integração do sistema

3. **Verifique se o chamado aparece**:
   - No dashboard
   - Na lista de chamados
   - Na planilha do Google Sheets

---

## ⚠️ **Importante**

- **Sistema 100% Google**: Usa apenas Google Apps Script + Google Sheets
- **Sem dependências externas**: Não precisa de Power Automate ou outros serviços
- **Gratuito**: Todas as tecnologias utilizadas são gratuitas
- Todos os usuários iniciais têm a senha `Arimateia1`
- O sistema está configurado para usar as URLs fornecidas
- Certifique-se de que o Google Apps Script está publicado corretamente
- Verifique se as permissões da planilha estão configuradas

---

## 🔄 **Próximos Passos**

1. ✅ Adicionar dados iniciais
2. ✅ Testar login
3. ✅ Criar primeiro chamado
4. ✅ Verificar integração
5. 🔄 Personalizar dados conforme sua realidade
6. 🔄 Treinar usuários
7. 🔄 Monitorar funcionamento
