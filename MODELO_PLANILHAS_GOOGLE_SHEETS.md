# 📊 Modelo de Central de Dados - Google Sheets

## Estrutura Recomendada para Integração com Arimateia Service

### 📋 **ABA 1: CHAMADOS**
Esta aba armazena todos os chamados/atendimentos do sistema.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do chamado | CH001, CH002, etc. |
| B | DATA_ABERTURA | Data/Hora | Data e hora de criação | 15/01/2024 10:30 |
| C | NOME_CIDADAO | Texto | Nome completo do cidadão | João Silva Santos |
| D | CPF | Texto | CPF formatado | 123.456.789-00 |
| E | CONTATO | Texto | Telefone/WhatsApp | (11) 99999-9999 |
| F | EMAIL | Texto | Email do cidadão (opcional) | joao@email.com |
| G | IGREJA | Texto | Igreja de origem | Igreja Central |
| H | REGIAO | Texto | Região de atendimento | Norte |
| I | DESCRICAO_DEMANDA | Texto Longo | Descrição detalhada da necessidade | Precisa de ajuda com documentação... |
| J | STATUS | Lista | Status atual do chamado | Aberto, Em Andamento, Resolvido, etc. |
| K | PRIORIDADE | Lista | Nível de prioridade | Baixa, Média, Alta, Urgente |
| L | CATEGORIA | Lista | Categoria do atendimento | Documentação, Benefícios, Jurídico, etc. |
| M | CRIADO_POR | Texto | Nome do voluntário que criou | Maria Santos |
| N | CRIADO_POR_EMAIL | Texto | Email do criador | maria@arimateia.org |
| O | RESPONSAVEL_ATUAL | Texto | Quem está atendendo | Pedro Oliveira |
| P | DATA_ULTIMA_ATUALIZACAO | Data/Hora | Última modificação | 16/01/2024 14:20 |
| Q | OBSERVACOES | Texto Longo | Observações e anotações | Entrei em contato com o INSS... |
| R | ANEXOS | Texto | Links para arquivos anexos | drive.google.com/file/... |
| S | TEMPO_RESOLUCAO | Número | Dias para resolução | 3 |
| T | SATISFACAO_CIDADAO | Número | Nota de 1 a 5 | 5 |

---

### 👥 **ABA 2: USUARIOS**
Esta aba gerencia todos os usuários do sistema (voluntários, secretários, coordenadores).

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do usuário | USR001, USR002, etc. |
| B | NOME_COMPLETO | Texto | Nome completo | Maria Santos Silva |
| C | EMAIL | Texto | Email de login | maria@arimateia.org |
| D | TELEFONE | Texto | Telefone/WhatsApp | (11) 88888-8888 |
| E | CARGO | Lista | Função no sistema | VOLUNTARIO, SECRETARIA, COORDENADOR |
| F | IGREJA | Texto | Igreja de atuação | Igreja do Bairro Alto |
| G | REGIAO | Texto | Região de atuação | Sul |
| H | DATA_CADASTRO | Data | Data de cadastro | 01/01/2024 |
| I | STATUS | Lista | Status do usuário | Ativo, Inativo, Suspenso |
| J | ULTIMO_ACESSO | Data/Hora | Último login | 15/01/2024 09:15 |
| K | TOTAL_CHAMADOS | Número | Total de chamados criados | 25 |
| L | CHAMADOS_RESOLVIDOS | Número | Chamados que resolveu | 20 |
| M | TAXA_RESOLUCAO | Percentual | Taxa de sucesso | 80% |
| N | CRIADO_POR | Texto | Quem cadastrou o usuário | Admin Sistema |
| O | OBSERVACOES | Texto | Anotações sobre o usuário | Voluntário experiente |

---

### 📝 **ABA 3: OBSERVACOES_CHAMADOS**
Esta aba armazena o histórico detalhado de cada chamado.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID_OBSERVACAO | Texto | ID único da observação | OBS001, OBS002, etc. |
| B | ID_CHAMADO | Texto | ID do chamado relacionado | CH001 |
| C | DATA_HORA | Data/Hora | Quando foi feita | 16/01/2024 14:30 |
| D | USUARIO | Texto | Quem fez a observação | Pedro Oliveira |
| E | USUARIO_EMAIL | Texto | Email de quem fez | pedro@arimateia.org |
| F | TIPO_ACAO | Lista | Tipo de ação realizada | Status Alterado, Contato Feito, Documento Enviado |
| G | STATUS_ANTERIOR | Texto | Status antes da alteração | Aberto |
| H | STATUS_NOVO | Texto | Status após alteração | Em Andamento |
| I | OBSERVACAO | Texto Longo | Detalhes da ação | Entrei em contato com o cidadão... |
| J | ANEXOS | Texto | Links para arquivos | drive.google.com/file/... |

---

