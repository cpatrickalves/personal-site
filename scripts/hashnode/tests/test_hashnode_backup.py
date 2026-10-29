import json
import urllib.error

import hashnode_backup as hb
from hashnode_backup import Response

SITEMAP = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://cpatrickalves.com</loc></url>
  <url><loc>https://cpatrickalves.com/basket-icon-detector</loc></url>
  <url><loc>https://cpatrickalves.com/mlops-what-it-is</loc></url>
  <url><loc>https://cpatrickalves.com/page/about</loc></url>
  <url><loc>https://cpatrickalves.com/page/contact</loc></url>
  <url><loc>https://cpatrickalves.com/page/hire-me</loc></url>
  <url><loc>https://cpatrickalves.com/page/uses</loc></url>
  <url><loc>https://cpatrickalves.com/series/portfolio</loc></url>
  <url><loc>https://cpatrickalves.com/archive</loc></url>
</urlset>"""

CDN = "https://cdn.hashnode.com/res/hashnode/image/upload"


def post_html(cover: str = f"{CDN}/v1/cover.png") -> str:
    ld = {"@type": "BlogPosting", "datePublished": "2021-05-25T12:39:37.000Z"}
    return (
        f'<script type="application/ld+json">{json.dumps(ld)}</script>'
        f'<meta property="og:image" content="{cover}"/>'
        f'<img src="{CDN}/v9/related-post-cover.png?auto=compress,format"/>'
    )


def test_classify_keeps_posts_and_the_three_pages():
    posts, pages = hb.classify(hb.parse_sitemap(SITEMAP))
    assert posts == ["basket-icon-detector", "mlops-what-it-is"]
    assert pages == ["about", "contact", "hire-me"]


def test_body_images_from_markdown_and_html_in_order():
    md = (
        f'![a.png]({CDN}/v1/a.png align="left")\n'
        '<img width="500" alt="x" src="https://user-images.githubusercontent.com/1/b.jpg">\n'
        "[![badge](https://i.redd.it/c.jpg)](https://example.com)\n"
        f"![again]({CDN}/v1/a.png)\n"
        "![GitHub](/github.jpg)\n"
    )
    assert hb.body_image_urls(md) == [
        f"{CDN}/v1/a.png",
        "https://user-images.githubusercontent.com/1/b.jpg",
        "https://i.redd.it/c.jpg",
    ]
    assert hb.relative_image_refs(md) == ["/github.jpg"]


def test_page_images_drop_query_and_duplicates():
    html = f'<img src="{CDN}/v1/a.jpeg?auto=compress,format"/><meta content="{CDN}/v1/a.jpeg"/>'
    assert hb.page_image_urls(html) == [f"{CDN}/v1/a.jpeg"]


def test_metadata_from_post_html():
    html = post_html()
    assert hb.blog_posting(html)["datePublished"] == "2021-05-25T12:39:37.000Z"
    assert hb.cover_url(html) == f"{CDN}/v1/cover.png"
    assert hb.blog_posting("<html></html>") is None


def test_local_name_adds_extension_and_avoids_collisions():
    taken: set[str] = set()
    assert hb.local_name(f"{CDN}/v1/a.png", "image/png", taken) == "a.png"
    second = hb.local_name(f"{CDN}/v2/a.png", "image/png", taken)
    assert second.endswith("-a.png") and second != "a.png"
    assert hb.local_name("https://example.com/img/xyz", "image/jpeg", taken) == "xyz.jpg"


def fake_site(overrides: dict[str, Response | None] | None = None):
    pages = {
        f"{hb.SITE}/sitemap.xml": Response(SITEMAP.encode(), "application/xml"),
        f"{hb.SITE}/basket-icon-detector.md": Response(
            f"# Basket\n\n![b]({CDN}/v1/body.png)\n".encode(), "text/markdown"
        ),
        f"{hb.SITE}/basket-icon-detector": Response(post_html().encode(), "text/html"),
        f"{hb.SITE}/mlops-what-it-is.md": Response(b"# MLOps\n", "text/markdown"),
        f"{hb.SITE}/mlops-what-it-is": Response(post_html(f"{CDN}/v2/c2.jpg").encode(), "text/html"),
        f"{CDN}/v1/body.png": Response(b"PNG-body", "image/png"),
        f"{CDN}/v1/cover.png": Response(b"PNG-cover", "image/png"),
        f"{CDN}/v2/c2.jpg": Response(b"JPG-cover", "image/jpeg"),
        f"{CDN}/v1/avatar.jpeg": Response(b"avatar", "image/jpeg"),
    }
    for name in hb.PAGES:
        pages[f"{hb.SITE}/page/{name}"] = Response(f'<img src="{CDN}/v1/avatar.jpeg"/>'.encode(), "text/html")
    pages.update(overrides or {})

    def fetch(url: str) -> Response:
        resp = pages.get(url)
        if resp is None:
            raise urllib.error.HTTPError(url, 404, "Not Found", {}, None)
        return resp

    return fetch


def test_run_writes_snapshot_and_manifest(tmp_path):
    out = tmp_path / "hashnode"
    assert hb.run(out, expected_posts=2, fetcher=fake_site()) == ([], [])

    manifest = json.loads((out / "manifest.json").read_text())
    basket = manifest["posts"][0]
    assert basket["markdown"] == "posts/basket-icon-detector/post.md"
    assert basket["cover"] == {"url": f"{CDN}/v1/cover.png", "file": "posts/basket-icon-detector/cover.png"}
    assert basket["images"] == {f"{CDN}/v1/body.png": "posts/basket-icon-detector/images/body.png"}
    assert (out / basket["images"][f"{CDN}/v1/body.png"]).read_bytes() == b"PNG-body"
    assert (out / "posts/mlops-what-it-is/cover.jpg").read_bytes() == b"JPG-cover"
    assert [p["name"] for p in manifest["pages"]] == ["about", "contact", "hire-me"]
    assert (out / "pages/about/images/avatar.jpeg").exists()
    assert not (tmp_path / "hashnode.tmp").exists()


def test_run_keeps_previous_snapshot_when_something_fails(tmp_path):
    out = tmp_path / "hashnode"
    out.mkdir()
    (out / "manifest.json").write_text("previous")

    failures, _ = hb.run(out, expected_posts=2, fetcher=fake_site({f"{CDN}/v1/body.png": None}))

    assert any("body.png" in f for f in failures)
    assert (out / "manifest.json").read_text() == "previous"
    assert (tmp_path / "hashnode.tmp" / "manifest.json").exists()


def test_run_fails_when_post_count_differs(tmp_path):
    failures, _ = hb.run(tmp_path / "hashnode", expected_posts=18, fetcher=fake_site())
    assert failures == ["sitemap tem 2 posts, esperado 18"]


def test_third_party_image_failure_is_a_warning(tmp_path):
    blocked = "https://www.flagship.io/meme.jpg"
    site = fake_site({
        f"{hb.SITE}/mlops-what-it-is.md": Response(f"# MLOps\n\n![meme]({blocked})\n".encode(), "text/markdown"),
    })
    out = tmp_path / "hashnode"

    failures, warnings = hb.run(out, expected_posts=2, fetcher=site)

    assert failures == []
    assert len(warnings) == 1 and warnings[0].startswith(blocked)
    mlops = json.loads((out / "manifest.json").read_text())["posts"][1]
    assert mlops["images"] == {}
    assert list(mlops["missing_images"]) == [blocked]
