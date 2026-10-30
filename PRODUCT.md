# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Público principal: leitores do blog técnico**, em PT-BR e em EN, interessados em IA aplicada, agentes, LLMs e ciência de dados. Chegam por busca, links compartilhados ou RSS, leem no desktop e no celular, e querem entender um assunto ou ver como algo foi construído. Quando uma decisão de produto tiver de favorecer um público (ordem da home, o que aparece primeiro), o leitor vence.

**Público secundário: potenciais clientes da Cognicode.** Chegam pela home e pela página de Projetos e precisam ver, sem esforço, o que o Patrick faz e como contratá-lo. O blog funciona para eles como prova de competência.

**Autor e mantenedor:** o Patrick, que escreve em Markdown/MDX, revisa os rascunhos de tradução e aprova design e conteúdo nos portões de aprovação.

## Product Purpose

Site pessoal, estático e bilíngue do Patrick Alves, que substitui o blog no Hashnode em cpatrickalves.com. Reúne apresentação pessoal, a Cognicode, blog, projetos e palestras.

Existe para resolver quatro limites do Hashnode: pouco controle de design e marca, nenhum i18n de verdade, um blog sem lugar para vitrine profissional e conteúdo preso numa plataforma de terceiros.

Sucesso no lançamento: os 18 posts importados com datas exatas e imagens locais, toda Versão PT-BR revisada, as páginas nos dois idiomas e nos dois temas aprovadas pelo Patrick, e o domínio servindo o site novo.

## Positioning

Patrick se apresenta como profissional de **IA aplicada e agentes**: ele e a Cognicode constroem soluções com LLMs, RAG e agentes para empresas. A trajetória de ML/MLOps (como no Hashnode) passa a ser histórico, não a identidade principal.

O que um site vizinho não copia com verdade: um blog técnico escrito por quem constrói essas soluções, publicado com o mesmo peso em PT-BR e EN (nenhuma Versão é "a tradução"), com diagramas e componentes interativos em MDX que a plataforma antiga não permitia, e com todo o conteúdo versionado no próprio repositório.

## Operating Context

- **Leitura:** lista do blog por idioma, post com TOC, tempo de leitura, código (Expressive Code), Mermaid, callouts, imagens com zoom e componentes MDX animados.
- **Navegação:** barra superior com menu mobile, busca ⌘K (só resultados do idioma atual, operável pelo teclado), tema claro, escuro ou sistema, e seletor de idioma que leva à Versão equivalente da página.
- **Assinatura:** RSS por idioma (`/rss.xml` em PT-BR, `/en/rss.xml` em EN). O feed raiz era o do Hashnode, em inglês.
- **Antes do lançamento:** o site roda no Preview (`cpatrickalves.github.io/personal-site`, com `noindex`), com Dados fake até a Fase 7, e o `/styleguide` publicado para aprovação. O roteiro está em `docs/PLAN.md` e as decisões em `docs/TDD.md` (ambos temporários).
- **Depois do lançamento:** não há Preview publicado; mudanças são revisadas localmente com `pnpm build && pnpm preview`.

## Capabilities and Constraints

- **Rotas:** Home, Blog (lista e post), Projetos e Sobre visíveis; Palestras pronta mas oculta pela flag `features.talks`. PT-BR na raiz, EN em `/en`. Os nomes das seções ficam em inglês nos dois idiomas.
- **Terminologia:** segue o `GLOSSARY.md` (Post, Versão, Projeto, Palestra, Série portfólio, Cognicode). Não usar "tradução", "artigo", "case" nem "talk" na interface ou nos documentos.
- **Bilíngue de verdade:** toda página existe nos dois idiomas, com `hreflang` recíproco. Não existe nota de "traduzido do inglês". Cada lista mostra só os posts do próprio idioma, e toda lista tem um estado vazio desenhado.
- **Estático e sem servidor:** sem backend, formulários, comentários, newsletter, reações ou contador público de views. O único script de terceiros é o do Umami, só em produção.
- **Links internos** passam sempre pelos helpers de URL (o `base` `/personal-site` existe até a Virada).
- **Datas** guardadas em UTC e exibidas no fuso America/Sao_Paulo nos dois idiomas.
- **Qualidade:** Lighthouse acima de 95 em acessibilidade e SEO bloqueia o PR; performance acima de 95 é portão do pré-lançamento.
- **Decisões em aberto:** paleta (uma de 3 propostas, Fase 1); dados do autor (nome de exibição, bios, foto, redes, e-mail, texto da Cognicode, favicon/logo), antes da Fase 5; links dos Projetos da Série portfólio, que dependem da decisão sobre duplicatas (Fase 7); conta e ID do Umami.

