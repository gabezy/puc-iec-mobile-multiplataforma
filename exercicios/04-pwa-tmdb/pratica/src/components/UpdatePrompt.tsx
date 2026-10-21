// src/components/UpdatePrompt.tsx
// ✅ AVALIATIVO — TODO 3 (parte 2)
//
// O app já renderiza <UpdatePrompt /> em App.tsx. Seu trabalho é fazer ele funcionar.
//
// Use o hook do vite-plugin-pwa:
//   import { useRegisterSW } from 'virtual:pwa-register/react';
//
// Ele devolve dois estados (cada um é um par [valor, setter]) e uma função:
//   - offlineReady  → true quando o app terminou de ser cacheado ("já funciona offline")
//   - needRefresh   → true quando existe uma NOVA versão esperando (SW em "waiting")
//   - updateServiceWorker(true) → ativa a nova versão e recarrega a página
//
// O que o componente deve mostrar:
//   1. offlineReady  → aviso "App pronto para uso offline" + botão para dispensar (setOfflineReady(false))
//   2. needRefresh   → aviso "Nova versão disponível" + botão "Atualizar" (updateServiceWorker(true))
//                      + botão "Depois" que dispensa o aviso (setNeedRefresh(false))
//   3. nenhum dos dois → não renderiza nada (return null)
//
// ⚠️ Só funciona com registerType: 'prompt' (TODO 3, parte 1) e no BUILD (npm run build && npm run preview).

import { useRegisterSW } from "virtual:pwa-register/react";

export function UpdatePrompt() {
  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
  const [isOfflineReady, setOfflineReady] = offlineReady;
  const [isNeedRefresh, setNeedRefresh] = needRefresh;

  if (isOfflineReady) {
    return (
      <div className="update-prompt">
        <p>App pronto para uso offline</p>
        <button onClick={() => setOfflineReady(false)}>Dispensar</button>
      </div>
    );
  }

  if (isNeedRefresh) {
    return (
      <div className="update-prompt">
        <p>Nova versão disponível</p>
        <button onClick={() => updateServiceWorker(true)}>Atualizar</button>
        <button onClick={() => setNeedRefresh(false)}>Depois</button>
      </div>
    );
  }

  return null;
}
