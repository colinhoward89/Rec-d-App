import React, { createContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import * as userService from './Services/UserService';

const Context = createContext([[], () => null]);

const ContextProvider = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  const { isLoading } = useAuth0();
  const { user } = useAuth0();
  const [currentUser, setCurrentUser] = useState({
    email: '',
    name: '',
    type: '',
    sources: '',
    id: '',
  });

  console.log(currentUser)
  console.log(user && user.email ? user.email : "null");

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

  return (
    <Context.Provider
      value={{
        user,
        currentUser,
        isAuthenticated,
        setCurrentUser,
        handleGetUser,
        handleCreateUser,
        // handleUpdateUser,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };