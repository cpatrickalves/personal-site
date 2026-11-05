(() => {
  const KEY = "theme";
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");

  let memory = "system";
  let storageWorks = true;

  const get = () => {
    if (!storageWorks) return memory;
    try {
      const value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : "system";
    } catch {
      storageWorks = false;
      return memory;
    }
  };

  const store = pref => {
    memory = pref;
    try {
      if (pref === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, pref);
    } catch {
      storageWorks = false;
    }
  };

  const resolve = pref =>
    pref === "dark" || (pref === "system" && media.matches) ? "dark" : "light";

  const next = () => {
    const pref = get();
    const order = media.matches
      ? ["system", "light", "dark"]
      : ["system", "dark", "light"];
    return order[(order.indexOf(pref) + 1) % order.length];
  };

  const stamp = element => {
    const pref = get();
    element.setAttribute("data-theme", resolve(pref));
    element.setAttribute("data-theme-pref", pref);
  };

  const notify = () => document.dispatchEvent(new CustomEvent("theme-change"));

  const set = pref => {
    store(pref);
    stamp(root);
    notify();
  };

  stamp(root);

  if (window.__theme) return;
  window.__theme = { get, set, next, resolve, cycle: () => set(next()) };

  document.addEventListener("astro:before-swap", event => {
    stamp(event.newDocument.documentElement);
  });
  document.addEventListener("astro:after-swap", () => stamp(root));

  media.addEventListener("change", () => {
    stamp(root);
    notify();
  });
})();
