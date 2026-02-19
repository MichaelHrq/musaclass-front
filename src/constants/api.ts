export const api = {
  auth: {
    login: "api/auth/login",
    logout: "api/auth/logout",
    register: "api/auth/register",
    refresh: "api/auth/refresh-token",
    create: "api/auth/register",
    change: "api/auth/reset-password",
    forgot: {
      sendCode: "api/auth/password/forgot/send-code",
      verifyCode: "api/auth/password/forgot/verify-code",
      reset: "api/auth/password/forgot/reset",
    },
  },
  gestao: {
    searchAnuncCpf: `api/anuciante/buscar-anuncios`,
    sendInvite: `api/convite`,
    dashboard: `api/posts`,
    aprovarFeed: `api/post/aprovar`, // /id_feed
    getApprovedMidias: `api/anuncios`, // ?city=slug_cidade
    updateEmailAnunc: `api/auth/admin/update-email`,
    anuncioImagens: `api/galeria`,
      // /id_anuncio (get) -> get imagens
      // /upload/id_anuncio (post) -> upload imagens
      // /id_anuncio/reorder -> reordenar imagens
      // /id_anuncio/delete/id_imagem (delete) -> soft delete
    anuncioVideos: `api/galeria/video`,
      // /id_anuncio (get) -> get videos
      // /upload/id_anuncio (post) -> upload videos
      // /id_anuncio/reorder/id_video (post) -> reordenar videos
      // /id_anuncio/delete/id_video (delete) -> soft delete
    anucioPost : `api/anuciante/dados-completo`, // /id_anuncio
    anucioPostUpdate : `api/anuciante/admin/post`, // /id_anuncio (post)
  },
  anunc: {
    getAnuncios: `api/anuciante/meus-anuncios`,
    getAnuncioDadosById: `api/anuciante/dados`, // /id_anuncio
    getDados: `api/anunciate/dados`,
    updateAnuncio: `api/anuciante/post`, // /id_anuncio
    craeteFeed: `api/post-feed`,
    getFeedByAnuncio: `api/posts/feed`, // /id_anuncio
    deleteMidia: `api/delete/feed`, // /id_feed
    reorderMidias: `api/reorder/feed`
  },
};
