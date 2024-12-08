## Sumário
- [Instalação](#instalação)
  - [Pré-requisitos](#pré-requisitos)
  - [Passos](#passos)
- [Conceito](#conceito)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Documentação Adicional](#documentação-adicional)
- [Contribuições](#contribuições)

---

## Instalação

### Pré-requisitos

Antes de começar, verifique se você tem os seguintes softwares instalados:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (preferencialmente) ou [npm](https://www.npmjs.com/)

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/brunossantana/poc-auth-open-id.git
   ```

2. Navegue até a pasta do repositório:
   ```bash
   cd poc-auth-open-id/openid-client
   ```

3. Instale as dependências:
   ```bash
   pnpm install
   ```

4. Inicie o servidor cliente:
   ```bash
   pnpm dev
   ```

> **Nota**: Esses passos são específicos para rodar apenas o `openid-client`, que foi o foco principal da prova de conceito (POC). Outros servidores podem ser iniciados de maneira semelhante, mas atualmente não estão sendo utilizados.

---

## Conceito

O OpenID Connect é um protocolo de autenticação baseado no framework OAuth 2.0 (RFC 6749 e 6750). Ele simplifica a verificação da identidade de usuários, permitindo que as informações sobre os usuários sejam obtidas de forma interoperável e segura.

O protocolo permite que desenvolvedores de aplicativos e sites integrem facilmente fluxos de login e recebam afirmações verificáveis sobre os usuários, seja em clientes baseados na Web, dispositivos móveis ou em JavaScript. Além disso, a especificação é extensível, podendo suportar recursos adicionais como criptografia de dados de identidade e logout de sessão.

---

## Estrutura do Repositório

Aqui está uma visão geral das pastas e arquivos principais do repositório:

- `openid-client/`: Contém o código principal do cliente OpenID.
- `docs/`: Contém documentação adicional relacionada ao objeto de estudo.
- Outros arquivos de configuração como `.dockerignore`, `Dockerfile`, etc.

---

## Documentação Adicional

Documentos úteis para entender melhor a arquitetura e os conceitos usados podem ser encontrados na pasta `docs/`.

---

## Contribuições

Se você deseja contribuir com o projeto, fique à vontade para abrir uma *issue* ou submeter um *pull request*. Sugestões e melhorias são sempre bem-vindas!