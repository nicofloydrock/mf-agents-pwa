import { useMemo, useState } from "react";
import type { HostConfig } from "./types/hostConfig";
import { AgentHeader } from "./components/agent/AgentHeader";
import { MessageList } from "./components/agent/MessageList";
import { ChatInput } from "./components/agent/ChatInput";
import { useChat } from "./hooks/useChat";
import { createId } from "./utils/id";
import "./index.css";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const valid = config?.token === "NICORIVERA";
  const [tunnelId, setTunnelId] = useState(() => createId());
  const userName = config?.user?.name ?? "Operador";
  const { messages, input, setInput, busy, error, chatRef, send, sendVoiceMock } =
    useChat();
  const [showDelayNotice, setShowDelayNotice] = useState(false);

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-center text-slate-200 sm:px-8">
        Config no recibida o token inválido.
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim() || busy) return;
    void send(input.trim(), tunnelId);
    setInput("");
  };

  const handleNewTunnel = () => {
    setTunnelId(createId());
  };

  const handleDelayNotify = () => {
    if (!config?.notify) return;
    setShowDelayNotice(true);
    setTimeout(() => {
      config.notify?.("Notificación diferida desde MF Agente", {
        title: "Agente (delay)",
        target: "agente",
      });
      setShowDelayNotice(false);
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <AgentHeader tunnelId={tunnelId} config={config} />

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
              <p className="text-xs text-slate-400">Sesión: {userName}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5"
                onClick={() => sendVoiceMock(tunnelId)}
                disabled={busy}
              >
                Simular voz
              </button>
              <button
                className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-white/40"
                onClick={handleNewTunnel}
              >
                Nuevo túnel
              </button>
              {config?.notify && (
                <button
                  className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-white/40 disabled:opacity-60"
                  onClick={handleDelayNotify}
                  disabled={showDelayNotice}
                >
                  {showDelayNotice ? "Enviando en 10s..." : "Notificar +10s"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <MessageList messages={messages} userName={userName} chatRef={chatRef} />
            <ChatInput value={input} onChange={setInput} onSend={handleSend} busy={busy} />
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
