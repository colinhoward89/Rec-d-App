const BASE_URL = 'http://localhost:3001';

const movieService = {};

movieService.getSearchResults = (query) => {
  return fetch(`${BASE_URL}/movie/search/${query}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export default movieService;
