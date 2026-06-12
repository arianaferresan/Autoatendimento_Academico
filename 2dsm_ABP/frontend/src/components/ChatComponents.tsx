import { useRef, useState } from 'react';

// Avatar do bot
function BotAvatar() {
  return (
    <img
      src="/foto-bot.svg"
      alt="bot"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid rgba(0, 92, 109, 0.6)',
        padding: '1px',
      }}
      onError={(e) => {
        (e.target as HTMLImageElement).outerHTML = '<span style="font-size:20px">🤖</span>';
      }}
    />
  );
}


//  exibir evidências
interface EvidenceListProps {
  items: { label: string; url: string }[];
}

export function EvidenceList({ items }: EvidenceListProps) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col self-start animate-fadeUp gap-1 max-w-[85%]">
      <div className="bg-[#004757] rounded-2xl px-4 py-3 flex flex-col gap-2 shadow-sm">
        <span className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">
          📎 Evidências
        </span>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              const fullUrl = item.url.startsWith('http') || item.url.startsWith('/')
                ? item.url
                : `/${item.url}`;
              window.open(fullUrl, '_blank');
            }}
            title={item.label}
            className="flex items-center gap-2 bg-[#003a47] text-white text-[12px] px-3 py-2
                       rounded-xl hover:opacity-80 transition-opacity
                       text-left break-all cursor-pointer border-0 w-full font-medium"
          >
            <span className="text-base shrink-0">🔗</span>
            <span className="flex-1 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


