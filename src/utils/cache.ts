// utils/cache.ts
let cachedData: unknown = null;
let lastFetched = 0;

export async function getCachedPortfolioData(): Promise<unknown> {
  const now = Date.now();
  const cacheTTL = 60 * 5000; // 5 minutes

  if (cachedData && now - lastFetched < cacheTTL) {
    return cachedData;
  }

  async function safeFetch(url: string, expectArray: boolean = false): Promise<unknown> {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return await res.json();
    } catch (e) {
      console.error(`Cache fetch error for ${url}:`, e);
      return expectArray ? [] : {};
    }
  }

  const [personal, projects, experience, education, skills, certifications, social] = await Promise.all([
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile`, false),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/projects`, true),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/experience`, true),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/education`, true),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/skills`, true),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/certifications`, true),
    safeFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/social-links`, true),
  ]);

  cachedData = { personal, projects, experience, education, skills, certifications, social };
  lastFetched = now;

  return cachedData;
}
