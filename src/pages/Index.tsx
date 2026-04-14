import { useState } from "react";
import ServerSidebar from "@/components/chat/ServerSidebar";
import ChannelSidebar from "@/components/chat/ChannelSidebar";
import MainPanel from "@/components/chat/MainPanel";
import {
  ALL_USERS, NOTIFICATIONS, INITIAL_MESSAGES, INITIAL_DM_MESSAGES,
  type Friend, type DmMessage, type Message, type ActivePanel, type UserStatus,
} from "@/components/chat/types";

export default function Index() {
  const [activeServer, setActiveServer] = useState(1);
  const [activeChannel, setActiveChannel] = useState(1);
  const [activePanel, setActivePanel] = useState<ActivePanel>("chat");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null);
  const [notifRead, setNotifRead] = useState<number[]>([]);
  const [userStatus, setUserStatus] = useState<UserStatus>("online");

  // Friends system
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([ALL_USERS[0], ALL_USERS[1], ALL_USERS[5]]);
  const [pendingIn, setPendingIn] = useState<Friend[]>([ALL_USERS[2]]);
  const [pendingOut, setPendingOut] = useState<Friend[]>([]);
  const [activeDm, setActiveDm] = useState<Friend | null>(null);
  const [dmMessages, setDmMessages] = useState<Record<number, DmMessage[]>>(INITIAL_DM_MESSAGES);
  const [dmInput, setDmInput] = useState("");
  const [friendsTab, setFriendsTab] = useState<"all" | "pending">("all");

  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read && !notifRead.includes(n.id)).length;

  const sendMessage = () => {
    if (!messageText.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      author: "Вы",
      avatar: "ВЫ",
      status: userStatus,
      time: "Только что",
      text: messageText.trim(),
      reactions: [],
      image: null,
    }]);
    setMessageText("");
  };

  const addReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions.find(r => r.emoji === emoji);
      if (existing) {
        return { ...m, reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) };
      }
      return { ...m, reactions: [...m.reactions, { emoji, count: 1 }] };
    }));
    setShowReactionPicker(null);
  };

  const markAllRead = () => {
    setNotifRead(NOTIFICATIONS.map(n => n.id));
  };

  const sendDm = () => {
    if (!dmInput.trim() || !activeDm) return;
    setDmMessages(prev => ({
      ...prev,
      [activeDm.id]: [...(prev[activeDm.id] || []), {
        id: Date.now(),
        author: "Вы",
        text: dmInput.trim(),
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        isMine: true,
      }]
    }));
    setDmInput("");
  };

  return (
    <div className="flex h-screen w-screen bg-background font-golos overflow-hidden relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-600/6 rounded-full blur-3xl" />
      </div>

      <ServerSidebar
        activeServer={activeServer}
        setActiveServer={setActiveServer}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        unreadNotifs={unreadNotifs}
        pendingIn={pendingIn}
        friends={friends}
        setShowAddFriend={setShowAddFriend}
      />

      <ChannelSidebar
        activeServer={activeServer}
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        userStatus={userStatus}
      />

      <MainPanel
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        activeChannel={activeChannel}
        messages={messages}
        setMessages={setMessages}
        messageText={messageText}
        setMessageText={setMessageText}
        sendMessage={sendMessage}
        showReactionPicker={showReactionPicker}
        setShowReactionPicker={setShowReactionPicker}
        addReaction={addReaction}
        notifRead={notifRead}
        setNotifRead={setNotifRead}
        markAllRead={markAllRead}
        unreadNotifs={unreadNotifs}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        friends={friends}
        setFriends={setFriends}
        pendingIn={pendingIn}
        setPendingIn={setPendingIn}
        pendingOut={pendingOut}
        setPendingOut={setPendingOut}
        activeDm={activeDm}
        setActiveDm={setActiveDm}
        dmMessages={dmMessages}
        setDmMessages={setDmMessages}
        dmInput={dmInput}
        setDmInput={setDmInput}
        sendDm={sendDm}
        friendsTab={friendsTab}
        setFriendsTab={setFriendsTab}
        showAddFriend={showAddFriend}
        setShowAddFriend={setShowAddFriend}
      />
    </div>
  );
}
