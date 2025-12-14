// Cliente para traducir mensajes en el mock (envía tunnel-id para trazar).
import { resolveApiBase } from "../utils/env";

const API_BASE = resolveApiBase();

export type TranslateResponse = { translated: string; lang: string };

export async function translateText(text: string, tunnelId: string) {
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
  return (await res.json()) as TranslateResponse;
}
