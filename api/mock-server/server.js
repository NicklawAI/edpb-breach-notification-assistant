#!/usr/bin/env node
/* Minimal zero-dependency mock of the breach-notification ingestion endpoint.
 * For local testing of the OpenAPI contract. Apache-2.0.
 * Usage: node api/mock-server/server.js  (listens on :8787)
 */
const http = require("http");
const crypto = require("crypto");
const seen = new Set();
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/v1/breach-notifications") {
    const idem = req.headers["idempotency-key"];
    if (!idem) { res.writeHead(400); return res.end(JSON.stringify({ error: "Idempotency-Key required" })); }
    if (seen.has(idem)) { res.writeHead(409); return res.end(JSON.stringify({ error: "duplicate" })); }
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try { JSON.parse(body || "{}"); } catch (e) { res.writeHead(400); return res.end(JSON.stringify({ error: "invalid JSON" })); }
      seen.add(idem);
      const id = "BN-" + crypto.randomBytes(6).toString("hex");
      res.writeHead(201, { "content-type": "application/json" });
      res.end(JSON.stringify({ notification_id: id, received_at: new Date().toISOString(), status: "received" }));
    });
  } else { res.writeHead(404); res.end(JSON.stringify({ error: "not found" })); }
});
server.listen(8787, () => console.log("Mock breach-notification API on http://localhost:8787/api/v1/breach-notifications"));
