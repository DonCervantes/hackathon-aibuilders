# IDEA · Handle

**Una línea:** Handle le permite a un changarro cobrar con CoDi al instante, sin terminal ni comisiones de tarjeta, y premia a sus clientes frecuentes con puntos.

**Frase de marca:** *Toda tu operación, en una sola mano.*

## El caso real
Una tortillería o una taquería cobra hoy en efectivo o con una terminal que le descuenta comisión. Con Handle el comerciante escribe el monto, le muestra un QR de CoDi al cliente, y en segundos la pantalla confirma el pago (confirmado por PEY, no por el celular del cliente). Si el cliente dio su teléfono, gana puntos con ese comercio.

## El momento "wow" (lo que ve el jurado)
1. El comerciante entra, registra su negocio y su CLABE (onboarding con KYB sencillo).
2. Cobra $0.01 real: aparece el QR, un celular lo paga, la pantalla pasa a "Pagado" por el webhook firmado de PEY.
3. El dashboard muestra la venta, los puntos del cliente y un resumen del día escrito por OpenAI a partir de ventas reales.

## Uso de OpenAI (el reto lo pide)
- **Onboarding inteligente:** el comerciante describe su negocio en una frase y OpenAI devuelve, en JSON validado, los módulos que le convienen. Con respaldo por reglas si la API falla.
- **Resumen del día:** texto en español sencillo con las ventas reales del día.
Nada de datos inventados: el resumen se genera solo de pagos confirmados.

## Números
Ninguno verificado todavía. No se pondrá ninguna cifra de mercado en la landing sin fuente.

## Alcance del MVP (se cobra, se confirma, se premia)
Dentro: auth con roles, onboarding KYB, cobro por QR CoDi, webhook con verificación e idempotencia, puntos con ledger, dashboard, panel de aprobación de comercios, función de OpenAI, landing.
Fuera, como roadmap documentado: mapa de comercios, Push CoDi (webhook sin verificar), inventario, facturación, analítica avanzada.

## Reglas que no se rompen
Sin pagos simulados presentados como reales · confirmación solo en backend · llaves solo en el servidor · pruebas reales únicamente de $0.01 MXN · sin cifras ni alianzas inventadas.
