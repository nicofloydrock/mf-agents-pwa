// Lista de mensajes con estado y traducción opcional.
import type { RefObject } from "react";
import type { Message } from "../../hooks/useChat";

type Props = {
  messages: Message[];
  userName: string;
  chatRef: RefObject<HTMLDivElement>;
  copy: {
    empty: string;
    agentLabel: string;
    status: { pending: string; error: string; ok: string };
    translationLabel: string;
  };
};

export function MessageList({ messages, userName, chatRef, copy }: Props) {
  return (
    <div
      ref={chatRef}
      className="h-[60vh] min-h-[320px] overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3"
    >
      {messages.length === 0 && (
        <p className="text-sm text-slate-300">{copy.empty}</p>
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
              <span>{msg.role === "user" ? userName : copy.agentLabel}</span>
              <span>
                {msg.status === "pending"
                  ? copy.status.pending
                  : msg.status === "error"
                  ? copy.status.error
                  : copy.status.ok}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm">{msg.text}</p>
            {msg.translated && (
              <p className="mt-1 text-xs text-emerald-200">
                {copy.translationLabel}: {msg.translated}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
