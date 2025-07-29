# 📊 Modelo de Central de Dados - Google Sheets

## Estrutura Recomendada para Integração com Google Apps Script

### 👨‍⚕️ **ABA 9: PROFISSIONAIS_LIBERAIS**
Esta aba gerencia profissionais liberais voluntários cadastrados no sistema.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do profissional | PROF001, PROF002, etc. |
| B | NOME | Texto | Nome completo do profissional | Dr. João Silva |
| C | TELEF**⚠️ Observações Importantes:**
- Dados sensíveis que requerem máxima segurança
- Usado para planejamento estratégico de campanhas
- Análise de eficiência organizacional por região
- Acompanhamento de crescimento eleitoral e demográfico

---

## 🏛️ **ABA 11: ELEICOES_VEREADORES** *(Nova)*
Esta aba gerencia dados de candidatos a vereador por região e município, incluindo histórico eleitoral e análise de desempenho.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do vereador | VER001, VER002, etc. |
| B | REGIAO | Texto | Região de localização | Oeste Paulista, Vale do Ribeira |
| C | IGREJA | Texto | Nome da igreja responsável | ICEOB Presidente Prudente |
| D | MUNICIPIO | Texto | Nome do município | Presidente Prudente |
| E | NOME_2024 | Texto | Nome do candidato em 2024 | João Silva |
| F | CONTATO | Texto | Telefone/WhatsApp para contato | (11) 99999-9999 |
| G | FUNCAO | Lista | Função na igreja | Obreiro, Cooperador, Membro |
| H | PARTIDO | Texto | Partido político | PT, PSDB, PP, etc. |
| I | ELEITO_NAO_ELEITO_2024 | Lista | Situação na eleição 2024 | Eleito, Não Eleito, Suplente |
| J | QUAL_MANDATO_ESTA | Lista | Número do mandato atual | 1º Mandato, 2º Mandato, etc. |
| K | SUPLENTE_2024 | Lista | Se foi suplente em 2024 | Sim, Não |
| L | VOTOS_2016 | Número | Votos recebidos em 2016 | 1250 |
| M | VOTOS_2020 | Número | Votos recebidos em 2020 | 1380 |
| N | VOTOS_2024 | Número | Votos recebidos em 2024 | 1520 |
| O | TOTAL_CADEIRAS | Número | Total de cadeiras do município | 13 |
| P | MAIOR_VOTACAO_ELEITO_2016 | Número | Maior votação de eleito em 2016 | 2500 |
| Q | MENOR_VOTACAO_ELEITO_2016 | Número | Menor votação de eleito em 2016 | 800 |
| R | MAIOR_VOTACAO_ELEITO_2020 | Número | Maior votação de eleito em 2020 | 2800 |
| S | MENOR_VOTACAO_ELEITO_2020 | Número | Menor votação de eleito em 2020 | 850 |
| T | MAIOR_VOTACAO_ELEITO_2024 | Número | Maior votação de eleito em 2024 | 3200 |
| U | MENOR_VOTACAO_ELEITO_2024 | Número | Menor votação de eleito em 2024 | 900 |
| V | DATA_CADASTRO | Data | Data de cadastro no sistema | 15/01/2024 |
| W | ULTIMA_ATUALIZACAO | Data/Hora | Última modificação no registro | 16/01/2024 14:30 |

**🏛️ Campos Calculados Automáticos:**
- **Crescimento 2020**: (VOTOS_2020 - VOTOS_2016) / VOTOS_2016 * 100
- **Crescimento 2024**: (VOTOS_2024 - VOTOS_2020) / VOTOS_2020 * 100
- **Taxa de Sucesso**: Eleitos / Total Candidatos * 100
- **Eficiência Municipal**: Eleitos / Total Cadeiras * 100

