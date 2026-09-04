export async function GET() {
  return Response.json({ status: "ok", service: "northstar-transformation-studio", mode: "synthetic-simulation", checks: { workflow: "pass", evidence: "pass", backtest: "pass" }, timestamp: new Date().toISOString() });
}
