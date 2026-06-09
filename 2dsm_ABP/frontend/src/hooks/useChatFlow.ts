import { useCallback } from 'react';
import { useChatContext } from '../state/ChatContext';
import {
  fetchRootNodes, fetchNodeOptions, fetchExternoNodeId,
  submitDoubt, submitRating,
} from '../services/chatService';
import type { ChatItem, UserType } from '../types/chat';

export type { ChatItem };

export function useChatFlow(initialUserType?: UserType) {
  const { items, addItem, removeItem, removeLastTyping, clearItems, userType, setUserType } = useChatContext();

  // ── Primitivos ──────────────────────────────────────────────────────────────

  const botMsg = useCallback((text: string) =>
    addItem({ type: 'msg', from: 'bot', text }), [addItem]);

  const userMsg = useCallback((text: string) =>
    addItem({ type: 'msg', from: 'user', text }), [addItem]);

  // ── Encerramento ─────────────────────────────────────────────────────────────

  const showRatingAndEnd = useCallback(() => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();
      addItem({
        type: 'ratingCard',
        onRate: (rating) => {
          submitRating({ rating, userType: userType ?? initialUserType ?? 'externo' }).catch(console.warn);
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
            addItem({ type: 'typing' });
            setTimeout(() => {
              removeLastTyping();
              addItem({ type: 'restart' });
            }, 700);
          }, 800);
        },
      });
    }, 900);
  }, [addItem, removeLastTyping, botMsg, userType, initialUserType]);

  const showEndOption = useCallback((onContinue?: () => void) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeLastTyping();
      const opts = onContinue
        ? ['Continuar atendimento', 'Finalizar atendimento']
        : ['Nos envie sua dúvida', 'Finalizar atendimento'];

      addItem({
        type: 'chips',
        label: onContinue ? 'Como deseja prosseguir?' : 'O que você gostaria de fazer?',
        options: opts,
        onSelect: (opt) => {
          userMsg(opt);

          if (opt === 'Continuar atendimento' && onContinue) {
            onContinue(); return;
          }

          if (opt === 'Nos envie sua dúvida') {
            addItem({ type: 'typing' });
            setTimeout(() => {
              removeLastTyping();
              addItem({
                type: 'doubtForm',
                isAluno: (userType ?? initialUserType) === 'aluno',
                onSubmit: (email, doubt) => {
                  submitDoubt({ email, doubt, userType: userType ?? initialUserType ?? 'externo' })
                    .then(() => {
                      addItem({ type: 'typing' });
                      setTimeout(() => {
                        removeLastTyping();
                        botMsg('Sua dúvida foi enviada! Fique atento ao seu e-mail. 📧');
                        showEndOption(undefined);
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

          showRatingAndEnd();
        },
      });
    }, 900);
  }, [addItem, removeLastTyping, userMsg, botMsg, userType, initialUserType, showRatingAndEnd]);

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
          opt === 'Sim' ? showEndOption(onSim) : showEndOption(undefined);
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
      if (data.content) botMsg(data.content);

      // monta lista de evidências e exibe num único item
      const evidences: { label: string; url: string }[] = [];
      if (data.chunk_path) evidences.push({ label: 'Documento de referência', url: data.chunk_path });
      if (data.link) evidences.push({ label: 'Link oficial', url: data.link });
      if (evidences.length > 0) {
        addItem({ type: 'evidenceList', evidences });
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
  }, [addItem, userMsg, botMsg, showAnswer, showEndOption]);

  // ── API pública do hook ──────────────────────────────────────────────────────

  const startChat = useCallback((type: UserType) => {
    setUserType(type);
    clearItems();
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
  }, [setUserType, clearItems, addItem, removeLastTyping, botMsg, navigateNode]);

  const startCourse = useCallback((courseNodeId: number, courseTitle: string) => {
    clearItems();
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
  }, [clearItems, addItem, removeLastTyping, botMsg, navigateNode]);

  return { items, startChat, startCourse, removeItem, removeLastTyping };
}
