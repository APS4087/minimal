require('dotenv').config({ path: '.env.local' });
const readline = require('readline');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const scopes = 'user-read-currently-playing user-read-recently-played';

console.log('\n🎵 Spotify Authorization Setup\n');
console.log('Step 1: Visit this URL to authorize:\n');
console.log(
  `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(scopes)}\n`
);

rl.question('Step 2: After authorizing, paste the full URL you were redirected to:\n', async (url) => {
  try {
    const code = new URL(url).searchParams.get('code');

    if (!code) {
      console.error('\n❌ Could not find code in URL. Make sure you pasted the full URL.');
      process.exit(1);
    }

    console.log('\n🔄 Exchanging code for refresh token...\n');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.refresh_token) {
      console.log('✅ Success! Add this to your .env.local file:\n');
      console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    } else {
      console.error('❌ Error:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  rl.close();
  process.exit(0);
});
