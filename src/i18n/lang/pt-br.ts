import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Início",
    blog: "Blog",
    tags: "Tags",
    projects: "Projetos",
    talks: "Palestras",
    about: "Sobre",
    archives: "Arquivo",
    search: "Buscar",
    languageCode: "PT",
  },
  post: {
    publishedAt: "Publicado em",
    updatedAt: "Atualizado",
    sharePostIntro: "Compartilhe este post:",
    sharePostOn: "Compartilhe este post no {{platform}}",
    sharePostViaEmail: "Compartilhe este post por e-mail",
    tagLabel: "Tags",
    backToTop: "Voltar ao topo",
    goBack: "Voltar",
    editPage: "Editar página",
    previousPost: "Post anterior",
    nextPost: "Próximo post",
  },
  pagination: {
    prev: "Anterior",
    next: "Próxima",
    page: "Página",
  },
  home: {
    socialLinks: "Redes sociais",
    featured: "Em destaque",
    recentPosts: "Posts recentes",
    allPosts: "Todos os posts",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "Todos os direitos reservados.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "Todos os posts com a tag",

    tagsTitle: "Tags",
    tagsDesc: "Todas as tags usadas nos posts.",

    blogTitle: "Blog",
    blogDesc: "Todos os posts que publiquei.",

    projectsTitle: "Projetos",
    projectsDesc: "Projetos em que trabalhei.",

    talksTitle: "Palestras",
    talksDesc: "Palestras que apresentei.",

    empty: "Nada por aqui ainda.",

    archivesTitle: "Arquivo",
    archivesDesc: "Todos os posts, por ano e mês.",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    menu: "Menu",
    mainNav: "Principal",
    toggleTheme: "Alternar tema",
    themeAction: {
      light: "Ativar tema claro",
      dark: "Ativar tema escuro",
      system: "Ativar tema do sistema",
    },
    switchLanguage: "Ler em português",
    searchWithShortcut: "Buscar ({{shortcut}})",
    goToPreviousPage: "Ir para a página anterior",
    goToNextPage: "Ir para a próxima página",
  },
  search: {
    dialog: "Buscar no site",
    placeholder: "Buscar posts e páginas…",
    close: "Fechar busca",
    results: "Resultados",
    latest: "Últimos posts",
    posts: "Posts",
    navigation: "Navegação",
    showMore: "Mostrar mais {{n}}",
    searching: "Buscando…",
    noResults: "Nenhum resultado para “{{term}}”",
    unavailable: "A busca nos posts está indisponível agora.",
    resultOne: "{{n}} resultado",
    resultOther: "{{n}} resultados",
    hintMove: "navegar",
    hintOpen: "abrir",
    hintClose: "fechar",
  },
  notFound: {
    title: "404 Não encontrada",
    message: "Página não encontrada",
    goHome: "Voltar para o início",
  },
} satisfies UIStrings;
