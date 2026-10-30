---
version: 1
slug: "src-pages-styleguide-path-astro"
primary_target: "src/pages/styleguide/[...path].astro"
related_targets: []
---

# Design system e /styleguide (Fase 1)

**Escopo:** o mundo visual do site inteiro (tokens, fontes, componentes base, movimento) e a página `/styleguide`, que o exibe. Só no dev e no Preview.
**Modo:** Read (o site é antes um blog; o leitor vence). O `/styleguide` é página de referência e aprovação, para o Patrick.
**Tarefa do visitante:** ver a paleta nos dois temas e cada componente e animação em uso, e aprovar o `/styleguide` (issue #10).
**Restrições:** referências fixadas pelo Patrick: karhdo.dev para estrutura, organização das seções e animações; Rubric para botões, cards, animação e o foco em IA agêntica. Nada do logo, do cursor hexagonal nem dos textos do Rubric. Cards na linguagem do Rubric.
**Decidido pelo Patrick (2026-10-29):** paleta Gelo (as propostas Açaí e Jambu saíram); a Doto foi rejeitada e substituída pela Martian Mono, que também passa a ser a fonte do código. O site usa só duas fontes: Outfit e Martian Mono.

## Direction contract

THESIS: Uma bancada de quem constrói agentes. Cada peça é uma placa recortada (canto reto, contorno de 2px na cor do texto, sombra dura deslocada) sobre um fundo tingido, com um único accent forte. Recusa o blog de dev padrão: cards arredondados, glow, gradiente no nome.

OWN-WORLD: Paleta Gelo, do logo antigo e irmã da Cognicode: fundo navy (escuro) ou azul-gelo claro (claro), card um tom acima, texto off-white ou navy, contorno = cor do texto, sombra = texto a 28% (escuro) ou tinta a 85% (claro), accent azul-gelo. Outfit em tudo que se lê; Outfit também em números e datas, Martian Mono só no código; a palavra de ênfase dos títulos é Outfit no accent-ink.

STORY: O Patrick vê a paleta nos dois temas e cada componente em situação real, e aprova o sistema antes das páginas.

FIRST VIEWPORT: Título "O sistema visual do site", com "sistema" em Martian Mono no accent, e à direita um parágrafo curto do que a página mostra. Logo abaixo, a paleta em claro e escuro lado a lado, cada painel com título, texto, botões e um card de post. O controle de tema (claro, escuro, sistema) fica na barra superior fixa, onde estará a barra do karhdo na Fase 3.

FORM: Direção fixada pelo Patrick (Rubric na superfície, karhdo na estrutura); o sorteio rodou, mas a direção fixada pelo usuário prevalece. Números e datas em Outfit com algarismos tabulares (Martian Mono só no código, decidido pelo Patrick em 2026-10-30); a ênfase de título é Outfit no accent-ink. seed:0b94e9062b91c8ee

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