**📊 Relatórios Avançados Disponíveis:**
1. **Ranking de Vereadores Eleitos por Votação**
2. **Análise de Performance por Município**
3. **Evolução Eleitoral 2016-2024**
4. **Taxa de Sucesso por Região**
5. **Comparativo de Mandatos**
6. **Análise de Crescimento Eleitoral**

**🔒 Acesso Ultrarrestrito:**
- **COORDENADORES**: Acesso completo para gerenciamento e relatórios
- **DEMAIS USUÁRIOS**: Sem acesso a dados de vereadores

**⚠️ Observações Importantes:**
- Dados estratégicos para análise política local
- Acompanhamento de desempenho eleitoral individual
- Análise de efetividade por município
- Histórico para planejamento de próximas eleições

---

## 🎯 **ABA 12: ELEICOES_CONSELHO** *(Nova)*
Esta aba gerencia dados de candidatos a Conselho Regional, incluindo histórico eleitoral 2019-2023 e análise de desempenho.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do conselheiro | CNS001, CNS002, etc. |
| B | REGIAO | Texto | Região de localização | Oeste Paulista, Vale do Ribeira |
| C | IGREJA | Texto | Nome da igreja responsável | ICEOB Presidente Prudente |
| D | MUNICIPIO | Texto | Nome do município | Presidente Prudente |
| E | NOMES_2023 | Texto | Nome do candidato em 2023 | João Silva |
| F | CONTATO | Texto | Telefone/WhatsApp para contato | (11) 99999-9999 |
| G | FUNCAO | Lista | Função na igreja | Obreiro, Cooperador, Ancião |
| H | VOTOS_2019 | Número | Votos recebidos em 2019 | 1250 |
| I | ELEITO_NAO_ELEITO_2023 | Lista | Situação na eleição 2023 | Eleito, Não Eleito |
| J | VOTOS_2023 | Número | Votos recebidos em 2023 | 1520 |
| K | POSICAO_2023 | Texto | Posição obtida em 2023 | 1º lugar, 2º lugar |
| L | DATA_CADASTRO | Data | Data de cadastro no sistema | 15/01/2024 |
| M | ULTIMA_ATUALIZACAO | Data/Hora | Última modificação no registro | 16/01/2024 14:30 |

**🎯 Campos Calculados Automáticos:**
- **Crescimento 2019-2023**: (VOTOS_2023 - VOTOS_2019) / VOTOS_2019 * 100
- **Taxa de Sucesso por Região**: Eleitos / Total Candidatos * 100
- **Ranking por Votação**: Ordenação por votos recebidos
- **Performance Regional**: Comparativo entre regiões

**📊 Relatórios Avançados Disponíveis:**
1. **Ranking de Conselheiros Eleitos por Votação**
2. **Análise de Performance por Região**
3. **Evolução Eleitoral 2019-2023**
4. **Taxa de Sucesso Regionalizada**
5. **Comparativo de Crescimento**
6. **Análise de Posicionamento**

**🔒 Acesso Ultrarrestrito:**
- **COORDENADORES**: Acesso completo para gerenciamento e relatórios
- **DEMAIS USUÁRIOS**: Sem acesso a dados de conselho

**⚠️ Observações Importantes:**
- Dados estratégicos para análise política regional
- Acompanhamento de desempenho eleitoral de conselheiros
- Análise de crescimento e efetividade regional
- Histórico para planejamento de próximas eleições de conselho

---

