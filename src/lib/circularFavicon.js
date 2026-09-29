const GH_USER = 'RajHarsh03';
const FALLBACK_ICON = '/favicon.png';
const CACHE_KEY = 'gh_favicon_cache_v1';
const CACHE_TTL = 24 * 60 * 60 * 1000;

function applyFavicon(href) {
  document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((el) => el.remove());

  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.type = 'image/png';
  icon.href = href;
  document.head.appendChild(icon);

  const apple = document.createElement('link');
  apple.rel = 'apple-touch-icon';
  apple.href = href;
  document.head.appendChild(apple);
}

function readCache() {
  try {
    const data = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!data?.dataUrl) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(dataUrl, avatarUrl) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      dataUrl,
      avatarUrl,
      savedAt: Date.now(),
    }));
  } catch {
    /* quota / private mode */
  }
}

function drawCircular(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('avatar load failed'));
    img.src = src;
  });
}

async function resolveAvatarUrl() {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}`);
    if (res.ok) {
      const data = await res.json();
      if (data.avatar_url) {
        return `${data.avatar_url}${data.avatar_url.includes('?') ? '&' : '?'}s=128`;
      }
    }
  } catch {
    /* fall through */
  }
  return `https://github.com/${GH_USER}.png?size=128`;
}

async function fetchCircularIcon(avatarUrl) {
  try {
    return await drawCircular(avatarUrl);
  } catch {
    return drawCircular(`https://avatars.githubusercontent.com/${GH_USER}?size=128`);
  }
}

export async function setLiveCircularFavicon() {
  const cached = readCache();
  const cacheFresh = cached && Date.now() - cached.savedAt < CACHE_TTL;

  if (cached?.dataUrl) applyFavicon(cached.dataUrl);

  try {
    const avatarUrl = await resolveAvatarUrl();

    if (cacheFresh && cached.avatarUrl === avatarUrl) return;

    const dataUrl = await fetchCircularIcon(avatarUrl);
    applyFavicon(dataUrl);
    writeCache(dataUrl, avatarUrl);
  } catch {
    if (cached?.dataUrl) applyFavicon(cached.dataUrl);
    else applyFavicon(FALLBACK_ICON);
  }
}
