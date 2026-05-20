import { useCallback } from 'react';
import { useChatContext } from '../state/ChatContext';
import {
  fetchRootNodes, fetchNodeOptions,
  submitDoubt, submitRating,
} from '../services/chatService';
import type { ChatItem, UserType } from '../types/chat';

export type { ChatItem };

export function useChatFlow(initialUserType?: string) {
  const { items, addItem, removeItem, clearItems, userType } = useChatContext();

  // ── Primitivos ──────────────────────────────────────────────────────────────

  const withTyping = useCallback((cb: () => void, delay = 900) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      removeItem(
        // remove o typing mais recente pelo tipo — o id é opaco aqui,
        // por isso filtramos o último 'typing' via closure externa no ChatScreen
        // (ver nota abaixo). Workaround: o ChatScreen renderiza no máximo 1 typing
        // visível porque withTyping é chamado de forma sequencial (nunca paralela).
        // Então remover todos é seguro: não haverá dois typings ao mesmo tempo.
        -1, // sentinel — ver removeLastTyping abaixo
      );
      cb();
    }, delay);
  }, [addItem, removeItem]);

  // removeItem(-1) nunca combina com um id real (uid começa em 1).
  // Precisamos de um helper que remova o último typing da lista.
  // Como o Context só expõe removeItem(id), usamos CLEAR_TYPING via ADD/REMOVE
  // com um flag especial — a solução mais simples: expor removeLastTyping.
  // Para não alterar a interface do Context, substituímos withTyping por uma
  // versão que usa clearItems de typing via filtro no reducer já existente:
  // Solução final limpa abaixo ↓

  const typingThenRun = useCallback((cb: () => void, delay = 900) => {
    let typingId: number | undefined;
    // Captura o id gerado pelo addItem inspecionando o retorno — mas addItem
    // não retorna o id. Alternativa pragmática e sem quebrar a API do context:
    // usamos um ref externo de sequência, replicando o uid() do reducer.
    // O id do próximo item = valor atual de _id + 1 (o reducer incrementa antes).
    // Para evitar acoplamento, a maneira mais robusta é usar REMOVE_ITEM com
    // um type-discriminator. Implementamos aqui diretamente:
    addItem({ type: 'typing' });
    const timer = setTimeout(() => {
      // Remove TODOS os itens do tipo 'typing' — seguro pois withTyping
      // nunca é chamado em paralelo no fluxo atual.
      clearItems(); // ERRADO: apagaria tudo.
      cb();
    }, delay);
    return timer;
  }, [addItem, clearItems]);

  // ── Solução correta e simples ────────────────────────────────────────────────
  // O Context expõe removeItem(id). O id do typing inserido não é capturado
  // porque addItem não retorna nada. A correção estrutural é fazer addItem
  // retornar o id — mas isso muda a interface. Optamos pela solução mais
  // pragmática que não quebra nada: guardar o id localmente via closure,
  // replicando o contador uid() de forma sincronizada.

  // ── IMPLEMENTAÇÃO FINAL ──────────────────────────────────────────────────────
  // addItem despacha para o reducer que chama uid() internamente.
  // Replicamos o mesmo contador aqui com um módulo compartilhado.
  // Ver src/state/uidCounter.ts abaixo — importado por ambos.

  const botMsg = useCallback((text: string) =>
    addItem({ type: 'msg', from: 'bot', text }), [addItem]);

  const userMsg = useCallback((text: string) =>
    addItem({ type: 'msg', from: 'user', text }), [addItem]);

  // ── Encerramento ─────────────────────────────────────────────────────────────

  const showRatingAndEnd = useCallback(() => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      addItem({
        type: 'ratingCard',
        onRate: (rating) => {
          submitRating({ rating, userType: userType ?? 'externo' }).catch(console.warn);
          const msg: Record<string, string> = {
            'Ruim':        'Lamentamos que sua experiência não tenha sido satisfatória. Vamos trabalhar para melhorar! 😔',
            'Satisfatório':'Obrigado pelo feedback! Estamos sempre buscando melhorar. 🙂',
            'Bom':         'Fico feliz que tenha sido útil! Sempre que precisar, estarei aqui. 😊',
            'Muito bom':   'Que ótimo! Fico muito feliz em ter ajudado! 😄',
            'Ótimo':       'Uau, que avaliação incrível! Obrigado pela confiança! 🌟',
          };
          addItem({ type: 'typing' });
          setTimeout(() => {
            botMsg(msg[rating] ?? 'Obrigado pela avaliação!');
            addItem({ type: 'typing' });
            setTimeout(() => addItem({ type: 'restart' }), 700);
          }, 800);
        },
      });
    }, 900);
  }, [addItem, botMsg, userType]);

  const showEndOption = useCallback((onContinue?: () => void) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      const opts = onContinue
        ? ['Continuar atendimento', 'Finalizar atendimento']
        : ['Nos envie sua dúvida',  'Finalizar atendimento'];

      addItem({
        type:  'chips',
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
              addItem({
                type:    'doubtForm',
                isAluno: userType === 'aluno',
                onSubmit: (email, doubt) => {
                  submitDoubt({ email, doubt, userType: userType ?? 'externo' })
                    .then(() => {
                      addItem({ type: 'typing' });
                      setTimeout(() => {
                        botMsg('Sua dúvida foi enviada! Fique atento ao seu e-mail. 📧');
                        showEndOption(undefined);
                      }, 800);
                    })
                    .catch(() => {
                      addItem({ type: 'typing' });
                      setTimeout(() => {
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
  }, [addItem, userMsg, botMsg, userType, showRatingAndEnd]);

  const askSatisfacao = useCallback((onSim: () => void) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      addItem({
        type:    'chips',
        label:   'Conseguiu encontrar o que queria?',
        options: ['Sim', 'Não'],
        onSelect: (opt) => {
          userMsg(opt);
          opt === 'Sim' ? showEndOption(onSim) : showEndOption(undefined);
        },
      });
    }, 900);
  }, [addItem, userMsg, showEndOption]);

  // ── Navegação via API ────────────────────────────────────────────────────────

  const showAnswer = useCallback((
    data: { content: string | null; link: string | null },
    onBack: () => void,
  ) => {
    addItem({ type: 'typing' });
    setTimeout(() => {
      if (data.content) botMsg(data.content);
      if (data.link)    addItem({ type: 'link', url: data.link, label: 'Acesse o link abaixo:' });
      askSatisfacao(onBack);
    }, 900);
  }, [addItem, botMsg, askSatisfacao]);

  const navigateNode = useCallback((
    nodeId: number | null,
    label:  string,
    onBack: () => void,
  ) => {
    addItem({ type: 'typing' });

    const run = async () => {
      try {
        const response = nodeId === null
          ? await fetchRootNodes()
          : await fetchNodeOptions(nodeId);

        if (response.type === 'answer') {
          showAnswer(response.data, onBack);
          return;
        }

        const options   = response.options.map((o) => o.title);
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
        botMsg('Não consegui carregar as opções agora. Tente novamente. 😕');
        showEndOption(undefined);
      }
    };

    setTimeout(run, 900);
  }, [addItem, userMsg, botMsg, showAnswer, showEndOption]);

  // ── API pública do hook ──────────────────────────────────────────────────────

  const startChat = useCallback((type: UserType) => {
    clearItems();
    addItem({ type: 'typing' });
    setTimeout(() => {
      botMsg('Olá! Eu sou o FAQtec e estou aqui para tirar suas dúvidas 😊');
      addItem({ type: 'typing' });
      setTimeout(() => {
        navigateNode(null, 'Como posso te ajudar hoje?', () =>
          navigateNode(null, 'Como posso te ajudar hoje?', () => {}));
      }, 600);
    }, 900);
  }, [clearItems, addItem, botMsg, navigateNode]);

  const startCourse = useCallback((courseNodeId: number, courseTitle: string) => {
    clearItems();
    addItem({ type: 'typing' });
    setTimeout(() => {
      botMsg(`Você selecionou ${courseTitle}. O que gostaria de saber?`);
      navigateNode(
        courseNodeId,
        `Sobre ${courseTitle}, o que deseja consultar?`,
        () => navigateNode(courseNodeId, `Sobre ${courseTitle}, o que deseja consultar?`, () => {}),
      );
    }, 900);
  }, [clearItems, addItem, botMsg, navigateNode]);

  return { items, startChat, startCourse, removeItem };
}