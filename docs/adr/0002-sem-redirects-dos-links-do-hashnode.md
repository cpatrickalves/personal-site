# Sem redirects dos links antigos do Hashnode

Depois da Virada, os links `cpatrickalves.com/<slug>` do Hashnode dão 404, mesmo que o post continue existindo em `/en/blog/<slug>/` com o mesmo slug. O Astro geraria redirects estáticos (meta refresh, não 301) a partir de uma lista de 18 entradas, mas a decisão foi manter o escopo do lançamento sem eles. Aceita-se perder parte do tráfego de busca e de backlinks. Reabrir é barato, porque a lista de slugs fica no snapshot do Hashnode feito na Fase 0. Quem achar que é um esquecimento deve saber que foi deliberado.

Origem: [revisão do TDD e do PLAN](../../.grills/revisao-tdd-plan-grill.md), Q6.
