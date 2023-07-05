const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

const boardGameService = {};

boardGameService.getSearchResults = (query) => {
  return fetch(`${BASE_URL}/boardgame/search/${query}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export default boardGameService;
