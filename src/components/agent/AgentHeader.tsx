// Header del MF Agente: muestra operador/túnel y permite alertar al host.
import type { HostConfig } from "../../types/hostConfig";

type Props = {
  tunnelId: string;
  config: HostConfig;
  copy: {
    microfrontLabel: string;
    title: string;
    sessionLabel: string;
    tunnelLabel: string;
    remoteLabel: string;
    moduleLabel: string;
    notifyCta: string;
    notifyBody: string;
  };
  userName: string;
};

export function AgentHeader({ tunnelId, config, copy, userName }: Props) {
  return (
    <header className="glass mx-auto flex max-w-5xl flex-col gap-2 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          {copy.microfrontLabel}
        </p>
        <h1 className="text-2xl font-semibold text-white">{copy.title}</h1>
        <p className="text-xs text-slate-400">
          {copy.sessionLabel}: {userName} · {copy.tunnelLabel}: {tunnelId}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          {copy.remoteLabel}: agente
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          {copy.moduleLabel}: App
        </span>
        {config?.notify && (
          <button
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] transition hover:-translate-y-0.5 hover:border-white/40"
            onClick={() => config.notify?.(copy.notifyBody)}
          >
            {copy.notifyCta}
          </button>
        )}
      </div>
    </header>
  );
}
