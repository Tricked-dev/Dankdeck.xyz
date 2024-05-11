import type { APIRoute } from "astro";

export const ALL: APIRoute = ({ request }) => {
  const cookies = request.headers.get("cookie");

  let headers = new Headers();

  headers.append("Content-Type", "text/plain");

  const rmCookies = `
authjs.callback-url=;
authjs.state=; 
authjs.pkce.code_verifier=; 
authjs.session-token=; 
token=; 
authjs.callback-url=;
authjs.csrf-token=;
`
    .trim()
    .split("\n");

  for (const cookie of rmCookies) {
    headers.append(
      "Set-Cookie",
      cookie.trim() +
        `Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT HttpOnly; SameSite=Lax`,
    );
  }

  // 2. Create a new response
  const response = new Response("Content", {
    headers: headers,
  });

  return response;
};
2;
