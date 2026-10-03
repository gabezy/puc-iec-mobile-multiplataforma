/*
┌───────────────────────────────────┬──────────────────────────────────────────────────────────────┐
│          Onde o app roda          │                             host                             │
├───────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ iOS Simulator                     │ localhost                                                    │
├───────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Emulador Android                  │ 10.0.2.2                                                     │
├───────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Celular físico (mesma rede Wi-Fi) │ IP do Mac na rede, ex. 192.168.0.10 (ipconfig getifaddr en0) │
└───────────────────────────────────┴──────────────────────────────────────────────────────────────┘
*/

import { Platform } from 'react-native';
import { authorize, logout, refresh, type AuthConfiguration } from 'react-native-app-auth';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

export const isAuthSupported = Platform.OS !== 'web';

const REDIRECT_URL = 'com.gabezy.aula02:/oauthredirect';

export const authConfig: AuthConfiguration = {
  issuer: process.env.EXPO_PUBLIC_KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/omni-market',
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'asd-aula02',
  redirectUrl: REDIRECT_URL,
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  usePKCE: false,
  // Keycloak local roda em http — liberar só em desenvolvimento
  dangerouslyAllowInsecureHttpRequests: __DEV__,
};

export type AuthSession = {
  accessToken: string;
  accessTokenExpirationDate: string;
  idToken: string;
  refreshToken: string;
};

export type AuthUser = {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
};

// jwt-decode NÃO valida assinatura: usar só para exibir dados, nunca para autorização.
export const decodeUser = (idToken: string): AuthUser => {
  const { sub, name, preferred_username, email } = jwtDecode<AuthUser>(idToken);
  return { sub, name, preferred_username, email };
};

// Considera expirado com 60s de margem para não usar token prestes a vencer.
export const isExpired = (session: AuthSession) =>
  new Date(session.accessTokenExpirationDate).getTime() - 60_000 <= Date.now();

export const login = async (): Promise<AuthSession> => {
  const result = await authorize(authConfig);
  return {
    accessToken: result.accessToken,
    accessTokenExpirationDate: result.accessTokenExpirationDate,
    idToken: result.idToken,
    refreshToken: result.refreshToken,
  };
};

export const refreshSession = async (session: AuthSession): Promise<AuthSession> => {
  const result = await refresh(authConfig, { refreshToken: session.refreshToken });
  return {
    accessToken: result.accessToken,
    accessTokenExpirationDate: result.accessTokenExpirationDate,
    idToken: result.idToken || session.idToken,
    // Keycloak pode não rotacionar o refresh token
    refreshToken: result.refreshToken ?? session.refreshToken,
  };
};

// Encerra a sessão no Keycloak (end_session_endpoint), senão o cookie SSO
// do navegador faria o próximo login entrar direto sem pedir senha.
export const endSession = (session: AuthSession) =>
  logout(authConfig, { idToken: session.idToken, postLogoutRedirectUrl: REDIRECT_URL });

// --- Persistência (Keychain/Keystore) ---
// Cada token em uma chave: SecureStore avisa para valores > 2048 bytes e JWTs do Keycloak são grandes.
const KEYS = ['accessToken', 'accessTokenExpirationDate', 'idToken', 'refreshToken'] as const;
const storageKey = (k: string) => `auth.${k}`;

export const saveSession = async (session: AuthSession) => {
  await Promise.all(KEYS.map((k) => SecureStore.setItemAsync(storageKey(k), session[k])));
};

export const loadSession = async (): Promise<AuthSession | null> => {
  const values = await Promise.all(KEYS.map((k) => SecureStore.getItemAsync(storageKey(k))));
  if (values.some((v) => !v)) return null;
  const [accessToken, accessTokenExpirationDate, idToken, refreshToken] = values as string[];
  return { accessToken, accessTokenExpirationDate, idToken, refreshToken };
};

export const clearSession = async () => {
  await Promise.all(KEYS.map((k) => SecureStore.deleteItemAsync(storageKey(k))));
};