## 🚀 **Próximos Passos**to | Telefone/WhatsApp para contato | (11) 99999-9999 |
| D | PROFISSAO | Lista | Profissão do voluntário | Advogado(a), Médico(a), etc. |
| E | CIDADE | Texto | Cidade de atuação | Presidente Prudente |
| F | EMAIL | Texto | Email para contato (opcional) | joao@email.com |
| G | CRM_CRO_OAB | Texto | Registro profissional (quando aplicável) | CRM 123456 |
| H | ESPECIALIDADE | Texto | Especialidade ou área específica | Direito Civil, Clínica Geral |
| I | DISPONIBILIDADE | Texto | Horários/dias disponíveis | Segunda a Sexta, 14h-18h |
| J | STATUS | Lista | Status do cadastro | Ativo, Inativo, Pendente |
| K | DATA_CADASTRO | Data | Data de cadastro no sistema | 15/01/2024 |
| L | CADASTRADO_POR | Texto | Quem cadastrou o profissional | Coordenador João |
| M | OBSERVACOES | Texto Longo | Observações e anotações | Atende casos específicos... |
| N | TOTAL_ATENDIMENTOS | Número | Quantos casos já atendeu | 25 |
| O | ULTIMA_ATUALIZACAO | Data/Hora | Última modificação no cadastro | 16/01/2024 14:30 |

**👨‍⚕️ Profissões Disponíveis:**
1. Advogado(a)
2. Dentista (Cirurgião-Dentista)
3. Professor(a) de Português
4. Professor(a) de Matemática
5. Psicólogo(a)
6. Assistente Social
7. Médico(a) Clínico Geral
8. Fisioterapeuta
9. Nutricionista
10. Fonoaudiólogo(a)
11. Terapeuta Ocupacional
12. Enfermeiro(a)
13. Pedagogo(a)
14. Orientador(a) Educacional
15. Farmacêutico(a)
16. Outros

**🔒 Acesso Restrito:**
- **COORDENADORES**: Podem adicionar, editar e remover profissionais
- **SECRETÁRIOS**: Podem visualizar e adicionar profissionais (sem editar/remover)
- **VOLUNTÁRIOS**: Sem acesso a esta funcionalidade

### 🏛️ **ABA 5: ASSESSORES**
Esta aba é utilizada para o registro e controle dos assessores vinculados aos parlamentares, com informações essenciais para contato e localização.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do assessor | ASSES_1k2m3n4p5q |
| B | ACESSOR | Texto | Nome completo do assessor parlamentar | Maria Silva Santos |
| C | TELEFONE | Texto | Telefone de contato direto (preferencialmente com WhatsApp) | (11) 99999-9999 |
| D | PARLAMENTAR | Texto | Nome do parlamentar ao qual o assessor está vinculado | Deputado João Santos |
| E | GABINETE | Texto | Identificação do gabinete e a cidade onde está localizado | Gabinete São Paulo - SP |
| F | DATA_CADASTRO | Data | Data de cadastro no sistema | 15/01/2024 |
| G | CADASTRADO_POR | Texto | Quem cadastrou o assessor | Coordenador João |
| H | OBSERVACOES | Texto Longo | Observações e anotações | Especialista em saúde... |
| I | ULTIMA_ATUALIZACAO | Data/Hora | Última modificação no cadastro | 16/01/2024 14:30 |

**🔒 Acesso Restrito:**
- **COORDENADORES**: Podem adicionar, editar e remover assessores
- **SECRETÁRIOS**: Podem visualizar e adicionar assessores (sem remover)
- **VOLUNTÁRIOS**: Sem acesso a esta funcionalidade

### 🏛️ **ABA 6: IGREJAS_REGIOES**
Esta aba gerencia todas as igrejas e suas informações regionais e estatísticas.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único da igreja (FIXO) | IGR001, IGR002, etc. |
| B | NOME_IGREJA | Texto | Nome da igreja (EDITÁVEL) | CATEDRAL DA FÉ |
| C | REGIAO | Texto | Região da igreja (EDITÁVEL) | CATEDRAL |
| D | OBREIROS | Número | Quantidade de obreiros (EDITÁVEL) | 15 |
| E | VOLUNTARIOS_DOS_GRUPOS | Número | Voluntários dos grupos (EDITÁVEL) | 25 |
| F | MEMBROS_DOMINGO | Número | Membros presentes aos domingos (EDITÁVEL) | 150 |
| G | TOTAL | Fórmula | Total automático (=D2+E2+F2) | 190 |
| H | COORDENADOR_LOCAL | Texto | Nome do coordenador (AUTO-ATUALIZADO) | João Silva |
| I | TOTAL_VOLUNTARIOS | Número | Total de voluntários cadastrados no sistema (AUTO-ATUALIZADO) | 8 |
| J | TOTAL_ATENDIMENTOS | Número | Total de chamados da igreja (AUTO-ATUALIZADO) | 45 |
| K | STATUS | Lista | Status da igreja | Ativa, Inativa, Manutenção |

