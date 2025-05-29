"use server";

const withAuth =
  <Args extends any[], Return>(action: (...args: Args) => Promise<Return>) =>
  async (...args: Args): Promise<Return> => {
    try {
      console.log("With auth executing");
      return await action(...args)
    } catch (error: unknown) {
      console.error("Authentication error:", error);

      // await clearTokens();

      throw new Error("Unknown authentication error");
    }
  };

export default withAuth;
