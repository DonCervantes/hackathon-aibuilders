# PROJECT · DevDay Exchange Community Hackathon: Mexico City (sprint mode)

> Filled in by `/uak-setup` with the human at minute 0. uak reads the flat fields of the last block from
> the remote `main`, so a stale worktree can never change permissions.

## Event
| Field | Value |
|---|---|
| Event / challenge | DevDay Exchange Community Hackathon: Mexico City (AI Builders México + UTOPÍAS, SEDECO, pey) · https://luma.com/f755f0k6 · reto: herramientas de bien público con OpenAI y CoDi vía API de pey |
| Start | 2026-11-07 16:00 America/Mexico_City (el evento presencial fue 10:00-16:00 en UTOPÍA Coyoacán; este es el inicio de nuestro reloj de build) |
| Official deadline | 2026-11-08 13:00 America/Mexico_City · envío por correo a hola@aibuilders.lat (el portal del evento también lo menciona: confirmar cuál es el canal oficial) |
| Freeze | Dom 09:51 → `Freeze-Epoch` (ver abajo) |
| Clean rehearsal / plan B | 2026-11-08 11:00 |
| Internal submission | 2026-11-08 12:00 |
| Humans | Dylan: arquitectura, auth y base de datos · Isaias: integración PEY/CoDi · Javier: frontend del dashboard del comercio · Sebastian: landing y documentación · submission owner: por definir (empieza T−8 h) |
| Agents | por definir, máx. 2 por humano |
| Machines | laptops · puertos tomados: por definir |

## Official rubric (weights sum to 100)
**Sin verificar.** El evento dice que los criterios "se confirmarán con el equipo del programa". Hasta tenerlos, se prioriza: (1) flujo real de cobro CoDi funcionando de punta a punta, (2) utilidad para comercios de barrio, (3) demo clara. No inventar pesos.

| ID | Criterion | Weight | Evidence in the demo |
|---|---|---:|---|
| C? | pendiente de confirmar con el programa | ? | ? |

## Event rules
| Topic | Confirmed rule | Source |
|---|---|---|
| AI use / prior code | El reto pide usar OpenAI y CoDi (pey). Código previo (repo handle-finanzas-central): decidimos empezar en limpio. Sin verificar si hay regla sobre código previo | Luma |
| Data and licenses | API de pey gratuita y de código abierto. Sin sandbox: la llave es de producción, probar solo con $0.01 MXN (no se devuelve). CLABEs de prueba de las organizadoras: no se guardan en el repo | Luma, anuncio PEY, docs.pey.mx |
| Format and video limits | Envío: dom 8 nov 13:00. Ganadores del jurado: lun 9 nov por la mañana, luego voto de comunidad. Premios: créditos OpenAI $500/$300/$200 (anuncio) y 10 boletos al DevDay Exchange (Luma). Formato de demo/video: sin verificar | Luma, anuncios |

## Plan B
- Un video del flujo completo en `docs/demo.mp4` (v1 a T−50%, final a T−2 h). Usarlo si falla la red, el wifi del lugar o la API de pey (no hay sandbox).

## Executable config
A human sets `yes`. A missing field means `no`.

```text
Mode: sprint
Backlog-Proposed-Epoch: 0
Backlog-Approved: yes
Autonomy: yes
Auto-Merge: yes
Review-Mode: claims
Plan-Channel: claims
Freeze-Epoch: 1794153060
Lease-Seconds: 2700
Review-Lease-Seconds: 14400
Events-Per-Session: 100
Checkpoint-Percent: 60
Merge-Lease-Seconds: 1800
Merge-Wait-Seconds: 180
Merge-Adopt-Seconds: 300
Max-Parallel-Subagents: 4
Opus-Subagents-Per-Session: 2
Pace: auto
Subagent-Hard-Cap: 6
Strong-Hard-Cap: 3
Subagents-Per-Session: 40
Subagents-Per-Machine: 8
Subagent-Burst-Per-Minute: 6
Max-Worktree-Agents: 6
Blackbox: on
Additive-Paths: -
UI-Paths: app/, components/, src/app/, src/components/
Test-First: yes
```
