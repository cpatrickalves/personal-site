"""Backup do Hashnode: grava um snapshot de cpatrickalves.com numa pasta versionada.

Lê o sitemap, baixa de cada post o Markdown (`<url>.md`), o HTML, a capa (`og:image`)
e as imagens do corpo, e das páginas fixas o HTML e as imagens do `cdn.hashnode.com`.
O snapshot é montado numa pasta temporária e só substitui o anterior se tudo der certo.

O conteúdo baixado é dado não confiável: rode com `python3 -I`.

    python3 -I scripts/hashnode/hashnode_backup.py --out archive/hashnode
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime, timezone
from html import unescape
from pathlib import Path, PurePosixPath
from urllib.parse import urlsplit

SITE = "https://cpatrickalves.com"
PAGES = ("about", "contact", "hire-me")
EXPECTED_POSTS = 18
USER_AGENT = "cpatrickalves-backup/1.0 (+https://github.com/cpatrickalves/personal-site)"
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
CONTENT_TYPE_EXT = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
}

MD_IMAGE = re.compile(r"!\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s[^)]*)?\)")
HTML_IMG_SRC = re.compile(r"<img\b[^>]*?\bsrc\s*=\s*[\"']([^\"']+)[\"']", re.I)
CDN_URL = re.compile(r"https://cdn\.hashnode\.com/[^\s\"'()<>\\]+")
JSON_LD = re.compile(r"<script[^>]*application/ld\+json[^>]*>(.*?)</script>", re.S | re.I)
OG_IMAGE = re.compile(r"<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"']", re.I)


def parse_sitemap(xml: str) -> list[str]:
    root = ET.fromstring(xml)
    return [loc.text.strip() for loc in root.iterfind("sm:url/sm:loc", SITEMAP_NS) if loc.text]


def classify(urls: list[str], site: str = SITE) -> tuple[list[str], list[str]]:
    """Separa as URLs do sitemap em slugs de post e nomes de página fixa.

    Post é toda URL com um único segmento de caminho (exceto `/archive`); das páginas
    `/page/<nome>`, só ficam as de PAGES. `/series/` e o resto são ignorados.
    """
    host = urlsplit(site).netloc
    posts: list[str] = []
    pages: list[str] = []
    for url in urls:
        parts = urlsplit(url)
        if parts.netloc != host:
            continue
        segments = [s for s in parts.path.split("/") if s]
        if len(segments) == 1 and segments[0] != "archive":
            posts.append(segments[0])
        elif len(segments) == 2 and segments[0] == "page" and segments[1] in PAGES:
            pages.append(segments[1])
    return posts, pages


def _dedupe(urls: list[str]) -> list[str]:
    return list(dict.fromkeys(urls))


def body_image_urls(markdown: str) -> list[str]:
    """URLs absolutas das imagens do corpo, na ordem em que aparecem."""
    found = [(m.start(), m.group(1)) for m in MD_IMAGE.finditer(markdown)]
    found += [(m.start(), unescape(m.group(1))) for m in HTML_IMG_SRC.finditer(markdown)]
    return _dedupe([url for _, url in sorted(found) if url.startswith(("http://", "https://"))])


def relative_image_refs(markdown: str) -> list[str]:
    """Imagens com caminho relativo, que não têm de onde ser baixadas."""
    refs = [m.group(1) for m in MD_IMAGE.finditer(markdown)]
    refs += [m.group(1) for m in HTML_IMG_SRC.finditer(markdown)]
    return _dedupe([r for r in refs if not r.startswith(("http://", "https://", "data:"))])


def page_image_urls(html: str) -> list[str]:
    """Imagens do `cdn.hashnode.com` citadas numa página, sem a query string."""
    return _dedupe([url.split("?", 1)[0] for url in CDN_URL.findall(unescape(html))])


def blog_posting(html: str) -> dict | None:
    for block in JSON_LD.findall(html):
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get("@type") == "BlogPosting":
            return data
    return None


def cover_url(html: str) -> str | None:
    match = OG_IMAGE.search(html)
    return unescape(match.group(1)) if match else None


def local_name(url: str, content_type: str | None, taken: set[str]) -> str:
    """Nome de arquivo estável para a imagem: o último segmento da URL, sem colisão."""
    name = PurePosixPath(urlsplit(url).path).name or "image"
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)
    if not PurePosixPath(name).suffix:
        name += CONTENT_TYPE_EXT.get((content_type or "").split(";")[0].strip(), "")
    if name in taken:
        name = f"{hashlib.sha1(url.encode()).hexdigest()[:8]}-{name}"
    taken.add(name)
    return name


@dataclass
class Response:
    body: bytes
    content_type: str


def fetch(url: str, attempts: int = 3) -> Response:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(1, attempts + 1):
        try:
            with urllib.request.urlopen(request, timeout=30) as resp:
                return Response(resp.read(), resp.headers.get("Content-Type", ""))
        except (urllib.error.URLError, TimeoutError):
            if attempt == attempts:
                raise
            time.sleep(2 * attempt)
    raise AssertionError("unreachable")


@dataclass
class Snapshot:
    root: Path
    fetch: Callable[[str], Response] = fetch
    failures: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def _try(self, url: str) -> Response | str:
        try:
            return self.fetch(url)
        except (urllib.error.URLError, TimeoutError) as exc:
            return str(exc)

    def _get(self, url: str) -> Response | None:
        resp = self._try(url)
        if isinstance(resp, str):
            self.failures.append(f"{url}: {resp}")
            return None
        return resp

    def _write(self, rel: str, data: bytes) -> str:
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return rel

    def _images(self, base: str, urls: list[str]) -> tuple[dict[str, str], dict[str, str]]:
        """Baixa as imagens. Falha no Hashnode é fatal; em site de terceiro, só aviso."""
        saved: dict[str, str] = {}
        missing: dict[str, str] = {}
        taken: set[str] = set()
        for url in urls:
            if urlsplit(url).netloc == "cdn.hashnode.com":
                resp = self._get(url)
            elif isinstance(resp := self._try(url), str):
                missing[url] = resp
                self.warnings.append(f"{url}: {resp}")
                resp = None
            if resp:
                name = local_name(url, resp.content_type, taken)
                saved[url] = self._write(f"{base}/images/{name}", resp.body)
        return saved, missing

    def post(self, slug: str) -> dict:
        base = f"posts/{slug}"
        url = f"{SITE}/{slug}"
        entry: dict = {"slug": slug, "url": url}
        md = self._get(f"{url}.md")
        html = self._get(url)
        if md:
            entry["markdown"] = self._write(f"{base}/post.md", md.body)
            text = md.body.decode("utf-8")
            entry["images"], missing = self._images(base, body_image_urls(text))
            if missing:
                entry["missing_images"] = missing
            if relative := relative_image_refs(text):
                entry["unresolved_images"] = relative
        if html:
            entry["html"] = self._write(f"{base}/post.html", html.body)
            page = html.body.decode("utf-8")
            if not blog_posting(page):
                self.failures.append(f"{url}: HTML sem JSON-LD BlogPosting")
            if cover := cover_url(page):
                resp = self._get(cover)
                if resp:
                    ext = PurePosixPath(local_name(cover, resp.content_type, set())).suffix
                    entry["cover"] = {"url": cover, "file": self._write(f"{base}/cover{ext}", resp.body)}
            else:
                self.failures.append(f"{url}: HTML sem og:image")
        return entry

    def page(self, name: str) -> dict:
        base = f"pages/{name}"
        url = f"{SITE}/page/{name}"
        entry: dict = {"name": name, "url": url}
        html = self._get(url)
        if html:
            entry["html"] = self._write(f"{base}/page.html", html.body)
            entry["images"], _ = self._images(base, page_image_urls(html.body.decode("utf-8")))
        return entry


def run(
    out: Path, expected_posts: int, fetcher: Callable[[str], Response] = fetch
) -> tuple[list[str], list[str]]:
    """Monta o snapshot em `<out>.tmp` e troca pelo `out` só se não houver falhas.

    Devolve `(falhas, avisos)`; os avisos são imagens de terceiros que não baixaram.
    """
    tmp = out.with_name(out.name + ".tmp")
    shutil.rmtree(tmp, ignore_errors=True)
    snap = Snapshot(tmp, fetcher)

    sitemap = fetcher(f"{SITE}/sitemap.xml").body.decode("utf-8")
    slugs, pages = classify(parse_sitemap(sitemap))
    if len(slugs) != expected_posts:
        snap.failures.append(f"sitemap tem {len(slugs)} posts, esperado {expected_posts}")
    if missing := sorted(set(PAGES) - set(pages)):
        snap.failures.append(f"páginas fora do sitemap: {', '.join(missing)}")

    manifest = {
        "source": SITE,
        "fetched_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "sitemap": snap._write("sitemap.xml", sitemap.encode("utf-8")),
        "posts": [snap.post(slug) for slug in slugs],
        "pages": [snap.page(name) for name in PAGES],
    }
    for entry in manifest["posts"]:
        for key in ("markdown", "html", "cover"):
            if key not in entry:
                snap.failures.append(f"{entry['url']}: sem {key}")
    snap._write("manifest.json", (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode())

    if not snap.failures:
        shutil.rmtree(out, ignore_errors=True)
        tmp.rename(out)
    return snap.failures, snap.warnings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--out", type=Path, required=True, help="pasta do snapshot")
    parser.add_argument("--expect-posts", type=int, default=EXPECTED_POSTS)
    args = parser.parse_args(argv)

    failures, warnings = run(args.out, args.expect_posts)
    for warning in warnings:
        print(f"aviso: imagem de terceiro não baixada: {warning}", file=sys.stderr)
    if failures:
        print(f"{len(failures)} falha(s); snapshot parcial em {args.out}.tmp:", file=sys.stderr)
        for failure in failures:
            print(f"  - {failure}", file=sys.stderr)
        return 1
    print(f"Snapshot gravado em {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
