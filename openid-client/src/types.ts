export interface TokenResponse {
	access_token: string;
	id_token: string;
}

// Interface para configuração de IdPs (Identity Providers)
export interface IdPConfig {
	name: string;
	client_id: string;
	client_secret: string;
	auth_server: string;
	token_server: string;
	redirect_uri: string;
	scope: string;
	profile_url: string;
}

export interface JWKS {
	keys: JWK[];
}

export interface JWK {
	kid: string;
	kty: string;
	alg: string;
	use: string;
	n: string;
	e: string;
	x5c: string[];
	x5t: string;
	"x5t#S256": string;
}
