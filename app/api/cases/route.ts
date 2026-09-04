import { cases } from "@/lib/data";
export async function GET() { return Response.json({ cases, disclosure: "Synthetic demonstration records; no personal data." }); }
