// withAuth.ts
"use server";
import { clearTokens } from "./authTokens";

const withAuth =
  <Args extends any[], Return>(action: (...args: Args) => Promise<Return>) =>
  async (...args: Args): Promise<Return> => {
    try {
      console.log("Auth middleware executing");

      const result = await action(...args);
      return result;
    } catch (error: unknown) {
      console.error("Authentication error:", error);

      // Garante que a limpeza de tokens seja uma Server Action
      ("use server");
      await clearTokens();

      // if (error instanceof Error) {
      //   if (error.message.includes("Unauthorized")) {
      //     await redirectIfUnauthorized();
      //   }
      //   throw error;
      // }

      throw new Error("Unknown authentication error");
    }
  };

export default withAuth;
