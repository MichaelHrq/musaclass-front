export const api = {
  auth: {
    login: "api/auth/login",
    logout: "api/auth/logout",
    register: "api/auth/register",
    refresh: "api/auth/refresh-token",
    create: "api/auth/register",
    // forgotPassword: "api/auth/forgot-password",
    // resetPassword: "api/auth/reset-password",
    // verifyEmail: "api/auth/verify-email",
    // verifyToken: "api/auth/verify-token",
  },
  gestao: {
    searchAnuncCpf: `api/anuciante/buscar-anuncios`,
    sendInvite: `api/convite`,
  },
  anunc: {
    getAnuncios: `api/anuciante/meus-anuncios`,
    getAnuncioDadosById: `api/anuciante/dados`, // id anuncio
    getDados: `api/anunciate/dados`,
    updatePost: `api/anuciante/post`,
    craeteFeed: `api/anuciante/midia`,
  },
};
