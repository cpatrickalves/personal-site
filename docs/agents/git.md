# Git

- Uma issue, uma branch, um PR: branch `<n>-<slug>` a partir do `main`, PR com `Closes #<n>`. O merge é do Patrick.
- Antes do commit, mostre o resultado ao Patrick: a prova no build e, quando der, as páginas renderizadas (ver [Testes e CI](testes-e-ci.md#checagem-visual)).
- Título do PR em inglês, como os commits; corpo em PT-BR.
- Adicione ao stage caminhos explícitos e confira `git show --stat HEAD` antes do push: `node_modules/`, `dist/`, `.astro/` e `public/pagefind/` continuam na árvore ao trocar para uma branch cujo `.gitignore` não os lista.
- Próximas issues livres: abertas, sem responsável e com `issue_dependencies_summary.blocked_by == 0` em `gh api repos/cpatrickalves/personal-site/issues/<n>`.
