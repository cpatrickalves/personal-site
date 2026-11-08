export interface UIStrings {
  nav: {
    home: string;
    blog: string;
    tags: string;
    projects: string;
    talks: string;
    about: string;
    archives: string;
    search: string;
    /** The short code the language switch shows, read from the target locale. */
    languageCode: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    sharePostIntro: string;
    sharePostOn: string;
    sharePostViaEmail: string;
    tagLabel: string;
    backToTop: string;
    goBack: string;
    editPage: string;
    previousPost: string;
    nextPost: string;
  };
  pagination: {
    prev: string;
    next: string;
    page: string;
  };
  home: {
    socialLinks: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
  };
  footer: {
    copyright: string;
    allRightsReserved: string;
  };
  pages: {
    tagTitle: string;
    tagDesc: string;

    tagsTitle: string;
    tagsDesc: string;

    blogTitle: string;
    blogDesc: string;

    projectsTitle: string;
    projectsDesc: string;

    talksTitle: string;
    talksDesc: string;

    /** Placeholder for an empty list until Fase 5 designs the empty states. */
    empty: string;

    archivesTitle: string;
    archivesDesc: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    menu: string;
    mainNav: string;
    /** The theme button's name before its script runs. */
    toggleTheme: string;
    /** The theme button's name: what the next press switches to. */
    themeAction: {
      light: string;
      dark: string;
      system: string;
    };
    /** The language switch's label, read from the target locale, in its language. */
    switchLanguage: string;
    /** The search button's name once its script knows the system: `{{shortcut}}` is ⌘K or Ctrl+K. */
    searchWithShortcut: string;
    goToPreviousPage: string;
    goToNextPage: string;
  };
  /** The ⌘K palette (`src/components/search/`). */
  search: {
    dialog: string;
    placeholder: string;
    close: string;
    results: string;
    latest: string;
    posts: string;
    navigation: string;
    /** `{{n}}`: the Posts left out. */
    showMore: string;
    searching: string;
    /** `{{term}}`: what the reader typed. */
    noResults: string;
    unavailable: string;
    /** `{{n}}`: the rows of the list. */
    resultOne: string;
    resultOther: string;
    hintMove: string;
    hintOpen: string;
    hintClose: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
}
