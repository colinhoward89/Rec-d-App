import React from 'react';
import auth from './../../utils/auth';
import userService from './../../Services/UserService';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Logout = (props) => {
  let navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleClick = () => {
    userService.logout();
    handleAuth();
  };

  const handleAuth = () => {
    if (props.setIsAuthenticated) {
      props.setIsAuthenticated(false);
    }
    auth.logout(() => navigate('/'));
  };


  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <Button variant="contained" className="confirm-btn"
        onClick={() => {
          navigate(`/user/${userId}/recs`);
        }}>No</Button>
      <Button variant="contained" color="error" className="confirm-btn" onClick={() => handleClick()}>
        Yes
      </Button>
    </div>
  );
};

export default Logout;
