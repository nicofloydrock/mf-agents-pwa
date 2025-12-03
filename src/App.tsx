import { useEffect, useMemo, useRef, useState } from "react";
import type { HostConfig } from "./types/hostConfig";

type Message = {
  id: string;
  role: "user" | "agent";
  text: string;
  translated?: string;
  status?: "pending" | "sent" | "error";
  createdAt: number;
};

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
};

const resolveApiBase = () => {
  if (import.meta.env.VITE_API_MOCK_URL) return import.meta.env.VITE_API_MOCK_URL;
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5050`;
  }
  return "http://localhost:5050";
};

const API_BASE = resolveApiBase();

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const valid = config?.token === "NICORIVERA";
  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-center text-slate-200 sm:px-8">
        Config no recibida o token inválido.
      </div>
    );
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const tunnelId = useMemo(() => randomId(), []);
  const userName = config?.user?.name ?? "Operador";

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMsg: Message = {
      id: randomId(),
      role: "user",
      text,
      createdAt: Date.now(),
      status: "sent",
    };
    const pendingAgent: Message = {
      id: randomId(),
      role: "agent",
      text: "Traduciendo...",
      createdAt: Date.now(),
      status: "pending",
    };
    setMessages((prev) => [...prev, userMsg, pendingAgent]);
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tunnel-id": tunnelId,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        throw new Error(`API ${res.status}: ${res.statusText}`);
      }
      const data = (await res.json()) as { translated: string; lang: string };
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingAgent.id
            ? {
                ...m,
                text: `Traducción (${data.lang.toUpperCase()}): ${data.translated}`,
                status: "sent",
                translated: data.translated,
              }
            : m,
        ),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingAgent.id
            ? { ...m, text: "Error al traducir", status: "error" }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput("");
    void sendMessage(text);
  };

  const handleVoiceMock = () => {
    if (busy) return;
    const text = "Mensaje de voz simulado desde operador";
    void sendMessage(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <header className="glass mx-auto flex max-w-5xl flex-col gap-2 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Microfront Agente
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Chat traducido en vivo
          </h1>
          <p className="text-xs text-slate-400">
            Sesión: {userName} · Túnel: {tunnelId}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            remote: agente
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            expose: App
          </span>
          {config?.notify && (
            <button
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] transition hover:-translate-y-0.5 hover:border-white/40"
              onClick={() =>
                config.notify?.("Alerta desde MF Agente hacia el host.")
              }
            >
              Alertar host
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto mt-6 flex max-w-5xl flex-col gap-4">
        <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Mensajería
              </p>
              <h2 className="text-xl font-semibold text-white">
                Chat minimal (texto/voz mock)
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5"
                onClick={handleVoiceMock}
                disabled={busy}
              >
                Simular voz
              </button>
              <button
                className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:border-white/40"
                onClick={() => window.location.reload()}
              >
                Nuevo túnel
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div
              ref={chatRef}
              className="h-[60vh] min-h-[320px] overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3"
            >
              {messages.length === 0 && (
                <p className="text-sm text-slate-300">
                  Envía un mensaje para iniciar el chat.
                </p>
              )}
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-xl rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "ml-auto bg-sky-500/20 text-sky-50"
                        : "mr-auto bg-white/10 text-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-slate-300">
                      <span>{msg.role === "user" ? userName : "Agente"}</span>
                      <span>
                        {msg.status === "pending"
                          ? "procesando"
                          : msg.status === "error"
                          ? "error"
                          : "ok"}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{msg.text}</p>
                    {msg.translated && (
                      <p className="mt-1 text-xs text-emerald-200">
                        Traducción: {msg.translated}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                placeholder="Escribe un mensaje para traducir..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-sky-950 shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSend}
                disabled={busy}
              >
                {busy ? "Enviando..." : "Enviar"}
              </button>
            </div>
            {error && (
              <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                {error}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
