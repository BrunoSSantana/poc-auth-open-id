import type { AddressInfo } from "node:net";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { configIdPs } from "./config.js";
import { generateLoginUrlForIdP, handleOAuthCallback } from "./utils.js";

const app = new Hono();

// Página inicial com múltiplas opções de login
app.get("/", (c) => {
	return c.html(`
    <h1>Multi-IdP Login</h1>
    <h2>Escolha seu método de login:</h2>
    <ul>
      <li><a href="/login/local">Login com IdP Local</a></li>
      <li><a href="/login/google">Login com Google</a></li>
      <li><a href="/login/keycloak">Login com Keycloak</a></li>
    </ul>
  `);
});

// Rotas de login para cada IdP
app.get("/login/local", (c) => {
	const loginUrl = generateLoginUrlForIdP(configIdPs.local);
	return c.redirect(loginUrl);
});

app.get("/login/google", (c) => {
	const loginUrl = generateLoginUrlForIdP(configIdPs.google);
	return c.redirect(loginUrl);
});

// Rota de login específica para Keycloak
app.get("/login/keycloak", (c) => {
	const loginUrl = generateLoginUrlForIdP(configIdPs.keycloak);
	return c.redirect(loginUrl);
});

// Rota de callback de login
app.get("/callback/:idp", handleOAuthCallback);

// Rota de recurso protegido (mantida do código original)
app.get("/resource", async (c) => {
	const response = await fetch("http://localhost:5000/api/protected", {
		headers: {
			Authorization: "Bearer " + "your-access-token",
		},
	});
	const data = await response.json();
	return c.json(data);
});

serve(
	{
		fetch: app.fetch,
		port: 4000,
	},
	(info: AddressInfo) => {
		console.log(`Cliente rodando em http://localhost:${info.port}`);
	},
);
