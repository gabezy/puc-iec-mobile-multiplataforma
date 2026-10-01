# ADR-01: Stack Mobile para plataforma de Surf
---

## Status

`Proposto`

**Data:** 2026-06-27
**Autor:** Gabriel Moreira da Silva de Faria

## Contexto

- **Produto:** app de surf que registra sessões no smartwatch (ondas, velocidade, trilha GPS) e mostra previsão de ondas e marés, no estilo Dawn Patrol / Surfline Sessions
- **Plataforma**: Aplicativo nativo para Apple Watch + iPhone e Wear OS + Android. Garmin fica fora do MVP (exige Monkey C, sem reaproveitamento)
- **Operação offline**: na água não há internet. GPS e sensores funcionam sem rede; os dados são gravados localmente e sincronizados depois
- **Escala alvo:** ~10 mil usuários ativos no primeiro ano, sem necessidade de tempo real
- **Time:** 3–4 devs mobile, MVP em ~6 meses
- **Restrição:** watchOS não tem suporte oficial a Flutter/RN e bloqueia sockets de baixo nível (MQTT inviável). Sessão de treino exige APIs nativas do dispositvo (HealthKit/Health Services). O app deve funcionar offline, utilizando GPS e sensores funcionam sem rede; os dados são gravados localmente e sincronizados depois.

## Decisão

Adotaremos Kotlin Multiplatform (KMP) para a lógica compartilhada (detecção de ondas, cálculo de marés, rede, cache) com UI e integrações nativas nos relógios (SwiftUI no watchOS, Compose for Wear OS), arquitetura offline-first e sincronização em lote via HTTPS/REST com push notification.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **KMP + UI nativa** (escolhida) | Lógica crítica escrita 1 vez e roda no watchOS e Wear OS; desempenho nativo; acesso total a sensores e APIs de treino | Duas UIs no relógio; time precisa de Kotlin e Swift (integração do KMP com WatchOS ainda em Beta); ecossistema mais novo |
| Flutter | Uma base de UI no celular; produtividade alta | Sem suporte oficial a watchOS; no Wear OS gasta mais bateria e ainda exige código nativo para sensores |
| React Native | Ecossistema grande; bom para time com background web | Sem watchOS; runtime JS pesa em sessões longas com GPS; relógio vira app nativo separado |
| Nativo puro (Swift + Kotlin) | Máximo desempenho e UX; sem camada extra | Algoritmo de ondas e marés duplicado em 2 linguagens; risco de resultados divergentes; mais custo |
| PWA | Uma base web; sem loja de app; deploy instantâneo | Não roda em smartwatch; sem acesso a HealthKit/Health Services; GPS em segundo plano limitado, sobretudo no iOS |
| Sync via MQTT | Tempo real, eficiente em rede instável | Bloqueado no watchOS; sem necessidade de tempo real no produto; exige broker |

 
**Positivas:**
 
- Detecção de ondas e marés idênticas em todas as plataformas, testadas uma vez.
- App funciona sem internet na água; nenhum dado depende de conexão durante a sessão.
- Melhor bateria possível no relógio, sem runtime extra.
- Backend simples (REST + fila), fácil de escalar e operar.

**Negativas:**

- Duas UIs de relógio e duas integrações de saúde para manter.
- Curva de aprendizado em KMP/Kotlin Native e build mais complexo no iOS.
- Compose Multiplatform não cobre watchOS: nenhuma UI de relógio é compartilhada.
- Sem recursos ao vivo sem nova decisão.
- Garmin exige projeto separado em Monkey C.

## Referências
 
- [JetBrains. *Kotlin Multiplatform* — documentação oficial](https://kotlinlang.org/docs/multiplatform/kmp-overview.html).
- [Apple. *TN3135: Low-level networking on watchOS* — nota técnica sobre restrições de socket no relógio](https://developer.apple.com/documentation/technotes/tn3135-low-level-networking-on-watchos).
- [Apple. *Documentação do HealthKit*](https://developer.apple.com/documentation/healthkit)
- [Google. *Health Services on Wear OS* — documentação oficial](https://developer.android.com).