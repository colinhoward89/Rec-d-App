import React, { useEffect, useState } from 'react';
import userService from './../../Services/UserService';
const initialState = {
  name: '',
};

const Profile = () => {
  const [state, setState] = useState(initialState);

  const name = state.name || 'Missing';

  useEffect(() => {
    const getProfile = async () => {
      const userInfo = await userService.getUserInfo();
      if (userInfo) {
        const { name } = userInfo;
        setState((prevState) => {
          return {
            ...prevState,
            name
          };
        });
      } else {
        console.log('No user info found 😞');
      }
    };
    getProfile();
  }, []);

  return (
    <section>
      <h2>My Profile</h2>
      <h3>
        Welcome back, {name}! Everything is fine.
      </h3>
    </section>
  );
};

export default Profile;
