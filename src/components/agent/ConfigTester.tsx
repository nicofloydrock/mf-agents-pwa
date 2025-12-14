// Pantalla fallback para modo standalone: permite pegar JSON de config y aplicarlo.
import { useState } from "react";
import type { HostConfig } from "../../types/hostConfig";

type Props = {
  copy: {
    title: string;
    description: string;
    placeholder: string;
    applyCta: string;
    demoCta: string;
    errorInvalid: string;
  };
  onApply: (config: HostConfig) => void;
};

const demoConfig = `{
  "token": "NICORIVERA",
  "user": { "id": "operator-1", "name": "Operador Demo" },
  "auth": {
    "provider": "auth0-demo",
    "roles": ["agent"],
    "permissions": { "agente": ["chat:send"] },
    "user": { "id": "operator-1", "name": "Operador Demo", "email": "demo@cmpc.test" }
  }
}`;

export function ConfigTester({ copy, onApply }: Props) {
  const [text, setText] = useState(copy.placeholder);
  const [error, setError] = useState("");

  const applyConfig = (value: string) => {
    try {
      onApply(JSON.parse(value) as HostConfig);
      setError("");
    } catch {
      setError(copy.errorInvalid);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-lg sm:p-6">
      <h2 className="text-xl font-semibold text-white">{copy.title}</h2>
      <p className="mt-1 text-sm text-slate-300">{copy.description}</p>
      <textarea
        className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900 p-3 font-mono text-sm text-slate-100"
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="mt-2 text-xs text-amber-300">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="rounded-lg border border-emerald-400/50 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/80"
          onClick={() => applyConfig(text)}
        >
          {copy.applyCta}
        </button>
        <button
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
          onClick={() => {
            setText(demoConfig);
            applyConfig(demoConfig);
          }}
        >
          {copy.demoCta}
        </button>
      </div>
    </div>
  );
}
