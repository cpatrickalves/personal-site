---
name: cpatrickalves.com
description: Site pessoal e blog técnico bilíngue de Patrick Alves; uma bancada de placas recortadas sobre fundo tingido.
colors:
  # Paleta "Gelo", escolhida em 2026-10-29. Os mesmos papéis em claro
  # (`:root, [data-theme="light"]`) e escuro (`[data-theme="dark"]`).
  light-background: "#e8edf1"
  light-card: "#f7f9fb"
  light-foreground: "#13212f"
  light-muted-foreground: "#4e596c"
  light-accent: "#9edcf1"
  light-accent-foreground: "#13212f"
  light-accent-ink: "#0b6688"
  light-muted: "#d9e1e8"
  light-border: "#c5d0da"
  light-shadow: "rgb(19 33 47 / 0.85)"
  dark-background: "#0e1822"
  dark-card: "#152230"
  dark-foreground: "#f3f3ec"
  dark-muted-foreground: "#9ca6b8"
  dark-accent: "#a8e4f5"
  dark-accent-foreground: "#0e1822"
  dark-accent-ink: "#a8e4f5"
  dark-muted: "#1d2d3f"
  dark-border: "#26384b"
  dark-shadow: "rgb(243 243 236 / 0.28)"
  # Semânticas de callout
  warning-light: "#8a4b00"
  danger-light: "#b42318"
  warning-dark: "#f2b45a"
  danger-dark: "#ff8f85"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "4rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  display-mobile:
    fontFamily: "Outfit, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline-mobile:
    fontFamily: "Outfit, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
    fontFeature: "\"ss01\""
  label:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "\"ss01\", \"tnum\""
  caption:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "\"ss01\", \"tnum\""
  data:
    fontFamily: "Martian Mono, monospace"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  data-hero:
    fontFamily: "Martian Mono, monospace"
    fontSize: "5.5rem"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  data-min:
    fontFamily: "Martian Mono, monospace"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  code:
    fontFamily: "Martian Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  none: "0px"
spacing:
  gutter: "16px"
  gutter-wide: "24px"
  plate-pad: "24px"
  plate-pad-wide: "32px"
  inset: "16px 20px"
  section: "64px"
  section-wide: "80px"
  plate-offset-sm: "4px"
  plate-offset-tight: "5px"
  plate-offset: "6px"
  plate-offset-lg: "8px"
components:
  button-primary:
    backgroundColor: "{colors.light-accent}"
    textColor: "{colors.light-accent-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-primary-sm:
    backgroundColor: "{colors.light-accent}"
    textColor: "{colors.light-accent-foreground}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.light-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-quiet:
    textColor: "{colors.light-foreground}"
    rounded: "{rounded.none}"
    padding: "0 4px"
    height: "48px"
  button-quiet-hover:
    textColor: "{colors.light-accent-ink}"
  button-disabled:
    backgroundColor: "{colors.light-muted}"
    textColor: "{colors.light-muted-foreground}"
    rounded: "{rounded.none}"
  badge-stack:
    backgroundColor: "{colors.light-background}"
    textColor: "{colors.light-foreground}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "28px"
  badge-tag:
    backgroundColor: "{colors.light-background}"
    textColor: "{colors.light-accent-ink}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "28px"
  badge-accent:
    backgroundColor: "{colors.light-accent}"
    textColor: "{colors.light-accent-foreground}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "28px"
  plate:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.light-foreground}"
    rounded: "{rounded.none}"
    padding: "{spacing.plate-pad}"
  callout:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.light-foreground}"
    rounded: "{rounded.none}"
    padding: "{spacing.inset}"
  code-block:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.light-foreground}"
    typography: "{typography.code}"
    rounded: "{rounded.none}"
    padding: "{spacing.inset}"
---

# Design System: cpatrickalves.com

## Overview

**Creative North Star: "A Bancada de Placas"**

Uma bancada de quem constrói agentes. Cada peça é uma placa recortada: canto reto, contorno de 2px na cor do texto e uma sombra dura deslocada na diagonal, apoiada sobre um fundo tingido um tom abaixo dela. A paleta é a Gelo, navy e azul-gelo do logo antigo, irmã da Cognicode, em claro e escuro. Há um único accent forte, e ele aparece como preenchimento (botão primário, badge de destaque, seleção de texto) ou, na versão `accent-ink`, como texto e link. O resto é tinta e papel da mesma família de cor.

