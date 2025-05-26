import { clearTokens, isTokenExpired, refreshToken } from "./authTokens";

export default function withAuth(action: Function) {
  return async function (...args: any[]) {
    try {
      if (await isTokenExpired()) {
        await refreshToken();
      }
      return await action(...args);
    } catch (error: any) {
      await clearTokens();
    }
  };
}
