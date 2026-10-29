# Plano — Novo site cpatrickalves.com

Oct 29, 2026 · @Carlos Patrick Alves da Silva

## Resumo e decisões

O novo cpatrickalves.com é um site pessoal bilíngue em Astro 7, estático, no GitHub Pages: home de apresentação com blog, projetos e palestras. O design e o estilo são alinhados primeiro com dados fake; a importação dos 18 posts do Hashnode é a última etapa antes do lançamento.

| Tema | Decisão |
| --- | --- |
| Base | Astro 7 + [AstroPaper](https://github.com/satnaing/astro-paper) (MIT), com peças do [karhdo.dev](https://github.com/Karhdo/karhdo.dev) (MIT): barra superior, busca ⌘K, modo claro/escuro, Expressive Code |
| Repositório | Novo, conteúdo em Markdown/MDX versionado |
| Hospedagem | GitHub Pages via GitHub Actions, domínio cpatrickalves.com; site 100% estático |
| Idiomas | PT-BR padrão na raiz; EN em `/en` |
| Analytics | Umami Cloud Hobby (posts mais acessados, origem, países, dispositivos); sem contador público de views |
| Mermaid | astro-mermaid (blocos ```` ```mermaid ```` no Markdown, tema claro/escuro automático) |
| Animações | View Transitions + CSS no site; MP4/WebM para demos; SVG animado ou React + Motion em posts MDX para diagramas |
| Design | Linguagem do [Rubric](https://www.getrubric.app/): fontes Outfit + Doto, cards, sombras, animações, estética de IA e agentes; paleta própria |
| Conteúdo | Todos os posts traduzidos para PT-BR antes do lançamento |
| Redirects | Fora do escopo: links antigos do Hashnode (`/<slug>`) deixam de funcionar |

## Estrutura do site e i18n

PT-BR fica sem prefixo e EN em `/en`; os nomes das seções ficam em inglês nos dois idiomas. A seção de palestras existe no código desde o início, mas nasce oculta.

| Página | PT-BR | EN | Estado no lançamento |
| --- | --- | --- | --- |
| Home (quem sou, Cognicode, projetos, últimos posts) | `/` | `/en/` | Visível |
| Blog (lista e post) | `/blog/` · `/blog/<slug>/` | `/en/blog/` · `/en/blog/<slug>/` | Visível |
| Projetos | `/projects/` | `/en/projects/` | Visível |
| Palestras | `/talks/` | `/en/talks/` | Oculta |
| Sobre | `/about/` | `/en/about/` | Visível |
| RSS | `/rss.xml` | `/en/rss.xml` | Visível |

**Palestras ocultas:** uma flag `features.talks = false` na config. Desligada, a seção sai do menu e da home, a rota não é gerada e não entra no sitemap. Ligar é mudar um valor e publicar.

**Organização do conteúdo em quatro camadas:**

1. Textos da interface: `src/i18n/lang/pt-br.ts` e `en.ts`, mesmo formato (padrão do AstroPaper).
2. Páginas institucionais: um template `.astro` por página; o texto em `src/content/pages/{pt-br,en}/`.
3. Posts: `src/content/posts/pt-br/<slug>.md` e `src/content/posts/en/<slug>.md`, ligados pelo mesmo nome de arquivo.
4. Projetos e palestras: um YAML por item com campos bilíngues (`title: {pt-br, en}`); texto longo vira Markdown por idioma.

**Comportamentos definidos:**

- Seletor de idioma leva à versão equivalente da página atual; sem tradução, leva à lista do outro idioma.
- Cada lista mostra só os posts do seu idioma (todos os posts serão traduzidos antes do lançamento).
- SEO: `<html lang>`, `hreflang` entre PT-BR e EN, sitemap com os dois idiomas, OG image por idioma.
- Um script no CI lista posts sem tradução; vira o checklist da Fase 7.

## Fases de implementação

São oito fases em sequência: design e estrutura com dados fake primeiro (Fases 0 a 6), importação e lançamento por último (Fases 7 e 8). Cada fase só fecha quando o critério de pronto passa no preview publicado.

**Fase 0: Setup do repositório**

- Repo novo cpatrickalves/personal-site a partir do template AstroPaper (Astro 7), pnpm, Node 22 LTS fixado.
- Remover os posts e páginas de exemplo do tema.
- Workflow do GitHub Actions: build em todo PR, deploy no GitHub Pages a partir da `main`.
- Preview em `cpatrickalves.github.io/personal-site` com `noindex`, até o lançamento.
- Créditos MIT do AstroPaper e do karhdo.dev em `THIRD_PARTY_NOTICES.md`.
- Pronto quando: `pnpm build` passa no CI e o preview abre.

**Fase 1: Design system**

- Tokens em CSS com tema claro e escuro: fundo, card, texto, texto suave, accent, bordas e sombras.
- Paleta própria: 3 propostas para você escolher (a do Rubric serve só de referência de contraste).
- Fontes Outfit (corpo) e Doto (títulos e detalhes) pela Fonts API do Astro.
- Componentes base: card, botão, badge/tag, callout, bloco de código, tabela.
- Primitivas de animação: reveal ao rolar, hover, View Transitions entre páginas; tudo respeita `prefers-reduced-motion`.
- Página `/styleguide` (só em dev) com todos os componentes nos dois temas.
- Pronto quando: você aprova a paleta e o `/styleguide`.

**Fase 2: Layout e navegação (peças do karhdo.dev)**

- Barra superior no estilo do karhdo.dev, com menu mobile.
- Busca ⌘K: paleta de comandos sobre o índice Pagefind, por idioma.
- Modo claro/escuro sem piscar, com `data-theme` e opção "sistema".
- Seletor de idioma no header.
- Rodapé e página 404 nos dois idiomas.
- Pronto quando: navegação, busca, tema e idioma funcionam no desktop e no celular.

**Fase 3: i18n**

- Config do Astro: `locales: ["pt-br", "en"]`, `defaultLocale: "pt-br"`, sem prefixo para o padrão.
- Strings de UI em `pt-br.ts` e `en.ts`, datas formatadas por idioma.
- Coleções de conteúdo por idioma e helpers de URL.
- `hreflang`, sitemap e RSS por idioma; script de CI de traduções pendentes.
- Pronto quando: toda página existe nos dois idiomas e o seletor leva à página equivalente.

**Fase 4: Dados fake** (detalhado na seção seguinte)

- Pronto quando: as páginas de lista e de post têm conteúdo suficiente para avaliar o design.

**Fase 5: Páginas**

- Home: hero (quem sou), Cognicode, projetos em destaque, últimos posts; bloco de palestras atrás da flag.
- Blog: lista com tags e paginação; post com TOC, tempo de leitura, Expressive Code, Mermaid, callouts, imagens com zoom e componentes MDX animados.
- Projetos: grade de cards a partir dos YAML; Sobre; Palestras pronta, mas oculta.
- OG images dinâmicas por idioma.
- Pronto quando: você aprova cada página nos dois idiomas e nos dois temas.

**Fase 6: Analytics, SEO e qualidade**

- Script do Umami só em produção, ignorando o preview.
- Lighthouse acima de 95 em performance, acessibilidade e SEO; checagem de links quebrados no CI.
- Pronto quando: os eventos aparecem no Umami e as metas de Lighthouse batem.

**Fase 7: Importação (última antes do lançamento)**

- Listar os 18 posts a partir de `https://cpatrickalves.com/sitemap.xml` (só URLs de post; ignorar `/page/`, `/series/`, `/archive`).
- Corpo: `GET <url do post>.md` devolve o Markdown original com o título, sem metadados.
- Metadados: do HTML do post, no JSON-LD e nas meta tags:
  - `datePublished` → `pubDatetime`
  - `dateModified` → `modDatetime`
  - `keywords` → `tags`
  - `<meta name="description">` → `description`
  - `og:image` → capa
- Datas exatas: ISO com hora, em UTC, como vieram do Hashnode. Nunca usar a data do commit ou da importação. A tradução PT-BR herda as mesmas `pubDatetime` e `modDatetime` do original.
- Imagens: baixar corpo e capa do `cdn.hashnode.com` para a pasta do post e reescrever os caminhos; remover atributos `  align="..." `.
- Script Python de conversão; posts em `posts/en/`.
- Os 6 posts da série portfólio viram também itens de Projetos (YAML com título, descrição, capa, data e tags como stack), cada um com link para o post completo: `basket-icon-detector`, `real-time-face-detection`, `accelerating-claim-approval-by-an-insurance-company`, `classifying-the-floor-surface-to-help-robots-on-different-surfaces`, `scraping-the-dentists-data-from-findadentistadaorg`, `predict-the-occurrence-of-diabetes`.
- Possíveis duplicatas: comparar os pares abaixo e **parar com um relatório** para Patrick decidir antes de seguir:
  - `accelerating-claim-approval-by-an-insurance-company` × `accelerating-payment-clearance-process-for-an-insurance-company`
  - `classifying-the-floor-surface-to-help-robots-on-different-surfaces` × `classifying-the-floor-surface-to-help-a-robot`
  - `predict-the-occurrence-of-diabetes` × `kaggle-predict-the-occurrence-of-diabetes`
- Patrick traduz para `posts/pt-br/`; remover todos os dados fake.
- Pronto quando: um teste compara as datas de cada post com o JSON-LD do Hashnode e não acha diferença, o script de CI aponta zero traduções pendentes e o link-checker passa.

**Fase 8: Lançamento**

- Domínio cpatrickalves.com em Settings → Pages do repo, com Enforce HTTPS (sem arquivo `CNAME`: com deploy por workflow do Actions ele é ignorado); DNS com 4 registros A na raiz e CNAME do `www` para `cpatrickalves.github.io`.
- Remover o domínio do Hashnode e apontar o DNS para o GitHub Pages; tirar o `noindex`.
- Enviar o sitemap ao Google Search Console.
- Pronto quando: cpatrickalves.com serve o site novo com HTTPS e o Search Console aceita o sitemap.

## Dados fake para alinhar o design

Os dados fake existem para testar cada componente nos dois idiomas antes da importação; todos ficam marcados com `fake: true` no frontmatter e saem na Fase 7.

| Item | Quantidade | O que cada um exercita |
| --- | --- | --- |
| Post 1: tutorial técnico | 1 em PT-BR + 1 em EN | Blocos de código longos com título e destaque de linhas, tabela, callouts, TOC profundo |
| Post 2: arquitetura de agentes de IA | 1 em PT-BR + 1 em EN | Diagramas Mermaid (fluxo e sequência), imagem com zoom, citação |
| Post 3: post em MDX | 1 em PT-BR + 1 em EN | Componente animado (diagrama SVG animado ou React + Motion) e vídeo MP4 em loop |
| Projetos | 6 YAML | Cards com stack, links e imagem; um em destaque na home |
| Palestras | 2 YAML | Página pronta, mas oculta pela flag |
| Home e Sobre | Textos placeholder nos dois idiomas | Hero, bloco da Cognicode, chamadas para blog e projetos |

Os posts terão datas, tags e tamanhos diferentes, para testar paginação, filtro por tag e a busca ⌘K.

## Pendências, riscos e fora do escopo

Três itens ainda dependem de você; nenhum bloqueia o início da Fase 0.

**Pendências**

- [ ] Nome do repositório: personal-site (decidido)
- [ ] Escolha da paleta entre as 3 propostas (Fase 1)
- [ ] Conta no Umami Cloud e o ID do site (Fase 6)
- [ ] Exportar ou tirar prints das métricas do Hashnode antes de desligar o blog (Fase 8)

**Riscos**

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Imagens do `cdn.hashnode.com` somem antes da importação | Posts com imagens quebradas | Baixar tudo no início da Fase 7, enquanto o blog antigo está no ar |
| Links antigos do Hashnode (`/<slug>`) dão 404 | Perda de tráfego de links externos e do Google | Aceito: redirects fora do escopo |
| Copiar demais o Rubric | Site com cara de clone de produto | Usar fontes, estilo e animações; nunca logo, cursor hexagonal ou textos deles |
| Fork divergente das peças do karhdo.dev | Manutenção manual dessas peças | Copiar só os componentes listados, isolados em pastas próprias |

**Fora do escopo por enquanto:** contador público de views, comentários (giscus), newsletter e redirects dos links antigos.

## Contexto para execução

Esta seção existe para que um agente no Claude Code execute o plano sem o chat de origem. Salve este documento em Markdown no repo como `docs/PLAN.md` e referencie-o no `CLAUDE.md`.

**Regras gerais**

- Pare e pergunte nos pontos de aprovação: paleta (Fase 1), cada página (Fase 5), duplicatas (Fase 7), virada de DNS (Fase 8).
- Gerenciador de pacotes: pnpm, como no AstroPaper (o karhdo.dev usa Bun; não trazer Bun, Biome nem lefthook).
- Verifique versões e APIs na documentação atual antes de usar (Astro 7, Pagefind, astro-mermaid, Umami).

**Base AstroPaper ([satnaing/astro-paper](https://github.com/satnaing/astro-paper))**

- Posts ficam em `src/content/posts/`; o schema usa `pubDatetime`, `modDatetime`, `title`, `description`, `tags`, `ogImage`, `draft`, `featured`. Manter esses nomes e acrescentar `fake: boolean`.
- O i18n do tema cobre só strings de UI (`src/i18n/lang/en.ts`, `locales: ["en"]`); rotas por idioma, coleções por idioma e seletor são trabalho novo.
- As rotas do tema usam `/posts/`; renomear para `/blog/`.
- Flags ficam em `features` no `astro-paper.config.ts`; a flag `talks` entra ali.
- Dados com `fake: true` aparecem no preview e saem do build quando a Fase 7 começa.

**Peças do karhdo.dev ([Karhdo/karhdo.dev](https://github.com/Karhdo/karhdo.dev), MIT)**

| Peça | Arquivos de origem |
| --- | --- |
| Barra superior | `src/components/header/` |
| Busca ⌘K (cmdk + Pagefind, exige `@astrojs/react`) | `src/components/search/CommandPalette.tsx`, `mount-palette.tsx`, `CommandPaletteLoader.astro` |
| Claro/escuro sem piscar | `src/components/seo/ThemeScript.astro`, `src/components/header/ThemeToggle.astro`, `src/styles/theme-css.ts` |
| Blocos de código | `ec.config.mjs` (Expressive Code) |

Não trazer: Spotify, token burn, relógio, snowfall, career, views, reações, newsletter, banco de dados, adapter do Vercel.

**Referência de design ([getrubric.app](https://www.getrubric.app/))**

- Fontes: Outfit (corpo, pesos 100 a 900) e Doto (títulos e detalhes em matriz de pontos, pesos 400 a 900), ambas do Google Fonts.
- Estilo: cards sobre fundo, sombras, accent forte único, estética de IA e agentes.
- Paleta de referência (não usar como final): fundo `#f2efe8`/`#131311`, card `#faf8f2`/`#1c1a16`, texto `#1c1a16`/`#e8e2d2`, accent `#ff6b1a`.
- Não copiar logo, cursor hexagonal nem textos do Rubric.

**Deploy e domínio**

- Até o lançamento o site roda em `cpatrickalves.github.io/personal-site`: configurar `base: "/personal-site"` e usar os helpers de base do AstroPaper em todo link interno.
- Na Fase 8, remover o `base`, configurar o domínio em Settings → Pages (o domínio fica só no campo site do Astro e nas Settings, para poder trocar no futuro, por exemplo para cpatrickalves.dev) e tirar o `noindex`.
- O repo antigo `cpatrickalves/hashnode-blog` está desatualizado desde 2023; não usar como fonte.

## Dados do autor

Preencher antes da Fase 5; na fase de dados fake, usar placeholders.

| Campo | Valor |
| --- | --- |
| Nome de exibição |  |
| Bio curta (PT-BR) |  |
| Bio curta (EN) |  |
| Foto |  |
| GitHub | cpatrickalves |
| LinkedIn |  |
| E-mail de contato |  |
| Outras redes |  |
| Texto sobre a Cognicode (PT-BR / EN) |  |
| Favicon / logo |  |
| Nome do repositório | personal-site |
