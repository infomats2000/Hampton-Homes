const baseUrl = (process.env.SMOKE_BASE_URL || "https://infomats-realestate.web.app").replace(/\/$/, "");
const routes = ["/", "/sell", "/auctions", "/api/health"];
let failed = false;

for (const route of routes) {
  try {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual", signal: AbortSignal.timeout(20_000) });
    const ok = response.status >= 200 && response.status < 400;
    console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${route}`);
    if (!ok) failed = true;
  } catch (error) {
    console.error(`FAIL ${route}: ${error instanceof Error ? error.message : String(error)}`);
    failed = true;
  }
}

if (failed) process.exitCode = 1;

