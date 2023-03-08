const axios = require('axios');

async function getSearchResults(query) {
  try {
    const url = `https://api.tvmaze.com/search/shows?q=${query}`;
    const response = await axios.get(url);
    const tvShows = response.data.map(async (result) => {
      const { id, name, premiered, network, image } = result.show;
      const imageUrl = image ? image.medium : null;
      return { id, name, premiered, network: network ? network.name : null, imageUrl };
    });
    return Promise.all(tvShows);
  } catch (error) {
    console.log('Error while searching for TV shows:', error);
    return [];
  }
}

module.exports = { getSearchResults };