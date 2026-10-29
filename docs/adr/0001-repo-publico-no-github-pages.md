# Repo público para publicar no GitHub Pages

O site é publicado no GitHub Pages a partir do próprio repo `cpatrickalves/personal-site`. No plano GitHub Free, o Pages só publica repos públicos, e assinar o Pro não é opção. Por isso, o repo é público. Rascunhos (`draft: true`), rascunhos de tradução e o histórico ficam visíveis, então nada que não possa ser público entra num commit.

## Considered Options

- **Manter privado e hospedar no Cloudflare Pages:** é grátis e tem preview por PR. Por outro lado, levaria o DNS do domínio para o Cloudflare e trocaria o workflow de deploy, sem ganho que justifique.
- **Manter privado e hospedar no Netlify:** tem as mesmas trocas, mais um limite de uso mensal no plano grátis.
- **Código privado com o Actions empurrando o HTML para um repo público:** mantém o Pages, mas exige um token pessoal guardado como segredo, e o deploy foi desenhado para usar só o token efêmero do Actions.

Origem: [revisão do TDD e do PLAN](../../.grills/revisao-tdd-plan-grill.md), Q29.
