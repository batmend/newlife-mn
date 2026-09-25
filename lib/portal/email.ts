import "server-only";
import type { DailyWord } from "@/lib/supabase/types";
import { formatDateMn } from "./dates";

export const SITE_URL = "https://newlife.mn";
const FROM = "Шинэ Амь Христийн Чуулган <noreply@newlife.mn>";
const EXCERPT_LENGTH = 700;

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraphs(text: string) {
  return escapeHtml(text).replace(/\r?\n/g, "<br />");
}

function excerpt(text: string) {
  const trimmed = text.trim();
  if (trimmed.length <= EXCERPT_LENGTH) return { text: trimmed, cut: false };
  const cut = trimmed.slice(0, EXCERPT_LENGTH);
  return { text: `${cut.slice(0, cut.lastIndexOf(" ") > 400 ? cut.lastIndexOf(" ") : EXCERPT_LENGTH)}…`, cut: true };
}

export function dailyWordEmail(word: Pick<DailyWord, "publish_date" | "title" | "scripture_ref" | "scripture_text" | "body">) {
  const url = `${SITE_URL}/portal/word/${word.publish_date}`;
  const date = formatDateMn(word.publish_date);
  const body = excerpt(word.body);

  const html = `<div style="margin:0;padding:32px 16px;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1c1c1f">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#b8924f">Өдрийн үг · ${escapeHtml(date)}</p>
    <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3">${escapeHtml(word.title)}</h1>
    <div style="margin:0 0 20px;padding:14px 18px;border-left:3px solid #d4b06a;background:#faf7f0;border-radius:8px">
      ${word.scripture_text ? `<p style="margin:0 0 8px;font-size:16px;line-height:1.6;font-style:italic">${paragraphs(word.scripture_text)}</p>` : ""}
      <p style="margin:0;font-size:13px;font-weight:bold;color:#b8924f">${escapeHtml(word.scripture_ref)}</p>
    </div>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7">${paragraphs(body.text)}</p>
    <p style="margin:0 0 24px">
      <a href="${url}" style="display:inline-block;background:#1c1c1f;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:999px">${body.cut ? "Үргэлжлүүлэн унших" : "Порталд бодлоо тэмдэглэх"}</a>
    </p>
    <p style="margin:0;font-size:12px;line-height:1.6;color:#6b6b72">
      Шинэ Амь Христийн Чуулганы гишүүдийн портал. Өглөөний имэйлийг
      <a href="${SITE_URL}/portal/profile" style="color:#6b6b72">профайл</a> хэсгээс унтрааж болно.
    </p>
  </div>
</div>`;

  const text = [
    `Өдрийн үг · ${date}`,
    "",
    word.title,
    "",
    word.scripture_text ? `${word.scripture_text}\n— ${word.scripture_ref}` : word.scripture_ref,
    "",
    body.text,
    "",
    `Унших: ${url}`,
    "",
    `Өглөөний имэйлийг унтраах: ${SITE_URL}/portal/profile`,
  ].join("\n");

  return { subject: `Өдрийн үг: ${word.title}`, html, text };
}

type Message = { to: string; subject: string; html: string; text: string };

/** Sends up to 100 messages per Resend batch call. Returns how many were accepted. */
export async function sendEmails(messages: Message[], idempotencyPrefix: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  let accepted = 0;
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `${idempotencyPrefix}-${i / 100}`,
      },
      body: JSON.stringify(
        chunk.map((m) => ({
          from: FROM,
          to: [m.to],
          subject: m.subject,
          html: m.html,
          text: m.text,
          headers: { "List-Unsubscribe": `<${SITE_URL}/portal/profile>` },
        })),
      ),
    });
    if (res.ok) {
      accepted += chunk.length;
    } else {
      console.error("resend batch failed", res.status, await res.text());
    }
  }
  return accepted;
}