### 🗑️ **ABA 4: CHAMADOS_EXCLUIDOS**
Esta aba mantém o histórico de chamados excluídos (exclusão lógica).

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID_ORIGINAL | Texto | ID do chamado original | CH001 |
| B | DATA_EXCLUSAO | Data/Hora | Quando foi excluído | 20/01/2024 16:00 |
| C | EXCLUIDO_POR | Texto | Quem excluiu | Ana Costa |
| D | EXCLUIDO_POR_EMAIL | Texto | Email de quem excluiu | ana@arimateia.org |
| E | MOTIVO_EXCLUSAO | Texto | Razão da exclusão | Chamado duplicado |
| F | DADOS_ORIGINAIS | Texto Longo | JSON com dados originais | {"nome":"João Silva"...} |

---

### 🏛️ **ABA 5: IGREJAS_REGIOES**
Esta aba gerencia as igrejas e regiões do sistema.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único | IGR001 |
| B | NOME_IGREJA | Texto | Nome da igreja | Igreja Central |
| C | REGIAO | Texto | Região da igreja | Norte |
| D | ENDERECO | Texto | Endereço completo | Rua das Flores, 123 |
| E | TELEFONE | Texto | Telefone da igreja | (11) 3333-4444 |
| F | PASTOR_RESPONSAVEL | Texto | Nome do pastor | Pastor João |
| G | COORDENADOR_LOCAL | Texto | Coordenador do balcão | Maria Silva |
| H | STATUS | Lista | Status da igreja | Ativa, Inativa |
| I | TOTAL_VOLUNTARIOS | Número | Quantidade de voluntários | 5 |
| J | TOTAL_ATENDIMENTOS | Número | Total de chamados da igreja | 150 |

---

### 📊 **ABA 6: CATEGORIAS_SERVICOS**
Esta aba define as categorias de atendimento disponíveis.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único | CAT001 |
| B | NOME_CATEGORIA | Texto | Nome da categoria | Documentação |
| C | DESCRICAO | Texto | Descrição detalhada | Auxílio com documentos pessoais |
| D | COR_IDENTIFICACAO | Texto | Cor para interface | #00c6ff |
| E | ICONE | Texto | Ícone representativo | 📄 |
| F | ATIVA | Booleano | Se está ativa | TRUE |
| G | ORDEM_EXIBICAO | Número | Ordem na lista | 1 |

---

### 📈 **ABA 7: RELATORIOS_MENSAIS**
Esta aba armazena dados consolidados mensais.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ANO_MES | Texto | Período do relatório | 2024-01 |
| B | TOTAL_CHAMADOS | Número | Total de chamados no mês | 45 |
| C | CHAMADOS_RESOLVIDOS | Número | Chamados resolvidos | 38 |
| D | TAXA_RESOLUCAO | Percentual | Taxa de resolução | 84.4% |
| E | TEMPO_MEDIO_RESOLUCAO | Número | Dias médios para resolver | 3.5 |
| F | TOTAL_VOLUNTARIOS_ATIVOS | Número | Voluntários que atuaram | 12 |
| G | IGREJA_MAIS_ATIVA | Texto | Igreja com mais atendimentos | Igreja Central |
| H | CATEGORIA_MAIS_DEMANDADA | Texto | Categoria mais solicitada | Documentação |
| I | SATISFACAO_MEDIA | Número | Nota média de satisfação | 4.2 |

---

## 🔧 **Configuração no Google Apps Script**

### Endpoints Disponíveis:

1. **?action=newTicket** - Insere novo chamado na aba CHAMADOS
2. **?action=updateTicket** - Atualiza chamado e adiciona observação
3. **?action=deleteTicket** - Move chamado para CHAMADOS_EXCLUIDOS
4. **?action=newUser** - Insere novo usuário na aba USUARIOS
5. **?action=validateUser** - Valida login consultando aba USUARIOS
6. **?action=getTickets** - Retorna chamados com filtros
7. **?action=getUsers** - Lista usuários ativos
8. **?action=generateReport** - Gera dados da aba RELATORIOS_MENSAIS

### Validações Recomendadas:

- **CPF**: Validar formato e dígitos verificadores
- **Email**: Validar formato e unicidade
- **Telefone**: Validar formato brasileiro
- **Status**: Validar contra lista pré-definida
- **Região/Igreja**: Validar contra aba IGREJAS_REGIOES

### Fórmulas Úteis no Google Sheets:

```excel
// Taxa de resolução por usuário
=COUNTIFS(CHAMADOS!M:M,A2,CHAMADOS!J:J,"Resolvido")/COUNTIF(CHAMADOS!M:M,A2)

// Total de chamados por mês
=COUNTIFS(CHAMADOS!B:B,">="&DATE(2024,1,1),CHAMADOS!B:B,"<"&DATE(2024,2,1))

// Tempo médio de resolução
=AVERAGE(CHAMADOS!S:S)

// Igreja mais ativa
=INDEX(CHAMADOS!G:G,MODE(MATCH(CHAMADOS!G:G,CHAMADOS!G:G,0)))
```

---

## 🚀 **Próximos Passos**

1. **Criar as planilhas** no Google Sheets com as estruturas acima
2. **Configurar o Power Automate** com os endpoints
3. **Testar a integração** com dados de exemplo
4. **Ajustar as validações** conforme necessário
5. **Implementar relatórios automáticos**

---

**💡 Dica**: Use a formatação condicional no Google Sheets para destacar chamados por status, prioridade ou tempo de resolução!
