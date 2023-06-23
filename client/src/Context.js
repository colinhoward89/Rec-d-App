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
  });

  const handleGetUser = async () => {
    console.log("being called")
    if (user) {
      const email = user.email;
      const receivedUser = await userService.getUser(email);
      console.log(receivedUser)
      if (receivedUser) {
        setCurrentUser({
          email: receivedUser[0].email,
          name: receivedUser[0].name,
          type: receivedUser[0].type,
          sources: receivedUser[0].sources,
          id: receivedUser[0]._id,
        });
      } else {
        setCurrentUser(null); // Set currentUser to null if receivedUser is not found
      }
    } else {
      setCurrentUser(null); // Set currentUser to null if email is empty
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
    console.log("refresh user")
    handleGetUser();
  };

  // const handleUpdateUser = async (updatedUser) => {
  //   const receivedUser = await userService.updateUser({
  //     id: currentUser.id,
  //     email: updatedUser.email === '' ? currentUser.email : updatedUser.email,
  //     name: updatedUser.name === currentUser.name ? currentUser.name : updatedUser.name,
  //   });


  //   if (receivedUser) {
  //     setCurrentUser({
  //       ...currentUser,
  //       email: receivedUser.email,
  //       name: receivedUser.name,
  //       sources: receivedUser.sources,
  //       type: receivedUser.type,
  //       id: receivedUser._id,
  //     });
  //   }
  // };

  // const authContextValue = {
  //   currentUser,
  //   isAuthenticated,
  //   handleGetUser,
  // };
  const contextValue = {
    user,
    currentUser,
    isAuthenticated,
    setCurrentUser,
    handleGetUser,
    handleCreateUser,
    refreshUser,
    // handleUpdateUser,
    isLoading,
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };