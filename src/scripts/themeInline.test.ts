import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const source = readFileSync(
  new URL("./themeInline.js", import.meta.url),
  "utf8"
);

type Storage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

/** A storage whose raw value the test can read: "system" must remove the key. */
function memoryStorage(initial?: string): Storage & { raw(): string | null } {
  let value: string | null = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key, next) => void (value = next),
    removeItem: () => void (value = null),
    raw: () => value,
  };
}

type Listener = (event: unknown) => void;

/** A fake <html>: only the attributes the script writes. */
function fakeElement() {
  const attributes = new Map<string, string>();
  return {
    attributes,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
  };
}

/** Runs the real inline script against a fake browser. */
function boot(osDark: boolean, storage: Storage) {
  const html = fakeElement();
  const listeners = new Map<string, Listener[]>();
  const on = (type: string, listener: Listener) =>
    listeners.set(type, [...(listeners.get(type) ?? []), listener]);
  const fire = (type: string, event: unknown = {}) =>
    (listeners.get(type) ?? []).forEach(listener => listener(event));
  const media = {
    matches: osDark,
    addEventListener: (_type: string, listener: Listener) =>
      on("media-change", listener),
  };
  const window: Record<string, unknown> = {};
  vm.runInNewContext(source, {
    window,
    document: {
      documentElement: html,
      addEventListener: on,
      dispatchEvent: () => true,
    },
    localStorage: storage,
    matchMedia: () => media,
    CustomEvent: class {},
  });
  return {
    attributes: html.attributes,
    fire,
    /** The OS switches its scheme. */
    setOs(dark: boolean) {
      media.matches = dark;
      fire("media-change");
    },
    api: window.__theme as {
      get(): string;
      set(pref: string): void;
      next(): string;
      cycle(): void;
    },
  };
}

test("C1 resolve as 7 combinações de valor salvo e sistema", () => {
  const cases: Array<[string | undefined, boolean, string]> = [
    ["light", true, "light"],
    ["dark", false, "dark"],
    [undefined, true, "dark"],
    [undefined, false, "light"],
    ["blue", true, "dark"],
    ["auto", true, "dark"],
    ["system", true, "dark"],
  ];
  for (const [stored, osDark, expected] of cases) {
    const { attributes } = boot(osDark, memoryStorage(stored));
    assert.equal(attributes.get("data-theme"), expected, `${stored}/${osDark}`);
  }
});

test("C2 ciclo com o sistema claro e com o sistema escuro", () => {
  const walk = (osDark: boolean) => {
    const { api } = boot(osDark, memoryStorage());
    const seen = [api.get()];
    for (let i = 0; i < 3; i++) {
      api.cycle();
      seen.push(api.get());
    }
    return seen;
  };
  assert.deepEqual(walk(false), ["system", "dark", "light", "system"]);
  assert.deepEqual(walk(true), ["system", "light", "dark", "system"]);
});

test("C7 armazenamento bloqueado segue o sistema e guarda a escolha em memória", () => {
  const blocked: Storage = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };
  const { attributes, api } = boot(true, blocked);
  assert.equal(attributes.get("data-theme"), "dark");
  assert.equal(api.get(), "system");
  api.cycle();
  assert.equal(api.get(), "light");
  assert.equal(attributes.get("data-theme"), "light");

  // Reads work, writes fail (quota): the click still counts.
  const quota = { ...memoryStorage(), setItem: blocked.setItem };
  const full = boot(false, quota);
  full.api.cycle();
  assert.equal(full.api.get(), "dark");
  assert.equal(full.attributes.get("data-theme"), "dark");
});

test("C3 sistema remove a chave e claro e escuro gravam o valor", () => {
  const storage = memoryStorage();
  const { api } = boot(false, storage);
  const raw = [storage.raw()];
  for (let i = 0; i < 3; i++) {
    api.cycle();
    raw.push(storage.raw());
  }
  assert.deepEqual(raw, [null, "dark", "light", null]);
});

test("C5 mudança do sistema não sobrescreve a escolha", () => {
  for (const pref of ["light", "dark"])
    for (const osDark of [false, true]) {
      const storage = memoryStorage(pref);
      const page = boot(osDark, storage);
      page.setOs(!osDark);
      assert.equal(
        page.attributes.get("data-theme"),
        pref,
        `${pref}/${osDark}`
      );
      assert.equal(page.attributes.get("data-theme-pref"), pref);
      assert.equal(storage.raw(), pref);
    }
});

test("C6 preferência sistema acompanha o sistema sem chave", () => {
  const storage = memoryStorage();
  const page = boot(false, storage);
  page.setOs(true);
  assert.equal(page.attributes.get("data-theme"), "dark");
  page.setOs(false);
  assert.equal(page.attributes.get("data-theme"), "light");
  assert.equal(page.attributes.get("data-theme-pref"), "system");
  assert.equal(storage.raw(), null);
});

test("C9 before-swap carimba a página nova com a preferência", () => {
  for (const [stored, osDark, theme, pref] of [
    ["dark", false, "dark", "dark"],
    ["light", true, "light", "light"],
    [undefined, true, "dark", "system"],
  ] as const) {
    const page = boot(osDark, memoryStorage(stored));
    const incoming = fakeElement();
    page.fire("astro:before-swap", {
      newDocument: { documentElement: incoming },
    });
    assert.equal(
      incoming.attributes.get("data-theme"),
      theme,
      `${stored}/${osDark}`
    );
    assert.equal(incoming.attributes.get("data-theme-pref"), pref);
  }
});

test("C39 after-swap carimba o html com a escolha feita depois do before-swap", () => {
  const storage = memoryStorage("dark");
  const page = boot(false, storage);
  const incoming = fakeElement();
  page.fire("astro:before-swap", {
    newDocument: { documentElement: incoming },
  });
  page.api.cycle();
  // The swap copies the incoming page's attributes, stamped before the click.
  page.attributes.set("data-theme", incoming.attributes.get("data-theme")!);
  page.attributes.set(
    "data-theme-pref",
    incoming.attributes.get("data-theme-pref")!
  );
  page.fire("astro:after-swap");
  assert.equal(page.attributes.get("data-theme"), "light");
  assert.equal(page.attributes.get("data-theme-pref"), "light");
  assert.equal(storage.raw(), "light");
});
