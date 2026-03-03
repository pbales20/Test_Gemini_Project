# College Football Wins & Losses League

A web application where users draft a roster of college football teams (5 "Win Teams" and 2 "Loss Teams") and make weekly picks against the spread specifically for Baylor games.

## Project Setup

This project uses Next.js with Tailwind CSS, Supabase for backend/auth, and the CollegeFootballData.com API.

### Prerequisites

1.  **Node.js**: Make sure you have Node.js (v18+) and `npm` installed.
2.  **Supabase Account**: You'll need a Supabase project set up.
3.  **CFBD API Key**: Register for an API key at [CollegeFootballData.com](https://collegefootballdata.com/key).

### Required Environment Variables

Create a `.env.local` file in the root of your project and add the following keys:

```env
# Supabase Keys (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# CollegeFootballData.com API Key
CFBD_API_KEY=your_cfbd_api_key
NEXT_PUBLIC_CFBD_API_KEY=your_cfbd_api_key_if_fetching_from_client # (Optional, depending on implementation)
```

### Initializing the Database

The database schema is defined in `supabase/migrations/schema.sql`. You have two options to apply this schema:
1.  **Supabase CLI**: If you have the Supabase CLI installed, you can link your project and push the migrations.
2.  **SQL Editor**: Copy the contents of `supabase/migrations/schema.sql` and run it directly in the SQL Editor in your Supabase dashboard.

### API Fetching Logic

The logic to fetch teams, games, and betting lines from CFBD is located in `src/lib/api.ts`.
You can use the exported functions (`getTeams`, `getGames`, `getLines`, `syncScoresAndSpreads`) in your Next.js API routes or Server Components.

### Testing the API Integration

You can easily test the API fetching logic using the included script. Once your `.env.local` is set up with a valid `CFBD_API_KEY`, run:

```bash
npm run test:api
```

This will run the `scripts/test-api.ts` script to fetch basic team and schedule data to verify your API connection is working.

### Running TypeScript Validation

To ensure the codebase has no TypeScript errors, run:

```bash
npm install
npm test
```
(Note: `npm test` is currently configured to run `npx tsc --noEmit`).