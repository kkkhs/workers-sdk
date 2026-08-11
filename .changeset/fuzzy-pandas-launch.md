---
"@cloudflare/workers-utils": minor
"@cloudflare/deploy-helpers": minor
"wrangler": minor
---

Add namespace-backed Container Instance Group configuration

Wrangler now accepts `type: "instance"` entries in `containers` and configures them through the Containers API after the Worker upload resolves their Durable Object namespace IDs. Entries without `type` continue to use the existing application-backed deployment flow.
