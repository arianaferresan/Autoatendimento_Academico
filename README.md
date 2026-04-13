# FAQtec

<p align="center">
  <strong>Plataforma web de autoatendimento academico para a Secretaria Academica da Fatec Jacarei.</strong>
</p>

<p align="center">
  <a href="DOCS/README.md">Documentacao</a> •
  <a href="DOCS/produto/backlog-do-produto.md">Backlog</a> •
  <a href="DOCS/sprints/README.md">Sprints</a> •
  <a href="2dsm%20ABP/app%20-%20aluno/README.md">Aplicacao</a>
</p>

---

## Visao Geral

O **FAQtec** foi criado para centralizar duvidas frequentes da Secretaria Academica em uma unica plataforma, reduzindo a sobrecarga do atendimento manual e melhorando o acesso a informacoes institucionais por alunos e publico externo.

A aplicacao organiza o atendimento em fluxos guiados, consultas objetivas e respostas baseadas em documentos oficiais, tornando o processo mais claro, rapido e rastreavel.

## Problema

Atualmente, grande parte das orientacoes academicas depende de atendimento humano para esclarecer temas recorrentes, como:

- matricula e rematricula
- calendario academico
- horarios de aula
- estagio supervisionado
- estrutura curricular dos cursos
- documentos e procedimentos institucionais

Esse modelo aumenta o tempo de resposta, gera retrabalho e dificulta a padronizacao das informacoes repassadas.

## Solucao Proposta

O FAQtec propoe uma aplicacao web de autoatendimento capaz de:

- conduzir o usuario por menus e submenus guiados
- permitir consultas sobre temas academicos recorrentes
- apresentar respostas objetivas e padronizadas
- exibir evidencias documentais vinculadas as respostas
- encaminhar duvidas nao resolvidas para a Secretaria Academica

## Documentacao

Toda a documentacao do projeto esta centralizada na pasta [DOCS](DOCS/README.md).

### Links Rapidos

| Categoria | Acesso |
| --- | --- |
| Indice geral | [DOCS/README.md](DOCS/README.md) |
| Requisitos | [DOCS/produto/requisitos.md](DOCS/produto/requisitos.md) |
| Backlog do produto | [DOCS/produto/backlog-do-produto.md](DOCS/produto/backlog-do-produto.md) |
| User stories | [DOCS/produto/user-stories.md](DOCS/produto/user-stories.md) |
| Definition of Ready | [DOCS/processo/definition-of-ready.md](DOCS/processo/definition-of-ready.md) |
| Definition of Done | [DOCS/processo/definition-of-done.md](DOCS/processo/definition-of-done.md) |
| Sprints | [DOCS/sprints/README.md](DOCS/sprints/README.md) |
| Referencias e anexos | [DOCS/referencias/README.md](DOCS/referencias/README.md) |

## Estrutura Do Repositorio

```text
.
├── DOCS/
│   ├── produto/
│   ├── processo/
│   ├── sprints/
│   └── referencias/
├── 2dsm ABP/
│   ├── app - aluno/
│   └── arquivos/
└── README.md
```

### Organizacao Das Pastas

- `DOCS/`: documentacao funcional, processual e acompanhamento das sprints
- `2dsm ABP/app - aluno/`: aplicacao principal com frontend, backend e banco
- `2dsm ABP/arquivos/`: documentos academicos utilizados como base de conhecimento

## Aplicacao

A documentacao tecnica da aplicacao permanece no modulo principal:

- [README da aplicacao](2dsm%20ABP/app%20-%20aluno/README.md)
- [README do banco](2dsm%20ABP/app%20-%20aluno/database/README.md)
- [README dos scripts SQL](2dsm%20ABP/app%20-%20aluno/database/init/README.md)

## Tecnologias Utilizadas

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, TypeScript, Express |
| Banco de dados | PostgreSQL |
| Autenticacao | JWT |
| Infraestrutura | Docker Compose |

## Execucao

Para configurar e subir o ambiente local, utilize as instrucoes disponiveis em:

- [2dsm ABP/app - aluno/README.md](2dsm%20ABP/app%20-%20aluno/README.md)

## Status Do Projeto

Projeto academico em desenvolvimento, com foco na construcao de uma plataforma de autoatendimento confiavel, organizada e sustentada por documentacao centralizada.

---

<p align="center">
  Desenvolvido para o ABP 2026-1 • Fatec Jacarei
</p>
