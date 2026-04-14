import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  CHANNELS, MEMBERS, NOTIFICATIONS, SERVERS, ALL_USERS,
  statusLabel,
  type ActivePanel, type Friend, type DmMessage, type Message, type UserStatus,
} from "./types";

type Props = {
  activePanel: ActivePanel;
  activeChannel: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageText: string;
  setMessageText: (v: string) => void;
  sendMessage: () => void;
  showReactionPicker: number | null;
  setShowReactionPicker: (id: number | null) => void;
  addReaction: (msgId: number, emoji: string) => void;
  notifRead: number[];
  setNotifRead: React.Dispatch<React.SetStateAction<number[]>>;
  markAllRead: () => void;
  unreadNotifs: number;
  userStatus: UserStatus;
  setUserStatus: (s: UserStatus) => void;
  // Friends / DM
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  pendingIn: Friend[];
  setPendingIn: React.Dispatch<React.SetStateAction<Friend[]>>;
  pendingOut: Friend[];
  setPendingOut: React.Dispatch<React.SetStateAction<Friend[]>>;
  activeDm: Friend | null;
  setActiveDm: (f: Friend | null) => void;
  dmMessages: Record<number, DmMessage[]>;
  setDmMessages: React.Dispatch<React.SetStateAction<Record<number, DmMessage[]>>>;
  dmInput: string;
  setDmInput: (v: string) => void;
  sendDm: () => void;
  friendsTab: "all" | "pending";
  setFriendsTab: (t: "all" | "pending") => void;
  showAddFriend: boolean;
  setShowAddFriend: (v: boolean) => void;
  setActivePanel: (p: ActivePanel) => void;
};

