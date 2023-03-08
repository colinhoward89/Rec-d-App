const axios = require('axios');

async function getSearchResults(query) {
  try {
    const url = `https://openlibrary.org/search.json?q=${query}`;
    const response = await axios.get(url);
    const books = response.data.docs.map(async (result) => {
      const { _version_, title, first_publish_year, author_name: [author] = [] } = result;
      const imageUrl = null;
      return { _version_, title, first_publish_year, author, imageUrl };
    });
    return Promise.all(books);
  } catch (error) {
    console.log('Error while searching for books:', error);
    return [];
  }
}

module.exports = { getSearchResults };