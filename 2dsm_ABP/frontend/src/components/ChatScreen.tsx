import { useEffect, useRef, useState } from 'react';
import { useChatFlow } from '../hooks/useChatFlow';
import { useChatContext } from '../state/ChatContext';
import { fetchRootNodes } from '../services/chatService';
import type { ChatItem, UserType } from '../types/chat';
import {
  MessageBubble, TypingIndicator, LinkCard,
  ChipsRow, ConfirmRow, DoubtForm, RatingCard, RestartButton,
} from './ChatComponents';

interface ChatScreenProps {
  onBack:   () => void;
  userType: UserType;
}

interface CourseTab {
  id:    number;
  label: string;
  full:  string;
}

export default function ChatScreen({ onBack, userType }: ChatScreenProps) {
  const { items, removeItem } = useChatContext();
  const { startChat, startCourse } = useChatFlow(userType);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [courseTabs, setCourseTabs] = useState<CourseTab[]>([]);

  // Busca os nós raiz da API e monta as abas de curso dinamicamente
  useEffect(() => {
    if (userType !== 'aluno') return;
    fetchRootNodes().then((res) => {
      if (res.type !== 'menu') return;
      const tabs = res.options
        .filter((o) => !o.title.toLowerCase().includes('não sou aluno'))
        .map((o) => ({
          id:    o.id,
          label: o.title,
          full:  o.title,
        }));
      setCourseTabs(tabs);
    });
  }, [userType]);

  useEffect(() => { startChat(userType); }, []);

  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [items]);

  const handleTabSelect = (tab: CourseTab) => {
    if (activeCourse === tab.full) return;
    setActiveCourse(tab.full);
    startCourse(tab.id, tab.full);
  };

  const renderItem = (item: ChatItem) => {
    switch (item.type) {
      case 'msg':
        return item.text !== undefined && item.from !== undefined
          ? <MessageBubble key={item.id} text={item.text} from={item.from} />
          : null;

      case 'typing':
        return <TypingIndicator key={item.id} />;

      case 'link':
        return item.url !== undefined
          ? <LinkCard key={item.id} url={item.url} label={item.label} />
          : null;

      case 'chips':
        return item.options !== undefined && item.onSelect !== undefined
          ? (
            <ChipsRow
              key={item.id}
              label={item.label}
              options={item.options}
              onSelect={item.onSelect}
            />
          ) : null;

      case 'confirm':
        return item.onYes !== undefined && item.onNo !== undefined
          ? (
            <ConfirmRow
              key={item.id}
              label={item.label}
              onYes={() => { removeItem(item.id); item.onYes!(); }}
              onNo={() =>  { removeItem(item.id); item.onNo!(); }}
            />
          ) : null;

      case 'doubtForm':
        return item.onSubmit !== undefined
          ? <DoubtForm key={item.id} isAluno={item.isAluno} onSubmit={item.onSubmit} />
          : null;

      case 'ratingCard':
        return item.onRate !== undefined
          ? <RatingCard key={item.id} onRate={item.onRate} />
          : null;

      case 'restart':
        return <RestartButton key={item.id} onRestart={onBack} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm shrink-0">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-gray-500 text-2xl leading-none bg-transparent border-0 cursor-pointer p-0 mr-1"
            >
              ‹
            </button>
            <img src="/logo-fatec.png" alt="Fatec Jacareí"
              className="h-8 sm:h-10 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <img src="/logo-cps.png" alt="CPS"
              className="h-6 sm:h-8 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden ml-2">
            <input
              className="text-sm outline-none px-2 py-1.5 w-24 sm:w-36 bg-transparent"
              placeholder="O que deseja localizar?"
            />
            <button className="bg-[#C0392B] text-white px-2 sm:px-3 py-1.5 text-sm hover:bg-[#96281B] transition-colors">
              🔍
            </button>
          </div>
        </div>

        {userType === 'aluno' && courseTabs.length > 0 && (
          <div className="bg-[#C0392B] flex">
            {courseTabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab)}
                className={`flex-1 text-center text-white text-[13px] font-bold py-2 border-0 cursor-pointer transition-colors
                  ${i < courseTabs.length - 1 ? 'border-r border-red-700' : ''}
                  ${activeCourse === tab.full ? 'bg-[#96281B]' : 'bg-transparent hover:bg-[#a93226]'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div ref={bodyRef} className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-3">
        {items.map(renderItem)}
      </div>
    </div>
  );
}