// Bolha de mensagem
interface MessageBubbleProps {
  text: string;
  from: string;
}
export function MessageBubble({ text, from }: MessageBubbleProps) {
  const isBot = from === 'bot';

  if (isBot) {
    return (
      <div className="flex flex-col self-start animate-fadeUp gap-2 max-w-[85%]">
        <BotAvatar />
        <div
          className="bg-[#005c6d] text-white px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-line shadow-sm"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[70%] px-5 py-3 rounded-2xl text-[14px] leading-relaxed text-gray-700 bg-[#d9dde0] self-end animate-fadeUp shadow-sm">
      {text}
    </div>
  );
}

// Typing indicator
export function TypingIndicator() {
  return (
    <div className="flex flex-col self-start animate-fadeUp gap-2">
      <BotAvatar />
      <div className="flex gap-1 items-center px-4 py-3 bg-[#005c6d] rounded-2xl shadow-sm">
        {[0, 200, 400].map((delay) => (
          <span
            key={delay}
            className="w-[7px] h-[7px] rounded-full bg-white/70 animate-bounce3"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// Link copiável
interface LinkCardProps {
  url: string;
  label?: string;
}
export function LinkCard({ url, label }: LinkCardProps) {
  return (
    <div className="flex flex-col self-start animate-fadeUp gap-2 max-w-[85%]">
      <BotAvatar />
      <div className="bg-[#005C6D] rounded-2xl px-5 py-4 flex flex-col gap-3 shadow-sm">
        <span className="text-white text-[14px] leading-relaxed font-medium">
          {label ?? 'Ok, aqui está o link que te leva direto para a grade horária do seu curso:'}
        </span>
        <button
  onClick={() => {
    navigator.clipboard.writeText(url).catch(() => {});
    const fullUrl = url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
    window.open(fullUrl, '_blank');
  }}
  title="Clique para abrir o link"
  className="flex items-center gap-2 bg-[#004757] text-white text-[12px] px-3.5 py-2.5
             rounded-xl hover:opacity-80 transition-opacity
             text-left break-all cursor-pointer border-0 overflow-hidden w-full font-bold"
>
  <span className="flex-1">{url}</span>
  <span className="text-base shrink-0">&#128203;</span>
</button>
      </div>
    </div>
  );
}

// Chips de seleção
interface ChipsRowProps {
  options: string[];
  onSelect: (opt: string) => void;
  label?: string;
}
export function ChipsRow({ options, onSelect, label }: ChipsRowProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (opt: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (selected) return;
    setSelected(opt);
    const row = e.currentTarget.closest('.chips-row');
    row?.querySelectorAll('button').forEach((b) => {
      (b as HTMLButtonElement).disabled = true;
    });
    onSelect(opt);
  };

  return (
    <div className="flex flex-col self-start animate-fadeUp gap-2 max-w-[90%]">
      <BotAvatar />
      <div className="bg-[#005c6d] rounded-2xl px-5 py-4 flex flex-col gap-4 shadow-sm">
        {label && (
          <span className="text-white text-[14px] leading-relaxed font-medium">{label}</span>
        )}
        <div className="chips-row flex flex-wrap gap-2.5">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={(e) => handleClick(opt, e)}
              className={`rounded-full px-4 py-2 text-[12px] font-bold border border-white/40
                cursor-pointer transition-all duration-200 disabled:cursor-default
                ${selected === opt
                  ? 'bg-white text-[#005c6d] border-white scale-105 shadow-md'
                  : selected !== null
                    ? 'bg-transparent text-white/40 border-white/20'
                    : 'bg-transparent text-white hover:bg-white/10 hover:border-white'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Botões Sim/Não
interface ConfirmRowProps {
  onYes: () => void;
  onNo: () => void;
  label?: string;
}
export function ConfirmRow({ onYes, onNo, label }: ConfirmRowProps) {
  return (
    <div className="flex flex-col self-start animate-fadeUp gap-2">
      <BotAvatar />
      <div className="bg-[#005c6d] rounded-2xl px-5 py-4 flex flex-col gap-4 shadow-sm">
        {label && (
          <span className="text-white text-[14px] leading-relaxed font-medium">{label}</span>
        )}
        <div className="flex gap-3">
          <button
            onClick={onYes}
            className="px-6 py-2 rounded-full bg-[#1D9E75] text-white text-[13px] font-black
                       hover:bg-[#168a62] transition-colors border-0 cursor-pointer shadow-sm"
          >
            ✓ Sim
          </button>
          <button
            onClick={onNo}
            className="px-6 py-2 rounded-full bg-[#C0392B] text-white text-[13px] font-black
                       hover:bg-[#a93226] transition-colors border-0 cursor-pointer shadow-sm"
          >
            ✗ Não
          </button>
        </div>
      </div>
    </div>
  );
}
// Card de formulário de dúvida
interface DoubtFormProps {
  onSubmit: (email: string, doubt: string) => void;
  isAluno?: boolean;
}

interface DoubtFormErrors {
  email?: string;
  doubt?: string;
  general?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DoubtForm({ onSubmit, isAluno }: DoubtFormProps) {
  const [email, setEmail] = useState('');
  const [doubt, setDoubt] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<DoubtFormErrors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const doubtRef = useRef<HTMLTextAreaElement>(null);

  const validateForm = (emailValue: string, doubtValue: string): DoubtFormErrors => {
    const nextErrors: DoubtFormErrors = {};

    if (!emailValue.trim()) {
      nextErrors.email = 'E-mail e obrigatorio.';
    } else if (!emailPattern.test(emailValue.trim())) {
      nextErrors.email = 'Informe um e-mail valido.';
    }

    if (!doubtValue.trim()) {
      nextErrors.doubt = 'Descreva sua solicitacao.';
    }

    if (nextErrors.email || nextErrors.doubt) {
      nextErrors.general = 'Existem campos obrigatorios nao preenchidos.';
    }

    return nextErrors;
  };

  const hasErrors = Boolean(errors.email || errors.doubt);

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!errors.email && !errors.general) return;

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      if (!value.trim()) {
        nextErrors.email = 'E-mail e obrigatorio.';
      } else if (!emailPattern.test(value.trim())) {
        nextErrors.email = 'Informe um e-mail valido.';
      } else {
        delete nextErrors.email;
      }

      delete nextErrors.general;
      return nextErrors;
    });
  };

  const handleDoubtChange = (value: string) => {
    setDoubt(value);

    if (!errors.doubt && !errors.general) return;

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      if (!value.trim()) {
        nextErrors.doubt = 'Descreva sua solicitacao.';
      } else {
        delete nextErrors.doubt;
      }

      delete nextErrors.general;
      return nextErrors;
    });
  };

  const handleSubmit = () => {
    const nextErrors = validateForm(email, doubt);

    if (nextErrors.email || nextErrors.doubt) {
      setErrors(nextErrors);

      if (nextErrors.email) {
        emailRef.current?.focus();
      } else {
        doubtRef.current?.focus();
      }

      return;
    }

    setErrors({});
    setSent(true);
    onSubmit(email.trim(), doubt.trim());
  };

  return (
    <div className="flex flex-col self-start animate-fadeUp gap-2 max-w-[90%]">
      <BotAvatar />
      <div className="bg-[#C0392B] rounded-2xl px-5 py-4 flex flex-col gap-4 shadow-md">
        <span className="text-white text-[14px] font-bold leading-relaxed">
          Por favor nos conte qual é a sua dúvida?
        </span>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="doubt-email" className="text-white/80 text-[11px] font-black uppercase tracking-tighter">
            {isAluno ? 'E-mail institucional:' : 'Seu E-mail:'}
          </label>
          <input
            id="doubt-email"
            ref={emailRef}
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="Digite seu E-mail aqui..."
            disabled={sent}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'doubt-email-error' : undefined}
            className={`rounded-xl px-4 py-2.5 text-[13px] text-gray-700 bg-white border outline-none placeholder-gray-400 disabled:opacity-60 font-medium
              ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-transparent'}`}
          />
          {errors.email && (
            <span id="doubt-email-error" role="alert" className="text-white text-[11px] font-bold">
              {errors.email}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-white/80 text-[11px] font-black uppercase tracking-tighter">Escreva sua dúvida:</span>
          <textarea
            id="doubt-message"
            ref={doubtRef}
            value={doubt}
            onChange={(e) => handleDoubtChange(e.target.value)}
            placeholder="Digite aqui sua mensagem detalhada..."
            disabled={sent}
            rows={4}
            aria-label="Escreva sua duvida"
            aria-invalid={Boolean(errors.doubt)}
            aria-describedby={errors.doubt ? 'doubt-message-error' : undefined}
            className={`rounded-xl px-4 py-2.5 text-[13px] text-gray-700 bg-white border outline-none placeholder-gray-400 resize-none disabled:opacity-60 font-medium
              ${errors.doubt ? 'border-red-500 ring-2 ring-red-200' : 'border-transparent'}`}
          />
          {errors.doubt && (
            <span id="doubt-message-error" role="alert" className="text-white text-[11px] font-bold">
              {errors.doubt}
            </span>
          )}
        </div>
        {errors.general && (
          <span role="alert" className="rounded-xl bg-white/15 px-3 py-2 text-white text-[12px] font-bold">
            {errors.general}
          </span>
        )}
        {!sent && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={hasErrors}
              className="px-8 py-2.5 rounded-xl bg-[#1D9E75] text-white text-[13px] font-black
                         hover:bg-[#168a62] transition-all active:scale-95 border-0 cursor-pointer shadow-lg
                         disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#1D9E75]"
            >
              Enviar Mensagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Card de avaliação com emojis
interface RatingCardProps {
  onRate: (rating: string) => void;
}
export function RatingCard({ onRate }: RatingCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const ratings: { emoji: string; label: string }[] = [
    { emoji: '😠', label: 'Ruim' },
    { emoji: '😐', label: 'Satisfatório' },
    { emoji: '🙂', label: 'Bom' },
    { emoji: '😊', label: 'Muito bom' },
    { emoji: '😁', label: 'Ótimo' },
  ];

  const handleRate = (label: string) => {
    if (selected) return;
    setSelected(label);
    onRate(label);
  };

  return (
    <div className="flex flex-col self-start animate-fadeUp gap-2 max-w-[90%]">
      <BotAvatar />
      <div className="bg-[#005c6d] rounded-2xl px-5 py-5 flex flex-col gap-5 shadow-sm">
        <span className="text-white text-[14px] leading-relaxed font-bold">
          Como você avalia o meu atendimento?
        </span>
        <div className="flex gap-2 justify-around">
          {ratings.map((r) => (
            <button
              key={r.label}
              onClick={() => handleRate(r.label)}
              disabled={!!selected}
              className={`flex flex-col items-center gap-2 bg-transparent border-0 cursor-pointer
                transition-all duration-300 disabled:cursor-default
                ${selected === r.label ? 'scale-125' : selected ? 'opacity-30 grayscale' : 'hover:scale-110'}`}
            >
              <span className="text-3xl">{r.emoji}</span>
              <span className="text-white text-[10px] font-bold uppercase">{r.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Botão voltar ao início
interface RestartButtonProps {
  onRestart: () => void;
}
export function RestartButton({ onRestart }: RestartButtonProps) {
  return (
    <div className="flex justify-center animate-fadeUp mt-4 mb-4">
      <button
        onClick={onRestart}
        className="flex items-center gap-3 px-8 py-3 rounded-full bg-[#C0392B] text-white
                   text-[14px] font-bold uppercase tracking-widest hover:bg-[#96281B] transition-all active:scale-95 border-0 cursor-pointer shadow-lg"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
        </svg>
        ENCERRAR
      </button>
    </div>
  );
}