**📊 Dados Pré-cadastrados (56 Igrejas):**

| ID | Nome da Igreja | Região |
|----|----------------|--------|
| IGR001 | CATEDRAL DA FÉ | CATEDRAL |
| IGR002 | Cecap | Presidente Prudente |
| IGR003 | Humberto Salvador | Presidente Prudente |
| IGR004 | Santo Expedito | Presidente Prudente |
| IGR005 | Montalvão | Presidente Prudente |
| IGR006 | Indiana | Presidente Prudente |
| IGR007 | Ana Jacinta | Presidente Prudente |
| IGR008 | Alvares Machado | Presidente Prudente |
| IGR009 | Pinheiros | Presidente Prudente |
| IGR010 | Taciba | Presidente Prudente |
| IGR011 | Regente Feijo | Presidente Prudente |
| IGR012 | Pirapozinho | Pirapozinho |
| IGR013 | Anhumas | Pirapozinho |
| IGR014 | Tarabai | Pirapozinho |
| IGR015 | Teodoro Sampaio | Pirapozinho |
| IGR016 | Mirante | Pirapozinho |
| IGR017 | Primavera | Pirapozinho |
| IGR018 | Rosana | Pirapozinho |
| IGR019 | Euclides da Cunha | Pirapozinho |
| IGR020 | Presidente Venceslau | Presidente Venceslau |
| IGR021 | Presidente Epitácio | Presidente Venceslau |
| IGR022 | Presidente Bernardes | Presidente Venceslau |
| IGR023 | Santo Anastácio | Presidente Venceslau |
| IGR024 | Piquerobi | Presidente Venceslau |
| IGR025 | RANCHARIA | Rancharia |
| IGR026 | Martinopólis | Rancharia |
| IGR027 | Quatá | Rancharia |
| IGR028 | Iepe | Rancharia |
| IGR029 | Paraguaçu Paulista | Rancharia |
| IGR030 | ANDRADINA | Andradina |
| IGR031 | Mirandopolis | Andradina |
| IGR032 | Castilho | Andradina |
| IGR033 | Guaracaí | Andradina |
| IGR034 | TUPÃ | Tupã |
| IGR035 | Bastos | Tupã |
| IGR036 | Quintana | Tupã |
| IGR037 | Queiroz | Tupã |
| IGR038 | Osvaldo Cruz | Tupã |
| IGR039 | Parapuã | Tupã |
| IGR040 | Salmourão | Tupã |
| IGR041 | Herculândia | Tupã |
| IGR042 | ASSIS | Assis |
| IGR043 | Tarumã | Assis |
| IGR044 | Prudenciana | Assis |
| IGR045 | Echaporã | Assis |
| IGR046 | Candido Mota | Assis |
| IGR047 | Palmital | Assis |
| IGR048 | Ibirarema | Assis |
| IGR049 | DRACENA | Dracena |
| IGR050 | Junqueiropolis | Dracena |
| IGR051 | Panorama | Dracena |
| IGR052 | Tupi Paulista | Dracena |
| IGR053 | Irapuru | Dracena |
| IGR054 | Paraiso | Dracena |
| IGR055 | Adamantina | Dracena |
| IGR056 | Lucélia | Dracena |

