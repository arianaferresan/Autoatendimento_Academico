// ── Navegação ────────────────────────────────────────────────────────────────

export type Screen   = 'welcome' | 'chat';
export type UserType = 'aluno' | 'externo';

// ── API — espelho exato do backend ───────────────────────────────────────────

export interface ApiOption {
  id:            number;
  title:         string;
  display_order: number;
}

export interface ApiMenuResponse {
  type:    'menu';
  options: ApiOption[];
}

export interface ApiAnswerData {
  title:      string;
  content:    string | null;
  chunk_path: string | null;
  link:       string | null;
}

export interface ApiAnswerResponse {
  type: 'answer';
  data: ApiAnswerData;
}

export type ApiNodeResponse = ApiMenuResponse | ApiAnswerResponse;

// ── Itens do chat (UI) ───────────────────────────────────────────────────────

export type ChatItemType =
  | 'msg'
  | 'typing'
  | 'link'
  | 'chips'
  | 'confirm'
  | 'doubtForm'
  | 'ratingCard'
  | 'restart';

export interface ChatItem {
  id:       number;
  type:     ChatItemType;
  text?:    string;
  from?:    'bot' | 'user';
  url?:     string;
  options?: string[];
  label?:   string;
  isAluno?: boolean;
  onSelect?: (opt: string) => void;
  onYes?:    () => void;
  onNo?:     () => void;
  onSubmit?: (email: string, doubt: string) => void;
  onRate?:   (rating: string) => void;
}