import fetch from "node-fetch";

fetch("https://hubcredo.app.n8n.cloud/webhook/2bfdc577-40a2-45a9-b064-fc3085fe8dd4", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uid: "12345",
    email: "hello@example.com",
    createdAt: "2025-01-01"
  }),
})
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
