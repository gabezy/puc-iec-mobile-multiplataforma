import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  type AuthSession,
  type AuthUser,
  clearSession,
  decodeUser,
  endSession,
  isAuthSupported,
  isExpired,
  loadSession,
  login,
  refreshSession,
  saveSession,
} from '@/services/auth';

type AuthContextData = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  // Retorna um access token válido (renova se estiver expirando) — use para chamar APIs protegidas.
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(isAuthSupported);
  const sessionRef = useRef<AuthSession | null>(null);

  const applySession = useCallback(async (session: AuthSession | null) => {
    sessionRef.current = session;
    if (session) {
      await saveSession(session);
      setUser(decodeUser(session.idToken));
    } else {
      await clearSession();
      setUser(null);
    }
  }, []);

  // Restaura sessão salva ao abrir o app; renova se o access token venceu.
  useEffect(() => {
    if (!isAuthSupported) return;
    (async () => {
      try {
        const saved = await loadSession();
        if (!saved) return;
        await applySession(isExpired(saved) ? await refreshSession(saved) : saved);
      } catch {
        // Refresh token expirado/revogado: volta para o login
        await applySession(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [applySession]);

  const signIn = useCallback(async () => {
    await applySession(await login());
  }, [applySession]);

  const signOut = useCallback(async () => {
    const session = sessionRef.current;
    try {
      if (session) await endSession(session);
    } catch {
      // Keycloak fora do ar / usuário fechou o navegador: segue com logout local
    }
    await applySession(null);
  }, [applySession]);

  const getAccessToken = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return null;
    if (!isExpired(session)) return session.accessToken;
    try {
      const renewed = await refreshSession(session);
      await applySession(renewed);
      return renewed.accessToken;
    } catch {
      await applySession(null);
      return null;
    }
  }, [applySession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
