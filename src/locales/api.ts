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
    searchAnuncCpf: `api/anuciante/meus-anuncios`,
    sendInvite: `api/convite`,
  },
  anunc: {
    getAnuncios: `api/anuciante`, // cpf
    updatePost: `api/anuciante/post/`, // id anunciante
    craeteFeed: `api/anuciante/midia/`, // id anunciante
  },
};
