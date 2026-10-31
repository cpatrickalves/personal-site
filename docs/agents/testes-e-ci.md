# Testes e CI

## Testes unitários

Runner nativo do Node com remoção de tipos TS nativa, sem dependência de teste. `pnpm test` roda `src/**/*.test.ts`; um arquivo só: `node --test src/i18n/routes.test.ts`.

Um módulo testável importa os irmãos com extensão `.ts` explícita (`./routes.ts`) e depende só de caminhos relativos, sem aliases `@/…` nem módulos virtuais `astro:*`. Guarde a lógica pura num arquivo assim e embrulhe-a em outro para o Astro. Exemplos: `src/i18n/locales.ts`, `routes.ts`, `contentPath.ts`.

## Checagem visual

O repo não tem Playwright: as capturas e checagens no `pnpm preview` saem da skill local `checagem-visual`, que instala o `playwright-core` na própria pasta.

## CI

`.github/workflows/ci.yml` roda lint, `format:check`, testes e build em todo PR, e publica `dist/` no GitHub Pages no `main`. Depois deles, mesmo quando um falha, `pnpm translations` escreve o relatório de traduções pendentes no Job Summary, sem falhar o run.