## Brand Commitments

- **Nome e domínio:** Patrick Alves, cpatrickalves.com, GitHub `cpatrickalves`. O nome de exibição final ainda está na tabela de dados do autor.
- **Referência visual tornada obrigatória pelo Patrick:** a linguagem do [Rubric](https://www.getrubric.app/) (cards, sombras, animações, estética de IA e agentes), com a fonte Outfit (todo texto; Martian Mono só no código) e uma paleta própria. A paleta do Rubric serve só de referência de contraste. Nunca copiar o logo, o cursor hexagonal nem os textos do Rubric.
- **Peças herdadas:** base AstroPaper e, do karhdo.dev, a barra superior, a busca ⌘K, o tema claro/escuro e o Expressive Code. Créditos em `THIRD_PARTY_NOTICES.md`.
- **Voz:** ainda não confirmada. O texto antigo do Hashnode era informal e em primeira pessoa ("Hello there! 👋"); não tratar isso como decisão.

## Evidence on Hand

- **Posts:** 18 posts em inglês no snapshot `archive/hashnode/posts/`, com Markdown, HTML, capa e imagens locais. Seis deles formam a Série portfólio (projetos de ciência de dados) e também viram Projetos.
- **Páginas antigas:** texto de about, contact e hire-me em `archive/hashnode/pages/`, ponto de partida para a página Sobre e o bloco da Cognicode. É texto de anos atrás: o "6+ anos de experiência" e a apresentação como Engenheiro de ML/MLOps não devem ser reutilizados sem atualização.
- **Upwork:** Top Rated Plus e 100% de Job Success, confirmados como válidos pelo Patrick. A contagem de "18 projetos" vem da página antiga e precisa ser atualizada antes de aparecer.
- **Clientes da Cognicode e palestras:** existem, mas os dados ainda não estão no repositório; o Patrick os fornece. Até lá, nenhum nome de cliente, depoimento, resultado ou palestra pode ser inventado. Os Dados fake da Fase 4 são marcados com `fake: true` e saem antes do lançamento.
- **Ausentes:** foto, bios, texto da Cognicode, depoimentos e métricas de tráfego (o histórico fica no Google Analytics do Hashnode, fora do site).

## Product Principles

1. **O leitor vem primeiro.** O conteúdo é o produto. A Cognicode e os Projetos aparecem como consequência do trabalho mostrado, nunca à frente da leitura.
2. **Duas línguas, mesmo peso.** Nenhuma Versão é secundária, e nenhuma página, estado vazio ou mensagem existe num idioma só.
3. **Dono do próprio conteúdo.** Tudo versionado no Git, estático e portável; nada que prenda o site a uma plataforma ou a um servidor.
4. **Prova real ou nenhuma.** Só aparece no site o que foi confirmado; o que falta fica visível como lacuna, não preenchido com invenção.
5. **Expressivo sem custar leitura.** Animação e interatividade existem para explicar, e cedem diante de desempenho, acessibilidade e `prefers-reduced-motion`.

## Accessibility & Inclusion

- Lighthouse de acessibilidade acima de 95 nas páginas representativas, nos dois idiomas; bloqueia o PR.
- `prefers-reduced-motion` desliga reveal, hover animado e View Transitions.
- Busca ⌘K e navegação completas pelo teclado.
- `<html lang>` correto em cada página e `hreflang` recíproco, para leitores de tela e buscadores.
- Público bilíngue: leitores brasileiros que não leem inglês são parte central do motivo do site.
