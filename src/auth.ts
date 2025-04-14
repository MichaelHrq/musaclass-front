import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchApi } from "./lib/fetch";
import { api } from "./locales/api";

class InvalidLoginError extends CredentialsSignin {
  code = "invalid_credentials";
  status: number;

  constructor(
    message: string = "Invalid identifier or password",
    status: number = 400
  ) {
    super(message);
    this.status = status;
    this.code = message;
    Object.defineProperty(this, "status", {
      enumerable: true,
      value: status,
    });
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_SERVER,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const formdata = new FormData();
        formdata.append("email", credentials.email as string);
        formdata.append("password", credentials.password as string);
        const response = await fetchApi({
          route: api.auth.login,
          method: "POST",
          body: formdata,
        });

        if (response?.error) {
          throw new InvalidLoginError(response.error, response.status);
        }

        if (response) {
          return {
            id: new Date().getTime().toString(),
            role: `admin`,
          };
        }

        return null;
      },
    }),
  ],
});
