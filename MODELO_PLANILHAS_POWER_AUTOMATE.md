# 📊 Modelo de Central de Dados - Power Automate

## Estrutura da Planilha OneDrive para Integração com Power Automate

---

### 📄 **ABA 1: CHAMADOS**
Esta aba armazena todos os chamados/atendimentos do sistema.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do chamado | CH001, CH002, etc. |
| B | DATA_ABERTURA | Data/Hora | Data e hora de criação | 15/01/2024 10:30 |
| C | NOME_CIDADAO | Texto | Nome completo do cidadão | João Silva Santos |
| D | CONTATO | Texto | Telefone/WhatsApp | (11) 99999-9999 |
| E | EMAIL | Texto | Email do cidadão (opcional) | joao@email.com |
| F | IGREJA | Texto | Igreja do responsável | Igreja Central |
| G | REGIAO | Texto | Região do responsável | Norte |
| H | DESCRICAO_DEMANDA | Texto Longo | Descrição detalhada da necessidade | Precisa de ajuda com documentação... |
| I | STATUS | Lista | Status atual do chamado | Aberto, Em Andamento, Resolvido, etc. |
| J | PRIORIDADE | Lista | Nível de prioridade | Baixa, Média, Alta, Urgente |
| K | CATEGORIA | Lista | Categoria do atendimento | Documentação, Benefícios, Jurídico, etc. |
| L | CRIADO_POR | Texto | Nome do voluntário que criou | Maria Santos |
| M | CRIADO_POR_EMAIL | Texto | Email do criador | maria@arimateia.org |
| N | RESPONSAVEL_ATUAL | Texto | Quem está atendendo | Pedro Oliveira |
| O | DATA_ULTIMA_ATUALIZACAO | Data/Hora | Última modificação | 16/01/2024 14:20 |
| P | OBSERVACOES | Texto Longo | Observações e anotações | Entrei em contato com o INSS... |
| Q | ANEXOS | Texto | Links para arquivos anexos | onedrive.live.com/file/... |
| R | TEMPO_RESOLUCAO | Número | Dias para resolução | 3 |
| S | SATISFACAO_CIDADAO | Número | Nota de 1 a 5 | 5 |

---

### 📄 **ABA 2: OBSERVACOES_CHAMADOS**
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
| J | ANEXOS | Texto | Links para arquivos | onedrive.com/file/... |

---

### 📄 **ABA 3: CHAMADOS_EXCLUIDOS**
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

### 📄 **ABA 4: USUARIOS**
Esta aba gerencia todos os usuários do sistema (voluntários, secretários, coordenadores).

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do usuário | USR001, USR002, etc. |
| B | NOME_COMPLETO | Texto | Nome completo | Maria Santos Silva |
| C | EMAIL | Texto | Email de login | maria@arimateia.org |
| D | SENHA | Texto | Senha criptografada | hash_senha_123 |
| E | TELEFONE | Texto | Telefone/WhatsApp | (11) 88888-8888 |
| F | CARGO | Lista | Função no sistema | VOLUNTARIO, SECRETARIA, COORDENADOR |
| G | IGREJA | Texto | Igreja de atuação | Igreja do Bairro Alto |
| H | REGIAO | Texto | Região de atuação | Sul |
| I | DATA_CADASTRO | Data | Data de cadastro | 01/01/2024 |
| J | STATUS | Lista | Status do usuário | Ativo, Inativo, Suspenso |
| K | ULTIMO_ACESSO | Data/Hora | Último login | 15/01/2024 09:15 |
| L | TOTAL_CHAMADOS | Número | Total de chamados criados | 25 |
| M | CHAMADOS_RESOLVIDOS | Número | Chamados que resolveu | 20 |
| N | TAXA_RESOLUCAO | Percentual | Taxa de sucesso | 80% |
| O | CRIADO_POR | Texto | Quem cadastrou o usuário | Admin Sistema |
| P | OBSERVACOES | Texto | Anotações sobre o usuário | Voluntário experiente |

---

