/**
 * The ⌘K palette, adapted from karhdo.dev's `CommandPalette.tsx` (MIT, see
 * THIRD_PARTY_NOTICES.md): Posts and the site's sections, no actions. A plain
 * React component mounted by `mount-palette.tsx`, never an Astro island.
 *
 * - Dialog: a native modal `<dialog>` (top layer, page behind it inert, Esc
 *   through `close`). Focus returns to whoever opened it, unless the palette
 *   closes to navigate. Opened and closed by the loader's window events.
 * - Data: read from the current page's `#cmdk-data` on every open, so the
 *   latest Posts, the sections and the texts follow the page's language.
 * - List: `cmdk` with `shouldFilter={false}`: Pagefind ranks the Posts and
 *   `matchesQuery` filters the sections. The selection is controlled, so it
 *   is the first row whenever the list changes.
 * - Pagefind: imported on the first open with the `base` as `baseUrl`, and
 *   started again when `<html lang>` changed since its `init`.
 */
import { navigate } from "astro:transitions/client";
import { Command } from "cmdk";
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { tplStr } from "@/i18n/format";
import { getAssetPath } from "@/utils/withBase";
import {
  groupOrder,
  matchesQuery,
  MAX_RESULTS,
  pagefindBaseUrl,
  resultCount,
  splitResults,
  toPalettePost,
  type PagefindFragment,
  type PaletteData,
  type PalettePost,
  type PaletteSection,
} from "./palette-data";

type PagefindResult = { id: string; data(): Promise<PagefindFragment> };
type Pagefind = {
  options(options: Record<string, unknown>): Promise<void>;
  init(): Promise<void>;
  destroy(): Promise<void>;
  debouncedSearch(
    term: string,
    options?: object,
    debounceMs?: number
  ): Promise<{ results: PagefindResult[] } | null>;
};

let pagefindModule: Promise<Pagefind> | undefined;
let pagefindReady: { lang: string; engine: Promise<Pagefind> } | undefined;

/**
 * Pagefind, started for the page's `<html lang>`: it loads that language's
 * index on `init`. `pagefind.js` is fetched once per page life; a failed
 * fetch is forgotten, so the next open tries again.
 */
function loadPagefind(): Promise<Pagefind> {
  const lang = document.documentElement.lang;
  if (pagefindReady?.lang === lang) return pagefindReady.engine;

  const previous = pagefindReady?.engine.catch(() => undefined);
  const module = (pagefindModule ??= import(
    /* @vite-ignore */ getAssetPath("pagefind/pagefind.js")
  ).catch((error: unknown) => {
    pagefindModule = undefined;
    throw error;
  }) as Promise<Pagefind>);

  const ready = { lang } as { lang: string; engine: Promise<Pagefind> };
  ready.engine = (async () => {
    const pagefind = await module;
    if (await previous) await pagefind.destroy();
    await pagefind.options({
      baseUrl: pagefindBaseUrl(import.meta.env.BASE_URL),
      excerptLength: 20,
    });
    // `init` reads `<html lang>` now, not when the open asked: the page may
    // have changed language while `pagefind.js` was on its way.
    ready.lang = document.documentElement.lang;
    await pagefind.init();
    return pagefind;
  })();
  ready.engine.catch(() => {
    if (pagefindReady === ready) pagefindReady = undefined;
  });
  pagefindReady = ready;
  return ready.engine;
}

/**
 * While the palette is open `palette.css` locks the page's scroll, which
 * takes away a classic scrollbar: its room is kept, so the page around the
 * plate does not move. A page with no scrollbar gets no gutter.
 */
function holdScrollbar(hold: boolean): void {
  const root = document.documentElement;
  if (!hold) root.style.removeProperty("scrollbar-gutter");
  else if (window.innerWidth > root.clientWidth) {
    root.style.setProperty("scrollbar-gutter", "stable");
  }
}

const EMPTY: PaletteData = {
  posts: [],
  sections: [],
  strings: {
    dialog: "",
    placeholder: "",
    close: "",
    results: "",
    latest: "",
    posts: "",
    navigation: "",
    showMore: "",
    searching: "",
    noResults: "",
    unavailable: "",
    resultOne: "",
    resultOther: "",
    hintMove: "",
    hintOpen: "",
    hintClose: "",
  },
};

