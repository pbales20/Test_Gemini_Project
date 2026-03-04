// src/lib/api.ts

const API_BASE_URL = 'https://api.collegefootballdata.com';

// Add the token in .env.local like CFBD_API_KEY
const getHeaders = () => {
  const apiKey = process.env.CFBD_API_KEY;
  if (!apiKey) {
    console.warn('Warning: CFBD_API_KEY is not defined. API requests may fail.');
  }
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
  };
};

export async function getTeams() {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/fbs?year=${new Date().getFullYear()}`, {
      headers: getHeaders(),
      next: { revalidate: 86400 }, // Cache for a day
    });
    if (!res.ok) throw new Error(`Failed to fetch teams: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

export async function getGames(season: number, seasonType: string = 'regular', team?: string) {
  try {
    let url = `${API_BASE_URL}/games?year=${season}&seasonType=${seasonType}`;
    if (team) {
      url += `&team=${encodeURIComponent(team)}`;
    }
    const res = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 3600 }, // Cache for an hour
    });
    if (!res.ok) throw new Error(`Failed to fetch games: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

export async function getLines(season: number, week?: number, seasonType: string = 'regular', team?: string) {
  try {
    let url = `${API_BASE_URL}/lines?year=${season}&seasonType=${seasonType}`;
    if (week) url += `&week=${week}`;
    if (team) url += `&team=${encodeURIComponent(team)}`;

    const res = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch lines: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching lines:', error);
    throw error;
  }
}

/**
 * Admin function to sync CFBD data to our Supabase database.
 * This function fetches data and in a real app would write it to Supabase.
 * It's structured here to perform the fetches.
 */
export async function syncScoresAndSpreads(season: number) {
  try {
    console.log(`Starting sync for season ${season}...`);

    // Fetch FBS teams, games, lines, and Baylor specific games concurrently
    const [teams, games, lines, baylorGames] = await Promise.all([
      getTeams(),
      getGames(season),
      getLines(season),
      getGames(season, 'regular', 'Baylor')
    ]);

    console.log(`Fetched ${teams.length} FBS teams.`);
    console.log(`Fetched ${games.length} games for season ${season}.`);
    console.log(`Fetched lines for ${lines.length} games.`);
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
