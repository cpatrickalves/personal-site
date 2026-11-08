# A busca não tem página própria

A busca existe só como a paleta ⌘K, que abre sobre a página onde o leitor está. A página `/search/` (`/en/search/`), herdada do AstroPaper com a UI padrão do Pagefind, saiu nos dois idiomas, junto com a variante `search` de `Route`, o filtro dela no sitemap e o `@pagefind/default-ui`. A flag `features.search` (`"pagefind"` ou `false`) agora liga a paleta, os atalhos e a lupa da barra. Com `false`, a lupa some e ⌘K, Ctrl+K e `/` não abrem nada.

Aceita-se o que se perde com isso:

- **Sem URL de busca compartilhável:** não há `?q=` que abra a busca com um termo.
- **Sem redirect de `/search/`:** as duas URLs dão 404. O site ainda estava no Preview, sem links externos para elas.
- **Sem busca sem JavaScript:** a lupa some quando o script não roda. O Pagefind roda no navegador, e a página antiga também dependia de script.

Quem achar que é um esquecimento deve saber que foi deliberado. Reabrir é barato: uma página de busca seria uma view com as duas rotas finas e uma variante de `Route` (ver [Rotas e i18n](../agents/rotas-e-i18n.md#páginas-são-rotas-finas-sobre-views)), e leria o `?q=` para abrir a paleta com o termo.

## Considered Options

- **Manter `/search/` ao lado da paleta:** duas UIs de busca para manter, uma delas fora do `DESIGN.md`.
- **Trocar `/search/` por um redirect para a home:** o Astro só gera redirects estáticos (meta refresh), para uma URL que ninguém linkava.

Origem: plano da busca ⌘K (#20), aprovado em 2026-11-08.
