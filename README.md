# Balcão da Cidadania

Sistema de Gestão de Atendimento ao Cidadão desenvolvido para a organização Arimateia.

## 📋 Descrição

O Balcão da Cidadania é uma aplicação web completa para gerenciar atendimentos e chamados de cidadãos, com diferentes níveis de acesso baseados em funções (Voluntário, Secretaria, Coordenador).

## 🚀 Funcionalidades

### Para Voluntários
- ✅ Visualizar chamados da sua região
- ✅ Criar novos chamados
- ✅ Dashboard personalizado

### Para Secretaria
- ✅ Todas as funcionalidades de Voluntário
- ✅ Editar status e observações de chamados
- ✅ Filtros avançados por região, igreja, status
- ✅ Visualização em cards ou tabela
- ✅ Exportar dados para CSV

### Para Coordenador
- ✅ Todas as funcionalidades anteriores
- ✅ Excluir chamados (exclusão lógica)
- ✅ Gerenciar usuários (adicionar voluntários, secretários)
- ✅ Relatórios gerais e estatísticas
- ✅ Painel de administração completo

## 🔐 Sistema de Autenticação

- Login com email e senha
- Senha padrão: `Arimateia1` (deve ser alterada no primeiro acesso)
- Controle de acesso baseado em funções
- Sessão com timeout automático

## 🎨 Interface

- Design moderno e responsivo
- Mobile-first approach
- Acessibilidade otimizada
- Tema consistente com a identidade visual

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Integração**: Power Automate + Google Sheets
- **Estilo**: CSS Grid, Flexbox, CSS Variables
- **Responsividade**: Mobile-first design

## 📁 Estrutura do Projeto

```
/
├── index.html                 # Página de login
├── dashboard.html            # Dashboard principal
├── balcao.html              # Gestão de chamados
├── secretaria.html          # Funcionalidades da secretaria
├── coordenador.html         # Painel de coordenação
│
├── /scripts
│   ├── main.js              # Lógica principal da aplicação
│   ├── auth.js              # Sistema de autenticação
│   ├── user.js              # Gestão de usuários
│   ├── helpers.js           # Funções utilitárias
│   └── flow.js              # Integração Power Automate
│
├── /assets
│   ├── style.css            # Estilos principais
│   ├── logo.png             # Logo da organização
│   └── default-avatar.png   # Avatar padrão
│
├── /data
│   └── config.js            # Configurações do sistema
│
└── /templates
    ├── card-chamado.html     # Template de chamado
    ├── card-voluntario.html  # Template de voluntário
    └── modal-editar.html     # Template de modal de edição
```

## 🚀 Como Usar

### 1. Configuração Inicial

1. Configure o URL do Power Automate em `/data/config.js`
2. Ajuste as configurações de regiões e igrejas conforme necessário
3. Configure o servidor web para servir os arquivos

### 2. Primeiro Acesso

1. Acesse `index.html`
2. Use uma das contas de demonstração:
   - **Voluntário**: `voluntario@arimateia.org`
   - **Secretaria**: `secretaria@arimateia.org`
   - **Coordenador**: `coordenador@arimateia.org`
3. Senha padrão: `Arimateia1`

### 3. Configuração do Power Automate

Para integração completa, configure os seguintes endpoints no Power Automate:

- `POST /new-ticket` - Criar novo chamado
- `POST /update-ticket` - Atualizar chamado existente
- `POST /delete-ticket` - Excluir chamado (lógico)
- `POST /new-user` - Criar novo usuário
- `POST /validate-user` - Validar credenciais de usuário

## 📊 Integração com Google Sheets

O sistema está preparado para integração com Google Sheets via Power Automate:

### Planilhas Recomendadas:
1. **Chamados** - Armazena todos os chamados
2. **Usuários** - Cadastro de voluntários, secretários e coordenadores
3. **Chamados_Excluidos** - Histórico de chamados excluídos
4. **Observacoes** - Histórico de alterações nos chamados

### Campos Principais:
- **Chamados**: ID, Nome, CPF, Contato, Igreja, Região, Descrição, Status, Data_Abertura, Criado_Por
- **Usuários**: ID, Nome, Email, Cargo, Região, Igreja, Telefone, Status, Data_Cadastro

## 🔒 Segurança

- Validação de entrada em todos os formulários
- Sanitização de HTML para prevenir XSS
- Controle de acesso baseado em funções
- Sessões com timeout automático
- Exclusão lógica (não física) de registros

## 📱 Responsividade

- Layout otimizado para dispositivos móveis
- Breakpoints: 480px, 768px, 1200px
- Touch-friendly (botões com altura mínima de 44px)
- Navegação adaptativa

## 🎯 Próximas Funcionalidades

- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Chat interno entre usuários
- [ ] Anexos de arquivos nos chamados
- [ ] Dashboard com gráficos avançados
- [ ] Relatórios em PDF
- [ ] Integração com WhatsApp Business

## 🐛 Solução de Problemas

### Problemas Comuns:

1. **Login não funciona**
   - Verifique se o email está cadastrado no sistema
   - Confirme se está usando a senha padrão `Arimateia1`

2. **Chamados não carregam**
   - Verifique a conexão com o Power Automate
   - Confirme se o usuário tem permissão para a região

3. **Botões não aparecem**
   - Verifique se o usuário tem as permissões necessárias
   - Confirme se o JavaScript está habilitado

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto foi desenvolvido especificamente para a organização Arimateia.

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024  
**Desenvolvido por**: Equipe de Desenvolvimento Arimateia
# ArimateiaService
# Arimateia-Service1
