import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Início",
    posts: "Posts",
    tags: "Tags",
    about: "Sobre",
    archives: "Arquivo",
    search: "Buscar",
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

    postsTitle: "Posts",
    postsDesc: "Todos os posts que publiquei.",

    archivesTitle: "Arquivo",
    archivesDesc: "Todos os posts, por ano e mês.",

    searchTitle: "Buscar",
    searchDesc: "Busque qualquer post ...",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    toggleTheme: "Alternar tema",
    searchPlaceholder: "Buscar posts...",
    noResults: "Nenhum resultado encontrado",
    goToPreviousPage: "Ir para a página anterior",
    goToNextPage: "Ir para a próxima página",
  },
  notFound: {
    title: "404 Não encontrada",
    message: "Página não encontrada",
    goHome: "Voltar para o início",
  },
} satisfies UIStrings;
