const BASE_URL = process.env.REACT_APP_SERVER_URL;

const recService = {};

recService.getUserRecs = (userId) => {
  return fetch(`${BASE_URL}/recs`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

recService.getSentRecs = (userId) => {
  return fetch(`${BASE_URL}/sentrecs`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
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
  return fetch(`${BASE_URL}/saverec`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, source, sourceComment, mediaId, type, title, author, image, year, urgent })
  })
  .then((res) => res.json())
  .catch((err) => {
    throw err;
  });

};

recService.saveRating = (rec, userId, source, rating, ratingComment) => {  
  const to = userId;
  const mediaId = rec.mediaId;
  const type = rec.type;
  const title = rec.title;
  const author = rec.author;
  const image = rec.image;
  const year = rec.year;
  return fetch(`${BASE_URL}/saverating`, {
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
  return fetch(`${BASE_URL}/updaterec`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, _id, rating, ratingComment })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

recService.updateUrgent = (rec) => {  
  return fetch(`${BASE_URL}/urgentrec`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rec })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export default recService;