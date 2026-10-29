/**
 * api/contact.js
 * Sends contact-form messages through Resend.
 * Env vars:
 *   RESEND_API_KEY      (required)
 *   CONTACT_TO_EMAIL    (default rajharsh.devx@gmail.com)
 *   CONTACT_FROM_EMAIL  (default 'Portfolio <contact@harshx.in>')
 *   KV_REST_API_URL / KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *     (optional, enables rate limiting)
 */
import crypto from 'crypto';

const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_TO = 'rajharsh.devx@gmail.com';
const DEFAULT_FROM = 'Portfolio <contact@harshx.in>';

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;
const RATE_LIMIT = 3;
const RATE_WINDOW_S = 3600;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getRedisConfig() {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    return url && token ? { url, token } : null;
}

async function redisCommand(config, command) {
    const response = await fetch(config.url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
    });
    if (!response.ok) throw new Error(`Redis request failed (${response.status})`);
    const data = await response.json();
    return data.result;
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
    if (Array.isArray(forwarded) && forwarded.length) return forwarded[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

function isProduction() {
    return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}

function getAllowedHosts() {
    const hosts = new Set(['www.harshx.in', 'harshx.in', 'portfolio-eight-puce-74.vercel.app']);
    if (process.env.VERCEL_URL) hosts.add(process.env.VERCEL_URL.toLowerCase());
    return hosts;
}

function isAllowedOrigin(headers) {
    const source = headers.origin || headers.referer;
    if (typeof source !== 'string' || !source) return false;
    try {
        const url = new URL(source);
        if (getAllowedHosts().has(url.host.toLowerCase())) return true;
        if (!isProduction() && ['localhost', '127.0.0.1'].includes(url.hostname)) return true;
        return false;
    } catch {
        return false;
    }
}

function parseBody(body) {
    if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return body;
    const text = Buffer.isBuffer(body) ? body.toString('utf8') : body;
    if (typeof text !== 'string' || !text) return null;
    try {
        const parsed = JSON.parse(text);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

function clean(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function validate(data) {
    const name = clean(data.name);
    const email = clean(data.email);
    const message = clean(data.message);
    if (!name || name.length > MAX_NAME) return { field: 'name' };
    if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) return { field: 'email' };
    if (!message || message.length > MAX_MESSAGE) return { field: 'message' };
    return { value: { name, email, message } };
}

async function isRateLimited(ip) {
    const config = getRedisConfig();
    if (!config) return false;
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 24);
    const key = `contact_rl:${ipHash}`;
    try {
        const count = Number(await redisCommand(config, ['INCR', key]));
        if (count === 1) await redisCommand(config, ['EXPIRE', key, String(RATE_WINDOW_S)]);
        return count > RATE_LIMIT;
    } catch (error) {
        console.error('[contact] Rate limit check failed:', error.message);
        return false;
    }
}

function buildEmail({ name, email, message }) {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');
    const received = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short',
        year: 'numeric', hour: 'numeric', minute: '2-digit',
    });
    const refId = (globalThis.crypto?.randomUUID?.() || `${Date.now()}`).slice(0, 8).toUpperCase();
    const words = message.trim().split(/\s+/).filter(Boolean).length;
    const replyHref = `mailto:${safeEmail}?subject=${encodeURIComponent('Re: Your message to Harsh Raj')}`;

    const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
    const mono = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";
    // Zero-width space stops Gmail from auto-linking plain "harshx.in" text.
    const brand = 'harshx&#8203;.in';
    const initial = escapeHtml((name.trim()[0] || '?').toUpperCase());
    const label = `font-family:${mono};font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#8a8a90;`;

    // Table layout + inline styles: the only reliable way across Gmail, Outlook and Apple Mail.
    const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>New message from ${safeName}</title>
</head>
<body style="margin:0;padding:0;background:#f3f3f5;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${safeName}: ${escapeHtml(message.slice(0, 120))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f5;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

      <!-- Brand bar -->
      <tr><td style="padding:0 4px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-family:${font};font-size:15px;font-weight:700;letter-spacing:-0.2px;color:#111113;">Harsh Raj</td>
          <td align="right" style="${label}">${brand}</td>
        </tr></table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#ffffff;border:1px solid #e7e7ea;border-radius:14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

          <!-- Heading -->
          <tr><td style="padding:32px 36px 0;font-family:${font};">
            <div style="${label}">New inquiry</div>
            <h1 style="margin:10px 0 0;font-family:${font};font-size:23px;line-height:1.3;font-weight:700;letter-spacing:-0.4px;color:#111113;">New message from ${safeName}</h1>
            <div style="margin-top:6px;font-size:13px;color:#8a8a90;">${escapeHtml(received)} IST</div>
          </td></tr>

          <!-- Sender + reply -->
          <tr><td style="padding:24px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeeef0;border-bottom:1px solid #eeeef0;">
              <tr>
                <td width="52" valign="middle" style="padding:16px 14px 16px 0;">
                  <div style="width:40px;height:40px;line-height:40px;border-radius:50%;background:#111113;color:#ffffff;text-align:center;font-family:${font};font-size:16px;font-weight:700;">${initial}</div>
                </td>
                <td valign="middle" style="padding:16px 0;font-family:${font};">
                  <div style="font-size:15px;font-weight:600;color:#111113;line-height:1.35;">${safeName}</div>
                  <div style="font-size:13px;color:#6b6b72;line-height:1.5;">${safeEmail}</div>
                </td>
                <td align="right" valign="middle" style="padding:16px 0 16px 12px;white-space:nowrap;">
                  <a href="${replyHref}" style="display:inline-block;padding:8px 16px 8px 15px;background:#111113;border-radius:999px;font-family:${font};font-size:13px;font-weight:600;line-height:18px;letter-spacing:0.1px;color:#ffffff;text-decoration:none;mso-padding-alt:0;">Reply<span style="padding-left:6px;color:#a1a1aa;font-weight:500;">&#8599;</span></a>
                </td>
              </tr>
            </table>
          </td></tr>

          <!-- Message -->
          <tr><td style="padding:24px 36px 34px;font-family:${font};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="${label}padding-bottom:10px;">Message</td>
              <td align="right" style="font-family:${mono};font-size:11px;color:#a0a0a6;padding-bottom:10px;">${words} ${words === 1 ? 'word' : 'words'}</td>
            </tr></table>
            <div style="padding:20px 22px;background:#f8f8fa;border-radius:10px;font-size:15px;line-height:1.75;color:#1d1d20;word-break:break-word;">${safeMessage}</div>
          </td></tr>

        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:20px 8px 0;font-family:${font};font-size:12px;line-height:1.65;color:#8a8a90;text-align:center;">
        Reply to this email to respond to ${safeName} directly.<br>
        Sent from the contact form on <a href="https://www.harshx.in" style="color:#6b6b72;text-decoration:underline;">${brand}</a> &middot; Ref ${refId}
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

    const text = [
        `NEW MESSAGE FROM ${name.toUpperCase()}`,
        `${received} IST`,
        '',
        `From: ${name} <${email}>`,
        '',
        'MESSAGE',
        '-------',
        message,
        '-------',
        '',
        `Reply to this email to respond to ${name} directly.`,
        `Ref ${refId}`,
    ].join('\n');
    return {
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
        reply_to: email,
        subject: `New message from ${name} · harshx.in`,
        text,
        html,
        // Unique ID keeps Gmail from collapsing separate messages into one thread.
        headers: { 'X-Entity-Ref-ID': refId },
    };
}
/**
 * Core logic shared by the Vercel handler and the Vite dev middleware.
 * @param {unknown} body  Parsed object, JSON string, or Buffer.
 * @param {{ headers: object, ip: string }} meta
 * @returns {Promise<{ status: number, body: object }>}
 */
