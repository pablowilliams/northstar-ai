import { approveRun } from "@/lib/engine";
import { runs } from "@/lib/runtime-store";
import { z } from "zod";

const schema = z.object({ runId: z.string(), payloadHash: z.string().length(16) });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Invalid approval request" }, { status: 400 });
  const run = runs.get(parsed.data.runId); if (!run) return Response.json({ error: "Run not found" }, { status: 404 });
  try { const approved = approveRun(run, parsed.data.payloadHash); runs.set(approved.runId, approved); return Response.json(approved); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Approval rejected" }, { status: 409 }); }
}
