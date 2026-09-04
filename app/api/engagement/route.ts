import { engagement, roadmap, risks, stakeholders } from "@/lib/data";

export async function GET() { return Response.json({ engagement, stakeholders, roadmap, risks }); }
