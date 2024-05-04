import { getSession } from "auth-astro/server";

export function createResponse(
  status: number,
  body: any,
  headers?: Record<string, string>,
) {
  if (status > 399 && status < 600) {
    return new Response(JSON.stringify({ error: body, data: null }), {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      status,
    });
  } else {
    return new Response(JSON.stringify({ error: null, data: body }), {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      status,
    });
  }
}

export const errors = {
  unauthorized: () => createResponse(401, "Unauthorized"),
  forbidden: () => createResponse(403, "Forbidden"),
  zodError: (error: any) => createResponse(400, error),
};

export async function requireSession(request: Request) {
  const session = await getSession(request);

  if (!session?.user?.id) {
    return { r: errors.unauthorized(), session: null };
  } else {
    return { r: null, session: session };
  }
}
