# Rotas e i18n

## Preview e Produção são o `base`

`astro.config.ts` define `base: "/personal-site"` enquanto o site é o Preview em `cpatrickalves.github.io/personal-site`. Remover o `base` na Virada faz do build a Produção. O código decide por `import.meta.env.BASE_URL !== "/"` (o `/styleguide`, por exemplo, só existe no dev e no Preview). Por isso toda URL interna passa pelos helpers abaixo.

## Locales, rotas e URLs

- `src/i18n/locales.ts`: a lista única de locales (`pt-br` padrão na raiz, `en` em `/en/`), lida pelo `astro.config.ts`, pelos schemas de conteúdo e pelos helpers de caminho. `LANG_TAGS` dá a tag BCP 47 (`pt-BR`, `en`) do `<html lang>`, do `hreflang`, do sitemap e dos feeds.
- `src/i18n/routes.ts`: o tipo `Route` (uma página sem o locale; listas paginadas levam `pageNumber`) e a lógica pura de caminhos. Os nomes das seções ficam em inglês nos dois locales. Recebe o que cada locale gera (`LocalePages`, montado e cacheado no build por `src/utils/getLocalePages.ts`) e decide:
  - `equivalentRoute`: para onde vai a troca de idioma. Um Post sem Versão no outro locale cai na lista do blog; uma página de lista que lá não existe cai na primeira página.
  - `hreflangLocales`: quais locales entram no `hreflang`. Só os que geram a mesma rota, e nenhum se for só um; é a mesma regra com que o sitemap (`i18n` do `@astrojs/sitemap`) pareia URLs.
- `toLocale(Astro.currentLocale)` (de `src/i18n/locales.ts`) dá o `Locale` da página atual; fora de um locale, o padrão.
- `src/i18n/urls.ts`: o que as páginas usam. `localeUrl(locale, route)`, `getPostUrl(post)` e `getEquivalentUrl(...)` acrescentam o `base` via `src/utils/withBase.ts`.
- Strings de UI: `src/i18n/lang/{pt-br,en}.ts` (mesma forma `UIStrings`), lidas com `useTranslations(locale)`.

## Datas

Datas passam pelo `formatDate` de `@/i18n`: `AAAA-MM-DD` no fuso America/Sao_Paulo, igual nos dois idiomas. Uma data YAML sem hora é meia-noite UTC: formate com `formatDate(date, "UTC")`, senão aparece o dia anterior. A marcação da data está em [Estilo](estilo.md#fontes).

## Páginas são rotas finas sobre views

Cada página existe duas vezes: `src/pages/<rota>.astro` (PT-BR) e `src/pages/en/<rota>.astro` (EN). As duas têm poucas linhas: chamam um `getStaticPaths` compartilhado de `src/views/staticPaths.ts` com o seu locale e renderizam um componente de `src/views/`. Toda a lógica fica na view.

Página nova = uma view + duas rotas finas + uma variante de `Route`. A view passa a sua `route` ao `Layout`, que monta o `hreflang` com ela; sem `route` (404, styleguide), a página fica sem `hreflang`.

O feed segue o mesmo padrão: `src/views/rssFeed.ts` com `src/pages/rss.xml.ts` (PT-BR) e `src/pages/en/rss.xml.ts` (EN).

`/talks/` é uma rota dinâmica `[talks].astro` só para que `features.talks = false` a tire do build e do sitemap.
