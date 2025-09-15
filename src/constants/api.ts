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
      reset: "api/auth/password/forgot/reset"
    } 
  },
  gestao: {
    searchAnuncCpf: `api/anuciante/buscar-anuncios`,
    sendInvite: `api/convite`,
    dashboard: `api/posts`,
    aprovarFeed: `api/post/aprovar`, // /id_feed
  },
  anunc: {
    getAnuncios: `api/anuciante/meus-anuncios`,
    getAnuncioDadosById: `api/anuciante/dados`, // /id_anuncio
    getDados: `api/anunciate/dados`,
    updateAnuncio: `api/anuciante/post`, // /id_anuncio
    craeteFeed: `api/post-feed`,
    getFeedByAnuncio: `api/posts/feed`, // /id_anuncio
    deleteFeed: `api/delete/feed`, // /id_feed
  },
};
