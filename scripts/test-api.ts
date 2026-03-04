import { getTeams, syncScoresAndSpreads } from '../src/lib/api';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testAPI() {
  console.log('Testing CFBD API Integration...');

  const apiKey = process.env.CFBD_API_KEY || process.env.NEXT_PUBLIC_CFBD_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: No CFBD_API_KEY found in .env.local');
    console.log('Please create a .env.local file with your API key to test the integration.');
    process.exit(1);
  }

  try {
    console.log('Fetching FBS teams for the current year...');
    const teams = await getTeams();

    if (teams && teams.length > 0) {
      console.log(`✅ Successfully fetched ${teams.length} teams.`);
      console.log('Sample teams:');
      console.log(teams.slice(0, 3).map((t: any) => ({ school: t.school, mascot: t.mascot, conference: t.conference })));
    } else {
      console.log('⚠️ Fetched teams but array was empty.');
    }

    console.log('\nTesting sync logic (fetching games, lines, and baylor games)...');
    const syncResult = await syncScoresAndSpreads(new Date().getFullYear());

    if (syncResult.success) {
      console.log('✅ Sync logic successful. Fetched data summary:');
      console.log(syncResult.data);
    } else {
      console.error('❌ Sync logic failed:', syncResult.error);
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error);
    if ((error as Error).message.includes('401')) {
       console.error('This usually indicates an invalid or missing API key.');
    }
  }
}

testAPI();
