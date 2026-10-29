# personal-site

Meu site pessoal com blog, projetos e palestras

## Plano em andamento

- `docs/PLAN.md`: roteiro de execução por fases, com critérios de pronto e pontos de aprovação.
- `docs/TDD.md`: arquitetura, contratos, decisões, riscos e questões em aberto.

Os dois são temporários: no fim da implementação, o que importar vira documentação permanente via `/docs-generator`, e eles são apagados.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `cpatrickalves/personal-site` (via the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one root `GLOSSARY.md` plus `docs/adr/`. See `docs/agents/domain.md`.
