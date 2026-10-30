# Git

- Uma issue, uma branch, um PR: branch `<n>-<slug>` a partir do `main`, PR com `Closes #<n>`. O merge é do Patrick.
- Antes do commit, mostre o resultado ao Patrick: a prova no build e, quando der, as páginas renderizadas (ver [Testes e CI](testes-e-ci.md#checagem-visual)).
- Título do PR em inglês, como os commits; corpo em PT-BR.
- Adicione ao stage caminhos explícitos e confira `git show --stat HEAD` antes do push: `node_modules/`, `dist/`, `.astro/` e `public/pagefind/` continuam na árvore ao trocar para uma branch cujo `.gitignore` não os lista.
- Próximas issues livres: abertas, sem responsável e sem bloqueio. Uma chamada lista todas:

  ```sh
  gh api graphql -f query='{repository(owner:"cpatrickalves",name:"personal-site"){issues(states:OPEN,first:100){nodes{number title assignees{totalCount} issueDependenciesSummary{blockedBy}}}}}' \
    -q '.data.repository.issues.nodes[] | select(.assignees.totalCount == 0 and .issueDependenciesSummary.blockedBy == 0) | "#\(.number) \(.title)"'
  ```
