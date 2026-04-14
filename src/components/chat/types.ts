export type Friend = {
  id: number;
  name: string;
  avatar: string;
  status: string;
  tag: string;
};

export type DmMessage = {
  id: number;
  author: string;
  text: string;
  time: string;
  isMine: boolean;
};

export type Message = {
  id: number;
  author: string;
  avatar: string;
  status: string;
  time: string;
  text: string;
  reactions: { emoji: string; count: number }[];
  image: string | null;
};

export type ActivePanel = "chat" | "profile" | "notifications" | "dm";
export type UserStatus = "online" | "idle" | "dnd" | "offline";

export const ALL_USERS: Friend[] = [
  { id: 10, name: "Алексей К.", avatar: "АК", status: "online", tag: "alex#1234" },
  { id: 11, name: "Мария Н.", avatar: "МН", status: "online", tag: "masha#5678" },
  { id: 12, name: "Дмитрий П.", avatar: "ДП", status: "idle", tag: "dima#9012" },
  { id: 13, name: "Екатерина В.", avatar: "ЕВ", status: "dnd", tag: "katya#3456" },
  { id: 14, name: "Иван С.", avatar: "ИС", status: "offline", tag: "ivan#7890" },
  { id: 15, name: "Ольга М.", avatar: "ОМ", status: "online", tag: "olga#2345" },
  { id: 16, name: "Сергей Т.", avatar: "СТ", status: "online", tag: "serg#6789" },
  { id: 17, name: "Анна Л.", avatar: "АЛ", status: "idle", tag: "anna#0123" },
];

export const SERVERS = [
  { id: 1, name: "Разработчики", emoji: "⚡", color: "from-violet-600 to-purple-700", unread: 3 },
  { id: 2, name: "Дизайн Hub", emoji: "🎨", color: "from-pink-500 to-rose-600", unread: 0 },
  { id: 3, name: "GameZone", emoji: "🎮", color: "from-indigo-500 to-blue-600", unread: 7 },
  { id: 4, name: "Музыка", emoji: "🎵", color: "from-emerald-500 to-teal-600", unread: 0 },
  { id: 5, name: "Стартапы", emoji: "🚀", color: "from-orange-500 to-amber-600", unread: 1 },
];

export const CHANNELS = [
  { id: 1, name: "общий", icon: "Hash", type: "text", unread: 3 },
  { id: 2, name: "объявления", icon: "Megaphone", type: "text", unread: 0 },
  { id: 3, name: "вопросы", icon: "HelpCircle", type: "text", unread: 0 },
  { id: 4, name: "Голосовой 1", icon: "Volume2", type: "voice", unread: 0 },
  { id: 5, name: "Голосовой 2", icon: "Volume2", type: "voice", unread: 0 },
];

export const MEMBERS = [
  { id: 1, name: "Алексей К.", status: "online", role: "Администратор", avatar: "АК" },
  { id: 2, name: "Мария Н.", status: "online", role: "Модератор", avatar: "МН" },
  { id: 3, name: "Дмитрий П.", status: "idle", role: "Участник", avatar: "ДП" },
  { id: 4, name: "Екатерина В.", status: "dnd", role: "Участник", avatar: "ЕВ" },
  { id: 5, name: "Иван С.", status: "offline", role: "Участник", avatar: "ИС" },
  { id: 6, name: "Ольга М.", status: "online", role: "Участник", avatar: "ОМ" },
];

export const NOTIFICATIONS = [
  { id: 1, text: "Алексей К. упомянул вас в #общий", time: "2 мин", icon: "AtSign", read: false },
  { id: 2, text: "Новое сообщение в #объявления", time: "15 мин", icon: "Bell", read: false },
  { id: 3, text: "Иван С. присоединился к серверу", time: "1 ч", icon: "UserPlus", read: true },
  { id: 4, text: "Вас добавили в роль Модератор", time: "3 ч", icon: "Shield", read: true },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 1, author: "Алексей К.", avatar: "АК", status: "online",
    time: "Сегодня в 12:34",
    text: "Привет всем! Запустили новую сборку проекта — всё работает как надо 🔥",
    reactions: [{ emoji: "🔥", count: 5 }, { emoji: "👍", count: 3 }],
    image: null,
  },
  {
    id: 2, author: "Мария Н.", avatar: "МН", status: "online",
    time: "Сегодня в 12:41",
    text: "Отлично! Я проверила, действительно всё гладко. Осталось только задокументировать изменения.",
    reactions: [{ emoji: "✅", count: 2 }],
    image: null,
  },
  {
    id: 3, author: "Дмитрий П.", avatar: "ДП", status: "idle",
    time: "Сегодня в 13:02",
    text: "Скинул скриншот из нового интерфейса:",
    reactions: [],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop",
  },
  {
    id: 4, author: "Екатерина В.", avatar: "ЕВ", status: "dnd",
    time: "Сегодня в 13:15",
    text: "Нравится! Цветовая схема очень приятная 😍 Когда релиз?",
    reactions: [{ emoji: "😍", count: 4 }, { emoji: "🚀", count: 6 }],
    image: null,
  },
  {
    id: 5, author: "Алексей К.", avatar: "АК", status: "online",
    time: "Сегодня в 13:22",
    text: "Планируем на следующей неделе. Всем готовиться к тестированию!",
    reactions: [{ emoji: "💪", count: 8 }],
    image: null,
  },
];

export const INITIAL_DM_MESSAGES: Record<number, DmMessage[]> = {
  10: [
    { id: 1, author: "Алексей К.", text: "Привет! Как дела?", time: "12:10", isMine: false },
    { id: 2, author: "Вы", text: "Отлично, спасибо! Работаю над проектом.", time: "12:12", isMine: true },
    { id: 3, author: "Алексей К.", text: "Классно! Расскажи подробнее 😊", time: "12:13", isMine: false },
  ],
  11: [
    { id: 1, author: "Мария Н.", text: "Видела новый дизайн — очень нравится!", time: "11:00", isMine: false },
  ],
};

export const statusLabel: Record<string, string> = {
  online: "В сети", idle: "Отошёл", dnd: "Не беспокоить", offline: "Не в сети",
};
