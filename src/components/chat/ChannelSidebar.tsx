import Icon from "@/components/ui/icon";
import { CHANNELS, MEMBERS, SERVERS, statusLabel, type ActivePanel, type UserStatus } from "./types";

type Props = {
  activeServer: number;
  activeChannel: number;
  setActiveChannel: (id: number) => void;
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  userStatus: UserStatus;
};

export default function ChannelSidebar({
  activeServer,
  activeChannel,
  setActiveChannel,
  activePanel,
  setActivePanel,
  userStatus,
}: Props) {
  const server = SERVERS.find(s => s.id === activeServer)!;

  return (
    <div className="relative z-10 flex flex-col w-56 bg-[hsl(225,20%,7%)] border-r border-white/5">
      {/* Server Header */}
      <div className={`p-4 border-b border-white/5 bg-gradient-to-r ${server.color} bg-opacity-20`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{server.emoji}</span>
          <div>
            <h2 className="font-bold text-sm text-white leading-tight">{server.name}</h2>
            <p className="text-[10px] text-white/50">{MEMBERS.filter(m => m.status !== "offline").length} онлайн</p>
          </div>
          <Icon name="ChevronDown" size={14} className="ml-auto text-white/40" />
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-2">Текстовые</p>
        {CHANNELS.filter(c => c.type === "text").map(c => (
          <button
            key={c.id}
            onClick={() => { setActiveChannel(c.id); setActivePanel("chat"); }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all duration-150 mb-0.5
              ${activeChannel === c.id && activePanel === "chat"
                ? "bg-white/10 text-white font-medium"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
          >
            <Icon name={c.icon as string} size={14} className={activeChannel === c.id ? "text-violet-400" : ""} />
            <span>{c.name}</span>
            {c.unread > 0 && (
              <span className="ml-auto w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {c.unread}
              </span>
            )}
          </button>
        ))}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-2 mt-2">Голосовые</p>
        {CHANNELS.filter(c => c.type === "voice").map(c => (
          <button
            key={c.id}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-150 mb-0.5"
          >
            <Icon name="Volume2" size={14} />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* User bar */}
      <div className="p-3 border-t border-white/5 glass">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">ВЫ</div>
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[hsl(225,20%,7%)] status-${userStatus}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">Вы</p>
            <p className="text-[10px] text-muted-foreground truncate">{statusLabel[userStatus]}</p>
          </div>
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
              <Icon name="Mic" size={12} />
            </button>
            <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
              <Icon name="Settings" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
