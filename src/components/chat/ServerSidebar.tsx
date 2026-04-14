import Icon from "@/components/ui/icon";
import { SERVERS, type ActivePanel, type Friend } from "./types";

type Props = {
  activeServer: number;
  setActiveServer: (id: number) => void;
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  unreadNotifs: number;
  pendingIn: Friend[];
  friends: Friend[];
  setShowAddFriend: (v: boolean) => void;
};

export default function ServerSidebar({
  activeServer,
  setActiveServer,
  activePanel,
  setActivePanel,
  unreadNotifs,
  pendingIn,
  friends,
  setShowAddFriend,
}: Props) {
  return (
    <div className="relative z-10 flex flex-col w-[72px] items-center py-4 gap-2 bg-[hsl(225,22%,5%)] border-r border-white/5">
      {/* Logo */}
      <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center glow-violet mb-2 hover-scale cursor-pointer">
        <span className="text-white font-black text-[10px] leading-none text-center">S7</span>
      </div>
      <div className="w-8 h-px bg-white/10 mb-1" />

      {/* Servers */}
      {SERVERS.map((s) => (
        <div key={s.id} className="relative group" onClick={() => setActiveServer(s.id)}>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl cursor-pointer transition-all duration-200 hover-scale
              ${activeServer === s.id
                ? `bg-gradient-to-br ${s.color} glow-violet rounded-xl`
                : "bg-white/5 hover:bg-white/10 hover:rounded-xl"
              }`}
          >
            {s.emoji}
          </div>
          {s.unread > 0 && activeServer !== s.id && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
              {s.unread}
            </div>
          )}
          {activeServer === s.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-1.5 h-8 bg-white rounded-r-full" />
          )}
        </div>
      ))}

      <div className="w-8 h-px bg-white/10 my-1" />

      {/* Add Friend */}
      <button
        onClick={() => setShowAddFriend(true)}
        className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:rounded-xl group relative"
        title="Добавить друга"
      >
        <Icon name="UserPlus" size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
        {pendingIn.length > 0 && (
          <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
            {pendingIn.length}
          </div>
        )}
      </button>

      {/* Friends DM button */}
      <button
        onClick={() => setActivePanel("dm")}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:rounded-xl relative
          ${activePanel === "dm" ? "bg-emerald-600/30 text-emerald-300" : "bg-white/5 hover:bg-white/10 text-muted-foreground"}`}
        title="Личные сообщения"
      >
        <Icon name="MessageCircle" size={18} />
        {friends.length > 0 && activePanel !== "dm" && (
          <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
        )}
      </button>

      {/* Bottom icons */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => setActivePanel("notifications")}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:rounded-xl relative
            ${activePanel === "notifications" ? "bg-violet-600/30 text-violet-300" : "bg-white/5 hover:bg-white/10 text-muted-foreground"}`}
        >
          <Icon name="Bell" size={18} />
          {unreadNotifs > 0 && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-pulse-dot">
              {unreadNotifs}
            </div>
          )}
        </button>
        <button
          onClick={() => setActivePanel("profile")}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:rounded-xl
            ${activePanel === "profile" ? "bg-violet-600/30 text-violet-300" : "bg-white/5 hover:bg-white/10 text-muted-foreground"}`}
        >
          <Icon name="User" size={18} />
        </button>
      </div>
    </div>
  );
}
