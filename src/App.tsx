// Entrada del MF Agente: valida config y decide entre tester o pantalla principal.
import { useState } from "react";
import type { HostConfig } from "./types/hostConfig";
import { ConfigTester } from "./components/agent/ConfigTester";
import { AgentScreen } from "./components/agent/AgentScreen";
import copy from "./content/agent.json";
import "./index.css";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const [localConfig, setLocalConfig] = useState<HostConfig | undefined>(config);
  const effectiveConfig = localConfig ?? config;
  const valid = effectiveConfig?.token === "NICORIVERA";
  const userName =
    effectiveConfig?.auth?.user?.name ?? effectiveConfig?.user?.name ?? copy.app.anonymousUser;

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-200 sm:px-8">
        <ConfigTester copy={copy.tester} onApply={(cfg) => setLocalConfig(cfg)} />
      </div>
    );
  }
  return <AgentScreen config={effectiveConfig as HostConfig} userName={userName} />;
}
