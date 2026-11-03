# Testes e CI

## Testes unitários

Runner nativo do Node com remoção de tipos TS nativa, sem dependência de teste. `pnpm test` roda `src/**/*.test.ts`; um arquivo só: `node --test src/i18n/routes.test.ts`.

Um módulo testável importa os irmãos com extensão `.ts` explícita (`./routes.ts`) e depende só de caminhos relativos, sem aliases `@/…` nem módulos virtuais `astro:*`. Guarde a lógica pura num arquivo assim e embrulhe-a em outro para o Astro. Exemplos: `src/i18n/locales.ts`, `routes.ts`, `contentPath.ts`.

## Checagem visual

O repo não tem Playwright: as capturas e checagens no `pnpm preview` saem da skill local `checagem-visual`, que instala o `playwright-core` na própria pasta.

## Pre-commit

`.githooks/pre-commit` roda o Prettier nos arquivos em stage e recusa o commit se algum estiver fora do formato; corrija com `pnpm format`. O `pnpm install` de um clone novo liga o hook; num clone já instalado, rode `pnpm run prepare`. Ele pega o que o hook de formatação do Claude Code não vê: arquivos alterados pela ferramenta Bash.

## CI

`.github/workflows/ci.yml` roda lint, `format:check`, testes e build em todo PR, e publica `dist/` no GitHub Pages no `main`. Depois deles, mesmo quando um falha, `pnpm translations` escreve o relatório de traduções pendentes no Job Summary, sem falhar o run.