A densidade é de oficina, não de revista: placas lado a lado, títulos curtos em Outfit seminegrito com tracking negativo, e os detalhes (números, datas, tempo de leitura) em Martian Mono. A assinatura do sistema é essa dupla: Outfit em tudo que se lê, Martian Mono onde há um número ou uma data, em qualquer tamanho, e no código. Palavras ficam sempre em Outfit. O movimento é físico e curto: placas levantam no hover, botões afundam no clique, o conteúdo sobe ao entrar.

O sistema recusa o blog de dev padrão: cards arredondados, glow, gradiente no nome. A linguagem de cards, sombras e animação vem da referência Rubric, tornada obrigatória pelo Patrick, mas nunca o logo, o cursor hexagonal nem os textos dela.

**Key Characteristics:**
- Placas de canto reto, contorno de 2px na cor do texto e sombra dura sem desfoque.
- Fundo tingido, card um tom acima, um único accent.
- Outfit para leitura; Martian Mono 500 para números, datas e o código, nunca para palavras.
- Paleta Gelo em claro e escuro, com os mesmos papéis de cor.
- Movimento visível por padrão e desligado inteiro sob `prefers-reduced-motion`.

## Colors

Uma paleta só, a Gelo, em claro e escuro com a mesma gramática de papéis. Os valores normativos estão no frontmatter (prefixo `light-` ou `dark-`) e no código como `--background`, `--card` etc., definidos em `:root, [data-theme="light"]` e em `[data-theme="dark"]`. O tema segue o sistema até o leitor escolher, e o atributo `data-theme` mora no `<html>` (ou num espécime que mostra o outro tema).

### Primary
- **Azul-Gelo** (`accent`): o único preenchimento forte. Botão primário, badge de destaque, seleção de texto, sombra da placa no hover. Nunca é texto sobre fundo claro.
- **Gelo Profundo** (`accent-ink`): o accent na versão que passa AA como texto sobre `background` e `card`. Links, marcadores de lista, a palavra de ênfase dos títulos, datas em destaque, contorno de foco, caret e `accent-color`. No tema escuro coincide com o accent.
- **Texto sobre accent** (`accent-foreground`): texto sobre preenchimento de accent; a tinta navy nos dois temas.

### Neutral
- **Chão** (`background`): o fundo tingido da página, azul-gelo pálido no claro e navy no escuro.
- **Placa** (`card`): um tom acima do chão. Também é o fundo dos blocos de código.
- **Tinta** (`foreground`): texto principal e, na mesma cor, o contorno de 2px das placas e botões. Navy no claro, off-white no escuro.
- **Tinta secundária** (`muted-foreground`): texto secundário, metadados, legendas, comentários de código; AA sobre `background` e `card`.
- **Preenchimento quieto** (`muted`): código inline, linha destacada, listras de tabela, botão desabilitado.
- **Filete** (`border`): linhas finas entre linhas de tabela, contorno de badge, divisores internos.
- **Sombra dura** (`shadow`): no claro, a tinta quase opaca (85%); no escuro, o texto claro a 28%.

### Semânticas
- **Warning** e **Danger** (`warning-*`, `danger-*`): só para o título e o ícone de callouts de atenção e de perigo, e para linhas removidas em diffs.

### Named Rules
**The Raw Token Rule.** CSS escrito à mão referencia os tokens crus (`var(--card)`, `var(--foreground)`, `var(--accent-ink)`), nunca os aliases do Tailwind (`var(--color-card)`). Os aliases são resolvidos no `:root` e vazam o tema raiz para dentro de espécimes aninhados; utilitários do Tailwind são seguros porque o tema é `inline`.

**The One Accent Rule.** A paleta tem um accent e só um. Se uma tela precisa de uma segunda cor de destaque, a resposta é tinta, contorno ou Martian Mono, não uma nova cor.

