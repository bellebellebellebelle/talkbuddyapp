import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useServerFn } from "@tanstack/react-start";
import { Database, FlaskConical, LogOut, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { askAssistant, saveOdoo, transcribeAudio } from "@/lib/assistant.functions";
import bgUrl from "@/assets/interface.jpg";
import { AuraMotion } from "@/components/aura-motion";
const bg = { url: bgUrl };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura — Votre assistant vocal Odoo" },
      { name: "description", content: "Parlez à Aura : e-mails, relances, rendez-vous, CRM, ventes et achats exécutés dans Odoo." },
      { property: "og:title", content: "Aura — Votre assistant vocal Odoo" },
      { property: "og:description", content: "Un assistant vocal qui agit réellement dans votre Odoo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type BoardItem = { kind: "step"; text: string } | { kind: "result"; title: string; lines: string[] };

function Index() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <main className="aura-bg relative h-screen w-full overflow-hidden text-foreground" style={{ backgroundImage: `url(${bg.url})` }}>
      {session === undefined ? null : session ? <Assistant userId={session.user.id} /> : <AuthCard />}
    </main>
  );
}

function AuthCard() {
  const [mode, setMode] = useState<"in" | "up">("up");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } =
      mode === "up"
        ? await supabase.auth.signUp({ email, password: pw })
        : await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message);
    setBusy(false);
  };
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-10 sm:items-center sm:justify-end sm:pb-0 sm:pr-16">
      <form onSubmit={submit} className="aura-glass w-[min(92vw,360px)] space-y-3 rounded-3xl p-7">
        <h1 className="text-2xl font-light tracking-wide">Aura</h1>
        <p className="text-sm text-muted-foreground">{mode === "up" ? "Créez votre compte pour rencontrer votre assistant." : "Bon retour."}</p>
        <input className="w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" type="password" required minLength={6} placeholder="Mot de passe" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-xs text-destructive-foreground">{err}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
          {busy ? "…" : mode === "up" ? "Créer mon compte" : "Se connecter"}
        </button>
        <button type="button" onClick={() => setMode(mode === "up" ? "in" : "up")} className="w-full text-xs text-muted-foreground hover:text-foreground">
          {mode === "up" ? "Déjà un compte ? Se connecter" : "Pas de compte ? Créer un compte"}
        </button>
      </form>
    </div>
  );
}

type State = "idle" | "listening" | "thinking" | "speaking";

function Assistant({ userId }: { userId: string }) {
  const [state, setState] = useState<State>("idle");
  const [caption, setCaption] = useState("Touchez la sphère pour parler");
  const [board, setBoard] = useState<BoardItem[] | null>(null);
  const [showOdoo, setShowOdoo] = useState(false);
  const [connected, setConnected] = useState(false);
  const [lab, setLab] = useState<{ path: string; v: number } | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcribe = useServerFn(transcribeAudio);
  const ask = useServerFn(askAssistant);

  useEffect(() => {
    supabase.from("odoo_connections").select("user_id").maybeSingle().then(({ data }) => setConnected(!!data));
    // Realtime sync: latest assistant message (e.g. from another device) updates the board.
    const ch = supabase
      .channel("msgs-" + userId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `user_id=eq.${userId}` }, (p) => {
        const m = p.new as { role: string; board: BoardItem[] | null };
        if (m.role === "assistant" && m.board?.length) setBoard(m.board);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [userId]);

  const handle = async (text: string) => {
    setCaption("« " + text + " »");
    setState("thinking");
    setBoard([{ kind: "step", text: "J'analyse votre demande…" }]);
    try {
      const r = await ask({ data: { text } });
      setBoard(r.board.length ? r.board : [{ kind: "result", title: "Réponse", lines: [r.reply] }]);
      setCaption(r.reply);
      if (r.open === "close") setLab(null);
      else if (r.open) setLab((l) => ({ path: r.open as string, v: (l?.v ?? 0) + 1 }));
      if (r.audio) {
        const a = new Audio(`data:audio/wav;base64,${r.audio}`);
        audioRef.current = a;
        setState("speaking");
        a.onended = () => setState("idle");
        await a.play().catch(() => setState("idle"));
      } else setState("idle");
    } catch (e) {
      setCaption((e as Error).message);
      setState("idle");
    }
  };

  const toggle = async () => {
    if (state === "speaking") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }
    if (state === "thinking") return;
    if (state === "listening") {
      recRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: rec.mimeType });
        if (blob.size < 2000) {
          setState("idle");
          setCaption("Je n'ai rien entendu.");
          return;
        }
        setState("thinking");
        setCaption("Transcription…");
        const buf = new Uint8Array(await blob.arrayBuffer());
        let s = "";
        for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
        try {
          const { text } = await transcribe({ data: { audio: btoa(s), mime: rec.mimeType } });
          if (!text) {
            setState("idle");
            setCaption("Je n'ai pas compris, réessayez.");
          } else await handle(text);
        } catch (e) {
          setCaption((e as Error).message);
          setState("idle");
        }
      };
      recRef.current = rec;
      rec.start();
      setState("listening");
      setCaption("Je vous écoute… touchez à nouveau pour envoyer");
    } catch {
      setCaption("Autorisez le micro pour parler à Aura.");
    }
  };

  return (
    <>
      <AuraMotion state={state} />
      <button aria-label="Parler à l'assistant" data-state={state} data-lab={lab ? "1" : undefined} onClick={toggle} className="aura-orb z-20 cursor-pointer outline-none" />

      <p className="pointer-events-none absolute z-20 bottom-[12vh] left-1/2 w-[min(90vw,640px)] -translate-x-1/2 text-center text-sm font-light tracking-wide text-foreground/85">
        {caption}
      </p>

      {lab && <LabWindow path={lab.path} v={lab.v} onClose={() => setLab(null)} />}

      {board && <Board items={board} onClose={() => setBoard(null)} />}

      <button onClick={() => supabase.auth.signOut()} aria-label="Se déconnecter" className="absolute right-4 top-4 rounded-full p-2 text-foreground/40 transition hover:text-foreground">
        <LogOut className="h-4 w-4" />
      </button>

      <button onClick={() => setShowOdoo(true)} className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-foreground/45 transition hover:bg-glass hover:text-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-ember" : "bg-foreground/30"}`} />
        <Database className="h-3 w-3" /> {connected ? "Odoo" : "Connecter Odoo"}
      </button>

      <button onClick={() => setLab(lab ? null : { path: "/dashboard", v: 0 })} aria-label="Ouvrir le laboratoire" className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-foreground/45 transition hover:bg-glass hover:text-foreground">
        <FlaskConical className="h-3 w-3" /> Laboratoire
      </button>

      {showOdoo && <OdooDialog onClose={() => setShowOdoo(false)} onSaved={() => setConnected(true)} />}
    </>
  );
}

