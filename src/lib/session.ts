'use server'

import { cookies } from 'next/headers';

const SESSION_EXPIRE_IN = 60 * 60 * 24 * 7; // 7 days
const SESSION_NAME = 'sessionId';   

export async function createSession({ sessionId }: { sessionId: string }) {
    const expiresAt = new Date(Date.now() + SESSION_EXPIRE_IN * 1000);
    (await cookies()).set(SESSION_NAME, sessionId, {
      httpOnly: true, // Impede acesso ao cookie via JavaScript
      expires: expiresAt, // Define o tempo de expiração
      secure: true, // Só envia o cookie em conexões seguras
    });
  }

export async function deleteSession() {
  (await cookies()).delete(SESSION_NAME);
}
  