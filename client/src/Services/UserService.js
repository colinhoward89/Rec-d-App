const BASE_URL = 'http://localhost:3001';

export const register = (user) => {
  return fetch(`${BASE_URL}/register`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const login = (user) => {
  return fetch(`${BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const getUser = (email) => {
  return fetch(`${BASE_URL}/user/${email}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const getUserInfo = (id) => {
  return fetch(`${BASE_URL}/userID/${id}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// userService.getSourcesNames = (source) => {
//   return fetch(`${BASE_URL}/user/${source}`, {
//     method: 'GET',
//     credentials: 'include',
//     mode: 'cors',
//     headers: { 'Content-Type': 'application/json' },
//   })
//     .then((res) => res.json())
//     .catch((err) => console.log(err));
// };

export const getSourceName = (source) => {
  return fetch(`${BASE_URL}/username/${source}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const saveSource = (userId, newSource) => {  
  return fetch(`${BASE_URL}/newSource`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, newSource })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const inviteFriend = (userId, newFriend) => {  
  return fetch(`${BASE_URL}/invitefriend`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, newFriend })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const friendRequests = (userId) => {  
  const queryString = `userId=${userId}`;
  return fetch(`${BASE_URL}/friendrequests?${queryString}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const deleteFriendRequest = (userId, request) => {  
  return fetch(`${BASE_URL}/deletefriendrequest`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, request })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const rejectFriendRequest = (userId, request) => {  
  return fetch(`${BASE_URL}/rejectfriendrequest`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, request })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const acceptFriendRequest = (userId, request) => {  
  return fetch(`${BASE_URL}/acceptfriendrequest`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, request })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};