### 📄 **ABA 5: CATEGORIAS_SERVICOS**
Esta aba define as categorias de atendimento disponíveis.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único | CAT001 |
| B | NOME_CATEGORIA | Texto | Nome da categoria | Documentação |
| C | DESCRICAO | Texto | Descrição detalhada | Auxílio com documentos pessoais |
| D | COR_IDENTIFICACAO | Texto | Cor para interface | #00c6ff |
| E | ICONE | Texto | Ícone representativo | 📄 |
| F | ATIVA | Lista | Se está ativa | Ativo, Inativo |
| G | ORDEM_EXIBICAO | Número | Ordem na lista | 1 |

---

### 📄 **ABA 6: IGREJAS_REGIOES**
Esta aba gerencia todas as igrejas e suas informações regionais e estatísticas.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único da igreja | IGR001, IGR002, etc. |
| B | NOME_IGREJA | Texto | Nome da igreja | CATEDRAL DA FÉ |
| C | REGIAO | Texto | Região da igreja | CATEDRAL |
| D | OBREIROS | Número | Quantidade de obreiros | 15 |
| E | VOLUTARIOS_DOS_GRUPOS | Número | Voluntários dos grupos | 25 |
| F | MEMBROS_DOMINGO | Número | Membros presentes aos domingos | 150 |
| G | TOTAL | Fórmula | Total automático (=D2+E2+F2) | 190 |
| H | COORDENADOR_LOCAL | Texto | Nome do coordenador | João Silva |
| I | TOTAL_VOLUNTARIOS | Número | Total de voluntários cadastrados | 8 |
| J | TOTAL_ATENDIMENTOS | Número | Total de chamados da igreja | 45 |
| K | STATUS | Lista | Status da igreja | Ativa, Inativa, Manutenção |

---

### 📄 **ABA 7: RELATORIOS_MENSAIS**
Esta aba gera relatórios consolidados mensais.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ANO_MES | Texto | Ano e mês do relatório | 2024-01 |
| B | TOTAL_CHAMADOS | Número | Total de chamados no mês | 150 |
| C | CHAMADOS_RESOLVIDOS | Número | Chamados resolvidos no mês | 120 |
| D | TAXA_RESOLUCAO | Percentual | Taxa de resolução | 80% |
| E | TEMPO_MEDIO_RESOLUCAO | Número | Tempo médio em dias | 3.5 |
| F | TOTAL_VOLUNTARIOS_ATIVOS | Número | Voluntários ativos no mês | 45 |
| G | IGREJA_MAIS_ATIVA | Texto | Igreja com mais atendimentos | Igreja Central |
| H | CATEGORIA_MAIS_DEMANDADA | Texto | Categoria mais solicitada | Documentação |
| I | SATISFACAO_MEDIA | Número | Nota média de satisfação | 4.2 |

---

### 📄 **ABA 8: PROFISSIONAIS_LIBERAIS**
Esta aba gerencia profissionais liberais voluntários cadastrados no sistema.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | NOME | Texto | Nome completo do profissional | Dr. João Silva |
| B | TELEFONE | Texto | Telefone/WhatsApp para contato | (11) 99999-9999 |
| C | PROFISSAO | Lista | Profissão do voluntário | Advogado(a), Médico(a), etc. |
| D | CIDADE | Texto | Cidade de atuação | Presidente Prudente |

---

### 📄 **ABA 9: ACESSORES**
Esta aba registra assessores vinculados aos parlamentares.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ACESSOR | Texto | Nome completo do assessor | Maria Silva Santos |
| B | TELEFONE | Texto | Telefone de contato | (11) 99999-9999 |
| C | PARLAMENTAR | Texto | Nome do parlamentar | Deputado João Santos |
| D | GABINETE | Texto | Gabinete e cidade | Gabinete São Paulo - SP |

---