**The Syntax Follows Palette Rule.** O realce de código usa o tema Shiki `css-variables`, mapeado para os papéis da paleta: palavras-chave e constantes em `accent-ink`, strings numa mistura de `accent-ink` com `foreground`, comentários em `muted-foreground`. Nenhuma cor de sintaxe fora da paleta.

## Typography

**Display Font:** Outfit (com sans-serif), variável de 100 a 900, `ss01` ligado no documento todo
**Detail e Mono Font:** Martian Mono (com monospace), variável de 100 a 800

As duas chegam pela Fonts API do Astro em woff2; Outfit é pré-carregada. Existe ainda uma cópia estática da Outfit em ttf (`--font-outfit-og`, 400 e 700), só para o gerador de imagens OG no build; nenhuma página a carrega.

**Character:** Outfit é geométrica, limpa e legível em corpo longo; Martian Mono é uma mono larga e técnica que dá aos números cara de painel de bancada. Uma carrega o texto, a outra marca os detalhes e o código.

### Hierarchy
- **Display** (600, 4rem no desktop e 2.75rem no celular, altura 1.02, tracking -0.04em): o título único da página, com equilíbrio de linhas (`text-wrap: balance`) e uma palavra de ênfase em Outfit no `accent-ink`.
- **Headline** (600, 2.5rem e 2rem no celular, altura 1.1, tracking -0.03em): títulos de seção, com uma palavra de ênfase em Outfit no `accent-ink`, em caixa normal.
- **Title** (600, 1.25rem): títulos de bloco, de card de projeto e de item de lista.
- **Body** (400, 1.0625rem, altura 1.75, medida de 70ch): a coluna de leitura. Parágrafos de apoio usam o mesmo tamanho com `leading-relaxed` em `muted-foreground`.
- **Label** (500, 0.9375rem): navegação, rótulos de controle.
- **Caption** (400, 0.875rem): metadados, legendas, notas de rodapé de espécime.
- **Detail** (Martian Mono 500, tracking -0.03em, algarismos tabulares, de 0.9375rem a 5.5rem): números, datas e tempo de leitura, nunca palavras (a unidade de "6 min" fica em Outfit). Os papéis `data`, `data-hero` e `data-min` do frontmatter são o tamanho de uso comum, o maior e o menor observados.
- **Code** (Martian Mono 400, 0.875rem, altura 1.7): blocos de código; inline em 0.88em sobre `muted`.

Na coluna de leitura, h2 fica em 1.6em e h3 em 1.25em, ambos seminegrito com tracking apertado. Tabelas ficam em 0.94em, com algarismos tabulares em `time`, `table` e `.tabular`.

O detalhe é o utilitário `detail` (família `--font-detail-face`, peso `--detail-weight`, tracking `--detail-tracking`, algarismos tabulares), com os tokens no `:root` de `theme.css`. Trocar a face ou o peso do detalhe é mudar esses tokens, não as classes.

### Named Rules
**The One Accent Word Rule.** Num título, no máximo uma palavra vai no `accent-ink`, na mesma Outfit e no mesmo peso do resto. É a palavra sobre a qual o título fala, não um enfeite. Martian Mono nunca entra em palavras: testada na ênfase dos títulos, foi recusada pelo Patrick.

**The Outfit Table Rule.** Martian Mono serve a números, datas e tempo de leitura em qualquer tamanho, inclusive em metadados pequenos; nas tabelas, os números ficam em Outfit com algarismos tabulares.

## Layout

O site é uma coluna central: o layout de app limita o conteúdo a 48rem (`max-w-3xl`) com respiro lateral de 16px; a página de styleguide abre para 72rem com respiro de 16px no celular e 24px a partir de 640px. A coluna de leitura limita o texto a 70ch.

Seções respiram 64px em cima e embaixo (80px a partir de 640px). Placas de conteúdo têm 24px de padding interno (32px a partir de 640px); callouts e blocos de código, 16px por 20px. Grades de placas passam a duas ou três colunas a partir de 768px ou 1024px, com 24 a 32px de vão; no celular, empilham.

Linhas que transbordam na horizontal (tabelas, código, navegação em linha) rolam dentro do próprio bloco e mostram uma sombra suave na borda onde ainda há conteúdo, desenhada com fundos `local`/`scroll` na cor do chão. Âncoras alvo ganham 1rem de margem de rolagem.

