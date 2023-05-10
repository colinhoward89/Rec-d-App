const axios = require('axios');
const { DOMParser } = require('xmldom');

async function getSearchResults(query) {
  try {
    const url = `https://api.geekdo.com/xmlapi/search?search=${query}`;
    const response = await axios.get(url);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const boardgames = xmlDoc.getElementsByTagName("boardgame");
    const results = [];
    for (let i = 0; i < boardgames.length; i++) {
      const id = boardgames[i].getAttribute("objectid");
      const name = boardgames[i].getElementsByTagName("name")[0].textContent;
      const year = boardgames[i].getElementsByTagName("yearpublished")[0].textContent;
      results.push({ id, name, year });
    }
    return results;
  } catch (error) {
    console.log('Error while searching for board games:', error);
    return [];
  }
}

module.exports = { getSearchResults };