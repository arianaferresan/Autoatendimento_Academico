import { EvidenceList } from './ChatComponents';
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
  onBack: () => void;
  userType: UserType;
}

interface CourseTab {
  id: number;
  label: string;
  full: string;
}

export default function ChatScreen({ onBack, userType }: ChatScreenProps) {
  const { items, removeItem } = useChatContext();
  const { startChat, startCourse } = useChatFlow();
  const bodyRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
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
          id: o.id,
          label: o.title,
          full: o.title,
        }));
      setCourseTabs(tabs);
    });
  }, [userType]);

  useEffect(() => { startChat(userType); }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
              onNo={() => { removeItem(item.id); item.onNo!(); }}
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

      case 'evidenceList':
        return item.evidences !== undefined
          ? <EvidenceList key={item.id} items={item.evidences} />
          : null;

      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-hidden">
      <header className="bg-white shadow-sm shrink-0 border-b border-gray-200">
        <div className="px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              title="Voltar ao início"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors border-0 cursor-pointer flex items-center justify-center shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo-fatec.png" alt="Fatec Jacareí"
                className="h-10 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="w-px h-6 bg-gray-200 hidden sm:block" />
              <img src="/logo-cps.png" alt="CPS"
                className="h-8 object-contain hidden sm:block"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          </div>
          
          <div className="flex w-full sm:w-auto items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50 focus-within:border-[#8B0000] transition-colors">
            <input
              className="text-sm outline-none px-3 py-2 w-full min-w-0 sm:w-48 bg-transparent"
              placeholder="Pesquisar..."
            />
            <button className="shrink-0 bg-[#8B0000] text-white px-3 py-2 border-0 cursor-pointer hover:bg-red-900 transition-colors">
              🔍
            </button>
          </div>
        </div>

        {userType === 'aluno' && courseTabs.length > 0 && (
          <div className="bg-[#8B0000] flex px-2 sm:px-4 py-1 gap-1 overflow-x-auto">
            {courseTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab)}
                className={`flex-1 min-w-[84px] sm:min-w-[90px] text-center text-white text-[12px] font-bold py-2 px-1 rounded-md transition-all border-0 cursor-pointer
                  ${activeCourse === tab.full ? 'bg-white/20 shadow-inner' : 'bg-transparent hover:bg-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div ref={bodyRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6">
          {items.map(renderItem)}
          <div ref={bottomRef} className="h-px w-full" />
        </div>
      </div>
    </div>
  );
}
