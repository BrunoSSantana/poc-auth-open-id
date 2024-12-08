import type { Context } from "hono";
import * as jose from "jose";
import { configIdPs } from "./config.js";
import type { IdPConfig, JWKS, TokenResponse } from "./types.js";

// Função para buscar o JWKS (JSON Web Key Set) de um IdP
export async function getJWKs(idp: keyof typeof configIdPs) {
	const jwks = await fetch(configIdPs[idp].jwks_url);

	if (!jwks.ok) {
		throw new Error(`Erro ao obter JWKS de ${idp}`);
	}

	const jwksJson = await jwks.json();
	return jwksJson as JWKS;
}

// Função para obter a chave pública (PEM) a partir de um JWK (JSON Web Key)
export async function getPemFromJWK(kid: string, jwks: JWKS) {
	const key = jwks.keys.find((k) => k.kid === kid);
	if (!key) {
		throw new Error("Chave não encontrada no JWKS");
	}
	return await jose.importJWK(key); // Converte o JWK para PEM
}

export async function decodeGoogleAccessToken(token: string) {
	const response = await fetch(
		`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
	);

	if (!response.ok) {
		throw new Error("Token not found");
	}

	return response.json();
}

// Função genérica para construir URLs de login para diferentes IdPs
export function generateLoginUrlForIdP(idpConfig: IdPConfig): string {
	const loginUrl = new URL(idpConfig.auth_server);
	loginUrl.searchParams.set("client_id", idpConfig.client_id);
	loginUrl.searchParams.set("redirect_uri", idpConfig.redirect_uri);
	loginUrl.searchParams.set("response_type", "code"); // configuração do fluxo de autorização
	loginUrl.searchParams.set("scope", idpConfig.scope);
	return loginUrl.toString();
}

// Função principal de callback
export async function handleOAuthCallback(c: Context) {
	const idpName = c.req.param("idp") as keyof typeof configIdPs;
	const code = c.req.query("code");

	if (!code) {
		return c.text("Código de autorização ausente", 400);
	}

	try {
		// Configuração do IdP
		const idpConfig = getIdPConfig(idpName);

		// Troca de código por tokens
		const tokens = await exchangeCodeForTokens(idpConfig, code);

		// Buscar perfil do usuário (se aplicável)
		const userProfile = await fetchUserProfile(idpConfig, tokens.access_token);

		// Verificação e decodificação de tokens
		const idTokenHeader = jose.decodeProtectedHeader(tokens.id_token);
		const accessTokenHeader =
			idpName !== "google"
				? jose.decodeProtectedHeader(tokens.access_token)
				: await decodeGoogleAccessToken(tokens.access_token);

		const jwks = await getJWKs(idpName);

		const idTokenPK = await getPemFromJWK(idTokenHeader.kid as string, jwks);
		const accessTokenPK = accessTokenHeader.kid
			? await getPemFromJWK(accessTokenHeader.kid, jwks)
			: null;

		const { payload: idTokenDecoded } = await jose.jwtVerify(
			tokens.id_token,
			idTokenPK,
		);
		const { payload: accessTokenDecoded } = accessTokenPK
			? await jose.jwtVerify(tokens.access_token, accessTokenPK)
			: { payload: accessTokenHeader };

		// Renderização do resultado
		return c.html(`
      <h1>Autenticado via ${idpConfig.name}</h1>
      <div class="tokens-container">
        <details>
          <summary>Tokens Brutos</summary>
          <pre>${JSON.stringify(tokens, null, 2)}</pre>
        </details>
        ${
					idTokenHeader
						? `
          <details>
            <summary>Header do ID Token</summary>
            <pre>${JSON.stringify(idTokenHeader, null, 2)}</pre>
          </details>
        `
						: ""
				}
        ${
					idTokenDecoded
						? `
          <details>
            <summary>ID Token Decodificado</summary>
            <pre>${JSON.stringify(idTokenDecoded, null, 2)}</pre>
          </details>
        `
						: ""
				}
        ${
					accessTokenHeader
						? `
          <details>
            <summary>Header do Access Token</summary>
            <pre>${JSON.stringify(accessTokenHeader, null, 2)}</pre>
          </details>
        `
						: ""
				}
        ${
					accessTokenDecoded
						? `
          <details>
            <summary>Access Token Decodificado</summary>
            <pre>${JSON.stringify(accessTokenDecoded, null, 2)}</pre>
          </details>
        `
						: ""
				}
        ${
					userProfile
						? `
          <details>
            <summary>Perfil do Usuário</summary>
            <pre>${JSON.stringify(userProfile, null, 2)}</pre>
          </details>
        `
						: ""
				}
        <a href="/">Voltar</a>
      </div>
    `);
	} catch (error) {
		console.error(`Erro na autenticação com ${idpName}:`, error);
		return c.text("Erro na autenticação", 500);
	}
}

// Função para buscar o perfil do usuário
async function fetchUserProfile(idpConfig: IdPConfig, accessToken: string) {
	if (idpConfig.name === "Google" && idpConfig.profile_url) {
		try {
			const response = await fetch(idpConfig.profile_url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			return await response.json();
		} catch (error) {
			console.error("Erro ao buscar perfil do usuário:", error);
			return null;
		}
	}
	return null;
}

// Função para obter configuração do IdP
function getIdPConfig(idpName: keyof typeof configIdPs): IdPConfig {
	const idpConfigs: Record<string, IdPConfig> = {
		local: configIdPs.local,
		google: configIdPs.google,
		keycloak: configIdPs.keycloak,
	};

	const idpConfig = idpConfigs[idpName];
	if (!idpConfig) {
		throw new Error("IdP não suportado");
	}
	return idpConfig;
}

// Função para trocar código por tokens
async function exchangeCodeForTokens(
	idpConfig: IdPConfig,
	code: string,
): Promise<TokenResponse> {
	const tokenResponse = await fetch(idpConfig.token_server, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			client_id: idpConfig.client_id,
			client_secret: idpConfig.client_secret,
			redirect_uri: idpConfig.redirect_uri,
		}),
	});

	if (!tokenResponse.ok) {
		throw new Error("Falha na troca de tokens");
	}

	return await tokenResponse.json();
}
