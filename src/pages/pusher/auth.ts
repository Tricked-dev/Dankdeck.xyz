import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";

export const POST: APIRoute = async ({ request }) => {
  const { default: Pusher } = await import("pusher");
  const session = await getSession(request);

  if (!session || !session.user) {
    return new Response(null, { status: 401 });
  }

  const body = await request.formData();

  const socketId = body.get("socket_id");
  const channel = body.get("channel_name");
  const presenceData = {
    user_id: session.user.id,
    user_info: {
      name: session.user.name,
      image: session.user.image,
      id: session.user.id,
    },
  };
  // This authenticates every user. Don't do this in production!
  const pusher = new Pusher({
    appId: import.meta.env.PUSHER_APP_ID,
    key: import.meta.env.PUBLIC_PUSHER_APP_KEY,
    secret: import.meta.env.PUSHER_APP_SECRET,
    cluster: import.meta.env.PUSHER_APP_CLUSTER,
    useTLS: true,
  });
  const authResponse = pusher.authorizeChannel(
    socketId!.toString(),
    channel!.toString(),
    presenceData,
  );
  return new Response(JSON.stringify(authResponse), { status: 200 });
};
