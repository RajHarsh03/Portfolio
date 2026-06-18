import crypto from 'crypto';

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

function getDateKey() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

function getVisitorId(ip, userAgent, dateKey) {
    return crypto
        .createHash('sha256')
        .update(`${ip}|${userAgent}|${dateKey}`)
        .digest('hex')
        .slice(0, 24);
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
    if (Array.isArray(forwarded) && forwarded.length) return forwarded[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

async function getTotalVisits(config) {
    const total = await redisCommand(config, ['GET', 'visits:total']);
    return Number(total || 0);
}

async function recordVisit(config, req) {
    const dateKey = getDateKey();
    const visitorId = getVisitorId(getClientIp(req), req.headers['user-agent'] || 'unknown', dateKey);
    const dailyKey = `visit:${dateKey}:${visitorId}`;
    const wasNew = await redisCommand(config, ['SET', dailyKey, '1', 'EX', '172800', 'NX']);
    if (wasNew === 'OK') await redisCommand(config, ['INCR', 'visits:total']);
    return getTotalVisits(config);
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const config = getRedisConfig();
    if (!config) return res.status(503).json({ configured: false, total: null });

    try {
        if (req.method === 'GET') {
            const total = await getTotalVisits(config);
            return res.status(200).json({ configured: true, total });
        }
        if (req.method === 'POST') {
            const total = await recordVisit(config, req);
            return res.status(200).json({ configured: true, total, counted: true });
        }
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Visit counter error:', error);
        return res.status(500).json({ configured: true, total: null, error: 'Failed' });
    }
}
