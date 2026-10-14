import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getRequestHeader } from "@tanstack/react-start/server";

function getOrigin() {
  const host = getRequestHeader("x-forwarded-host") ?? getRequestHeader("host");
  const proto = getRequestHeader("x-forwarded-proto") ?? "https";
  if (!host) throw new Error("no host header");
  return `${proto}://${host}`;
}

export const startGmailOAuth = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { buildAuthUrl } = await import("./gmail.server");
    const origin = getOrigin();
    // state = base64(userId) so the public callback knows whom to attach to
    const state = Buffer.from(JSON.stringify({ uid: context.userId, t: Date.now() })).toString("base64url");
    return { url: buildAuthUrl(origin, state) };
  });

export const disconnectGmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("gmail_credentials").delete().eq("user_id", context.userId);
    return { ok: true };
  });

export const generateChatLinkCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await supabaseAdmin.from("chat_link_codes").delete().eq("user_id", context.userId);
    const { error } = await supabaseAdmin.from("chat_link_codes").insert({ code, user_id: context.userId });
    if (error) throw new Error(error.message);
    const origin = getOrigin();
    return { code, endpoint: `${origin}/api/public/google-chat` };
  });

export const unlinkChatSpace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { spaceId: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("google_chat_links").delete().eq("space_id", data.spaceId).eq("user_id", context.userId);
    return { ok: true };
  });
