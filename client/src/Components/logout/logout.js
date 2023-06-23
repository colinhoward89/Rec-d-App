import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate();

  return (
        <div>
      <h2>Are you sure you want to log out?</h2>
      <Button variant="contained" className="confirm-btn"
        onClick={() => {
          navigate(`/recs`);
        }}>No</Button>
    <Button onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:3000/' } })}>
      Yes
    </Button>
    </div>

  );
};

export default Logout;
