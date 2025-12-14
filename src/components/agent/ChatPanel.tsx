// Panel principal del chat: acciones, lista de mensajes e input.
import type { RefObject } from "react";
import type { Message } from "../../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatActions } from "./ChatActions";
import { ChatHeader } from "./ChatHeader";
type Props = {
  userName: string;
  chatRef: RefObject<HTMLDivElement>;
  messages: Message[];
  input: string;
  busy: boolean;
  error: string | null;
  showDelayNotice: boolean;
  copy: typeof import("../../content/agent.json")["chat"];
  onVoiceMock: () => void;
  onNewTunnel: () => void;
  onDelayNotify: () => void;
  onInputChange: (val: string) => void;
  onSend: () => void;
};

export function ChatPanel({
  userName,
  chatRef,
  messages,
  input,
  busy,
  error,
  showDelayNotice,
  copy,
  onVoiceMock,
  onNewTunnel,
  onDelayNotify,
  onInputChange,
  onSend,
}: Props) {
  return (
    <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ChatHeader copy={copy} userName={userName} />
        <ChatActions
          busy={busy}
          showDelayNotice={showDelayNotice}
          copy={copy}
          onVoiceMock={onVoiceMock}
          onNewTunnel={onNewTunnel}
          onDelayNotify={onDelayNotify}
        />
      </div>

      <div className="mt-4 grid gap-3">
        <MessageList messages={messages} userName={userName} chatRef={chatRef} copy={copy} />
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          busy={busy}
          copy={copy}
        />
        {error && (
          <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