### 📄 **ABA 10: ELEICOES_DEPUTADOS**
Esta aba gerencia dados eleitorais por região e município para deputados.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | REGIAO | Texto | Região de localização | Oeste Paulista |
| B | IGREJAS | Texto | Nome da igreja responsável | ICEOB Presidente Prudente |
| C | MUNICIPIO | Texto | Nome do município | Presidente Prudente |
| D | ENDERECOS | Texto | Endereço da igreja | Rua das Flores, 123 |
| E | HABITANTES | Número | População do município | 230000 |
| F | OBREIROS | Número | Quantidade de obreiros | 150 |
| G | GRUPOS_SEM_OBREIROS | Número | Grupos sem obreiros | 80 |
| H | POVO_GERAL | Número | Membros não obreiros | 500 |
| I | ARIMATEIAS_SOMENTE_OBREIROS | Número | Arimatéias somente obreiros | 120 |
| J | TOTAL_ARIMATEIAS | Número | Total de arimatéias | 200 |
| K | VOTOS_DF_2018 | Número | Votos Deputado Federal 2018 | 450 |
| L | VOTOS_DF_2022 | Número | Votos Deputado Federal 2022 | 520 |
| M | VOTOS_DE_2018 | Número | Votos Deputado Estadual 2018 | 380 |
| N | VOTOS_DE_2022 | Número | Votos Deputado Estadual 2022 | 440 |

---

### 📄 **ABA 11: ELEICOES_VEREADORES**
Esta aba gerencia dados de candidatos a vereador por região e município.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | REGIAO | Texto | Região de localização | Oeste Paulista |
| B | IGREJAS | Texto | Nome da igreja responsável | ICEOB Presidente Prudente |
| C | MUNICIPIO | Texto | Nome do município | Presidente Prudente |
| D | NOME_2024 | Texto | Nome do candidato em 2024 | João Silva |
| E | CONTATO | Texto | Telefone/WhatsApp | (11) 99999-9999 |
| F | FUNCAO | Lista | Função na igreja | Obreiro, Cooperador, Membro |
| G | PARTIDO | Texto | Partido político | PT, PSDB, PP, etc. |
| H | ELEITO_NAO_ELEITO_2024 | Lista | Situação na eleição 2024 | Eleito, Não Eleito, Suplente |
| I | QUAL_MANDATO_ESTA | Lista | Número do mandato atual | 1º Mandato, 2º Mandato, etc. |
| J | SUPLENTE_2024 | Lista | Se foi suplente em 2024 | Sim, Não |
| K | VOTOS_2016 | Número | Votos recebidos em 2016 | 1250 |
| L | VOTOS_2020 | Número | Votos recebidos em 2020 | 1380 |
| M | VOTOS_2024 | Número | Votos recebidos em 2024 | 1520 |
| N | TOTAL_CADEIRAS | Número | Total de cadeiras do município | 13 |
| O | MAIOR_VOTACAO_ELEITO_2016 | Número | Maior votação de eleito em 2016 | 2500 |
| P | MENOR_VOTACAO_ELEITO_2016 | Número | Menor votação de eleito em 2016 | 800 |
| Q | MAIOR_VOTACAO_ELEITO_2020 | Número | Maior votação de eleito em 2020 | 2800 |
| R | MENOR_VOTACAO_ELEITO_2020 | Número | Menor votação de eleito em 2020 | 850 |
| S | MAIOR_VOTACAO_ELEITO_2024 | Número | Maior votação de eleito em 2024 | 3200 |
| T | MENOR_VOTACAO_ELEITO_2024 | Número | Menor votação de eleito em 2024 | 900 |

---

### 📄 **ABA 12: ELEICOES_CONSELHO**
Esta aba gerencia dados de candidatos a Conselho Regional.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | REGIAO | Texto | Região de localização | Oeste Paulista |
| B | IGREJAS | Texto | Nome da igreja responsável | ICEOB Presidente Prudente |
| C | MUNICIPIO | Texto | Nome do município | Presidente Prudente |
| D | NOMES_2023 | Texto | Nome do candidato em 2023 | João Silva |
| E | CONTATO | Texto | Telefone/WhatsApp | (11) 99999-9999 |
| F | FINCAO | Lista | Função na igreja | Obreiro, Cooperador, Ancião |
| G | VOTOS_2019 | Número | Votos recebidos em 2019 | 1250 |
| H | ELEITO_NAO_ELEITO_2023 | Lista | Situação na eleição 2023 | Eleito, Não Eleito |
| I | VOTOS_2023 | Número | Votos recebidos em 2023 | 1520 |
| J | POSICAO_2023 | Texto | Posição obtida em 2023 | 1º lugar, 2º lugar |

