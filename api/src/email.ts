import type { Bindings } from "./types";

/**
 * Send the magic-link email via Resend. In dev (no RESEND_API_KEY) we just log
 * the link to the worker console so you can click it without email setup.
 */
export async function sendMagicLink(
  env: Bindings,
  to: string,
  link: string
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.log("\n==============================================");
    console.log(`[dev] Magic link for ${to}:`);
    console.log(link);
    console.log("==============================================\n");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [to],
      subject: "Your Hatchling dashboard login link",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#111">Sign in to Hatchling</h2>
          <p style="color:#444">Click the button below to log into your dashboard. This link expires in 15 minutes and can only be used once.</p>
          <p style="margin:28px 0">
            <a href="${link}" style="background:#111;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600">Log in to Hatchling</a>
          </p>
          <p style="color:#999;font-size:13px">If you didn't request this, you can ignore this email.</p>
        </div>`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error ${res.status}: ${text}`);
  }
}