function LabWindow({ path, v, onClose }: { path: string; v: number; onClose: () => void }) {
  return (
    <section className="absolute inset-x-3 top-3 bottom-[22vh] z-10 overflow-hidden rounded-2xl border border-border shadow-2xl sm:inset-x-6 sm:right-[380px]" aria-label="Laboratoire">
      <iframe key={path + v} src={path} title="Laboratoire IDEALAB" className="h-full w-full bg-background" />
      <button onClick={onClose} aria-label="Fermer le laboratoire" className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground/70 hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </section>
  );
}

function Board({ items, onClose }: { items: BoardItem[]; onClose: () => void }) {
  return (
    <aside className="board absolute left-4 right-4 top-4 max-h-[42vh] overflow-y-auto rounded-2xl p-5 shadow-2xl sm:left-auto sm:right-6 sm:top-1/2 sm:max-h-[80vh] sm:w-[340px] sm:-translate-y-1/2">
      <button onClick={onClose} aria-label="Fermer le tableau" className="absolute right-3 top-3 opacity-50 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
      <svg width="120" height="14" className="mb-1"><path className="draw-line" d="M2 9 C 30 2, 60 14, 118 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
      <div className="space-y-2 text-xl leading-snug">
        {items.map((it, i) =>
          it.kind === "step" ? (
            <div key={i} className="write-in flex items-center gap-2" style={{ animationDelay: `${i * 0.35}s` }}>
              <span className="board-ink">✓</span>
              <span className="whitespace-normal">{it.text}</span>
            </div>
          ) : (
            <div key={i} className="write-in mt-3 rounded-xl border-2 border-dashed border-current/30 p-3" style={{ animationDelay: `${i * 0.35}s` }}>
              <div className="board-ink text-2xl font-bold">{it.title}</div>
              {it.lines.map((l, j) => (
                <div key={j} className="whitespace-normal">— {l}</div>
              ))}
            </div>
          ),
        )}
      </div>
    </aside>
  );
}

function OdooDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const save = useServerFn(saveOdoo);
  const [f, setF] = useState({ url: "", db: "", username: "", api_key: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await save({ data: f });
      onSaved();
      onClose();
    } catch (er) {
      setMsg((er as Error).message);
    }
    setBusy(false);
  };
  const field = (k: keyof typeof f, ph: string, type = "text") => (
    <input required type={type} placeholder={ph} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" />
  );
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/40 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="aura-glass w-full max-w-sm space-y-3 rounded-3xl p-6">
        <h2 className="text-lg font-light">Connecter votre Odoo</h2>
        {field("url", "https://votre-societe.odoo.com")}
        {field("db", "Nom de la base de données")}
        {field("username", "Identifiant (e-mail)")}
        {field("api_key", "Clé API Odoo", "password")}
        <p className="text-[11px] text-muted-foreground">Odoo → Préférences → Sécurité du compte → Nouvelle clé API.</p>
        {msg && <p className="text-xs text-destructive-foreground">{msg}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {busy ? "Vérification…" : "Connecter"}
        </button>
      </form>
    </div>
  );
}
