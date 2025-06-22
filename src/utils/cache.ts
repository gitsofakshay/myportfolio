// utils/cache.ts
let cachedData: any = null;
let lastFetched = 0;

export async function getCachedPortfolioData(): Promise<any> {
  const now = Date.now();
  const cacheTTL = 60 * 5000; // 5 minutes

  if (cachedData && now - lastFetched < cacheTTL) {
    return cachedData;
  }

  async function safeFetch(url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return await res.json();
    } catch (e) {
      console.error(`Cache fetch error for ${url}:`, e);
      return Array.isArray(url) ? [] : {};
    }
  }

  const [personal, projects, experience, education, skills, certifications, resume, social] = await Promise.all([
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/experience`),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/education`),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/skills`),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/certifications`),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/resume`),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/social-links`),
  ]);

  cachedData = { personal, projects, experience, education, skills, certifications, resume, social };
  lastFetched = now;

  return cachedData;
}
