# Frontend

## Responsabilidade da pasta

Esta pasta concentra a interface web do FAQtec. O frontend é responsável pelo fluxo público do chatbot e, nas próximas etapas do projeto, também dará suporte aos painéis internos do sistema.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS

## Organização interna

| Caminho | Papel |
| --- | --- |
| `src/App.tsx` | Composição principal da aplicação |
| `src/components/` | Componentes reutilizáveis da interface |
| `src/hooks/` | Hooks que concentram comportamento do fluxo |
| `src/data.ts` | Dados auxiliares atualmente usados pelo frontend |
| `src/assets/` | Recursos visuais do frontend |

## Scripts principais

Em `2dsm_ABP/frontend/`:

```bash
npm install
npm run dev
npm run build
```

## Situação atual

- O frontend já demonstra o fluxo público do chatbot.
- Parte relevante do fluxo ainda depende de dados mockados locais.
- A Sprint 2 prioriza integrar este frontend à API e melhorar a separação entre interface, hooks e serviços.
