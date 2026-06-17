# Open API - breach notification submission (M2M)

`openapi.yaml` - OpenAPI 3.1 spec for submitting an EDPB breach-notification payload from a controller's management system to a supervisory authority. The `application/json` body conforms to `breach-notification.schema.json` (the same schema the offline tool exports).

**Security-by-design (GDPR Art. 32):** mutual TLS · OAuth2 client-credentials (controller-bound) · HTTP Message Signatures (RFC 9421, non-repudiation) · idempotency keys · rate limiting · immutable audit log · server-side schema validation · API versioning.

**Mock server:** `node mock-server/server.js` starts a zero-dependency local mock on `:8787` for testing the contract offline.

This is a **reference / proposal** specification accompanying the EDPB consultation - not an active endpoint.
