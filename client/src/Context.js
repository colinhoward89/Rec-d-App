import React, { createContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import * as userService from './Services/UserService';

const Context = createContext([[], () => null]);

const ContextProvider = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [currentUser, setCurrentUser] = useState({
    email: '',
    name: '',
    type: '',
    sources: '',
    id: '',
    requestSent: '',
    requestRec: '',
    });

  const handleGetUser = async () => {
    if (user) {
      const email = user.email;
      const receivedUser = await userService.getUser(email);
      if (receivedUser) {
        setCurrentUser({
          email: receivedUser[0].email,
          name: receivedUser[0].name,
          type: receivedUser[0].type,
          sources: receivedUser[0].sources,
          id: receivedUser[0]._id,
          requestSent: receivedUser[0].requestSent,
          requestRec: receivedUser[0].requestRec,
        });
      } else {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  };

  const handleCreateUser = async (newUser) => {

    const receivedUser = await userService.register({
      email: newUser.email,
      name: newUser.name,
      type: 'user',
    });

    if (receivedUser) {
      setCurrentUser({
        ...currentUser,
        email: receivedUser.email,
        name: receivedUser.name,
        type: receivedUser.type,
        id: receivedUser._id,
      });
    }
  };

  const refreshUser = () => {
    handleGetUser();
  };

  const contextValue = {
    user,
    currentUser,
    isAuthenticated,
    setCurrentUser,
    handleGetUser,
    handleCreateUser,
    refreshUser,
    isLoading,
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };