import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token!,
    }),
  });

  return response.json();
};

const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();

  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export async function GET() {
  try {
    const nowPlayingResponse = await getNowPlaying();

    if (nowPlayingResponse.status === 200) {
      const song = await nowPlayingResponse.json();

      if (song.item) {
        const isPlaying = song.is_playing;
        const title = song.item.name;
        const artist = song.item.artists.map((artist: any) => artist.name).join(', ');
        const album = song.item.album.name;
        const albumImageUrl = song.item.album.images[0]?.url;
        const songUrl = song.item.external_urls.spotify;

        return NextResponse.json({
          isPlaying,
          title,
          artist,
          album,
          albumImageUrl,
          songUrl,
        });
      }
    }

    // Fallback to recently played
    const recentlyPlayedResponse = await getRecentlyPlayed();

    if (recentlyPlayedResponse.status === 200) {
      const data = await recentlyPlayedResponse.json();

      if (data.items && data.items.length > 0) {
        const track = data.items[0].track;
        const playedAt = new Date(data.items[0].played_at);
        const now = new Date();
        const minutesAgo = Math.floor((now.getTime() - playedAt.getTime()) / 60000);

        return NextResponse.json({
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((artist: any) => artist.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify,
          minutesAgo,
        });
      }
    }

    return NextResponse.json({ isPlaying: false });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return NextResponse.json({ isPlaying: false }, { status: 500 });
  }
}
