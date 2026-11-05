# ClientRouter

O `<ClientRouter />` do `Layout.astro` troca as páginas no navegador: o `load` só dispara na primeira carga. O que está abaixo foi conferido no Astro 7.4.2 (`node_modules/astro/dist/transitions/router.js`) e é o que custou defeitos na #19.

## Ordem dos eventos

Uma navegação que chega ao fim dispara `astro:before-preparation`, `astro:after-preparation`, `astro:before-swap`, a troca, `astro:after-swap` e `astro:page-load`.

- Listeners no `document` duram a sessão toda, porque os scripts de módulo rodam uma vez. O que depende da página nova roda em `astro:page-load`.
- A troca (`swapRootAttributes`) apaga os atributos do `<html>` e copia os da página nova. Estado guardado no `<html>`, como `data-theme`, é gravado em `event.newDocument.documentElement` no `astro:before-swap`.

## Sem View Transitions

Sem `document.startViewTransition`, como no Firefox, o fallback `animate` dispara o `astro:before-swap` e só troca depois da animação de saída. Um clique nesse intervalo muda a página antiga, e a troca desfaz a mudança. Grave o estado de novo no `astro:after-swap`, que roda antes da pintura.

## Navegação que não chega à troca

Nesses casos não há `astro:after-swap` nem `astro:page-load`:

- outro clique num link da mesma origem aborta a navegação em curso, e o `event.signal` do `astro:before-preparation` dispara `abort`;
- um link de âncora da mesma página aborta a navegação e não abre outra;
- uma resposta que não é HTML cai em `location.href`, e a página pode voltar pelo bfcache.

Estado ligado no `astro:before-preparation` é desligado no `abort` e no `pageshow` com `event.persisted`. O "pular para o conteúdo" do `Header.astro` cancela o próprio clique, então o router nunca o vê.

## Nas provas

- Clique num link interno com `clickAndSwap` da skill `checagem-visual`, que espera o `astro:page-load`.
- Apague `document.startViewTransition` e `Document.prototype.startViewTransition` num init script para cair no fallback.
- O bfcache só restaura no Chromium completo, com `ignoreDefaultArgs: ["--disable-back-forward-cache"]`; o headless shell não restaura.