**The Visible-by-Default Rule.** O conteúdo está sempre visível sem JavaScript. O reveal ao rolar só se arma quando o script marca `<html>` com `reveal-ready`, nunca anima o que já está na primeira dobra, e não roda com `prefers-reduced-motion`.

## Elevation & Depth

A profundidade é feita de sombras duras: deslocamento diagonal para baixo e para a direita, sem desfoque nem espalhamento, na cor `shadow`. Não há sombra ambiente, glow nem camadas translúcidas. A sombra é parte do recorte da placa, não um efeito de luz.

### Shadow Vocabulary
- **Placa** (`box-shadow: 6px 6px 0 0 var(--shadow)`): o padrão de toda placa. O deslocamento varia por `--plate-offset` em 4, 6 ou 8px.
- **Placa justa** (`5px 5px 0 0 var(--shadow)`): blocos de código, callouts e o card dentro de um espécime.
- **Placa levantada** (`11px 11px 0 0 var(--accent)` com `translate(-2px, -6px)`): hover e foco de placas clicáveis. A sombra cresce e vira accent.
- **Botão** (`5px 5px 0 0 var(--shadow)`, 3px no tamanho pequeno): cresce 4px e sobe `translate(-2px, -3px)` no hover; no clique, a sombra vai a zero e o botão desce até ela.

### Named Rules
**The Hard Shadow Rule.** Toda sombra é um bloco deslocado sem desfoque. Uma sombra com blur não pertence a este mundo.

**The Lift Rule.** Elevar é uma resposta: placas sobem só no hover ou foco, e a sombra levantada sempre muda para o accent. Em repouso, todas as placas estão no mesmo plano.

## Shapes

Canto reto em tudo (0px): placas, botões, badges, controle de tema, imagens, blocos de código. Contornos são grossos e na cor do texto (2px em placas, botões, espécimes de tema e imagens da coluna de leitura; 1.5px em badges), e as linhas internas são finas na cor `border`. Cabeçalhos de tabela assentam numa régua de 2px na cor do texto; citações levam um filete de 2px à esquerda.

**The Square Corner Rule.** Nenhum raio de borda. Um canto arredondado desfaz o recorte de placa que define o sistema. Cantos de 16px com sombra mais clara foram testados no styleguide e recusados pelo Patrick.

## Components

### Buttons
Táteis e diretos: uma placa pequena que afunda quando pressionada.
- **Shape:** canto reto (0px), contorno de 2px.
- **Primary:** preenchimento `accent`, texto `accent-foreground`, contorno no próprio accent, sombra de botão. 48px de altura e 20px laterais no tamanho padrão; 40px e 14px no pequeno.
- **Secondary:** fundo `card`, texto e contorno `foreground`, mesma sombra.
- **Quiet:** sem fundo, contorno nem sombra, texto `foreground` que vira `accent-ink` no hover.
- **Hover / Active:** sobe e a sombra cresce em 180ms com `ease-out-back`; no clique, desce até a sombra em 60ms. O ícone final anda 3px para a direita no hover.
- **Disabled:** fundo `muted`, texto `muted-foreground`, contorno `border`, sem sombra nem movimento.
- **Focus:** contorno sólido de 2px em `accent-ink` com 3px de afastamento (regra global de `a`, `button`, `summary`).

### Badges
- **Style:** 28px de altura, 8px laterais, Outfit 500 em 0.8125rem, contorno de 1.5px em `border` sobre `background`.
- **Variantes:** `stack` (rótulo neutro), `tag` (texto `accent-ink`, prefixo `#` a 60% de opacidade), `accent` (preenchida no accent).
- **State:** como link, o contorno vira `foreground` e o badge sobe 2px no hover.

### Cards / Containers (a Placa)
- **Corner Style:** reto (0px).
- **Background:** `card` sobre `background`.
- **Shadow Strategy:** sombra de placa; com link ou `lift`, a placa levantada no hover e no foco (ver Elevation & Depth). Títulos dentro de placas clicáveis passam a `accent-ink` no hover.
- **Border:** 2px na cor `foreground`.
- **Internal Padding:** 24px, 32px a partir de 640px.
- **Card de post:** título em Headline, resumo em `muted-foreground`, tags, e um rodapé sobre régua de 2px em `border` com a data em detalhe no `accent-ink` e o tempo de leitura com o número em detalhe.

