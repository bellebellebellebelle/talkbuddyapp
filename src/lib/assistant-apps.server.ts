import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { applications } from "./laboratory";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Ctx = { db: SupabaseClient<any, "public", any>; userId: string };
type Action = { description: string; input: z.ZodObject<any>; run: (ctx: Ctx, input: any) => Promise<unknown> };

/**
 * Actions the voice assistant can execute, per app key.
 * Every app in the lab catalog is automatically known to the assistant (name + description);
 * add an entry here with the app's key to let the assistant perform tasks in it.
 */
const appActions: Record<string, Record<string, Action>> = {
  lab: {
    lire_donnees: {
      description: "Lire les idées et l'activité récentes de l'utilisateur.",
      input: z.object({}),
      run: async ({ db }) => {
        const [ideas, activity] = await Promise.all([
          db.from("ideas").select("id,title,description,created_at").order("created_at", { ascending: false }).limit(50),
          db.from("lab_activity").select("kind,app_key,seconds_saved,created_at").order("created_at", { ascending: false }).limit(100),
        ]);
        if (ideas.error || activity.error) throw new Error("Lecture impossible");
        return { ideas: ideas.data, activity: activity.data };
      },
    },
    creer_idee: {
      description: "Enregistrer une nouvelle idée dans le laboratoire.",
      input: z.object({ title: z.string(), description: z.string() }),
      run: async ({ db, userId }, i) => {
        const { data, error } = await db.from("ideas").insert({ user_id: userId, title: String(i.title).slice(0, 150), description: String(i.description).slice(0, 5000) }).select("id,title").single();
        if (error) throw new Error(error.message);
        return data;
      },
    },
  },
  memotrack: {
    lister_reunions: {
      description: "Lister les mémos de réunion récents avec résumé et scores.",
      input: z.object({}),
      run: async ({ db }) => {
        const { data, error } = await db.from("meetings").select("id,title,meeting_date,summary,score_global,sentiment,category").order("meeting_date", { ascending: false }).limit(20);
        if (error) throw new Error(error.message);
        return data;
      },
    },
    detail_reunion: {
      description: "Obtenir décisions, actions, risques et prochaines étapes d'une réunion (par id).",
      input: z.object({ id: z.string() }),
      run: async ({ db }, i) => {
        const { data, error } = await db.from("meetings").select("title,meeting_date,summary,decisions,actions,risks,next_steps,participants").eq("id", i.id).maybeSingle();
        if (error) throw new Error(error.message);
        return data ?? "Réunion introuvable";
      },
    },
  },
  angelo: {
    lister_impayes: {
      description: "Lister les factures impayées en cache (montant, client, échéance, relances).",
      input: z.object({}),
      run: async ({ db }) => {
        const { data, error } = await db.from("invoices_cache").select("odoo_id,name,partner_name,amount_residual,currency,due_date,reminder_count,partner_email").gt("amount_residual", 0).order("due_date").limit(50);
        if (error) throw new Error(error.message);
        return data;
      },
    },
    synchroniser: {
      description: "Synchroniser les factures depuis Odoo.",
      input: z.object({}),
      run: async ({ db, userId }) => (await import("./angelo-engine.server")).syncInvoices(db, userId),
    },
    lancer_analyse: {
      description: "Lancer l'analyse complète : synchronisation puis relances automatiques selon les règles.",
      input: z.object({ confirmed: z.boolean() }),
      run: async ({ db, userId }, i) => {
        if (!i.confirmed) return "Demande d'abord une confirmation orale explicite.";
        return (await import("./angelo-engine.server")).runAnalysis(db, userId, "manual");
      },
    },
    envoyer_relance: {
      description: "Envoyer une relance email pour une facture (odoo_id).",
      input: z.object({ odoo_id: z.number(), confirmed: z.boolean() }),
      run: async ({ db, userId }, i) => {
        if (!i.confirmed) return "Demande d'abord une confirmation orale explicite.";
        const engine = await import("./angelo-engine.server");
        const { odooAuthenticate } = await import("./odoo.server");
        const creds = await engine.loadConnection(db, userId);
        const uid = await odooAuthenticate(creds);
        const [{ data: settings }, { data: rules }, { data: invoice }] = await Promise.all([
          db.from("angelo_settings").select("*").eq("user_id", userId).maybeSingle(),
          db.from("reminder_rules").select("*").eq("user_id", userId).order("days_overdue"),
          db.from("invoices_cache").select("*").eq("user_id", userId).eq("odoo_id", i.odoo_id).maybeSingle(),
        ]);
        if (!settings) throw new Error("Paramètres introuvables.");
        if (!invoice) throw new Error("Facture introuvable. Lancez une synchronisation.");
        if (!invoice.partner_email) throw new Error("Ce client n'a pas d'email.");
        const overdue = Math.max(1, engine.daysOverdue(invoice.due_date));
        const rule = engine.pickRule(rules ?? [], overdue) ?? (rules ?? [])[0] ?? { level: 1, firmness: "courtois", instructions: "" };
        const sent = await engine.sendReminderForInvoice(db, userId, creds, uid, settings, rule, invoice, overdue);
        return { ok: true, subject: sent.subject };
      },
    },
  },
};

const catalog = [{ key: "lab", name: "Laboratoire IDEALAB", description: "Idées et activité de l'utilisateur." }, ...applications];

/** Short description of every app and its actions, injected into the assistant prompts. */
export function appsSummary() {
  return catalog
    .map((a) => {
      const actions = Object.entries(appActions[a.key] ?? {}).map(([n, x]) => `${n} (${x.description})`).join("; ");
      return `- ${a.name} [${a.key}] : ${a.description} Actions : ${actions || "aucune action disponible pour l'instant"}.`;
    })
    .join("\n");
}

/** Run one registered lab action (used by Aura). */
export async function runAppAction(ctx: Ctx, app: string, action: string, input: unknown) {
  const def = appActions[app]?.[action];
  if (!def) return { error: `Action inconnue. Disponibles :\n${appsSummary()}` };
  const parsed = def.input.safeParse(input ?? {});
  if (!parsed.success) return { error: `Paramètres invalides : ${parsed.error.message}` };
  try {
    return await def.run(ctx, parsed.data);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Échec de l'action" };
  }
}
