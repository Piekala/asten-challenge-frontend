# Visão Geral

Este projeto é um painel de administração que permite gerenciar acessos de usuários a diferentes recursos (Documentos, Área Privada e Área Interna). Ele oferece funcionalidades para visualizar acessos válidos, expirados e prestes a expirar, além de permitir a revogação de acessos.
por padrão também criei o primeiro usuário com email "admin" e senha "admin" para testes iniciais, também há alguns polimentos faltando como criar um arquivo de serviços para colocar funções como a de alteração de tema e de logout que foram reutilizadas diversas vezes ou o modal de confirmação ser transformado em genérico com title, text e callback.

## Frontend

### Tecnologias

- **Framework**: Vue.js (com Quasar Framework)
- **Gerenciamento de Estado**: Vuex (ou Composition API)
- **Requisições HTTP**: Axios
- **Estilização**: CSS, SCSS ou Quasar components

### Estrutura do Projeto

- `src/`
  - `components/`: Componentes reutilizáveis (ex: UserModal.vue)
  - `pages/`: Páginas da aplicação (ex: UserPermissionsPage.vue)
  - `router/`: Configuração das rotas

### Componentes Principais

- **UserPermissionsPage.vue**: Página principal que exibe acessos válidos, expirados e prestes a expirar.
- **UserModal.vue**: Modal para gerenciar acessos de um usuário específico.
- **awaitingUsers.vue**: Pagina de autorização de novos usuários.
- **userList.vue**: Página de concessão de permissões a um usuário já autorizado.

---

### 5. Estrutura do Projeto

#### 5.1 Layouts: Molduras das pessoas: usuário e admin

#### 5.2 Componentes: Componente genérico de Modal.

#### 5.3 Pages: Páginas usadas por toda a aplicação.

###### 5.3.1 Auth: Páginas focadas no usuário autenticado.

###### 5.3.2 Admin: Páginas focadas no Admin.

#### 5.4 Router: rotas da aplicação.

## Instalação: npm install

## Rodando a aplicação: npx quasar dev
