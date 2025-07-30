// src/lib/withAuth.ts (ou onde você preferir colocar este HOF)

import { redirect } from "next/navigation"; // Importa a função de redirecionamento do Next.js
import {
  verifyAndRefreshTokensIfNeeded,
  VerificationOutcome,
  clearTokens, // Importa clearTokens para garantir a limpeza
} from "./authTokens"; // Ajuste o caminho se necessário

// TArgs e TReturn são tipos genéricos para os argumentos e o tipo de retorno da action original.
export default function withAuth<TArgs extends any[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>
) {
  return async function (...args: TArgs): Promise<TReturn> {
    // console.log(`withAuth: Verifying tokens before executing action: ${action.name}`);

    // return await action(...args);

    const verificationResult: VerificationOutcome =
      await verifyAndRefreshTokensIfNeeded();

    if (
      verificationResult.status === "valid" ||
      verificationResult.status === "refreshed"
    ) {
      // console.log(`withAuth: Token valid or refreshed. Proceeding with action ${action.name}. Status: ${verificationResult.status}`);
      // Usuário autenticado, executa a action original
      try {
        return await action(...args);
      } catch (error) {
        // console.error(`withAuth: Error during execution of wrapped action ${action.name}:`, error);
        // Se a action original lançar um erro, ele será propagado.
        // O chamador da Server Action (no lado do cliente) precisará tratar esse erro.
        throw error;
      }
    } else {
      // Falha na autenticação/verificação do token
      const reason = verificationResult.reason || "session_invalid";
      // console.warn(`withAuth: Token verification failed for action ${action.name}. Reason: ${reason}. Clearing tokens and redirecting to login.`);

      // 1. Limpar os tokens de autenticação
      await clearTokens();

      // 2. Redirecionar para a página de login
      // A função redirect() de next/navigation deve ser usada.
      // Ela funciona lançando um erro especial que o Next.js captura para realizar o redirecionamento.
      // Portanto, a execução da função para aqui.
      redirect(
        `/login?error=authentication_failed&reason=${encodeURIComponent(
          reason
        )}`
      );

      // Nota: Como redirect() interrompe a execução, não há necessidade de um `return` explícito aqui
      // para o caso de falha. A tipagem de retorno da função encapsulada é Promise<TReturn>,
      // porque ou a action original retorna isso, ou o redirect acontece (que é um fluxo de exceção).
    }
  };
}