**🔄 Campos Auto-atualizados:**
- **TOTAL**: Soma automática de Obreiros + Voluntários dos Grupos + Membros Domingo
- **COORDENADOR_LOCAL**: Atualizado quando voluntário é promovido a coordenador
- **TOTAL_VOLUNTARIOS**: Contagem de usuários VOLUNTÁRIO + COORDENADOR da igreja
- **TOTAL_ATENDIMENTOS**: Contagem de chamados da igreja

### 📋 **ABA 1: CHAMADOS**
Esta aba armazena todos os chamados/atendimentos do sistema.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do chamado | CH001, CH002, etc. |
| B | DATA_ABERTURA | Data/Hora | Data e hora de criação | 15/01/2024 10:30 |
| C | NOME_CIDADAO | Texto | Nome completo do cidadão | João Silva Santos |
| D | CONTATO | Texto | Telefone/WhatsApp | (11) 99999-9999 |
| E | EMAIL | Texto | Email do cidadão (opcional) | joao@email.com |
| F | IGREJA | Texto | Igreja do responsável (auto-preenchida) | Igreja Central |
| G | REGIAO | Texto | Região do responsável (auto-preenchida) | Norte |
| H | DESCRICAO_DEMANDA | Texto Longo | Descrição detalhada da necessidade | Precisa de ajuda com documentação... |
| I | STATUS | Lista | Status atual do chamado | Aberto, Em Andamento, Resolvido, etc. |
| J | PRIORIDADE | Lista | Nível de prioridade | Baixa, Média, Alta, Urgente |
| K | CATEGORIA | Lista | Categoria do atendimento | Documentação, Benefícios, Jurídico, etc. |
| L | DEMANDA_ESPECIFICA | Texto | Demanda específica selecionada | Título de Eleitor, RG, etc. |
| M | CRIADO_POR | Texto | Nome do voluntário que criou (auto-preenchido) | Maria Santos |
| N | CRIADO_POR_EMAIL | Texto | Email do criador (auto-preenchido) | maria@arimateia.org |
| O | RESPONSAVEL_ATUAL | Texto | Quem está atendendo (auto-preenchido) | Pedro Oliveira |
| P | DATA_ULTIMA_ATUALIZACAO | Data/Hora | Última modificação | 16/01/2024 14:20 |
| Q | OBSERVACOES | Texto Longo | Observações e anotações | Entrei em contato com o INSS... |
| R | ANEXOS | Texto | Links para arquivos anexos | drive.google.com/file/... |
| S | TEMPO_RESOLUCAO | Número | Dias para resolução | 3 |
| T | SATISFACAO_CIDADAO | Número | Nota de 1 a 5 | 5 |

**📝 Campos Auto-preenchidos pelo Sistema:**
- **IGREJA/REGIAO**: Baseados no usuário logado
- **STATUS**: Sempre "Aberto" para novos chamados
- **CRIADO_POR/EMAIL**: Dados do usuário logado
- **RESPONSAVEL_ATUAL**: Inicialmente o criador do chamado
- **CATEGORIA**: Selecionada pelo usuário na lista suspensa
- **DEMANDA_ESPECIFICA**: Baseada na categoria selecionada
- **PRIORIDADE**: Auto-definida para "Título de Eleitor" como "Alta"

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

### 📊 **ABA 7: CATEGORIAS_SERVICOS**
Esta aba define as categorias de atendimento disponíveis.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único | CAT001 |
| B | NOME_CATEGORIA | Texto | Nome da categoria | Documentação |
| C | DESCRICAO | Texto | Descrição detalhada | Auxílio com documentos pessoais |
| D | COR_IDENTIFICACAO | Texto | Cor para interface | #00c6ff |
| E | ICONE | Texto | Ícone representativo | 📄 |
| F | STATUS | Lista | Se está ativa | Ativo, Inativo |
| G | ORDEM_EXIBICAO | Número | Ordem na lista | 1 |

**📋 Categorias Padrão Recomendadas:**

