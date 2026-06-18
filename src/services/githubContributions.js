/**
 * githubContributions.js
 * Fetches the last-year contribution data from the jogruber proxy API.
 */

export const GH_USER = 'RajHarsh03';

/**
 * @returns {Promise<{ contributions: Array<{date:string,count:number}>, total: number|null }>}
 */
export async function fetchContributions() {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`
  );
  if (!res.ok) throw new Error('Contributions API ' + res.status);
  const data = await res.json();
  const total = data.total?.lastYear ?? Object.values(data.total || {}).pop() ?? null;
  return { contributions: data.contributions || [], total };
}