/** The current page's data; the palette root outlives the page. */
function readData(): PaletteData {
  try {
    return JSON.parse(
      document.getElementById("cmdk-data")?.textContent ?? ""
    ) as PaletteData;
  } catch {
    return EMPTY;
  }
}

/** Tabler icon paths (MIT), the set the rest of the site draws with. */
const GLYPHS = {
  search: (
    <>
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M21 21l-6 -6" />
    </>
  ),
  post: (
    <>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M9 13l6 0" />
      <path d="M9 17l6 0" />
    </>
  ),
  section: (
    <>
      <path d="M5 12l14 0" />
      <path d="M13 18l6 -6" />
      <path d="M13 6l6 6" />
    </>
  ),
  more: <path d="M6 9l6 6l6 -6" />,
  close: (
    <>
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </>
  ),
} satisfies Record<string, ReactNode>;

function Glyph({ name }: { name: keyof typeof GLYPHS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[name]}
    </svg>
  );
}

type Search =
  | { status: "idle" }
  | { status: "loading"; term: string }
  | {
      status: "done";
      term: string;
      results: PagefindResult[];
      posts: PalettePost[];
      expanded: boolean;
    };

const MORE = "more";

export default function CommandPalette({
  initialOpener,
}: {
  initialOpener: HTMLElement | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(initialOpener);
  const restoreFocusRef = useRef(true);
  const requestRef = useRef(0);
  const nextSelectionRef = useRef<string | undefined>(undefined);
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<PaletteData>(readData);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<Search>({ status: "idle" });
  const [unavailable, setUnavailable] = useState(false);
  const [selected, setSelected] = useState("");
  // Bumped on every open, so an open with the same rows selects the first.
  const [openCount, setOpenCount] = useState(0);

  const show = useCallback((opener?: HTMLElement | null) => {
    if (dialogRef.current?.open) return;
    openerRef.current =
      opener ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    setData(readData());
    setQuery("");
    setSearch({ status: "idle" });
    setUnavailable(false);
    setOpenCount(count => count + 1);
    setOpen(true);
    // Now, not after the render: a `close` event still queued from the last
    // Esc then finds the dialog open and leaves it alone.
    const dialog = dialogRef.current;
    if (dialog) {
      restoreFocusRef.current = true;
      holdScrollbar(true);
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>("[cmdk-input]")?.focus();
    }
  }, []);

  /** Closes the dialog now; without focus return when a page swap follows. */
  const close = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus;
    dialogRef.current?.close();
    setOpen(false);
  }, []);

  // Open state → native dialog, before paint, so focus lands in the field:
  // the first open, mounted already open, and any open a batch left behind.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      restoreFocusRef.current = true;
      holdScrollbar(true);
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>("[cmdk-input]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, openCount]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const onOpen = (event: Event) =>
      show((event as CustomEvent<{ opener?: HTMLElement }>).detail?.opener);
    const onToggle = () => (dialogRef.current?.open ? close() : show());
    const onBeforeSwap = () => close(false);
    const onClose = () => {
      // The `close` event is queued: a reopen may have come first.
      if (dialog?.open) return;
      holdScrollbar(false);
      setOpen(false);
      const opener = openerRef.current;
      if (restoreFocusRef.current && opener?.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
    // A click on the dialog itself is a click around the plate. A drag that
    // starts on the plate (selecting the field's text, the list's scrollbar)
    // and ends around it also clicks the dialog: only a press that starts
    // there closes.
    let pressedOnBackdrop = false;
    const onPointerDown = (event: PointerEvent) => {
      pressedOnBackdrop = event.target === dialog;
    };
    const onBackdrop = (event: MouseEvent) => {
      if (pressedOnBackdrop && event.target === dialog) close();
    };
    // Tab cycles through the dialog's controls and never leaves it.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog) return;
      const controls = [
        ...dialog.querySelectorAll<HTMLElement>("input, button"),
      ];
      const first = controls.at(0);
      const last = controls.at(-1);
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("cmdk:open", onOpen);
    window.addEventListener("cmdk:toggle", onToggle);
    document.addEventListener("astro:before-swap", onBeforeSwap);
    dialog?.addEventListener("close", onClose);
    dialog?.addEventListener("pointerdown", onPointerDown);
    dialog?.addEventListener("click", onBackdrop);
    dialog?.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("cmdk:open", onOpen);
      window.removeEventListener("cmdk:toggle", onToggle);
      document.removeEventListener("astro:before-swap", onBeforeSwap);
      dialog?.removeEventListener("close", onClose);
      dialog?.removeEventListener("pointerdown", onPointerDown);
      dialog?.removeEventListener("click", onBackdrop);
      dialog?.removeEventListener("keydown", onKeyDown);
    };
  }, [show, close]);

  // Every open loads Pagefind for the page's language, or tries again.
  useEffect(() => {
    if (!open) return;
    let current = true;
    loadPagefind().then(
      () => current && setUnavailable(false),
      () => current && setUnavailable(true)
    );
    return () => {
      current = false;
    };
  }, [open, openCount]);

  // One search per term; a response for an older term is dropped.
  useEffect(() => {
    const term = query.trim();
    const request = ++requestRef.current;
    if (!term || unavailable) {
      setSearch({ status: "idle" });
      return;
    }
    setSearch({ status: "loading", term });
    loadPagefind()
      .then(async pagefind => {
        const response = await pagefind.debouncedSearch(term, {}, 150);
        if (!response || request !== requestRef.current) return;
        const { shown } = splitResults(response.results, false);
        const fragments = await Promise.all(shown.map(result => result.data()));
        if (request !== requestRef.current) return;
        setSearch({
          status: "done",
          term,
          results: response.results,
          posts: fragments.map(toPalettePost),
          expanded: false,
        });
      })
      .catch(() => {
        if (request === requestRef.current) setUnavailable(true);
      });
  }, [query, unavailable]);

  const { strings } = data;
  const term = query.trim();
  const done = search.status === "done" && search.term === term;
  const searching = term !== "" && !unavailable && !done;

  const sections = data.sections.filter(section => matchesQuery(section, term));
  const found = done ? search.results : [];
  const { more } = splitResults(found, done && search.expanded);
  const posts = term ? (done ? search.posts : []) : data.posts;
  const order = groupOrder(term, sections.length);

  const showMore = () => {
    if (search.status !== "done") return;
    const request = requestRef.current;
    const loaded = search.posts.length;
    Promise.all(search.results.slice(loaded).map(result => result.data()))
      .then(fragments => {
        if (request !== requestRef.current) return;
        const rest = fragments.map(toPalettePost);
        setSearch({
          ...search,
          posts: [...search.posts, ...rest],
          expanded: true,
        });
        if (rest[0]) nextSelectionRef.current = `post:${rest[0].url}`;
      })
      .catch(() => {
        if (request === requestRef.current) setUnavailable(true);
      });
  };

  // A click on a row keeps the focus in the field, where the keys work.
  const keepFocus = (event: ReactMouseEvent) => event.preventDefault();

  const go = (href: string) => {
    close(false);
    void navigate(href);
  };

  // The rows in the order they show, for the selection and the count.
  const values = order.flatMap(group =>
    group === "navigation"
      ? sections.map(section => `section:${section.href}`)
      : [
          ...posts.map(post => `post:${post.url}`),
          ...(group === "posts" && more > 0 ? [MORE] : []),
        ]
  );
  const listKey = values.join("\n");
  const rows = values.filter(value => value !== MORE).length;

  // The first row whenever the list changes, so Enter never opens a row
  // that left it; after `Mostrar mais`, the first of the Posts it brought.
  useEffect(() => {
    setSelected(nextSelectionRef.current ?? values[0] ?? "");
    nextSelectionRef.current = undefined;
  }, [listKey, openCount]);

  // The selected row stays in view inside the list.
  useLayoutEffect(() => {
    dialogRef.current
      ?.querySelector(`[cmdk-item][data-value="${CSS.escape(selected)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected, listKey, open]);

  // cmdk computes `aria-activedescendant` only on its own selection path, and
  // re-renders the field with a stale one when the selection is controlled.
  // The row marked `aria-selected` is the truth: the field follows it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const sync = () => {
      const input = dialog.querySelector("[cmdk-input]");
      const id = dialog.querySelector(
        ".cmdk-list [cmdk-item][aria-selected='true']"
      )?.id;
      if (!input || input.getAttribute("aria-activedescendant") === id) return;
      if (id) input.setAttribute("aria-activedescendant", id);
      else input.removeAttribute("aria-activedescendant");
    };
    const observer = new MutationObserver(sync);
    observer.observe(dialog, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-selected", "aria-activedescendant"],
    });
    sync();
    return () => observer.disconnect();
  }, []);

  const status = searching ? strings.searching : resultCount(rows, strings);

  // The first Post `Mostrar mais` brings takes over its row's key: cmdk then
  // sees no selected row leave, and does not move the selection to the top.
  const postItem = (post: PalettePost, index: number) => (
    <Command.Item
      key={done && search.expanded && index === MAX_RESULTS ? MORE : post.url}
      value={`post:${post.url}`}
      data-value={`post:${post.url}`}
      className="cmdk-item"
      onMouseDown={keepFocus}
      onSelect={() => go(post.url)}
    >
      <Glyph name="post" />
      <span className="cmdk-main">
        <span className="cmdk-title">{post.title}</span>
        {post.excerpt ? (
          <span
            className="cmdk-excerpt"
            // Pagefind escapes only < and > in the excerpt, then adds <mark>.
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        ) : null}
      </span>
      {post.date && (
        <time className="cmdk-sub" dateTime={post.date}>
          {post.date}
        </time>
      )}
    </Command.Item>
  );

  const sectionItem = (section: PaletteSection) => (
    <Command.Item
      key={section.href}
      value={`section:${section.href}`}
      data-value={`section:${section.href}`}
      className="cmdk-item"
      onMouseDown={keepFocus}
      onSelect={() => go(section.href)}
    >
      <Glyph name="section" />
      <span className="cmdk-main">
        <span className="cmdk-title">{section.title}</span>
      </span>
      <span className="cmdk-sub">{section.path}</span>
    </Command.Item>
  );

  const groups: Record<(typeof order)[number], ReactNode> = {
    latest: posts.length > 0 && (
      <Command.Group key="latest" heading={strings.latest}>
        {posts.map(postItem)}
      </Command.Group>
    ),
    posts: posts.length > 0 && (
      <Command.Group key="posts" heading={strings.posts}>
        {/* One array, so the `Mostrar mais` row and the Post that takes its
            key are the same element to React. */}
        {[
          ...posts.map(postItem),
          ...(more > 0
            ? [
                <Command.Item
                  key={MORE}
                  value={MORE}
                  data-value={MORE}
                  className="cmdk-item cmdk-more"
                  onMouseDown={keepFocus}
                  onSelect={showMore}
                >
                  <Glyph name="more" />
                  <span className="cmdk-main">
                    <span className="cmdk-title">
                      {tplStr(strings.showMore, { n: more })}
                    </span>
                  </span>
                </Command.Item>,
              ]
            : []),
        ]}
      </Command.Group>
    ),
    navigation: sections.length > 0 && (
      <Command.Group key="navigation" heading={strings.navigation}>
        {sections.map(sectionItem)}
      </Command.Group>
    ),
  };

  return (
    <dialog ref={dialogRef} className="cmdk-back" aria-label={strings.dialog}>
      <div className="cmdk">
        <Command
          label={strings.dialog}
          shouldFilter={false}
          loop
          vimBindings={false}
          value={selected}
          onValueChange={setSelected}
        >
          <div className="cmdk-in">
            <Glyph name="search" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder={strings.placeholder}
              aria-label={strings.placeholder}
            />
            <button
              type="button"
              className="cmdk-close"
              onClick={() => close()}
              aria-label={strings.close}
              title={strings.close}
            >
              <Glyph name="close" />
            </button>
          </div>
          {/* The scrolling area holds the notes beside the listbox, which may
              only own options and groups; the live region reads them out. */}
          <div className="cmdk-list" aria-busy={searching}>
            {unavailable && <p className="cmdk-note">{strings.unavailable}</p>}
            <Command.List label={strings.results} aria-busy={searching}>
              {order.map(group => groups[group])}
            </Command.List>
            {searching && <p className="cmdk-note">{strings.searching}</p>}
            {term && done && rows === 0 && (
              <p className="cmdk-empty">
                {tplStr(strings.noResults, { term })}
              </p>
            )}
          </div>
          <div className="cmdk-foot" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              {strings.hintMove}
            </span>
            <span>
              <kbd>↵</kbd>
              {strings.hintOpen}
            </span>
            <span>
              <kbd>esc</kbd>
              {strings.hintClose}
            </span>
          </div>
          <p className="sr-only" aria-live="polite">
            {status}
          </p>
        </Command>
      </div>
    </dialog>
  );
}
