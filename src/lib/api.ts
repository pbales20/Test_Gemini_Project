// src/lib/api.ts

const API_BASE_URL = 'https://api.collegefootballdata.com';

// Add the token in .env.local like NEXT_PUBLIC_CFBD_API_KEY
const getHeaders = () => {
  const apiKey = process.env.CFBD_API_KEY || process.env.NEXT_PUBLIC_CFBD_API_KEY;
  if (!apiKey) {
    console.warn('Warning: CFBD_API_KEY is not defined. API requests may fail.');
  }
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
  };
};

async function apiFetch<T>(endpoint: string, options: { revalidate?: number; errorPrefix?: string } = {}): Promise<T> {
  const { revalidate = 3600, errorPrefix = 'API Error' } = options;
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`${errorPrefix}: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`${errorPrefix}:`, error);
    throw error;
  }
}

export async function getTeams() {
  return apiFetch<any[]>(`/teams/fbs?year=${new Date().getFullYear()}`, {
    revalidate: 86400,
    errorPrefix: 'Error fetching teams',
  });
}

export async function getGames(season: number, seasonType: string = 'regular', team?: string) {
  let endpoint = `/games?year=${season}&seasonType=${seasonType}`;
  if (team) {
    endpoint += `&team=${encodeURIComponent(team)}`;
  }
  return apiFetch<any[]>(endpoint, {
    revalidate: 3600,
    errorPrefix: 'Error fetching games',
  });
}

export async function getLines(season: number, week?: number, seasonType: string = 'regular', team?: string) {
  let endpoint = `/lines?year=${season}&seasonType=${seasonType}`;
  if (week) endpoint += `&week=${week}`;
  if (team) endpoint += `&team=${encodeURIComponent(team)}`;

  return apiFetch<any[]>(endpoint, {
    revalidate: 3600,
    errorPrefix: 'Error fetching lines',
  });
}

/**
 * Admin function to sync CFBD data to our Supabase database.
 * This function fetches data and in a real app would write it to Supabase.
 * It's structured here to perform the fetches.
 */
export async function syncScoresAndSpreads(season: number) {
  try {
    console.log(`Starting sync for season ${season}...`);

    // 1. Fetch FBS teams (could be updated yearly)
    const teams = await getTeams();
    console.log(`Fetched ${teams.length} FBS teams.`);

    // 2. Fetch all games for the season
    const games = await getGames(season);
    console.log(`Fetched ${games.length} games for season ${season}.`);

    // 3. Fetch all betting lines for the season
    const lines = await getLines(season);
    console.log(`Fetched lines for ${lines.length} games.`);

    // 4. Fetch Baylor specific games to easily identify them
    const baylorGames = await getGames(season, 'regular', 'Baylor');
    console.log(`Fetched ${baylorGames.length} Baylor games.`);

    // In a full implementation, the logic below would involve:
    // a. Upsert teams to Supabase `teams` table
    // b. Upsert games to Supabase `games` table, mapping fields
    // c. Merge lines (spreads) into the `games` records
    // d. Mark `is_baylor_game` for Baylor games and set `baylor_team_id`

    // For now we return the fetched data structures to verify fetching works.
    return {
      success: true,
      data: {
        teamsCount: teams.length,
        gamesCount: games.length,
        linesCount: lines.length,
        baylorGamesCount: baylorGames.length,
      }
    };

  } catch (error) {
    console.error('Failed to sync scores and spreads:', error);
    return { success: false, error };
  }
}