| ID | Nome | Descrição | Ícone |
|----|------|-----------|-------|
| CAT001 | Documentação | Emissão e renovação de documentos pessoais | 📄 |
| CAT002 | Benefícios Sociais | Programas sociais e benefícios governamentais | 🤝 |
| CAT003 | Jurídico | Orientação jurídica e resolução de conflitos | ⚖️ |
| CAT004 | Saúde | Consultas médicas, exames e tratamentos | 🏥 |
| CAT005 | Outros | Demandas não categorizadas especificamente | � |

**📋 Demandas Específicas por Categoria:**

**📁 Documentação:**
1. Título de Eleitor ⚠️ (Prioridade Alta Automática)
2. Registro Geral (RG)
3. CPF
4. Antecedentes Criminais
5. CIPTEA – Carteira de Identificação da Pessoa com Transtorno do Espectro Autista
6. CNH / Habilitação
7. Passaporte
8. Conta GOV.BR
9. Alistamento Militar

**📁 Benefícios Sociais:**
10. Cadastro Único (CadÚnico)
11. Moradia e Serviços Sociais
12. Trabalho e Previdência
13. Impostos e Empresa (CNPJ, MEI etc.)

**📁 Jurídico:**
14. Justiça e Cidadania (Certidões, processos etc.)
15. Antecedentes Criminais

**📁 Saúde:**
16. Vacinação COVID-19
17. Conecte SUS
18. CIPTEA – Carteira de Identificação da Pessoa com Transtorno do Espectro Autista

**📁 Outros:**
19. Achados e Perdidos (Busca de Documentos Perdidos)
20. Transporte e Veículos
21. Educação (Históricos, matrícula, certificados etc.)
22. Água, Esgoto e Meio Ambiente
23. Outro (Especificar na descrição do atendimento)

---

### 📈 **ABA 8: RELATORIOS_MENSAIS**
Esta aba gera relatórios consolidados por região/igreja com dados atuais e análises proporcionais.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | DATA_RELATORIO | Data | Data de geração do relatório | 15/01/2024 |
| B | TIPO_RELATORIO | Lista | Tipo: GERAL, REGIAO, IGREJA | REGIAO |
| C | NOME_REGIAO_IGREJA | Texto | Nome da região ou igreja | CATEDRAL |
| D | TOTAL_MEMBROS | Número | Obreiros + Vol.Grupos + Membros Domingo | 190 |
| E | TOTAL_VOLUNTARIOS_SISTEMA | Número | Voluntários cadastrados no sistema | 8 |
| F | META_VOLUNTARIOS | Número | 1% do total de membros (meta) | 2 |
| G | STATUS_META_VOLUNTARIOS | Texto | ATINGIDA, ACIMA, ABAIXO | ACIMA |
| H | TOTAL_COORDENADORES | Número | Coordenadores da região/igreja | 1 |
| I | META_COORDENADORES | Número | 1 coordenador por igreja | 1 |
| J | STATUS_META_COORDENADORES | Texto | ATINGIDA, ACIMA, ABAIXO | ATINGIDA |
| K | TOTAL_CHAMADOS | Número | Total de chamados da região/igreja | 45 |
| L | CHAMADOS_RESOLVIDOS | Número | Chamados resolvidos | 38 |
| M | CHAMADOS_TITULO_ELEITOR | Número | Chamados específicos de Título de Eleitor | 12 |
| N | PORCENTAGEM_TITULO_ELEITOR | Percentual | % de chamados de Título de Eleitor | 26.7% |
| O | TAXA_RESOLUCAO | Percentual | Taxa geral de resolução | 84.4% |
| P | TEMPO_MEDIO_RESOLUCAO | Número | Dias médios para resolver | 3.5 |
| Q | CATEGORIA_MAIS_DEMANDADA | Texto | Categoria mais solicitada | Documentação |
| R | SATISFACAO_MEDIA | Número | Nota média de satisfação | 4.2 |
| S | OBSERVACOES | Texto | Análises e observações | Região com alta demanda... |

