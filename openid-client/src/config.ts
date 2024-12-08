import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET,
} from "./envs.js";

// Configurações dos Identity Providers (IdPs)
export const configIdPs = {
	// IdP local fictício para exemplo
	local: {
		name: "Local IdP",
		client_id: "client-id",
		client_secret: "client-secret",
		auth_server: "http://localhost:3000/authorize",
		token_server: "http://localhost:3000/token",
		redirect_uri: "http://localhost:4000/callback/local",
		jwks_url: "http://localhost:3000/.well-known/jwks.json",
		scope: "openid profile",
		profile_url: "http://localhost:3000/profile",
	},
	// Configuração para o IdP do Google
	google: {
		name: "Google",
		client_id: GOOGLE_CLIENT_ID,
		client_secret: GOOGLE_CLIENT_SECRET,
		auth_server: "https://accounts.google.com/o/oauth2/v2/auth",
		token_server: "https://oauth2.googleapis.com/token",
		redirect_uri: "http://localhost:4000/callback/google",
		jwks_url: "https://www.googleapis.com/oauth2/v3/certs",
		scope: "openid email profile",
		profile_url: "https://www.googleapis.com/oauth2/v1/userinfo",
	},
	// Configuração do Keycloak (IdP)
	keycloak: {
		name: "Keycloak",
		client_id: KEYCLOAK_CLIENT_ID,
		client_secret: KEYCLOAK_CLIENT_SECRET,
		auth_server:
			"http://localhost:7080/realms/my-realm/protocol/openid-connect/auth",
		token_server:
			"http://localhost:7080/realms/my-realm/protocol/openid-connect/token",
		redirect_uri: "http://localhost:4000/callback/keycloak",
		jwks_url:
			"http://localhost:7080/realms/my-realm/protocol/openid-connect/certs",
		scope: "openid profile email offline_access",
		profile_url:
			"http://localhost:7080/realms/my-realm/protocol/openid-connect/userinfo",
	},
};
