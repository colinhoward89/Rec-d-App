import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '@mui/material';
import React from 'react';;

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  // const handleLogin = async () => {
  //   await loginWithRedirect({
  //     appState: {
  //       returnTo: "/home",
  //     },
  //   });
  // };

  return (
    <Button
      variant="outlined"
      sx={{
        color: 'white',
        borderColor: 'white',
        borderWidth: '2px',
        fontWeight: 'bold',
        '&:hover': {
          borderColor: 'silver',
          borderWidth: '3px',
        },
      }}
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
  );
};

export default Login;
