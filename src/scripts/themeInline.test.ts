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

function memoryStorage(initial?: string): Storage {
  let value: string | null = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key, next) => void (value = next),
    removeItem: () => void (value = null),
  };
}

/** Runs the real inline script against a fake browser. */
function boot(osDark: boolean, storage: Storage) {
  const attributes = new Map<string, string>();
  const listeners = new Map<string, Array<(event: unknown) => void>>();
  const window: Record<string, unknown> = {};
  const document = {
    documentElement: {
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
    },
    addEventListener: (type: string, listener: (event: unknown) => void) =>
      listeners.set(type, [...(listeners.get(type) ?? []), listener]),
    dispatchEvent: () => true,
  };
  vm.runInNewContext(source, {
    window,
    document,
    localStorage: storage,
    matchMedia: () => ({ matches: osDark, addEventListener: () => {} }),
    CustomEvent: class {},
  });
  return {
    attributes,
    api: window.__theme as {
      get(): string;
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
