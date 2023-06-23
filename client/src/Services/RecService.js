const BASE_URL = 'http://localhost:3001';

const recService = {};

recService.getUserRecs = (userId) => {
  const queryString = `userId=${userId}`;
  return fetch(`${BASE_URL}/recs?${queryString}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

recService.getSentRecs = (userId) => {
  return fetch(`${BASE_URL}/user/${userId}/sentrecs`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

recService.saveRec = (rec, userId, source, sourceComment, urgent) => {  
  const to = userId;
  const mediaId = rec.mediaId;
  const type = rec.type;
  const title = rec.title;
  const author = rec.author;
  const image = rec.image;
  const year = rec.year;
  return fetch(`${BASE_URL}/user/${userId}/recs`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, source, sourceComment, mediaId, type, title, author, image, year, urgent })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

recService.saveRating = (rec, userId, source, rating, ratingComment) => {  
  const to = userId;
  const mediaId = rec.mediaId;
  const type = rec.type;
  const title = rec.title;
  const author = rec.author;
  const image = rec.image;
  const year = rec.year;
  return fetch(`${BASE_URL}/user/${userId}/rating`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, source, rating, ratingComment, mediaId, type, title, author, image, year })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

recService.updateRating = (userId, _id, rating, ratingComment) => {  
  return fetch(`${BASE_URL}/user/${userId}/recs`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id, rating, ratingComment })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export default recService;