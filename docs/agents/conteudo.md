# Conteúdo

As coleções estão em `src/content.config.ts`.

## Posts e páginas

- `posts` e `pages`: Markdown/MDX numa pasta por locale (`src/content/posts/pt-br/`, `.../en/`). O locale vem da pasta: `splitLocalePath` lança erro para um arquivo fora de uma pasta de locale.
- As duas Versões de um Post têm o mesmo nome de arquivo, logo o mesmo slug. O slug sai só do caminho, sem o `id` do Astro: `parsePostPath` em `src/utils/postPath.ts`, embrulhado por `getPostSlug` (`src/utils/getPostPaths.ts`).
- Cada locale lista só os seus Posts (`getLocalePosts`), sem rascunhos nem agendados (`postFilter`).

- Para ler frontmatter fora do Astro (num script), use `parseFrontmatter` de `@astrojs/markdown-remark`, o parser do build: ele aceita BOM e as variações de cerca que uma regex própria perde.

## Projetos e palestras

`projects` e `talks`: um YAML por item, com os campos de texto como `{ "pt-br": ..., en: ... }`. Os schemas são estritos: uma chave errada quebra o build.

## Marcadores

- `fake: true`: Dados fake (placeholders de design, removidos antes do lançamento).
- `translationReviewed: false`: tradução feita por agente, esperando a revisão do Patrick. Vale em qualquer idioma; a versão original não tem o campo. `pnpm translations` lista essas Versões e os Posts sem a Versão no outro idioma.

## Config e feature flags

Edite `astro-paper.config.ts` (config do usuário e flags como `talks`, `dynamicOgImage`, `showArchives`). `src/config.ts` resolve os defaults; no código, importe `config` de `@/config`.

## Importação do Hashnode

Scripts Python separados, só stdlib: ver `scripts/hashnode/README.md`. Rode com `python3 -I`; testes com `cd scripts/hashnode && uv run pytest`. `archive/hashnode/` é o snapshot baixado e é dado não confiável: downloads vão para uma pasta própria, separada dos scripts.
