require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.MUSIC_API_ID,
  clientSecret: process.env.MUSIC_API_SECRET,
});

const getSearchResults = async (query) => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    const token = data.body.access_token;
    spotifyApi.setAccessToken(token);
    const response = await spotifyApi.searchTracks(query);
    const tracks = response.body.tracks.items;
    const albums = tracks.map((track) => ({
      id: track.album.id,
      artist: track.album.artists[0].name,
      name: track.album.name,
      year: track.album.release_date.slice(0, 4),
      image: track.album.images[0].url,
    }));
    const albumSet = new Set();
    const results = [];
    albums.forEach((album) => {
      if (!albumSet.has(album.id)) {
        albumSet.add(album.id);
        results.push(album);
      }
    });
    return results;
  } catch (error) {
    console.log('Error while searching for tracks:', error);
    return [];
  }
};

module.exports = { getSearchResults };