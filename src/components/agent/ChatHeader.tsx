// Encabezado del panel de chat (título y sesión actual).
type Props = {
  copy: typeof import("../../content/agent.json")["chat"];
  userName: string;
};

export function ChatHeader({ copy, userName }: Props) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{copy.section}</p>
      <h2 className="text-xl font-semibold text-white">{copy.title}</h2>
      <p className="text-xs text-slate-400">
        {copy.sessionPrefix}: {userName}
      </p>
    </div>
  );
}
