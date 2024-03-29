const BASE_URL = process.env.REACT_APP_SERVER_URL;

const musicService = {};

musicService.getSearchResults = (query) => {
  return fetch(`${BASE_URL}/music/search/${query}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export default musicService;