export default function MainPanel({
  activePanel,
  activeChannel,
  messages,
  messageText,
  setMessageText,
  sendMessage,
  showReactionPicker,
  setShowReactionPicker,
  addReaction,
  notifRead,
  setNotifRead,
  markAllRead,
  unreadNotifs,
  userStatus,
  setUserStatus,
  friends,
  setFriends,
  pendingIn,
  setPendingIn,
  pendingOut,
  setPendingOut,
  activeDm,
  setActiveDm,
  dmMessages,
  setDmMessages,
  dmInput,
  setDmInput,
  sendDm,
  friendsTab,
  setFriendsTab,
  showAddFriend,
  setShowAddFriend,
  setActivePanel,
}: Props) {
  const channel = CHANNELS.find(c => c.id === activeChannel)!;
  const [friendSearch, setFriendSearch] = useState("");

  const searchResults = friendSearch.length >= 2
    ? ALL_USERS.filter(u =>
        (u.name.toLowerCase().includes(friendSearch.toLowerCase()) || u.tag.includes(friendSearch)) &&
        !friends.find(f => f.id === u.id) &&
        !pendingOut.find(f => f.id === u.id)
      )
    : [];

  const sendFriendRequest = (user: Friend) => {
    setPendingOut(prev => [...prev, user]);
  };

  const acceptFriend = (user: Friend) => {
    setFriends(prev => [...prev, user]);
    setPendingIn(prev => prev.filter(u => u.id !== user.id));
  };

  const declineFriend = (user: Friend) => {
    setPendingIn(prev => prev.filter(u => u.id !== user.id));
  };

  const removeFriend = (id: number) => {
    setFriends(prev => prev.filter(f => f.id !== id));
  };

  const openDm = (friend: Friend) => {
    setActiveDm(friend);
    setActivePanel("dm");
    setShowAddFriend(false);
  };

  return (
    <>
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* CHAT PANEL */}
        {activePanel === "chat" && (
          <div className="flex flex-col flex-1 animate-fade-in">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 glass-strong">
              <Icon name="Hash" size={18} className="text-violet-400" />
              <h3 className="font-semibold text-foreground">{channel.name}</h3>
              <div className="w-px h-4 bg-white/10" />
              <p className="text-sm text-muted-foreground">Общий канал сервера</p>
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
                  <Icon name="Search" size={16} />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
                  <Icon name="Pin" size={16} />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
                  <Icon name="Users" size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className="group flex gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors relative"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onMouseLeave={() => setShowReactionPicker(null)}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-[11px] font-bold text-white">
                      {msg.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background status-${msg.status}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={`text-sm font-semibold ${msg.author === "Вы" ? "gradient-text" : "text-foreground"}`}>
                        {msg.author}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{msg.text}</p>
                    {msg.image && (
                      <div className="mt-2 rounded-xl overflow-hidden max-w-xs">
                        <img src={msg.image} alt="медиа" className="w-full h-auto object-cover hover:brightness-110 transition-all cursor-pointer" />
                      </div>
                    )}
                    {msg.reactions.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {msg.reactions.map((r, ri) => (
                          <button
                            key={ri}
                            onClick={() => addReaction(msg.id, r.emoji)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full glass neon-border text-xs hover:bg-violet-600/20 transition-all hover:scale-105"
                          >
                            <span>{r.emoji}</span>
                            <span className="text-muted-foreground font-medium">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reaction toolbar */}
                  <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                      className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      😊
                    </button>
                    <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="Reply" size={12} />
                    </button>
                    <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="MoreHorizontal" size={12} />
                    </button>
                  </div>

                  {/* Emoji picker */}
                  {showReactionPicker === msg.id && (
                    <div className="absolute right-3 top-10 z-50 glass-strong rounded-2xl p-3 flex gap-2 animate-scale-in neon-border">
                      {["👍", "❤️", "🔥", "😂", "😮", "😢", "🚀", "✅"].map(e => (
                        <button
                          key={e}
                          onClick={() => addReaction(msg.id, e)}
                          className="text-xl hover:scale-125 transition-transform"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 glass-strong rounded-2xl px-4 py-3 neon-border focus-within:border-violet-500/50 transition-all">
                <button className="text-muted-foreground hover:text-violet-400 transition-colors">
                  <Icon name="Plus" size={18} />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder={`Написать в #${channel.name}`}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                />
                <div className="flex items-center gap-2">
                  <button className="text-muted-foreground hover:text-violet-400 transition-colors">
                    <Icon name="Smile" size={16} />
                  </button>
                  <button className="text-muted-foreground hover:text-violet-400 transition-colors">
                    <Icon name="Image" size={16} />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center disabled:opacity-30 hover:opacity-90 transition-all glow-violet hover:scale-105"
                  >
                    <Icon name="Send" size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS PANEL */}
        {activePanel === "notifications" && (
          <div className="flex flex-col flex-1 animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 glass-strong">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center">
                  <Icon name="Bell" size={18} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Уведомления</h2>
                  <p className="text-xs text-muted-foreground">{unreadNotifs} непрочитанных</p>
                </div>
              </div>
              <button
                onClick={markAllRead}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-violet-600/10"
              >
                Прочитать все
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {NOTIFICATIONS.map((n, i) => {
                const isRead = n.read || notifRead.includes(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => setNotifRead(prev => [...prev, n.id])}
                    className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/5 animate-fade-in
                      ${!isRead ? "glass neon-border" : "bg-white/[0.02]"}`}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${!isRead ? "bg-violet-600/25" : "bg-white/5"}`}>
                      <Icon name={n.icon as string} fallback="Bell" size={18} className={!isRead ? "text-violet-400" : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${!isRead ? "text-foreground font-medium" : "text-muted-foreground"}`}>{n.text}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{n.time} назад</p>
                    </div>
                    {!isRead && (
                      <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0 animate-pulse-dot" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROFILE PANEL */}
        {activePanel === "profile" && (
          <div className="flex flex-col flex-1 animate-fade-in overflow-y-auto">
            {/* Banner */}
            <div className="relative h-36 gradient-bg flex-shrink-0">
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)" }} />
              <div className="absolute bottom-3 right-4">
                <button className="px-3 py-1.5 glass rounded-xl text-xs text-white/80 hover:bg-white/20 transition-colors">
                  Изменить баннер
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-8 mb-4 inline-block">
                <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center text-2xl font-black text-white border-4 border-background glow-violet">
                  ВЫ
                </div>
                <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full status-${userStatus}`}
                  style={{ border: "3px solid hsl(225, 20%, 6%)" }} />
              </div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Ваш Профиль</h2>
                  <p className="text-sm text-muted-foreground">nexus_user#0001</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-violet-400 neon-border hover:bg-violet-600/10 transition-all">
                  <Icon name="Pencil" size={14} />
                  Редактировать
                </button>
              </div>

              {/* Status selector */}
              <div className="glass rounded-2xl p-4 mb-4 neon-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Статус</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["online", "idle", "dnd", "offline"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setUserStatus(s)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200
                        ${userStatus === s ? "bg-violet-600/20 border border-violet-500/40 text-white" : "hover:bg-white/5 text-muted-foreground"}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full status-${s}`} />
                      {statusLabel[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="glass rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">О себе</p>
                <p className="text-sm text-foreground/70 leading-relaxed">Участник сообщества Nexus. Разрабатываю крутые вещи и общаюсь с классными людьми 🚀</p>
              </div>

              {/* Servers */}
              <div className="glass rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Серверы</p>
                <div className="space-y-2">
                  {SERVERS.map(s => (
                    <div key={s.id} className="flex items-center gap-3 py-1">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-sm`}>{s.emoji}</div>
                      <span className="text-sm text-foreground/80">{s.name}</span>
                      {s.unread > 0 && <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{s.unread} новых</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="glass rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Настройки</p>
                <div className="space-y-1">
                  {[
                    { icon: "Bell", label: "Уведомления" },
                    { icon: "Shield", label: "Приватность" },
                    { icon: "Palette", label: "Внешний вид" },
                    { icon: "LogOut", label: "Выйти" },
                  ].map(item => (
                    <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                      ${item.label === "Выйти" ? "text-red-400 hover:bg-red-500/10" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                      <Icon name={item.icon as string} fallback="Settings" size={16} />
                      {item.label}
                      {item.label !== "Выйти" && <Icon name="ChevronRight" size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DM PANEL */}
        {activePanel === "dm" && (
          <div className="flex flex-1 animate-fade-in overflow-hidden">
            {/* Friends list sidebar */}
            <div className="w-64 bg-[hsl(225,20%,7%)] border-r border-white/5 flex flex-col">
              <div className="p-4 border-b border-white/5">
                <h2 className="font-bold text-foreground mb-3">Друзья</h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFriendsTab("all")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${friendsTab === "all" ? "bg-violet-600/30 text-violet-300" : "text-muted-foreground hover:bg-white/5"}`}
                  >
                    Все ({friends.length})
                  </button>
                  <button
                    onClick={() => setFriendsTab("pending")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all relative
                      ${friendsTab === "pending" ? "bg-violet-600/30 text-violet-300" : "text-muted-foreground hover:bg-white/5"}`}
                  >
                    Заявки
                    {pendingIn.length > 0 && (
                      <span className="ml-1 w-4 h-4 bg-emerald-500 rounded-full text-[9px] text-white inline-flex items-center justify-center">
                        {pendingIn.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {friendsTab === "all" && friends.map(f => (
                  <div
                    key={f.id}
                    onClick={() => openDm(f)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer transition-all group mb-0.5
                      ${activeDm?.id === f.id ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-white">{f.avatar}</div>
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[hsl(225,20%,7%)] status-${f.status}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground">{statusLabel[f.status]}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removeFriend(f.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Icon name="UserMinus" size={12} />
                    </button>
                  </div>
                ))}
                {friendsTab === "pending" && (
                  <>
                    {pendingIn.length > 0 && (
                      <>
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-2">Входящие</p>
                        {pendingIn.map(f => (
                          <div key={f.id} className="flex items-center gap-2 px-2 py-2 rounded-xl mb-0.5 glass neon-border animate-fade-in">
                            <div className="relative flex-shrink-0">
                              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-white">{f.avatar}</div>
                              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[hsl(225,20%,7%)] status-${f.status}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{f.name}</p>
                              <p className="text-[10px] text-muted-foreground">{f.tag}</p>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => acceptFriend(f)} className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-colors flex items-center justify-center">
                                <Icon name="Check" size={11} />
                              </button>
                              <button onClick={() => declineFriend(f)} className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors flex items-center justify-center">
                                <Icon name="X" size={11} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {pendingOut.length > 0 && (
                      <>
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-2 mt-2">Отправленные</p>
                        {pendingOut.map(f => (
                          <div key={f.id} className="flex items-center gap-2 px-2 py-2 rounded-xl mb-0.5 bg-white/[0.02]">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground">{f.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground truncate">{f.name}</p>
                              <p className="text-[10px] text-muted-foreground">Ожидание...</p>
                            </div>
                            <button onClick={() => setPendingOut(prev => prev.filter(u => u.id !== f.id))} className="p-1 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
                              <Icon name="X" size={12} />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                    {pendingIn.length === 0 && pendingOut.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">Нет заявок</div>
                    )}
                  </>
                )}
              </div>
              <div className="p-3 border-t border-white/5">
                <button
                  onClick={() => setShowAddFriend(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 transition-all glow-violet"
                >
                  <Icon name="UserPlus" size={15} />
                  Добавить друга
                </button>
              </div>
            </div>

            {/* DM Chat area */}
            {activeDm ? (
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 glass-strong">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-white">{activeDm.avatar}</div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background status-${activeDm.status}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{activeDm.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{statusLabel[activeDm.status]}</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
                      <Icon name="Phone" size={15} />
                    </button>
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
                      <Icon name="Video" size={15} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {(dmMessages[activeDm.id] || []).map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}>
                      {!msg.isMine && (
                        <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                          {activeDm.avatar}
                        </div>
                      )}
                      <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed
                        ${msg.isMine
                          ? "gradient-bg text-white rounded-br-sm"
                          : "glass neon-border text-foreground rounded-bl-sm"
                        }`}>
                        {msg.text}
                        <p className={`text-[9px] mt-1 ${msg.isMine ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/5">
                  <div className="flex items-center gap-3 glass-strong rounded-2xl px-4 py-3 neon-border focus-within:border-violet-500/50 transition-all">
                    <input
                      type="text"
                      value={dmInput}
                      onChange={e => setDmInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendDm()}
                      placeholder={`Написать ${activeDm.name}...`}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                    />
                    <button
                      onClick={sendDm}
                      disabled={!dmInput.trim()}
                      className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center disabled:opacity-30 hover:opacity-90 transition-all glow-violet hover:scale-105"
                    >
                      <Icon name="Send" size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mb-4 glow-violet opacity-60">
                  <Icon name="MessageCircle" size={36} className="text-white" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">Личные сообщения</h3>
                <p className="text-sm text-muted-foreground max-w-xs">Выбери друга слева, чтобы начать общение</p>
              </div>
            )}
          </div>
        )}

        {/* MEMBERS SIDEBAR */}
        {activePanel === "chat" && (
          <div className="w-52 bg-[hsl(225,20%,7%)] border-l border-white/5 flex flex-col overflow-y-auto">
            <div className="p-3 border-b border-white/5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Участники — {MEMBERS.length}</p>
            </div>
            <div className="p-2 space-y-0.5">
              {["online", "idle", "dnd", "offline"].map(status => {
                const group = MEMBERS.filter(m => m.status === status);
                if (!group.length) return null;
                return (
                  <div key={status}>
                    <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-2">
                      {statusLabel[status]} — {group.length}
                    </p>
                    {group.map(m => (
                      <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
                        <div className="relative flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                            ${m.status !== "offline" ? "gradient-bg" : "bg-white/10"}`}>
                            {m.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[hsl(225,20%,7%)] status-${m.status}`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-medium truncate ${m.status === "offline" ? "text-muted-foreground" : "text-foreground"}`}>{m.name}</p>
                          <p className="text-[9px] text-muted-foreground truncate">{m.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ADD FRIEND MODAL */}
      {showAddFriend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={e => e.target === e.currentTarget && setShowAddFriend(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddFriend(false)} />
          <div className="relative glass-strong rounded-3xl p-6 w-full max-w-md mx-4 neon-border animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-black text-xl text-foreground">Добавить друга</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Поиск по имени или тегу</p>
              </div>
              <button
                onClick={() => setShowAddFriend(false)}
                className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={15} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 glass rounded-xl">
              <button
                onClick={() => setFriendsTab("all")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${friendsTab === "all" ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                Найти
              </button>
              <button
                onClick={() => setFriendsTab("pending")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all relative
                  ${friendsTab === "pending" ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                Заявки {pendingIn.length > 0 && `(${pendingIn.length})`}
              </button>
            </div>

            {friendsTab === "all" && (
              <>
                <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 neon-border mb-4">
                  <Icon name="Search" size={15} className="text-muted-foreground flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={friendSearch}
                    onChange={e => setFriendSearch(e.target.value)}
                    placeholder="Введите имя или тег..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                  />
                  {friendSearch && (
                    <button onClick={() => setFriendSearch("")} className="text-muted-foreground hover:text-foreground">
                      <Icon name="X" size={13} />
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {friendSearch.length < 2 && (
                    <p className="text-center text-xs text-muted-foreground py-6">Введите минимум 2 символа для поиска</p>
                  )}
                  {friendSearch.length >= 2 && searchResults.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-6">Никого не найдено</p>
                  )}
                  {searchResults.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all animate-fade-in">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">{user.avatar}</div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background status-${user.status}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{user.tag}</p>
                      </div>
                      {pendingOut.find(u => u.id === user.id) ? (
                        <span className="text-[11px] text-muted-foreground px-3 py-1.5 rounded-xl glass">Отправлено</span>
                      ) : (
                        <button
                          onClick={() => sendFriendRequest(user)}
                          className="px-3 py-1.5 rounded-xl gradient-bg text-white text-xs font-medium hover:opacity-90 transition-all glow-violet"
                        >
                          Добавить
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {friendsTab === "pending" && (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {pendingIn.length === 0 && pendingOut.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-6">Нет активных заявок</p>
                )}
                {pendingIn.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 pb-1">Входящие заявки</p>
                    {pendingIn.map(f => (
                      <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl glass neon-border animate-fade-in">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">{f.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{f.name}</p>
                          <p className="text-[11px] text-muted-foreground">{f.tag}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => acceptFriend(f)}
                            className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-all flex items-center justify-center"
                          >
                            <Icon name="Check" size={14} />
                          </button>
                          <button
                            onClick={() => declineFriend(f)}
                            className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all flex items-center justify-center"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {pendingOut.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 pb-1 mt-3">Исходящие</p>
                    {pendingOut.map(f => (
                      <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground">{f.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">{f.name}</p>
                          <p className="text-[11px] text-muted-foreground">Ожидание ответа...</p>
                        </div>
                        <button onClick={() => setPendingOut(prev => prev.filter(u => u.id !== f.id))} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
                          <Icon name="X" size={13} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
