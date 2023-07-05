const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

const videoGameService = {};

videoGameService.getSearchResults = (query) => {
  return fetch(`${BASE_URL}/videogame/search/${query}`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export default videoGameService;