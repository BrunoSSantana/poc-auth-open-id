import { Provider } from "oidc-provider";

const oidc = new Provider("http://localhost:3000", {
	clients: [
		{
			client_id: "client-id",
			client_secret: "client-secret",
			redirect_uris: ["http://localhost:4000/callback"],
		},
	],
	jwks: { keys: [{}] },
});

oidc.listen(3000, () => {
	console.log(
		"oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration",
	);
});
