# Integración PEY (CoDi) · contrato verificado

Fuentes: `pey-openapi.json` (versión 2026-10-20) y capturas de docs.pey.mx (webhooks). Lo marcado *(sin verificar)* no está en esas fuentes.

## Reglas
- Base `https://api.pey.mx`, `Authorization: Bearer <PEY_API_KEY>`. Solo desde el backend.
- **No hay sandbox**: la llave es de producción. Pruebas reales solo con $0.01 MXN (no se devuelven). Las pruebas automatizadas usan un fake marcado, nunca la API real.
- Variables: ver `.env.example`.

## Endpoints que usamos
| Qué | Endpoint | Notas |
|---|---|---|
| Registrar CLABE del comercio | `POST /bank-account` | Devuelve el `bankAccountId` (ULID) que piden los cobros |
| Cobro con QR | `POST /codi/qr` | `amount` obligatorio. `expiration` en segundos (mín. 360, 0 = sin expiración). `numRef` ≤7 dígitos. `generateImage:true` devuelve `qrImage` (PNG base64). `metadata` ≤50 pares. Responde 201 `{id, qrString, qrImage}` (`id` = IDC de Banxico) |
| Cobro Push | `POST /codi/pn` | `amount` y `phoneNumber` (10 dígitos) obligatorios. Responde 200 `{transactionId, codiId}` |
| Estado de un pago | `GET /transaction/{id}` | `status`: solo `PENDING` o `PAID` |
| Pagos de un QR | `GET /transaction/codi/qr/{id}` | Hasta 20, paginado con `nextToken` |

Errores: `{error:{message,type,requestId}}`. Guardar `requestId` en la auditoría.

## Estados propios
PEY solo da `PENDING`/`PAID`. Nosotros derivamos `expirado` (sigue `PENDING` y pasó `expiration`) y `rechazado` *(sin verificar si PEY lo expone)*.

## Webhook `codi.qr.payment_received`
Se dispara al recibir un pago en un QR creado por la API. Payload:
`amount`, `apiKeyId`, `bankAccountId`, `codiQrId`, `concept`, `datePaid` (Unix en segundos), `metadata`, `numRef`, `transactionId`, `type`.

- Firma: Standard Webhooks (paquete `standardwebhooks`). Se valida con el secreto `PEY_WEBHOOK_SECRET` (`whsec_...`) y el **cuerpo crudo como string**, nunca el JSON ya parseado.
- Idempotencia: el encabezado `webhook-id` es la clave. Guardarlo y ignorar repetidos.
- Verificar siempre con `GET /transaction/{transactionId}` antes de marcar la venta como pagada.
- Historial de entregas: portal → Desarrollador → engrane de la API key → "Webhook Logs".
- Pendiente de verificar: webhook del Push (sección Webhooks → CoDi tiene 2 artículos, falta ver el segundo) y si `metadata` que enviamos vuelve en `metadata.externalMetadata`.