---

## 🔧 **Configuração para Power Automate**

### Endpoints Principais para Integração:

1. **Criar Chamado** - Insere novo registro na aba CHAMADOS
2. **Atualizar Chamado** - Atualiza chamado e adiciona observação
3. **Excluir Chamado** - Move chamado para CHAMADOS_EXCLUIDOS
4. **Criar Usuário** - Insere novo usuário na aba USUARIOS
5. **Validar Login** - Verifica credenciais na aba USUARIOS
6. **Listar Chamados** - Retorna chamados com filtros
7. **Listar Usuários** - Lista usuários ativos
8. **Obter Categorias** - Retorna categorias da aba CATEGORIAS_SERVICOS
9. **Cadastrar Profissional** - Adiciona à aba PROFISSIONAIS_LIBERAIS
10. **Obter Igrejas/Regiões** - Lista da aba IGREJAS_REGIOES
11. **Gerar Relatório** - Processa dados para aba RELATORIOS_MENSAIS

### Validações Recomendadas no Power Automate:

- **CPF**: Validar formato e dígitos verificadores
- **Email**: Validar formato e unicidade
- **Telefone**: Validar formato brasileiro
- **Status**: Validar contra lista pré-definida
- **Região/Igreja**: Validar contra aba IGREJAS_REGIOES

### Fórmulas Úteis no Excel Online:

```excel
// Taxa de resolução por usuário
=COUNTIFS(CHAMADOS[CRIADO_POR],[@NOME_COMPLETO],CHAMADOS[STATUS],"Resolvido")/COUNTIF(CHAMADOS[CRIADO_POR],[@NOME_COMPLETO])

// Total de chamados por mês
=COUNTIFS(CHAMADOS[DATA_ABERTURA],">="&DATE(2024,1,1),CHAMADOS[DATA_ABERTURA],"<"&DATE(2024,2,1))

// Tempo médio de resolução
=AVERAGE(CHAMADOS[TEMPO_RESOLUCAO])
```

### Dados Pré-cadastrados:

**Igrejas (56 unidades):**
- CATEDRAL DA FÉ
- Cecap, Humberto Salvador, Santo Expedito (Presidente Prudente)
- Pirapozinho, Anhumas, Tarabai (Pirapozinho)
- Presidente Venceslau, Presidente Epitácio (Presidente Venceslau)
- RANCHARIA, Martinópolis, Quatá (Rancharia)
- ANDRADINA, Mirandópolis, Castilho (Andradina)
- TUPÃ, Bastos, Quintana (Tupã)
- ASSIS, Tarumã, Prudenciana (Assis)
- DRACENA, Junqueirópolis, Panorama (Dracena)

**Categorias de Serviços:**
1. Documentação (📄) - RG, CPF, Título de Eleitor, etc.
2. Benefícios Sociais (🤝) - CadÚnico, Moradia, Trabalho
3. Jurídico (⚖️) - Orientação jurídica, processos
4. Saúde (🏥) - Consultas, exames, tratamentos
5. Outros (📋) - Demandas diversas

**Profissões Liberais:**
- Advogado(a), Dentista, Médico(a)
- Professor(a) de Português/Matemática
- Psicólogo(a), Assistente Social
- Fisioterapeuta, Nutricionista
- Fonoaudiólogo(a), Enfermeiro(a)
- Pedagogo(a), Farmacêutico(a)

---

## 🚀 **Próximos Passos para Power Automate**

1. **Criar a planilha** no OneDrive/SharePoint com as abas estruturadas
2. **Configurar Power Automate Flows** para cada endpoint
3. **Implementar autenticação** e controle de acesso
4. **Testar a integração** com dados de exemplo
5. **Configurar relatórios automáticos**
6. **Implementar notificações** por email/Teams

---

**💡 Dica**: Use formatação condicional no Excel para destacar chamados por status, prioridade ou tempo de resolução!

**🔒 Segurança**: Configure permissões adequadas no SharePoint para proteger dados sensíveis eleitorais.

---

## 📊 **Estrutura Simplificada para Cópia/Colagem**

