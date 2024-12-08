import "dotenv/config";

// Carregar variáveis de ambiente
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
export const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID as string;
export const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET as string;