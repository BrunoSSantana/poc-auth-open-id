import fs from "node:fs";
import path from "node:path";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

const app = new Hono();

const DIRNAME = path.dirname(new URL(import.meta.url).pathname);
const PUBLIC_KEY_PATH = path.join(DIRNAME, "../../public_key.pem");
const PRIVATE_KEY_PATH = path.join(DIRNAME, "../../private_key.pem");

const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");

// Configuração do OIDC
const issuer = "http://localhost:3000";
const clients = [
	{
		client_id: "client-id",
		client_secret: "client-secret",
		redirect_uri: "http://localhost:4000/callback",
	},
];

// Sessões simuladas
const users = [{ id: "1", username: "user", password: "pass" }];
const sessions = new Map();

// Utilitário para gerar tokens
function generateToken(payload: JWTPayload) {
	return sign(payload, privateKey, "RS256");
}

// Endpoint para Discovery Document
app.get("/.well-known/openid-configuration", (c) => {
	return c.json({
		issuer,
		authorization_endpoint: `${issuer}/authorize`,
		token_endpoint: `${issuer}/token`,
		userinfo_endpoint: `${issuer}/userinfo`,
		jwks_uri: `${issuer}/.well-known/jwks.json`,
		response_types_supported: ["code", "id_token"],
		subject_types_supported: ["public"],
		id_token_signing_alg_values_supported: ["RS256"],
	});
});

// Endpoint para JWKS (chave pública)
app.get("/.well-known/jwks.json", (c) => {
	return c.json({
		keys: [
			{
				kty: "RSA",
				kid: "1",
				use: "sig",
				alg: "RS256",
				n: Buffer.from(privateKey).toString("base64"),
				e: "AQAB",
			},
		],
	});
});

// Endpoint /authorize
app.get("/authorize", (c) => {
	const query = c.req.query();
	const { client_id, redirect_uri, response_type, scope } = query;

	// Verifique se o client_id e o redirect_uri estão corretos
	const client = clients.find((c) => c.client_id === client_id);
	const clientNotFound = !client;
	const invalidRedirectUri = client?.redirect_uri !== redirect_uri;

	if (clientNotFound || invalidRedirectUri) {
		return c.json({ error: "Invalid client_id or redirect_uri" }, 400);
	}

	// Gere o codigo de autorização
	const authCode = Math.random().toString(36).substring(7); // Código de autorização fictício
	sessions.set(authCode, { client_id, scope });

	// Checar se redireciona ou retorna o código de autorização
	return c.redirect(`${redirect_uri}/local?code=${authCode}`);

	/* return c.json({ code: authCode }); */
});

// Endpoint /token
app.post("/token", async (c) => {
	const { code, client_id, client_secret, redirect_uri } =
		await c.req.parseBody();

	const session = sessions.get(code);
	const sessionNotFound = !session;
	const clientIdMismatch = session?.client_id !== client_id;

	if (sessionNotFound || clientIdMismatch) {
		return c.json({ error: "Invalid authorization code" }, 400);
	}

	const client = clients.find(
		(c) => c.client_id === client_id && c.client_secret === client_secret,
	);

	if (!client || client.redirect_uri !== redirect_uri) {
		return c.json({ error: "Invalid client credentials" }, 400);
	}

	// Gerar ID Token e Access Token
	const idToken = await generateToken({
		sub: "1",
		aud: client_id,
		iss: issuer,
	});

	const accessToken = await generateToken({ scope: session.scope });

	return c.json({
		id_token: idToken,
		access_token: accessToken,
		token_type: "Bearer",
	});
});

// Endpoint /userinfo
app.get("/userinfo", async (c) => {
	const authHeader = c.req.header("Authorization");
	const token = authHeader?.split(" ")[1];
	if (!token) return c.json({ error: "Unauthorized" }, 401);

	try {
		const decoded = await verify(token, publicKey, "RS256");
		return c.json({ sub: decoded.sub, scope: decoded.scope });
	} catch (e) {
		return c.json({ error: "Invalid token" }, 401);
	}
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		if (info) {
			console.log(`OIDC Provider running at http://localhost:${info.port}`);
		}
	},
);
