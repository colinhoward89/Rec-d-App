import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '@mui/material';
import { Context } from '../../Context';
import React, { useContext } from 'react';;

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/home",
      },
    });
  };

  return <Button variant="outlined" className="form-submit" onClick={() => handleLogin()}>Log In</Button>;
};

export default Login;
