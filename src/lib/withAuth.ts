export default function withAuth(action: Function) {
  return async function (...args: any[]) {
    return await action(...args);
    // try {
    // console.log(`entrou no withauth`);
    // await clearTokens();
    // if (await isTokenExpired()) {
    //   await refreshToken();
    // }
    // return await action(...args);
    // } catch (error: any) {
    // console.log(`with auth:`, Object.entries(error))
    // await clearTokens();
    // }
  };
}
