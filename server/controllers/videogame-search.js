const axios = require('axios');

async function getSearchResults(query) {
  try {
    const url = `https://api.igdb.com/v4/games?search=${query}&fields=id,name`;
    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        'Client-ID': `${process.env.IGDB_CLIENT_ID}`,
        'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`
      },
    });
    const videogames = response.data.map(async (result) => {
      const { id, name } = result;
      const year = null;
      const author = null;
      const imageUrl = null;
      return { id, name, year, author, imageUrl };
    });
    return Promise.all(videogames);
  } catch (error) {
    console.log('Error while searching for video games:', error);
    return [];
  }
}

module.exports = { getSearchResults };