import { pingDb } from "@/lib/db/client";
import { createHealthHandler } from "./handler";

export const dynamic = "force-dynamic";
export const GET = createHealthHandler(pingDb);
