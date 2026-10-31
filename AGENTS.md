# personal-site

Site pessoal bilíngue do Patrick Alves (blog, projetos e palestras) que substitui o blog do Hashnode: Astro 7 sobre o tema AstroPaper, estático no GitHub Pages, PT-BR na raiz e EN em `/en/`.

## Ambiente

- pnpm e Node 24.
- Checks: `pnpm lint`, `pnpm format:check`, `pnpm test` e `pnpm check` (tipos); `pnpm build` roda o `check`, o build e o índice do Pagefind.

## Em toda tarefa

- Escreva em PT-BR tudo o que vai para o repo e o GitHub: docs, arquivos `.md`, commits, PRs e issues.
- Para qualquer biblioteca ou API (Astro 7, AstroPaper, Pagefind, astro-mermaid, Umami e as demais), busque a documentação no Context7 MCP por conta própria, sem esperar o pedido: `resolve-library-id` e depois `query-docs`. Se o Context7 não tiver a biblioteca, use a documentação oficial.
- Use o vocabulário do `GLOSSARY.md` (Post, Versão, Importação, Preview, Produção, Virada, Portão de aprovação, Dados fake) em código, commits e issues.
- Toda URL interna sai dos helpers de `@/i18n/urls` (`localeUrl`, `getPostUrl`): o `base` `/personal-site` some na Virada.
- Siga `docs/PLAN.md` (fases) e `docs/TDD.md` (decisões); quando divergirem, corrija os dois. São temporários: no fim, o que durar vira doc permanente via `/docs-generator`.
- Issues com título `Portão de aprovação:` são do Patrick: pare nelas, espere por ele e deixe que ele as feche.
- O título do commit e do PR termina com o número da issue, como em `Adiciona a barra superior fixa (#17)`.
- Commits e PRs saem sem linhas de atribuição (`Co-authored-by` ou similares) e sem mencionar o Claude.
- Antes de abrir um PR, rode a skill `docs-generator` no escopo da branch e atualize a documentação que a mudança afeta.
- Para criar ou alterar qualquer página, componente ou estilo, use a skill `impeccable`.

## Docs por assunto

- [Rotas e i18n](docs/agents/rotas-e-i18n.md): ao criar página, rota, link ou string de UI, ou ao formatar datas.
- [Conteúdo](docs/agents/conteudo.md): ao mexer em Posts, projetos, palestras, config e feature flags, ou na Importação do Hashnode.
- [Estilo](docs/agents/estilo.md): ao mexer em UI, tokens, fontes ou no `/styleguide`.
- [Testes e CI](docs/agents/testes-e-ci.md): ao escrever testes, fazer checagem visual ou depurar o CI.
- [Git](docs/agents/git.md): antes de criar branch ou PR, ou de escolher a próxima issue.

## Agent skills

- Issue tracker: GitHub Issues de `cpatrickalves/personal-site` via `gh`. Ver [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).
- Labels de triagem: ver [docs/agents/triage-labels.md](docs/agents/triage-labels.md).
- Domínio: single-context, um `GLOSSARY.md` na raiz e `docs/adr/`. Ver [docs/agents/domain.md](docs/agents/domain.md).
