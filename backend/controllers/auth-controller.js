// controllers/auth-controller.js
require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

async function sendSignupWebhook(user) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  const payload = {
    uid: user._id,
    email: user.email,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("n8n Webhook Status:", res.status);
  } catch (err) {
    console.error("Error calling n8n webhook:", err);
  }
}

module.exports = { sendSignupWebhook };
