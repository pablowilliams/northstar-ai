import { findCase, runWorkflow } from "@/lib/engine";
import { runs } from "@/lib/runtime-store";
import { z } from "zod";

const schema = z.object({ caseId: z.string().min(1) });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "A valid caseId is required" }, { status: 400 });
  const customerCase = findCase(parsed.data.caseId);
  if (!customerCase) return Response.json({ error: "Case not found" }, { status: 404 });
  const run = runWorkflow(customerCase); runs.set(run.runId, run); return Response.json(run, { status: 201 });
}
