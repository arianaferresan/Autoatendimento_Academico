import {
  createContext, useContext, useReducer,
  useCallback, type ReactNode,
} from 'react';
import type { ChatItem, UserType } from '../types/chat';

// ── Estado ───────────────────────────────────────────────────────────────────

interface ChatState {
  items:    ChatItem[];
  userType: UserType | null;
}

const initial: ChatState = { items: [], userType: null };

// ── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_USER_TYPE';      payload: UserType }
  | { type: 'ADD_ITEM';           payload: Omit<ChatItem, 'id'> }
  | { type: 'REMOVE_ITEM';        payload: number }
  | { type: 'REMOVE_LAST_TYPING' }
  | { type: 'CLEAR_ITEMS' };

let _id = 0;
const uid = () => ++_id;

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'SET_USER_TYPE':
      return { ...state, userType: action.payload };
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
      return { ...state, items: [] };
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface Ctx {
  items:             ChatItem[];
  userType:          UserType | null;
  setUserType:       (t: UserType) => void;
  addItem:           (item: Omit<ChatItem, 'id'>) => void;
  removeItem:        (id: number) => void;
  removeLastTyping:  () => void;
  clearItems:        () => void;
}

const ChatContext = createContext<Ctx | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const setUserType = useCallback((t: UserType) =>
    dispatch({ type: 'SET_USER_TYPE', payload: t }), []);

  const addItem = useCallback((item: Omit<ChatItem, 'id'>) =>
    dispatch({ type: 'ADD_ITEM', payload: item }), []);

  const removeItem = useCallback((id: number) =>
    dispatch({ type: 'REMOVE_ITEM', payload: id }), []);

  const removeLastTyping = useCallback(() =>
    dispatch({ type: 'REMOVE_LAST_TYPING' }), []);

  const clearItems = useCallback(() =>
    dispatch({ type: 'CLEAR_ITEMS' }), []);

  return (
    <ChatContext.Provider value={{
      items: state.items, userType: state.userType,
      setUserType, addItem, removeItem, removeLastTyping, clearItems,
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