# Scripts do Hashnode

Backup (Fase 0) e, mais tarde, Importação (Fase 7) dos posts do Hashnode. Só biblioteca padrão; o `uv` é usado só para os testes.

## Backup

```sh
python3 -I scripts/hashnode/hashnode_backup.py --out archive/hashnode
```

Rode da raiz do repo. O `-I` importa porque o conteúdo baixado é dado não confiável. O snapshot é montado em `archive/hashnode.tmp` e só substitui `archive/hashnode` se tudo baixar. Imagem de site de terceiro que falha vira aviso, não erro.

## Testes

```sh
cd scripts/hashnode && uv run pytest
```

## Formato do snapshot

```
archive/hashnode/
├── manifest.json          # índice de tudo; a Importação começa por aqui
├── sitemap.xml
├── posts/<slug>/
│   ├── post.md            # GET <url>.md: sem frontmatter, título como H1
│   ├── post.html          # JSON-LD BlogPosting e meta tags
│   ├── cover.<ext>        # og:image
│   └── images/<arquivo>   # imagens do corpo
└── pages/{about,contact,hire-me}/
    ├── page.html
    └── images/<arquivo>   # imagens do cdn.hashnode.com citadas na página
```

No `manifest.json`, cada post tem `images` (URL original → arquivo local, para reescrever os caminhos), `cover` e, quando houver, `missing_images` (imagens de terceiros que não baixaram, com o erro) e `unresolved_images` (caminhos relativos, sem de onde baixar).
