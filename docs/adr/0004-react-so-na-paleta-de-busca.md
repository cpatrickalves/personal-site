# React entra no site só pela paleta de busca, na primeira abertura

A busca ⌘K é uma paleta de comandos feita com React e `cmdk`, adaptada do karhdo.dev. Por isso `@astrojs/react`, `react`, `react-dom` e `cmdk` são dependências do site, e o `astro.config.ts` liga a integração `react()`. O React não entra como ilha do Astro (`client:*`). Ele é um componente comum, que o `CommandPaletteLoader.astro` importa por `import()` dinâmico quando o leitor abre a busca pela primeira vez, por ⌘K, Ctrl+K, `/` ou pela lupa da barra. Até essa abertura, a página roda só o script puro do loader, e o React, o `cmdk`, o CSS da paleta e o `pagefind.js` não baixam. O `mount-palette.tsx` forma um chunk próprio e monta a paleta em `#cmdk-root`, que o `transition:persist` mantém entre as trocas de página do ClientRouter. O CSS vem como string (`?inline`) e vai num `<style>` dentro dessa raiz, porque um import comum entraria em todas as páginas e um `<style>` no `<head>` sumiria na troca seguinte.

O preço:

- Com os tipos do React instalados, o satori espera um elemento React. Os geradores de imagem OG (`src/pages/og.png.ts` e `src/views/postOgImage.ts`) fazem um cast para `SatoriElement`.
- O `tsconfig.json` usa `jsx: "react-jsx"`. No dev, o loader instala o preâmbulo do React Refresh, que o Vite só injeta em páginas com ilha. Sem ele, o TSX da paleta quebra. O build não leva esse código.
- O React já estava previsto para os componentes MDX animados (React + Motion) da Fase 4, que vão usar a mesma integração.

Reabrir tem custo médio: trocar o React exige reescrever `CommandPalette.tsx` e `mount-palette.tsx`. As regras da busca (o que um resultado mostra, que seções casam com o termo, quantas linhas ficam, a ordem dos grupos e o atalho de cada sistema) moram em `palette-data.ts`, sem DOM nem React, e continuam valendo.

## Considered Options

- **Paleta em JavaScript puro, sem `cmdk`:** evitaria a dependência, mas o plano previa as peças do karhdo.dev com `cmdk`. Também exigiria reescrever à mão a navegação pelo teclado e os papéis `combobox` e `listbox`.
- **Ilha do Astro com `client:idle` ou `client:load`:** é o caminho padrão do Astro. Só que baixaria o React em toda página, mesmo para quem nunca busca, e iria contra a meta de Lighthouse.
- **Manter a UI padrão do Pagefind:** não precisaria de React, mas ficava numa página à parte (`/search/`), sem atalho de teclado e fora do `DESIGN.md`.

Origem: plano da busca ⌘K (#20), aprovado em 2026-11-08.
