import { useCallback, useRef, useEffect } from 'react';
import { useChatContext } from '../state/ChatContext';
import {
  fetchRootNodes, fetchNodeOptions, fetchExternoNodeId,
  submitDoubt, submitRating, submitFulfillmentLog
} from '../services/chatService';
import type { ChatItem, UserType } from '../types/chat';

export type { ChatItem };

export function useChatFlow() {
  const {
    items, addItem, removeItem, removeLastTyping, clearItems, userType,
    hasSentDoubt, setHasSentDoubt, currentCourseId, currentCourseTitle, setCourse,
    sessionLog, addToLog, clearLog
  } = useChatContext();

  // Mantém a referência mais recente do log para evitar o problema de "stale closure" nos callbacks
  const sessionLogRef = useRef(sessionLog);
  useEffect(() => {
    sessionLogRef.current = sessionLog;
  }, [sessionLog]);

  // ── Primitivos ──────────────────────────────────────────────────────────────

  const botMsg = useCallback((text: string) =>
    addItem({ type: 'msg', from: 'bot', text }), [addItem]);

  const userMsg = useCallback((text: string) =>
    addItem({ type: 'msg', from: 'user', text }), [addItem]);

  // Envia log para o servidor antes de limpar
  const flushLog = useCallback((flag: string | null = null) => {
    const currentLog = sessionLogRef.current;
    if (currentLog.length > 0) {
      submitFulfillmentLog({
        navigation_flow: currentLog,
        inquiry_ids: currentLog.map(l => l.id),
        flag
      }).catch(console.warn);
      clearLog();
    }
  }, [clearLog]);

  // ── Helper de Restart ───────────────────────────────────────────────────────

  // Permite recarregar o chat na raiz do curso selecionado (se houver), ou globalmente
  const restartCurrentCourse = useCallback(() => {
    flushLog(null);
    setHasSentDoubt(false); // Reseta o estado de envio de dúvida

    if (currentCourseId !== null && currentCourseTitle !== null) {
      clearItems();
      // Ao reiniciar o curso, o primeiro item do log deve ser o próprio curso novamente
      addToLog(currentCourseId, currentCourseTitle);
      addItem({ type: 'typing' });
      setTimeout(() => {
        removeLastTyping();
        navigateNode(
          currentCourseId,
          `Sobre ${currentCourseTitle}, o que deseja consultar?`,
          () => navigateNode(currentCourseId, `Sobre ${currentCourseTitle}, o que deseja consultar?`, () => { }),
          true,
        );
      }, 900);
    } else {
      addItem({ type: 'restart' });
    }
  }, [currentCourseId, currentCourseTitle, clearItems, addItem, removeLastTyping, flushLog, addToLog, setHasSentDoubt]);

  // ── Encerramento ─────────────────────────────────────────────────────────────

  const showRatingAndEnd = useCallback(() => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();
      addItem({
        type: 'ratingCard',
        onRate: (rating) => {
          submitRating({ rating, userType: userType ?? 'externo' }).catch(console.warn);
          const msg: Record<string, string> = {
            'Ruim': 'Lamentamos que sua experiência não tenha sido satisfatória. Vamos trabalhar para melhorar! 😔',
            'Satisfatório': 'Obrigado pelo feedback! Estamos sempre buscando melhorar. 🙂',
            'Bom': 'Fico feliz que tenha sido útil! Sempre que precisar, estarei aqui. 😊',
            'Muito bom': 'Que ótimo! Fico muito feliz em ter ajudado! 😄',
            'Ótimo': 'Uau, que avaliação incrível! Obrigado pela confiança! 🌟',
          };
          addItem({ type: 'typing' });
          setTimeout(() => {
            removeLastTyping();
            botMsg(msg[rating] ?? 'Obrigado pela avaliação!');
            flushLog(rating.toUpperCase());
            addItem({ type: 'typing' });
            setTimeout(() => {
              removeLastTyping();
              addItem({ type: 'restart' });
            }, 700);
          }, 800);
        },
      });
    }, 900);
  }, [addItem, removeLastTyping, botMsg, userType, flushLog]);

  const showEndOption = useCallback((onContinue?: () => void, onBack?: () => void) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();
      
      const opts = [];
      if (onBack) opts.push('Ver outras opções');
      
      if (onContinue) {
        opts.push('Continuar atendimento', 'Finalizar atendimento');
      } else {
        // Só oferece envio de dúvida se ainda não enviou nesta sessão
        if (!hasSentDoubt) {
          opts.push('Envie sua dúvida');
        }
        opts.push('Finalizar atendimento');
      }

      addItem({
        type: 'chips',
        label: onContinue ? 'Como deseja prosseguir?' : 'O que você gostaria de fazer?',
        options: opts,
        onSelect: (opt) => {
          userMsg(opt);

          if (opt === 'Ver outras opções' && onBack) {
            onBack(); return;
          }

          if (opt === 'Continuar atendimento' && onContinue) {
            onContinue(); return;
          }

          if (opt === 'Fazer outra consulta') {
            restartCurrentCourse();
            return;
          }

          if (opt === 'Envie sua dúvida') {
            addItem({ type: 'typing' });
            setTimeout(() => {
              removeLastTyping();
              addItem({
                type: 'doubtForm',
                isAluno: userType === 'aluno',
                onSubmit: (email, doubt) => {
              submitDoubt({ email, doubt, userType: userType ?? 'externo' })
                .then(() => {
                  setHasSentDoubt(true);
                  addItem({ type: 'typing' });
                  setTimeout(() => {
                    removeLastTyping();
                    botMsg('Sua dúvida foi enviada com sucesso! 📧');
                    addItem({ type: 'typing' });
                    setTimeout(() => {
                      removeLastTyping();
                      botMsg('Nossa equipe analisará sua solicitação e retornará através do e-mail informado.');
                      
                      // Oferece opções lógicas após o envio
                      addItem({
                        type: 'chips',
                        label: 'O que você gostaria de fazer agora?',
                        options: ['Fazer outra consulta', 'Finalizar atendimento'],
                        onSelect: (nextOpt) => {
                          userMsg(nextOpt);
                          if (nextOpt === 'Fazer outra consulta') {
                            restartCurrentCourse();
                          } else {
                            showRatingAndEnd();
                          }
                        }
                      });
                    }, 800);
                  }, 800);
                })
                    .catch(() => {
                      addItem({ type: 'typing' });
                      setTimeout(() => {
                        removeLastTyping();
                        botMsg('Não foi possível enviar agora. Tente novamente mais tarde. 😕');
                        showEndOption(undefined);
                      }, 800);
                    });
                },
              });
            }, 900);
            return;
          }
          
          if (opt === 'Finalizar atendimento') {
             flushLog(null);
          }

          showRatingAndEnd();
        },
      });
    }, 900);
  }, [addItem, removeLastTyping, userMsg, botMsg, userType, showRatingAndEnd, hasSentDoubt, setHasSentDoubt, restartCurrentCourse, flushLog]);

  const askSatisfacao = useCallback((onSim: () => void) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();
      addItem({
        type: 'chips',
        label: 'Conseguiu encontrar o que queria?',
        options: ['Sim', 'Não'],
        onSelect: (opt) => {
          userMsg(opt);
          opt === 'Sim' ? showEndOption(onSim) : showEndOption(undefined, onSim);
        },
      });
    }, 900);
  }, [addItem, removeLastTyping, userMsg, showEndOption]);

  // ── Navegação via API ────────────────────────────────────────────────────────

  const showAnswer = useCallback((
    data: { content: string | null; link: string | null; chunk_path: string | null },
    onBack: () => void,
  ) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();

      const hasContent = !!(data.content?.trim() || data.link?.trim() || data.chunk_path?.trim());

      if (!hasContent) {
        botMsg('Desculpe, esta opção ainda não possui uma resposta detalhada configurada. Por favor, entre em contato com a secretaria para mais informações. 😕');
      } else {
        if (data.content) botMsg(data.content);

        // monta lista de evidências e exibe num único item
        const evidences: { label: string; url: string }[] = [];
        if (data.chunk_path) evidences.push({ label: 'Documento de referência', url: data.chunk_path });
        if (data.link) evidences.push({ label: 'Link oficial', url: data.link });
        if (evidences.length > 0) {
          addItem({ type: 'evidenceList', evidences });
        }
      }

      askSatisfacao(onBack);
    }, 900);
  }, [addItem, removeLastTyping, botMsg, askSatisfacao]);

  const navigateNode = useCallback((
    nodeId: number | null,
    label: string,
    onBack: () => void,
    skipContent = false,
  ) => {
    addItem({ type: 'typing' });

    const run = async () => {
      removeLastTyping();
      try {
        const response = nodeId === null
          ? await fetchRootNodes()
          : await fetchNodeOptions(nodeId);

        if (response.type === 'answer') {
          if (!skipContent) showAnswer(response.data, onBack);
          else askSatisfacao(onBack);
          return;
        }

        const options = response.options.map((o) => o.title);
        const optionMap = Object.fromEntries(response.options.map((o) => [o.title, o.id]));

        addItem({
          type: 'chips',
          label,
          options,
          onSelect: (title) => {
            userMsg(title);
            const id = optionMap[title];
            addToLog(id, title);
            navigateNode(id, 'O que você gostaria de saber?', () =>
              navigateNode(nodeId, label, onBack));
          },
        });
      } catch {
        removeLastTyping();
        botMsg('Não consegui carregar as opções agora. Tente novamente. 😕');
        showEndOption(undefined);
      }
    };

    setTimeout(run, 900);
  }, [addItem, userMsg, botMsg, showAnswer, showEndOption, addToLog]);

  // ── API pública do hook ──────────────────────────────────────────────────────

  const startChat = useCallback((type: UserType) => {
    clearItems();
    clearLog();
    setCourse(null, null);
    setHasSentDoubt(false); // Garante que a opção de dúvida apareça em novas sessões
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();
      botMsg('Olá! Eu sou o FAQtec e estou aqui para tirar suas dúvidas 😊');
      if (type === 'aluno') {
        addItem({ type: 'typing' });
        setTimeout(() => {
          removeLastTyping();
          botMsg('Selecione o seu curso nas abas acima para começar! 👆');
        }, 800);
      } else {
        // Externo: entra direto no nó "Não sou aluno" dos raiz
        addItem({ type: 'typing' });
        setTimeout(async () => {
          removeLastTyping();
          try {
            const externoId = await fetchExternoNodeId();
            if (externoId !== null) {
              setCourse(externoId, 'Não sou aluno');
              addToLog(externoId, 'Não sou aluno');
              navigateNode(externoId, 'Como posso te ajudar hoje?', () =>
                navigateNode(externoId, 'Como posso te ajudar hoje?', () => { }));
            } else {
              // fallback: mostra todos os nós raiz
              navigateNode(null, 'Como posso te ajudar hoje?', () =>
                navigateNode(null, 'Como posso te ajudar hoje?', () => { }));
            }
          } catch {
            navigateNode(null, 'Como posso te ajudar hoje?', () =>
              navigateNode(null, 'Como posso te ajudar hoje?', () => { }));
          }
        }, 600);
      }
    }, 900);
  }, [clearItems, clearLog, setCourse, setHasSentDoubt, addItem, removeLastTyping, botMsg, addToLog, navigateNode]);

  const startCourse = useCallback((courseNodeId: number, courseTitle: string) => {
    clearItems();
    clearLog();
    setCourse(courseNodeId, courseTitle);
    setHasSentDoubt(false); // Garante que a opção de dúvida apareça em novas sessões
    addToLog(courseNodeId, courseTitle);
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();
      botMsg(`Bem-vindo ao atendimento de ${courseTitle}. O que você procura?`);
      navigateNode(
        courseNodeId,
        `Sobre ${courseTitle}, o que deseja consultar?`,
        () => navigateNode(courseNodeId, `Sobre ${courseTitle}, o que deseja consultar?`, () => { }),
        true,
      );
    }, 900);
  }, [clearItems, clearLog, setCourse, setHasSentDoubt, addToLog, addItem, removeLastTyping, botMsg, navigateNode]);

  return { items, startChat, startCourse, removeItem, removeLastTyping };
}