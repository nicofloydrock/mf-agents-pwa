import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async (text: string, tunnelId: string) => {
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
      const isFallback = data.translated?.startsWith("[fallback]");
      const translatedText = isFallback ? text : data.translated;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingAgent.id
            ? {
                ...m,
                text: `Traducción (${data.lang.toUpperCase()}): ${translatedText}`,
                status: isFallback ? "error" : "sent",
                translated: translatedText,
              }
            : m,
        ),
      );

      if (isFallback) {
        setError("Traducción no disponible (fallback de API).");
      }
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

  const sendVoiceMock = (tunnelId: string) => {
    if (busy) return;
    void send("Mensaje de voz simulado desde operador", tunnelId);
  };

  return {
    messages,
    input,
    setInput,
    busy,
    error,
    chatRef,
    send,
    sendVoiceMock,
  };
}