### Callouts
Placa justa com título colorido: ícone de 20px e título seminegrito em `accent-ink` (nota, dica), `warning` (atenção) ou `danger` (perigo); corpo em `foreground`. A mesma marcação serve aos callouts do Markdown e ao componente.

### Code Blocks
Placa justa sobre `card`, Martian Mono em 0.875rem, realce pela paleta. O bloco avulso tem uma barra de arquivo com o nome em mono `muted-foreground` sobre uma régua de 2px em `border`, e um botão Copiar que troca o ícone e o rótulo por 1.8s. Linhas adicionadas levam `accent` a 15%, removidas `danger` a 15%, destacadas `muted`.

### Tables
Cabeçalho seminegrito sobre régua de 2px em `foreground`, linhas finas em `border` entre as linhas do corpo, células com 12px por 10px, algarismos tabulares em Outfit. Variantes: mínima (sem linhas) e listrada (linhas ímpares em `muted` a 25%). Rolam na horizontal com a sombra de borda.

### Navigation
Barra superior de 64px; links em Outfit 500 a 0.9375rem em `muted-foreground`; o item ativo leva sublinhado ondulado de 2px com 8px de afastamento. O controle de tema (claro, escuro, sistema) é um grupo de botões quadrados de 40px dentro de um contorno de 2px, em que o pressionado inverte para fundo `foreground` e texto `background`.

### Espécime de tema (ThemePair)
Os dois temas lado a lado: cada painel fixa `data-theme`, pinta o próprio `background` dentro de um contorno de 2px e mostra um título com a palavra de ênfase, texto secundário com link, os botões pequenos e um card de post em placa justa. Empilha no celular, duas colunas a partir de 768px.

### Motion
- **Reveal:** elementos marcados entram de 16px abaixo, com opacidade e desfoque de 4px, em 700ms com `ease-out-expo`, escalonados por `--reveal-delay`.
- **Entre páginas:** a página que sai afunda 8px e some em 180ms; a que entra sobe 12px em 500ms, 80ms depois.
- **Redução de movimento:** transições, animações, View Transitions e levantamento de placas são desligados.

## Do's and Don'ts

### Do:
- **Do** usar a placa (canto reto, contorno de 2px em `foreground`, sombra dura de 6px) como o único contêiner do site.
- **Do** escrever cores de tema só em `:root, [data-theme="light"]` e `[data-theme="dark"]`, com os mesmos papéis nos dois.
- **Do** referenciar tokens crus (`var(--card)`, `var(--foreground)`) em CSS escrito à mão.
- **Do** usar `accent-ink` para todo texto na cor do accent e `accent` só como preenchimento.
- **Do** usar o detalhe (Martian Mono 500) para números, datas e tempo de leitura, em qualquer tamanho. **Don't** usar Martian Mono em palavras; a ênfase de título é Outfit no `accent-ink`.
- **Do** fazer a sombra crescer e virar accent quando uma placa clicável recebe hover ou foco.
- **Do** manter todo conteúdo visível sem JavaScript e desligar o movimento sob `prefers-reduced-motion`.

### Don't:
- **Don't** usar cantos arredondados, glow ou gradiente no nome.
- **Don't** usar sombras com desfoque ou espalhamento.
- **Don't** pôr os números de tabela em Martian Mono; ali ficam em Outfit com algarismos tabulares.
- **Don't** colocar mais de uma palavra em Martian Mono num título, nem passá-la para caixa alta.
- **Don't** carregar uma terceira família de fonte; Outfit e Martian Mono cobrem leitura, detalhe e código.
- **Don't** referenciar os aliases `--color-*` do Tailwind em CSS escrito à mão.
- **Don't** introduzir um segundo accent ou cores de sintaxe fora da paleta.
- **Don't** usar eyebrows ou kickers (rótulos pequenos acima de títulos).
- **Don't** copiar o logo, o cursor hexagonal ou os textos do Rubric.
