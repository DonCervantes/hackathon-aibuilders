export type Ping = () => Promise<void>;

export function createHealthHandler(ping: Ping) {
  return async (): Promise<Response> => {
    try {
      await ping();
      return Response.json({ ok: true, db: true });
    } catch {
      return Response.json({ ok: false, db: false }, { status: 503 });
    }
  };
}
