# Plano — Novo site cpatrickalves.com

Oct 29, 2026 · @Carlos Patrick Alves da Silva

## Resumo e decisões

O novo cpatrickalves.com é um site pessoal bilíngue em Astro 7, estático, no GitHub Pages: home de apresentação com blog, projetos e palestras. O design e o estilo são alinhados primeiro com dados fake. A Importação dos 18 posts do Hashnode é a última etapa antes do lançamento, mas o backup completo do Hashnode acontece logo na Fase 0.

| Tema | Decisão |
| --- | --- |
| Base | Astro 7 + [AstroPaper](https://github.com/satnaing/astro-paper) (MIT), a partir de um commit fixo da `main` (a última release, v6.1.0, ainda é Astro 6), com peças do [karhdo.dev](https://github.com/Karhdo/karhdo.dev) (MIT): barra superior, busca ⌘K, modo claro/escuro, Expressive Code |
| Repositório | `cpatrickalves/personal-site`, que já existe; vira **público** antes da Fase 0 (o GitHub Pages no plano Free só publica repos públicos). Conteúdo em Markdown/MDX versionado |
| Runtime | Node 24 LTS, pnpm |
| Hospedagem | GitHub Pages via GitHub Actions, domínio cpatrickalves.com; site 100% estático |
| Idiomas | PT-BR padrão na raiz; EN em `/en` |
| Analytics | Umami Cloud Hobby (posts mais acessados, origem, países, dispositivos); sem contador público de views |
| Mermaid | astro-mermaid (blocos ```` ```mermaid ```` no Markdown, renderizados no navegador, tema claro/escuro automático) |
| Animações | View Transitions + CSS no site; MP4/WebM para demos; SVG animado ou React + Motion em posts MDX para diagramas |
| Design | Linguagem do [Rubric](https://www.getrubric.app/): fontes Outfit + Doto, cards, sombras, animações, estética de IA e agentes; paleta própria |
| Conteúdo | Todos os posts com versão PT-BR antes do lançamento: rascunho do agente, revisão do Patrick |
| Redirects | Fora do escopo: links antigos do Hashnode (`/<slug>`) deixam de funcionar |
| Blog do Hashnode | Fica como está em `*.hashnode.dev` depois da Virada, com um post curto de aviso |

O vocabulário do projeto (Post, Versão, Virada, Preview, Dados fake etc.) está no [`GLOSSARY.md`](../GLOSSARY.md).

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
| Styleguide | `/styleguide/` | — | Só no dev e no preview |

**Palestras ocultas:** uma flag `features.talks = false` na config. Desligada, a seção sai do menu e da home, a rota não é gerada e não entra no sitemap. Ligar é mudar um valor e publicar.

**Organização do conteúdo em quatro camadas:**

1. Textos da interface: `src/i18n/lang/pt-br.ts` e `en.ts`, mesmo formato (padrão do AstroPaper).
2. Páginas institucionais: um template `.astro` por página; o texto em `src/content/pages/{pt-br,en}/`.
3. Posts: `src/content/posts/pt-br/<slug>.md` e `src/content/posts/en/<slug>.md`, ligados pelo mesmo nome de arquivo (as duas versões têm o mesmo slug).
4. Projetos e palestras: um YAML por item com campos bilíngues (`title: {pt-br, en}`); texto longo vira Markdown por idioma.

**Comportamentos definidos:**

- Seletor de idioma leva à versão equivalente da página atual; numa página de tag, à mesma tag no outro idioma; sem versão no outro idioma, leva à lista do outro idioma.
- Cada lista mostra só os posts do seu idioma. Toda lista tem um estado vazio desenhado.
- Tags são as mesmas nas duas versões de um post (termos técnicos em inglês).
- Datas guardadas em UTC e exibidas no fuso America/Sao_Paulo nos dois idiomas.
- Sem nota de "traduzido do inglês": as duas versões têm o mesmo peso.
- SEO: `<html lang>`, `hreflang` entre PT-BR e EN, sitemap com os dois idiomas, OG image por idioma.
- Preview × produção vem do config: com `base` é preview (`noindex`, `/styleguide` publicado, sem Umami); sem `base` é produção (indexado, sem `/styleguide`, com Umami).
- Um script no CI lista posts sem versão no outro idioma ou com `translationReviewed: false`; vira o checklist da Fase 7.

## Fases de implementação

São nove fases (0 a 8) em sequência: design e estrutura com dados fake primeiro (Fases 0 a 6), Importação e lançamento por último (Fases 7 e 8). Cada fase só fecha quando o critério de pronto passa no preview publicado. Cada entrega vira um GitHub Issue, agrupado num milestone por fase ([milestones](https://github.com/cpatrickalves/personal-site/milestones), issues #1 a #50).

**Fase 0: Setup do repositório**

- Tornar o repo `cpatrickalves/personal-site` público.
- Trazer o AstroPaper como snapshot: copiar os arquivos de um commit fixo da `main` (Astro 7) para o repo, num commit só, preservando `AGENTS.md`, `GLOSSARY.md` e `docs/`. Registrar o commit de origem em `THIRD_PARTY_NOTICES.md`.
- pnpm; Node 24 LTS fixado em `.nvmrc` e em `engines` no `package.json`.
- Remover os posts e páginas de exemplo do tema.
- Workflow do GitHub Actions: build e checagens em todo PR e na `main`; deploy no GitHub Pages a partir da `main`, só se as checagens passarem.
- Preview em `cpatrickalves.github.io/personal-site` com `noindex`, até o lançamento.
- Créditos MIT do AstroPaper e do karhdo.dev em `THIRD_PARTY_NOTICES.md`.
- Backup do Hashnode: um script Python (`scripts/hashnode/`) baixa um snapshot completo para uma pasta versionada fora do build (`archive/hashnode/`). O snapshot inclui:
  - o Markdown de cada post via `GET <url>.md`;
  - o HTML de cada post, com JSON-LD e meta tags;
  - as imagens do corpo e as capas;
  - as páginas `/page/about`, `/page/contact` e `/page/hire-me`;
  - o export ou prints das métricas do Hashnode.
- Pronto quando: `pnpm build` passa no CI, o preview abre e o snapshot tem os 18 posts com imagens.

**Fase 1: Design system**

- Tokens em CSS com tema claro e escuro: fundo, card, texto, texto suave, accent, bordas e sombras.
- Paleta própria: 3 propostas para você escolher (a do Rubric serve só de referência de contraste).
- Fontes Outfit (corpo) e Doto (títulos e detalhes) pela Fonts API do Astro (chave `fonts`, estável desde o Astro 6).
- Componentes base: card, botão, badge/tag, callout, bloco de código, tabela.
- Primitivas de animação: reveal ao rolar, hover, View Transitions entre páginas; tudo respeita `prefers-reduced-motion`.
- Página `/styleguide` com todos os componentes nos dois temas e um seletor para as 3 propostas de paleta. Ela é publicada no preview (com `noindex`) e fica fora dos builds de produção. O seletor de paleta é descartado depois da escolha.
- Pronto quando: você aprova a paleta e o `/styleguide` no preview.

**Fase 2: i18n**

- Config do Astro: `locales: ["pt-br", "en"]`, `defaultLocale: "pt-br"`, sem prefixo para o padrão.
- Strings de UI em `pt-br.ts` e `en.ts`, datas formatadas por idioma, no fuso America/Sao_Paulo.
- Coleções de conteúdo por idioma e helpers de URL (que também aplicam o `base`). Daqui em diante, todo link interno usa os helpers.
- `hreflang`, sitemap e RSS por idioma; script de CI de traduções pendentes.
- Pronto quando: as rotas-esqueleto existem nos dois idiomas e a troca de idioma leva à rota equivalente.

**Fase 3: Layout e navegação (peças do karhdo.dev)**

- Barra superior no estilo do karhdo.dev, com menu mobile, usando os helpers de URL da Fase 2.
- Busca ⌘K: paleta de comandos sobre o índice Pagefind, que já separa um índice por `<html lang>`.
- Modo claro/escuro sem piscar, com `data-theme` e opção "sistema".
- Seletor de idioma no header.
- Rodapé e página 404 nos dois idiomas.
- Pronto quando: navegação, busca, tema e idioma funcionam no desktop e no celular.

**Fase 4: Dados fake** (detalhado na seção seguinte)

- Pronto quando: as páginas de lista e de post têm conteúdo suficiente para avaliar o design.

**Fase 5: Páginas**

- Home: hero (quem sou), Cognicode, até 3 projetos em destaque (os `featured: true` mais recentes por `date`), últimos posts; bloco de palestras atrás da flag.
- Blog: lista com tags e paginação; post com TOC, tempo de leitura, Expressive Code, Mermaid, callouts, imagens com zoom e componentes MDX animados.
- Projetos: grade de cards a partir dos YAML; Sobre; Palestras pronta, mas oculta.
- Estado vazio desenhado para as listas: idioma sem posts, tag sem posts, Palestras sem itens.
- OG images dinâmicas por idioma.
- Pronto quando: você aprova cada página nos dois idiomas e nos dois temas.

**Fase 6: Analytics, SEO e qualidade**

- Script do Umami só em produção (build sem `base`), com `data-domains="cpatrickalves.com"`.
- Lighthouse acima de 95 em performance, acessibilidade e SEO.
  - Acessibilidade e SEO bloqueiam o PR.
  - Performance (mediana de 3 execuções) só gera aviso no PR e vira portão manual no pré-lançamento.
- Medir a performance no post fake com Mermaid. Se ficar abaixo da meta, trocar por rehype-mermaid no build (exige Playwright no CI).
- Checagem de links no CI: links internos quebrados bloqueiam o PR; links externos só avisam e rodam também num job semanal que abre issue.
- Pronto quando: um build sem `base` tem o script do Umami e não tem `noindex` nem `/styleguide`; o preview tem o contrário; as metas de Lighthouse batem.

**Fase 7: Importação (última antes do lançamento)**

- No início da fase, os dados fake saem do build e são apagados. As listas PT-BR mostram o estado vazio até as versões PT-BR chegarem.
- O importador (Python, em `scripts/hashnode/`) lê só do snapshot da Fase 0 (`archive/hashnode/`, a partir do `manifest.json`), nunca da rede.
  - Corpo: o Markdown do snapshot, sem o H1 do título.
  - Metadados: do JSON-LD e das meta tags do HTML do snapshot:
    - `datePublished` → `pubDatetime`
    - `dateModified` → `modDatetime`
    - `keywords` → `tags`
    - `<meta name="description">` → `description`
    - `og:image` → capa
  - Datas exatas: ISO com hora, em UTC, como vieram do Hashnode. Nunca usar a data do commit ou da importação. A versão PT-BR herda as mesmas `pubDatetime`, `modDatetime` e `tags` da original.
  - Imagens: copiar do snapshot para a pasta do post e reescrever os caminhos; remover atributos `  align="..." `.
  - Posts em `posts/en/`.
- Os 6 posts da série portfólio viram também itens de Projetos (YAML com título, descrição, capa, data e tags como stack), cada um com link para o post completo: `basket-icon-detector`, `real-time-face-detection`, `accelerating-claim-approval-by-an-insurance-company`, `classifying-the-floor-surface-to-help-robots-on-different-surfaces`, `scraping-the-dentists-data-from-findadentistadaorg`, `predict-the-occurrence-of-diabetes`.
- Possíveis duplicatas: comparar os pares abaixo e **parar com um relatório** para Patrick decidir antes de seguir:
  - `accelerating-claim-approval-by-an-insurance-company` × `accelerating-payment-clearance-process-for-an-insurance-company`
  - `classifying-the-floor-surface-to-help-robots-on-different-surfaces` × `classifying-the-floor-surface-to-help-a-robot`
  - `predict-the-occurrence-of-diabetes` × `kaggle-predict-the-occurrence-of-diabetes`
- Versões PT-BR: o agente gera um rascunho de cada post em `posts/pt-br/` com `translationReviewed: false`. Patrick revisa, ajusta o tom e muda para `true`.
- Pronto quando:
  - um teste compara as datas de cada post com o JSON-LD do snapshot e não acha diferença;
  - o script de CI aponta zero traduções pendentes (todas revisadas);
  - o link-checker passa.

**Fase 8: Lançamento**

- Um dia antes da Virada: baixar o TTL dos registros DNS e verificar o domínio cpatrickalves.com nas configurações de Pages da conta do GitHub.
- Domínio cpatrickalves.com em Settings → Pages do repo, com Enforce HTTPS. Não há arquivo `CNAME`, porque o deploy por workflow do Actions o ignora. DNS com 4 registros A na raiz e CNAME do `www` para `cpatrickalves.github.io`.
- Remover o domínio do Hashnode e apontar o DNS para o GitHub Pages.
- Remover o `base`. Isso tira o `noindex`, liga o Umami e tira o `/styleguide` do build.
- Publicar no Hashnode um post curto de aviso, com o link do site novo e do feed EN (`/en/rss.xml`; o `/rss.xml` passa a ser o feed PT-BR). Os 18 posts do Hashnode ficam como estão.
- Enviar o sitemap ao Google Search Console.
- Pronto quando: cpatrickalves.com serve o site novo com HTTPS, o Search Console aceita o sitemap e os eventos aparecem no Umami.

## Dados fake para alinhar o design

Os dados fake existem para testar cada componente nos dois idiomas antes da Importação; todos ficam marcados com `fake: true` no frontmatter e saem no início da Fase 7.

| Item | Quantidade | O que cada um exercita |
| --- | --- | --- |
| Post 1: tutorial técnico | 1 em PT-BR + 1 em EN | Blocos de código longos com título e destaque de linhas, tabela, callouts, TOC profundo |
| Post 2: arquitetura de agentes de IA | 1 em PT-BR + 1 em EN | Diagramas Mermaid (fluxo e sequência), imagem com zoom, citação; serve para medir o Lighthouse com Mermaid |
| Post 3: post em MDX | 1 em PT-BR + 1 em EN | Componente animado (diagrama SVG animado ou React + Motion) e vídeo MP4 em loop |
| Projetos | 6 YAML | Cards com stack, links e imagem; até 3 em destaque na home |
| Palestras | 2 YAML | Página pronta, mas oculta pela flag; campos `title`, `description`, `event`, `date`, `location`, `language`, `links` |
| Home e Sobre | Textos placeholder nos dois idiomas | Hero, bloco da Cognicode, chamadas para blog e projetos |

Os posts terão datas, tags e tamanhos diferentes, para testar paginação, filtro por tag e a busca ⌘K.

## Pendências, riscos e fora do escopo

Estes itens ainda dependem de você. Só o primeiro bloqueia o início da Fase 0.

**Pendências**

- [ ] Tornar o repo `personal-site` público (antes da Fase 0)
- [x] Nome do repositório: personal-site
- [ ] Escolha da paleta entre as 3 propostas (Fase 1)
- [ ] Dados do autor (antes da Fase 5; o backup traz as páginas about e hire-me do Hashnode como ponto de partida)
- [ ] Conta no Umami Cloud e o ID do site (Fase 6)
- [ ] Decisão sobre as duplicatas e o link dos projetos da série portfólio (Fase 7)
- [ ] Revisão das 18 versões PT-BR (Fase 7)

**Riscos**

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Imagens do `cdn.hashnode.com` somem antes da Importação | Posts com imagens quebradas | Snapshot completo na Fase 0; a Importação lê só dele |
| Links antigos do Hashnode (`/<slug>`) dão 404 | Perda de tráfego de links externos e do Google | Aceito: redirects fora do escopo; acompanhar no Search Console |
| Posts do `*.hashnode.dev` competem com os novos no Google | O Google indexa a cópia antiga | Acompanhar no Search Console; se acontecer, URL canônica nos posts do Hashnode |
| Repo público | Rascunhos e histórico visíveis | Nada que não possa ser público entra num commit |
| Copiar demais o Rubric | Site com cara de clone de produto | Usar fontes, estilo e animações; nunca logo, cursor hexagonal ou textos deles |
| Fork divergente das peças do karhdo.dev | Manutenção manual dessas peças | Copiar só os componentes listados, isolados em pastas próprias |

**Fora do escopo por enquanto:** contador público de views, comentários (giscus), newsletter, redirects dos links antigos e mudanças nos posts do Hashnode além do post de aviso.

## Contexto para execução

Esta seção existe para que um agente no Claude Code execute o plano sem o chat de origem. O plano está salvo em `docs/PLAN.md` e referenciado no `AGENTS.md`.

**Regras gerais**

- Pare e pergunte nos portões de aprovação:
  - paleta (Fase 1);
  - cada página (Fase 5);
  - duplicatas e revisão de cada versão PT-BR (Fase 7);
  - Virada (Fase 8).
- Gerenciador de pacotes: pnpm, como no AstroPaper (o karhdo.dev usa Bun; não trazer Bun, Biome nem lefthook).
- Verifique versões e APIs na documentação atual antes de usar (Astro 7, Pagefind, astro-mermaid, Umami).
- Use o vocabulário do [`GLOSSARY.md`](../GLOSSARY.md).

**Base AstroPaper ([satnaing/astro-paper](https://github.com/satnaing/astro-paper))**

- Partir de um commit fixo da `main`, que já está no Astro 7 (#664). A release v6.1.0 ainda é Astro 6.
- Posts ficam em `src/content/posts/`; o schema usa `pubDatetime`, `modDatetime`, `title`, `description`, `tags`, `ogImage`, `draft`, `featured`. Manter esses nomes e acrescentar `fake: boolean` e `translationReviewed: boolean` (opcional).
- O i18n do tema cobre só strings de UI (`src/i18n/lang/en.ts`, `locales: ["en"]`); rotas por idioma, coleções por idioma e seletor são trabalho novo.
- As rotas do tema usam `/posts/`; renomear para `/blog/`.
- Flags e config ficam no `astro-paper.config.ts`; a flag `talks` entra em `features`. Trocar o `timezone` do exemplo (Asia/Bangkok) para `America/Sao_Paulo`.
- A busca do tema é uma página com Pagefind; ela é substituída pela paleta ⌘K do karhdo.dev.
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

- Até o lançamento, o site roda em `cpatrickalves.github.io/personal-site`.
  - Configurar `base: "/personal-site"` e usar os helpers de URL em todo link interno.
  - A presença do `base` também define o preview: `noindex`, `/styleguide` publicado e sem Umami.
- Na Fase 8:
  - remover o `base`, o que tira o `noindex`, liga o Umami e tira o `/styleguide`;
  - configurar o domínio em Settings → Pages. O domínio fica só no campo `site` do Astro e nas Settings, para poder trocar no futuro, por exemplo para cpatrickalves.dev.
- Depois do lançamento não há preview publicado: revisar localmente com `pnpm build && pnpm preview`.
- O user site antigo `cpatrickalves.github.io` já redireciona para cpatrickalves.com; não mexer.
- O repo antigo `cpatrickalves/hashnode-blog` está desatualizado desde 2023; não usar como fonte.

## Dados do autor

Preencher antes da Fase 5; na fase de dados fake, usar placeholders. O snapshot da Fase 0 traz o texto das páginas about e hire-me do Hashnode como ponto de partida.

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