export async function sendContactMessage(body, meta = {}) {
    const headers = meta.headers || {};
    if (!isAllowedOrigin(headers)) return { status: 403, body: { error: 'forbidden' } };

    const data = parseBody(body);
    if (!data) return { status: 400, body: { error: 'invalid', field: 'body' } };

    // Honeypot: bots fill hidden fields. Pretend success without sending.
    if (clean(data.website)) return { status: 200, body: { ok: true } };

    const result = validate(data);
    if (!result.value) return { status: 400, body: { error: 'invalid', field: result.field } };

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { status: 503, body: { error: 'not_configured' } };

    if (await isRateLimited(meta.ip || 'unknown')) {
        return { status: 429, body: { error: 'rate_limited' } };
    }

    try {
        const response = await fetch(RESEND_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(buildEmail(result.value)),
        });
        if (!response.ok) {
            let detail = '';
            try {
                const err = await response.json();
                detail = err?.message || err?.name || '';
            } catch { /* ignore non-JSON error bodies */ }
            console.error(`[contact] Resend error ${response.status}${detail ? `: ${detail}` : ''}`);
            return { status: 502, body: { error: 'send_failed' } };
        }
        return { status: 200, body: { ok: true } };
    } catch (error) {
        console.error('[contact] Resend request failed:', error.message);
        return { status: 502, body: { error: 'send_failed' } };
    }
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return res.status(204).end();
    }
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const result = await sendContactMessage(req.body, {
        headers: req.headers,
        ip: getClientIp(req),
    });
    return res.status(result.status).json(result.body);
}
