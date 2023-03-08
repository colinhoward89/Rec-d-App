require('dotenv').config()
const axios = require('axios');

async function getSearchResults(query) {
  try {
    const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}&plot=short`;
    const response = await axios.get(url);
    const movies = response.data.Search.map(async movie => {
      const detailsUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movie.imdbID}&plot=short`;
      const detailsResponse = await axios.get(detailsUrl);
      const { Title, Year, Poster, Director, imdbID } = detailsResponse.data;
      return { Title, Year, Poster, Director, imdbID };
    });
    return Promise.all(movies);
  } catch (error) {
    console.log('Error while searching for movies:', error);
    return [];
  }
}

module.exports = { getSearchResults };