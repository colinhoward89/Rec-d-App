const {HOST, PORT} = require('../config');

function parseMany (data) {
  return data.map(recommendations => {
    const {id, name, url, front_pic, back_pic } = parseOne(recommendations);
    return { id, name, url, front_pic, back_pic };

  });
}

function parseOne (recommendation) {
  return {
    ...recommendation,
    name: formatName(recommendation.identifier),
    url: `http://${HOST}:${PORT}/recs/${recommendation.id}/`,
    front_pic: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${recommendation.id}.png`,
    back_pic: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${poke.id}.png`
  };
}


function formatName (name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

module.exports = { parseMany, parseOne };
