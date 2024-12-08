import fs from "node:fs";
import type { AddressInfo } from "node:net";
import path from "node:path";
import { serve } from "@hono/node-server";
import { type Context, Hono, type Next } from "hono";
import { verify } from "hono/jwt";

const app = new Hono();

async function validateToken(c: Context, next: Next) {
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return c.json({ error: "Missing token" }, 401);
	}

	const token = authHeader.split(" ")[1];

	const DIRNAME = path.dirname(new URL(import.meta.url).pathname);
	const PUBLIC_KEY_PATH = path.join(DIRNAME, "../../public_key.pem");
	const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, "utf-8");

	try {
		await verify(token, PUBLIC_KEY, "RS256");
		await next();
	} catch (err) {
		return c.json({ error: "Invalid token" }, 401);
	}
}

app.get("/api/protected", validateToken, (c) => {
	return c.json({ message: "This is a protected resource!" });
});

serve(
	{
		fetch: app.fetch,
		port: 5000,
	},
	(info: AddressInfo) => {
		console.log(`Resource Server running at http://localhost:${info.port}`);
	},
);
