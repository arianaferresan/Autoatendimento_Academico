import {
  createContext, useContext, useReducer,
  useCallback, type ReactNode,
} from 'react';
import type { ChatItem, UserType } from '../types/chat';

// ── Estado ───────────────────────────────────────────────────────────────────

interface ChatState {
  items:    ChatItem[];
  userType: UserType | null;
  hasSentDoubt: boolean;
  currentCourseId: number | null;
  currentCourseTitle: string | null;
  sessionLog: { id: number; title: string }[];
}

const initial: ChatState = { 
  items: [], 
  userType: null, 
  hasSentDoubt: false,
  currentCourseId: null,
  currentCourseTitle: null,
  sessionLog: []
};

// ── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_USER_TYPE';      payload: UserType }
  | { type: 'SET_HAS_SENT_DOUBT'; payload: boolean }
  | { type: 'SET_COURSE';         payload: { id: number | null; title: string | null } }
  | { type: 'ADD_ITEM';           payload: Omit<ChatItem, 'id'> }
  | { type: 'REMOVE_ITEM';        payload: number }
  | { type: 'REMOVE_LAST_TYPING' }
  | { type: 'CLEAR_ITEMS' }
  | { type: 'ADD_TO_LOG';         payload: { id: number; title: string } }
  | { type: 'CLEAR_LOG' };

let _id = 0;
const uid = () => ++_id;

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'SET_USER_TYPE':
      return { ...state, userType: action.payload };
    case 'SET_HAS_SENT_DOUBT':
      return { ...state, hasSentDoubt: action.payload };
    case 'SET_COURSE':
      return { ...state, currentCourseId: action.payload.id, currentCourseTitle: action.payload.title };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, { id: uid(), ...action.payload }] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'REMOVE_LAST_TYPING': {
      const idx = [...state.items].reverse().findIndex((i) => i.type === 'typing');
      if (idx === -1) return state;
      const realIdx = state.items.length - 1 - idx;
      return { ...state, items: state.items.filter((_, i) => i !== realIdx) };
    }
    case 'CLEAR_ITEMS':
      // Clear items only. Course memory is handled explicitly by login/tab changes.
      return { ...state, items: [] };
    case 'ADD_TO_LOG':
      return { ...state, sessionLog: [...state.sessionLog, action.payload] };
    case 'CLEAR_LOG':
      return { ...state, sessionLog: [] };
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface Ctx {
  items:             ChatItem[];
  userType:          UserType | null;
  hasSentDoubt:      boolean;
  currentCourseId:   number | null;
  currentCourseTitle:string | null;
  sessionLog:        { id: number; title: string }[];
  setUserType:       (t: UserType) => void;
  setHasSentDoubt:   (v: boolean) => void;
  setCourse:         (id: number | null, title: string | null) => void;
  addItem:           (item: Omit<ChatItem, 'id'>) => void;
  removeItem:        (id: number) => void;
  removeLastTyping:  () => void;
  clearItems:        () => void;
  addToLog:          (id: number, title: string) => void;
  clearLog:          () => void;
}

const ChatContext = createContext<Ctx | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const setUserType = useCallback((t: UserType) =>
    dispatch({ type: 'SET_USER_TYPE', payload: t }), []);

  const setHasSentDoubt = useCallback((v: boolean) =>
    dispatch({ type: 'SET_HAS_SENT_DOUBT', payload: v }), []);

  const setCourse = useCallback((id: number | null, title: string | null) =>
    dispatch({ type: 'SET_COURSE', payload: { id, title } }), []);

  const addItem = useCallback((item: Omit<ChatItem, 'id'>) =>
    dispatch({ type: 'ADD_ITEM', payload: item }), []);

  const removeItem = useCallback((id: number) =>
    dispatch({ type: 'REMOVE_ITEM', payload: id }), []);

  const removeLastTyping = useCallback(() =>
    dispatch({ type: 'REMOVE_LAST_TYPING' }), []);

  const clearItems = useCallback(() =>
    dispatch({ type: 'CLEAR_ITEMS' }), []);

  const addToLog = useCallback((id: number, title: string) =>
    dispatch({ type: 'ADD_TO_LOG', payload: { id, title } }), []);

  const clearLog = useCallback(() =>
    dispatch({ type: 'CLEAR_LOG' }), []);

  return (
    <ChatContext.Provider value={{
      items: state.items, 
      userType: state.userType, 
      hasSentDoubt: state.hasSentDoubt,
      currentCourseId: state.currentCourseId,
      currentCourseTitle: state.currentCourseTitle,
      sessionLog: state.sessionLog,
      setUserType, setHasSentDoubt, setCourse, addItem, removeItem, removeLastTyping, clearItems, addToLog, clearLog
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): Ctx {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext deve estar dentro de <ChatProvider>');
  return ctx;
}