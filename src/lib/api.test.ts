import { test, mock } from 'node:test';
import assert from 'node:assert';
import { getGames } from './api.ts';

/**
 * Unit tests for getGames in src/lib/api.ts
 * Verifies URL construction and error handling.
 */

const API_BASE_URL = 'https://api.collegefootballdata.com';

test('getGames - default parameters', async (t) => {
  const mockFetch = mock.fn(() =>
    Promise.resolve(new Response(JSON.stringify([{ id: 1, home_team: 'Team A' }]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }))
  );

  global.fetch = mockFetch as any;

  const result = await getGames(2023);

  assert.strictEqual(mockFetch.mock.calls.length, 1);
  const [url, options] = mockFetch.mock.calls[0].arguments;
  assert.strictEqual(url, `${API_BASE_URL}/games?year=2023&seasonType=regular`);
  assert.deepStrictEqual(result, [{ id: 1, home_team: 'Team A' }]);
});

test('getGames - custom seasonType', async (t) => {
  const mockFetch = mock.fn(() =>
    Promise.resolve(new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }))
  );

  global.fetch = mockFetch as any;

  await getGames(2023, 'postseason');

  assert.strictEqual(mockFetch.mock.calls.length, 1);
  const [url] = mockFetch.mock.calls[0].arguments;
  assert.strictEqual(url, `${API_BASE_URL}/games?year=2023&seasonType=postseason`);
});

test('getGames - with team parameter', async (t) => {
  const mockFetch = mock.fn(() =>
    Promise.resolve(new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }))
  );

  global.fetch = mockFetch as any;

  await getGames(2023, 'regular', 'Baylor');

  assert.strictEqual(mockFetch.mock.calls.length, 1);
  const [url] = mockFetch.mock.calls[0].arguments;
  assert.strictEqual(url, `${API_BASE_URL}/games?year=2023&seasonType=regular&team=Baylor`);
});

test('getGames - handles fetch error', async (t) => {
  const mockFetch = mock.fn(() =>
    Promise.resolve(new Response(null, {
      status: 404,
      statusText: 'Not Found'
    }))
  );

  global.fetch = mockFetch as any;

  await assert.rejects(
    async () => await getGames(2023),
    { message: 'Failed to fetch games: 404 Not Found' }
  );
});
