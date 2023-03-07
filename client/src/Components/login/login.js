import React, { useState } from 'react';
import auth from './../../utils/auth';
import userService from './../../Services/UserService';
import { useNavigate } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

const Login = (props) => {
  let navigate = useNavigate();
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
    const { email, password } = state;
    const user = { email, password };
    const res = await userService.login(user);
    if (res.error) {
      alert(`${res.message}`);
      setState(initialState);
    } else {
      // Get user info to extract the user ID
      const userInfo = await userService.getUserInfo();
      const userId = userInfo._id;
      // This sets isAuthenticated = true and redirects to profile
      props.setIsAuthenticated(true);
      localStorage.setItem('userId', userId);
      auth.login(() => navigate(`/user/${userId}/recs`));
    }
  };

  const validateForm = () => {
    return !state.email || !state.password;
  };

  return (
    <section>
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name@mail.com"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="******"
          name="password"
          value={state.password}
          onChange={handleChange}
        />
        <button className="form-submit" type="submit" disabled={validateForm()}>
          &nbsp;Login&nbsp;
        </button>
      </form>
    </section>
  );
};

export default Login;