**📊 Tipos de Relatório:**

1. **GERAL (BLOCO)**: Dados consolidados de todas as regiões
2. **REGIAO**: Dados consolidados por região específica 
3. **IGREJA**: Dados detalhados por igreja individual

**🎯 Metas e Análises Automáticas:**

- **META_VOLUNTARIOS**: 1% do total de membros da igreja
- **META_COORDENADORES**: 1 coordenador por igreja
- **DESTAQUE_TITULO_ELEITOR**: Análise específica da demanda prioritária
- **PROPORÇÃO_ATENDIMENTOS**: Relação entre membros e atendimentos

**📋 Estrutura do Relatório Gerado:**

```
RELATÓRIO GERAL (BLOCO) - Data: 15/01/2024
===============================================

RESUMO EXECUTIVO:
- Total de Igrejas: 56
- Total de Membros: 10.640 (todas as igrejas)
- Total de Voluntários no Sistema: 125
- Meta de Voluntários: 106 (1% dos membros)
- Status Meta Voluntários: ACIMA ✅
- Total de Coordenadores: 56
- Meta de Coordenadores: 56 (1 por igreja)
- Status Meta Coordenadores: ATINGIDA ✅

ANÁLISE POR REGIÃO:
- CATEDRAL: 4 igrejas, 760 membros, 8 voluntários
- Presidente Prudente: 10 igrejas, 1.900 membros, 25 voluntários
- [... outras regiões]

DESTAQUE TÍTULO DE ELEITOR:
- Total de Chamados: 450
- Chamados Título de Eleitor: 135 (30%)
- Taxa de Resolução Título: 95%
- Tempo Médio Resolução: 2.1 dias
```

---

### 🔧 **Configuração no Google Apps Script**

### Endpoints Disponíveis:

1. **?action=newTicket** - Insere novo chamado na aba CHAMADOS
2. **?action=updateTicket** - Atualiza chamado e adiciona observação
3. **?action=deleteTicket** - Move chamado para CHAMADOS_EXCLUIDOS
4. **?action=newUser** - Insere novo usuário na aba USUARIOS
5. **?action=validateUser** - Valida login consultando aba USUARIOS
6. **?action=getTickets** - Retorna chamados com filtros
7. **?action=getUsers** - Lista usuários ativos
8. **?action=getCategorias** - Retorna categorias e demandas hierárquicas
9. **?action=adicionarVoluntario** - Cadastro público de voluntários
10. **?action=buscarUsuarios** - Busca usuários para coordenador
11. **?action=atualizarStatusUsuario** - Atualiza status de usuário
12. **?action=atualizarTotaisIgrejas** - Auto-atualiza totais na aba IGREJAS_REGIOES
13. **?action=generateReport** - Gera relatório básico mensal
14. **?action=generateAdvancedReport** - Gera relatórios avançados com análise de metas

### Novos Endpoints de Relatórios:

**generateAdvancedReport** - Parâmetros:
```json
{
  "action": "generateAdvancedReport",
  "tipo": "GERAL|REGIAO|IGREJA",
  "filtroNome": "Nome da região ou igreja (opcional)"
}
```

**Retorna:**
```json
{
  "success": true,
  "message": "X relatório(s) gerado(s) com sucesso!",
  "dados": {
    "tipo": "GERAL",
    "filtro": null,
    "relatoriosGerados": 10,
    "dadosGerais": {
      "totalMembros": 10640,
      "totalVoluntarios": 125,
      "totalCoordenadores": 56,
      "totalChamados": 450,
      "chamadosResolvidos": 380,
      "chamadosTituloEleitor": 135,
      "igrejas": 56
    },
    "regioes": 9,
    "igrejas": 56
  }
}
```

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

