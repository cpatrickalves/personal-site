# Rotas e i18n

## Preview e Produção são o `base`

`astro.config.ts` define `base: "/personal-site"` enquanto o site é o Preview em `cpatrickalves.github.io/personal-site`. Remover o `base` na Virada faz do build a Produção. O código decide por `import.meta.env.BASE_URL !== "/"` (o `/styleguide`, por exemplo, só existe no dev e no Preview). Por isso toda URL interna passa pelos helpers abaixo.

## Locales, rotas e URLs

- `src/i18n/locales.ts`: a lista única de locales (`pt-br` padrão na raiz, `en` em `/en/`), lida pelo `astro.config.ts`, pelos schemas de conteúdo e pelos helpers de caminho.
- `src/i18n/routes.ts`: o tipo `Route` (uma página sem o locale) e a montagem pura de caminhos. Os nomes das seções ficam em inglês nos dois locales. `equivalentRoute` decide para onde vai a troca de idioma: um Post sem Versão no outro locale cai na lista do blog.
- `toLocale(Astro.currentLocale)` (de `src/i18n/locales.ts`) dá o `Locale` da página atual; fora de um locale, o padrão.
- `src/i18n/urls.ts`: o que as páginas usam. `localeUrl(locale, route)`, `getPostUrl(post)` e `getEquivalentUrl(...)` acrescentam o `base` via `src/utils/withBase.ts`.
- Strings de UI: `src/i18n/lang/{pt-br,en}.ts` (mesma forma `UIStrings`), lidas com `useTranslations(locale)`.

## Datas

Datas passam pelo `formatDate` de `@/i18n`: `AAAA-MM-DD` no fuso America/Sao_Paulo, igual nos dois idiomas. Uma data YAML sem hora é meia-noite UTC: formate com `formatDate(date, "UTC")`, senão aparece o dia anterior. A marcação da data está em [Estilo](estilo.md#fontes).

## Páginas são rotas finas sobre views

Cada página existe duas vezes: `src/pages/<rota>.astro` (PT-BR) e `src/pages/en/<rota>.astro` (EN). As duas têm poucas linhas: chamam um `getStaticPaths` compartilhado de `src/views/staticPaths.ts` com o seu locale e renderizam um componente de `src/views/`. Toda a lógica fica na view.

Página nova = uma view + duas rotas finas + uma variante de `Route`.

`/talks/` é uma rota dinâmica `[talks].astro` só para que `features.talks = false` a tire do build e do sitemap.
