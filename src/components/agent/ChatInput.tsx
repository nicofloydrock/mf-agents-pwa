// Input de chat con envío inmediato y estado de busy.
type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  busy: boolean;
  copy: { placeholder: string; send: string; sending: string };
};

export function ChatInput({ value, onChange, onSend, busy, copy }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
        placeholder={copy.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <button
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-sky-950 shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onSend}
        disabled={busy}
      >
        {busy ? copy.sending : copy.send}
      </button>
    </div>
  );
}
