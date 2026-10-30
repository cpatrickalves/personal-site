# Estilo e UI

O sistema de design (paleta, tipografia, componentes) está no `DESIGN.md`; o posicionamento, no `PRODUCT.md`. A skill `impeccable` lê os dois.

- Tailwind 4 via Vite; tokens em `src/styles/theme.css`. O Shiki usa o tema `css-variables`, então as cores do código também vêm desses tokens.
- Primitivas de UI compartilhadas ficam em `src/components/ui/`; `src/pages/styleguide/` as renderiza para a aprovação do design.

## Fontes

Declaradas no `astro.config.ts` pela Fonts API do Astro.

- Outfit em todo texto, inclusive números e datas; Martian Mono só em código.
- Números usam a classe `detail` (Outfit 500, tabular).
- Datas ficam num `<time>` ou num span `tabular`, no peso do texto em volta, e passam pelo `formatDate` (ver [Rotas e i18n](rotas-e-i18n.md#datas)).
- A cópia estática TTF da Outfit existe só para o gerador de imagens OG (satori).
