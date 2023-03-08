import React, { useState } from 'react';
import auth from './../../utils/auth';
import userService from './../../Services/UserService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const initialState = {
  name: '',
  email: '',
  password: '',
};

const Register = (props) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic to send send a request to the API service /register
    const { name, email, password } = state;
    const type = "user";
    const user = { type, name, email, password };
    const res = await userService.register(user);
    if (res.error) {
      alert(`${res.message}`);
      setState(initialState);
    } else {
      // This sets isAuthenticated = true and redirects to profile
      props.setIsAuthenticated(true);
      auth.login(() => navigate('/profile'));
    }
  };

  const validateForm = () => {
    return (
      !state.name || !state.email || !state.password
    );
  };

  return (
    <section>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          name="name"
          value={state.name}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="name@mail.com"
          name="email"
          value={state.email}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="******"
          name="password"
          value={state.password}
          onChange={handleChange}
        />
        <Button variant="outlined" className="form-submit" type="submit" disabled={validateForm()}>
          &nbsp;Register&nbsp;
        </Button>
      </form>
    </section>
  );
};

export default Register;
