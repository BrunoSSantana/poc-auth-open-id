Sumario

## Instalação

Pré-requisitos:
- [x] Docker
- [x] Docker Compose
- [x] git
- [x] Node
- [x] pnpm (preferencialmente) ou npm

Passos:
- clone do repositório: `git clone https://github.com/brunossantana/poc-auth-open-id.git`
- navegue para a pasta do repositório: `cd poc-auth-open-id/openid-client`
- instale as dependências: `pnpm install`
- inicie o servidor cliente: `pnpm dev`

> Esses passos são para rodar apenas o openid-client que foi meu foco principal na poc. Os outros servidores não dei tanto foco, mas eles podem ser iniciados de maneira similar, mas atualmente não estão sendo usados.

Nesse repositório temos também outros artefatos que podem contribuir para um melhor entendimento do objeto de estudo que podem ser encontrados na pasta `docs/`.

## Conceito

OpenID Connect é um protocolo de autenticação interoperável baseado no framework de especificações OAuth 2.0 (IETF RFC 6749 e 6750). Ele simplifica a forma de verificar a identidade de usuários com base na autenticação realizada por um Servidor de Autorização e de obter informações de perfil do usuário de maneira interoperável e semelhante ao padrão REST.

O OpenID Connect permite que desenvolvedores de aplicativos e sites iniciem fluxos de login e recebam afirmações verificáveis sobre os usuários em clientes baseados na Web, dispositivos móveis e JavaScript. Além disso, a suíte de especificações é extensível para suportar uma variedade de recursos opcionais, como criptografia de dados de identidade, descoberta de Provedores de OpenID e logout de sessão.

Para desenvolvedores, ele oferece uma resposta segura e verificável à pergunta: “Qual é a identidade da pessoa que está atualmente usando o navegador ou aplicativo móvel conectado?” O melhor de tudo é que elimina a responsabilidade de definir, armazenar e gerenciar senhas, frequentemente associadas a violações de dados baseadas em credenciais.


O OpenID Connect permite um ecossistema de identidade na Internet por meio de integração e suporte fáceis, configuração de segurança e preservação de privacidade, interoperabilidade, amplo suporte a clientes e dispositivos, e permitindo que qualquer entidade seja um Provedor OpenID (OP).
O protocolo OpenID Connect, de forma abstrata, segue os seguintes passos: