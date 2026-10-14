import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { odooAuth, runAgent, speak, transcribe } from "./assistant.server";

export const transcribeAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { audio: string; mime: string }) => {
    if (!d?.audio || d.audio.length > 15_000_000) throw new Error("Audio invalide");
    return d;
  })
  .handler(async ({ data }) => ({ text: await transcribe(data.audio, data.mime) }));

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { text: string }) => {
    const text = String(d?.text || "").trim().slice(0, 4000);
    if (!text) throw new Error("Message vide");
    return { text };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error: e1 } = await supabase.from("messages").insert({ user_id: userId, role: "user", content: data.text });
    if (e1) throw new Error(e1.message);
    const [{ data: hist }, { data: odoo }] = await Promise.all([
      supabase.from("messages").select("role, content").order("created_at", { ascending: false }).limit(14),
      supabase.from("odoo_connections").select("url, db, username, api_key").maybeSingle(),
    ]);
    const history = (hist || []).reverse().map((m) => ({ role: m.role, content: m.content }));
    const { appsSummary, runAppAction } = await import("./assistant-apps.server");
    const { reply, board, open } = await runAgent(history, odoo ?? null, {
      summary: appsSummary(),
      run: async (app, action, input) => {
        const r = await runAppAction({ db: supabase as never, userId }, app, action, input);
        await supabase.from("lab_activity").insert({ user_id: userId, kind: `aura:${app}.${action}`, app_key: app === "lab" ? null : app });
        return r;
      },
    });
    const { error: e2 } = await supabase
      .from("messages")
      .insert({ user_id: userId, role: "assistant", content: reply, board: board as never });
    if (e2) throw new Error(e2.message);
    let audio: string | null = null;
    try {
      audio = await speak(reply);
    } catch (e) {
      console.error(e);
    }
    return { reply, board, audio, open };
  });

export const saveOdoo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { url: string; db: string; username: string; api_key: string }) => {
    if (!/^https?:\/\//.test(d.url) || !d.db || !d.username || !d.api_key) throw new Error("Champs invalides");
    return d;
  })
  .handler(async ({ data, context }) => {
    await odooAuth(data);
    const { error } = await context.supabase
      .from("odoo_connections")
      .upsert({ ...data, user_id: context.userId, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
