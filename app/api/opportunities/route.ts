import { opportunities } from "@/lib/data";
import { scoreOpportunity } from "@/lib/scoring";
import { z } from "zod";

const bodySchema = z.object({ id: z.string(), title: z.string(), function: z.string(), problem: z.string(), value: z.number().min(1).max(5), feasibility: z.number().min(1).max(5), evidence: z.number().min(1).max(5), risk: z.number().min(1).max(5), effortWeeks: z.number().positive(), annualValueGbp: z.number().nonnegative() });
export async function GET() { return Response.json({ opportunities, methodology: { value: 0.32, feasibility: 0.26, evidence: 0.22, controllableRisk: 0.20 } }); }
export async function POST(request: Request) { const parsed = bodySchema.safeParse(await request.json()); if (!parsed.success) return Response.json({ error: "Invalid opportunity", issues: parsed.error.issues }, { status: 400 }); return Response.json(scoreOpportunity(parsed.data), { status: 201 }); }
