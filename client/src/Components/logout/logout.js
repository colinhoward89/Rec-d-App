import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate();

  return (
        <div>
      <h2 style={{ color: 'white' }}>Are you sure you want to log out?</h2>
      <Button style={{ backgroundColor: 'white', color: '#1876D1', fontWeight: 'bold' }} variant="contained" className="confirm-btn"
        onClick={() => {
          navigate(`/recs`);
        }}>No</Button>
    <Button style={{ backgroundColor: 'red', color: 'white', fontWeight: 'bold'}} variant="contained" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Yes
    </Button>
    </div>

  );
};

export default Logout;
