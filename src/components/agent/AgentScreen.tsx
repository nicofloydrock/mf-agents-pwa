// Vista principal del agente cuando hay config válida.
import { useState } from "react";
import type { HostConfig } from "../../types/hostConfig";
import { useChat } from "../../hooks/useChat";
import { createId } from "../../utils/id";
import { AgentHeader } from "./AgentHeader";
import { ChatPanel } from "./ChatPanel";
import copy from "../../content/agent.json";

type Props = {
  config: HostConfig;
  userName: string;
};

export function AgentScreen({ config, userName }: Props) {
  const [tunnelId, setTunnelId] = useState(() => createId());
  const { messages, input, setInput, busy, error, chatRef, send, sendVoiceMock } =
    useChat();
  const [showDelayNotice, setShowDelayNotice] = useState(false);

  const handleSend = () => {
    if (!input.trim() || busy) return;
    void send(input.trim(), tunnelId);
    setInput("");
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
      <AgentHeader tunnelId={tunnelId} config={config} copy={copy.header} userName={userName} />
      <main className="mx-auto mt-6 flex max-w-5xl flex-col gap-4">
        <ChatPanel
          userName={userName}
          chatRef={chatRef}
          messages={messages}
          input={input}
          busy={busy}
          error={error}
          showDelayNotice={showDelayNotice}
          copy={copy.chat}
          onVoiceMock={() => sendVoiceMock(tunnelId)}
          onNewTunnel={() => setTunnelId(createId())}
          onDelayNotify={handleDelayNotify}
          onInputChange={setInput}
          onSend={handleSend}
        />
      </main>
    </div>
  );
}