### CHAMADOS
```
ID | DATA_ABERTURA | NOME_CIDADAO | CONTATO | EMAIL | IGREJA | REGIAO | DESCRICAO_DEMANDA | STATUS | PRIORIDADE | CATEGORIA | CRIADO_POR | CRIADO_POR_EMAIL | RESPONSAVEL_ATUAL | DATA_ULTIMA_ATUALIZACAO | OBSERVACOES | ANEXOS | TEMPO_RESOLUCAO | SATISFACAO_CIDADAO
```

### OBSERVACOES_CHAMADOS
```
ID_OBSERVACAO | ID_CHAMADO | DATA_HORA | USUARIO | USUARIO_EMAIL | TIPO_ACAO | STATUS_ANTERIOR | STATUS_NOVO | OBSERVACAO | ANEXOS
```

### CHAMADOS_EXCLUIDOS
```
ID_ORIGINAL | DATA_EXCLUSAO | EXCLUIDO_POR | EXCLUIDO_POR_EMAIL | MOTIVO_EXCLUSAO | DADOS_ORIGINAIS
```

### USUARIOS
```
ID | NOME_COMPLETO | EMAIL | SENHA | TELEFONE | CARGO | IGREJA | REGIAO | DATA_CADASTRO | STATUS | ULTIMO_ACESSO | TOTAL_CHAMADOS | CHAMADOS_RESOLVIDOS | TAXA_RESOLUCAO | CRIADO_POR | OBSERVACOES
```

### CATEGORIAS_SERVICOS
```
ID | NOME_CATEGORIA | DESCRICAO | COR_IDENTIFICACAO | ICONE | ATIVA | ORDEM_EXIBICAO
```

### IGREJAS_REGIOES
```
ID | NOME_IGREJA | REGIAO | OBREIROS | VOLUTARIOS_DOS_GRUPOS | MEMBROS_DOMINGO | TOTAL | COORDENADOR_LOCAL | TOTAL_VOLUNTARIOS | TOTAL_ATENDIMENTOS | STATUS
```

### RELATORIOS_MENSAIS
```
ANO_MES | TOTAL_CHAMADOS | CHAMADOS_RESOLVIDOS | TAXA_RESOLUCAO | TEMPO_MEDIO_RESOLUCAO | TOTAL_VOLUNTARIOS_ATIVOS | IGREJA_MAIS_ATIVA | CATEGORIA_MAIS_DEMANDADA | SATISFACAO_MEDIA
```

### PROFISSIONAIS_LIBERAIS
```
NOME | TELEFONE | PROFISSAO | CIDADE
```

### ACESSORES
```
ACESSOR | TELEFONE | PARLAMENTAR | GABINETE
```

### ELEICOES_DEPUTADOS
```
REGIAO | IGREJAS | MUNICIPIO | ENDERECOS | HABITANTES | OBREIROS | GRUPOS_SEM_OBREIROS | POVO_GERAL | ARIMATEIAS_SOMENTE_OBREIROS | TOTAL_ARIMATEIAS | VOTOS_DF_2018 | VOTOS_DF_2022 | VOTOS_DE_2018 | VOTOS_DE_2022
```

### ELEICOES_VEREADORES
```
REGIAO | IGREJAS | MUNICIPIO | NOME_2024 | CONTATO | FUNCAO | PARTIDO | ELEITO_NAO_ELEITO_2024 | QUAL_MANDATO_ESTA | SUPLENTE_2024 | VOTOS_2016 | VOTOS_2020 | VOTOS_2024 | TOTAL_CADEIRAS | MAIOR_VOTACAO_ELEITO_2016 | MENOR_VOTACAO_ELEITO_2016 | MAIOR_VOTACAO_ELEITO_2020 | MENOR_VOTACAO_ELEITO_2020 | MAIOR_VOTACAO_ELEITO_2024 | MENOR_VOTACAO_ELEITO_2024
```

### ELEICOES_CONSELHO
```
REGIAO | IGREJAS | MUNICIPIO | NOMES_2023 | CONTATO | FINCAO | VOTOS_2019 | ELEITO_NAO_ELEITO_2023 | VOTOS_2023 | POSICAO_2023
```
