import React from 'react';
import auth from './../../utils/auth';
import userService from './../../Services/UserService';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Logout = (props) => {
  let navigate = useNavigate();
  const handleClick = () => {
    userService.logout();
    handleAuth();
  };

  const handleAuth = () => {
    props.setIsAuthenticated(false);
    auth.logout(() => navigate('/'));
  };

  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <Link to="/">
        <button className="confirm-btn">No</button>
      </Link>
      <button className="confirm-btn" onClick={() => handleClick()}>
        Yes
      </button>
    </div>
  );
};

export default Logout;
