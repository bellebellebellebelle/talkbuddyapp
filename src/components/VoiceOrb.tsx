import { useState, useRef } from "react";
import { Mic, Loader2, Square } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { transcribeAudio } from "@/lib/voice.functions";
import { askAgent } from "@/lib/agent.functions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function VoiceOrb() {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const transcribe = useServerFn(transcribeAudio);
  const ask = useServerFn(askAgent);
  const qc = useQueryClient();

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const mr = new MediaRecorder(s, { mimeType: mime });
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      mr.onstop = handleStop;
      mr.start();
      mediaRecorder.current = mr;
      setRecording(true);
    } catch {
      toast.error("Micro inaccessible. Vérifie les permissions du navigateur.");
    }
  }

  function stop() {
    mediaRecorder.current?.stop();
    stream.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
  }

  async function handleStop() {
    setBusy(true);
    try {
      const mime = mediaRecorder.current?.mimeType ?? "audio/webm";
      const blob = new Blob(chunks.current, { type: mime });
      if (blob.size < 1500) {
        toast.error("Enregistrement trop court.");
        return;
      }
      const fd = new FormData();
      fd.append("audio", blob, "rec");
      toast.message("Transcription en cours…");
      const { text } = await transcribe({ data: fd });
      if (!text) { toast.error("Aucun texte détecté."); return; }
      toast.message(`🎙️ "${text}"`);
      const res = await ask({ data: { prompt: text, source: "voice" } });
      toast.success(res.summary || "Action exécutée");
      qc.invalidateQueries({ queryKey: ["actions-log"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur vocale");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={recording ? stop : start}
        disabled={busy}
        aria-label={recording ? "Arrêter l'enregistrement" : "Démarrer la commande vocale"}
        className="relative grid h-14 w-14 place-items-center rounded-full holo-glow text-primary-foreground transition active:scale-95"
        style={{ background: "linear-gradient(135deg, var(--holo), var(--holo-2))" }}
      >
        {recording && (
          <>
            <span className="absolute inset-0 voice-ring rounded-full" style={{ background: "var(--holo)" }} />
            <span className="absolute inset-0 voice-ring rounded-full" style={{ background: "var(--holo-2)", animationDelay: "0.5s" }} />
          </>
        )}
        {busy ? <Loader2 className="relative h-6 w-6 animate-spin" /> : recording ? <Square className="relative h-5 w-5" /> : <Mic className="relative h-6 w-6" />}
      </button>
    </div>
  );
}
