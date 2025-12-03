import { useEffect, useMemo, useRef, useState } from "react";
import { translateText } from "../api/translate";
import { createId } from "../utils/id";

export type Message = {
  id: string;
  role: "user" | "agent";
  text: string;
  translated?: string;
  status?: "pending" | "sent" | "error";
  createdAt: number;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [tunnelId, setTunnelId] = useState(() => createId());

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const resetTunnel = () => {
    setMessages([]);
    setTunnelId(createId());
  };

  const send = async (text: string) => {
    const userMsg: Message = {
      id: createId(),
      role: "user",
      text,
      createdAt: Date.now(),
      status: "sent",
    };
    const pendingAgent: Message = {
      id: createId(),
      role: "agent",
      text: "Traduciendo...",
      createdAt: Date.now(),
      status: "pending",
    };
    setMessages((prev) => [...prev, userMsg, pendingAgent]);
    setBusy(true);
    setError(null);

    try {
      const data = await translateText(text, tunnelId);
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

  return {
    messages,
    input,
    setInput,
    busy,
    error,
    chatRef,
    tunnelId,
    resetTunnel,
    send,
  };
}
