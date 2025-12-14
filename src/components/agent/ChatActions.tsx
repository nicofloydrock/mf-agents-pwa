// Botones de acciones rápidas del chat (voz mock, nuevo túnel, notificación diferida).
type Props = {
  busy: boolean;
  showDelayNotice: boolean;
  copy: typeof import("../../content/agent.json")["chat"];
  onVoiceMock: () => void;
  onNewTunnel: () => void;
  onDelayNotify: () => void;
};

export function ChatActions({
  busy,
  showDelayNotice,
  copy,
  onVoiceMock,
  onNewTunnel,
  onDelayNotify,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5"
        onClick={onVoiceMock}
        disabled={busy}
      >
        {copy.voice}
      </button>
      <button
        className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-white/40"
        onClick={onNewTunnel}
      >
        {copy.newTunnel}
      </button>
      <button
        className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-white/40 disabled:opacity-60"
        onClick={onDelayNotify}
        disabled={showDelayNotice}
      >
        {showDelayNotice ? copy.delaySending : copy.delayNotify}
      </button>
    </div>
  );
}