## �️ **ABA 10: ELEICOES_DEPUTADOS** *(Nova)*
Esta aba gerencia dados eleitorais por região, igreja e município para análise estratégica de eleições de deputados federais e estaduais.

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo |
|--------|---------------|------|-----------|---------|
| A | ID | Texto | Identificador único do município | MUN001, MUN002, etc. |
| B | REGIAO | Texto | Região de localização | Oeste Paulista, Vale do Ribeira |
| C | IGREJA | Texto | Nome da igreja responsável | ICEOB Presidente Prudente |
| D | MUNICIPIO | Texto | Nome do município | Presidente Prudente |
| E | ENDERECO | Texto | Endereço da igreja (opcional) | Rua das Flores, 123 |
| F | HABITANTES | Número | População total do município | 230000 |
| G | OBREIROS | Número | Quantidade de obreiros na igreja | 150 |
| H | GRUPOS_SEM_OBREIROS | Número | Grupos sem obreiros | 80 |
| I | POVO_GERAL | Número | Membros não obreiros | 500 |
| J | ARIMATEIAS_OBREIROS | Número | Arimatéias somente obreiros | 120 |
| K | TOTAL_ARIMATEIAS | Número | Total de arimatéias (calculado) | 200 |
| L | VOTOS_DF_2018 | Número | Votos para Deputado Federal em 2018 | 450 |
| M | VOTOS_DF_2022 | Número | Votos para Deputado Federal em 2022 | 520 |
| N | VOTOS_DE_2018 | Número | Votos para Deputado Estadual em 2018 | 380 |
| O | VOTOS_DE_2022 | Número | Votos para Deputado Estadual em 2022 | 440 |
| P | DATA_CADASTRO | Data | Data de cadastro no sistema | 15/01/2024 |
| Q | ULTIMA_ATUALIZACAO | Data/Hora | Última modificação no registro | 16/01/2024 14:30 |
| R | OBSERVACOES | Texto Longo | Observações e anotações estratégicas | Igreja em crescimento... |

**🗳️ Campos Calculados Automáticos:**
- **Crescimento DF**: (VOTOS_DF_2022 - VOTOS_DF_2018) / VOTOS_DF_2018 * 100
- **Crescimento DE**: (VOTOS_DE_2022 - VOTOS_DE_2018) / VOTOS_DE_2018 * 100
- **Eficiência Eleitoral**: (VOTOS_DF_2022 + VOTOS_DE_2022) / TOTAL_ARIMATEIAS
- **Percentual Arimatéias Obreiros**: ARIMATEIAS_OBREIROS / TOTAL_ARIMATEIAS * 100

**📊 Relatórios Avançados Disponíveis:**
1. **Ranking de Igrejas por Eficiência Eleitoral**
2. **Análise de Crescimento por Região**
3. **Comparativo 2018 vs 2022**
4. **Potencial Eleitoral por Município**
5. **Demografia Religiosa e Política**

**🔒 Acesso Ultrarrestrito:**
- **COORDENADORES**: Acesso completo para gerenciamento e relatórios
- **DEMAIS USUÁRIOS**: Sem acesso a dados eleitorais

**⚠️ Observações Importantes:**
- Dados sensíveis que requerem máxima segurança
- Usado para planejamento estratégico de campanhas
- Análise de eficiência organizacional por região
- Acompanhamento de crescimento eleitoral e demográfico

---

## �🚀 **Próximos Passos**

1. **Criar as planilhas** no Google Sheets com as estruturas acima
2. **Configurar o Google Apps Script** seguindo o arquivo `CONFIGURACAO_GOOGLE_APPS_SCRIPT.md`
3. **Testar a integração** com dados de exemplo
4. **Ajustar as validações** conforme necessário
5. **Implementar relatórios automáticos**

---

**💡 Dica**: Use a formatação condicional no Google Sheets para destacar chamados por status, prioridade ou tempo de resolução!
