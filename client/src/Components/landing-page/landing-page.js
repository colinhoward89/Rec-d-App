import React, { useState } from 'react';
import styles from './landing-page.module.css';
import Login from './../login/login';
import Register from '../register/register';

const LandingPage = ({ setIsAuthenticated }) => {
  const [currentTab, setCurrentTab] = useState('login');

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className={styles.LandingPage}>
      <p>Find your next favourite band faster</p>
      <p>Receive music recommendations in your to-do-list</p>
      <p>Listen to your rec and give it a rating</p>
      <p>See it in action</p>
      <p>embedded YouTube video</p>
      <p>What are you waiting for? Get Rec'd today!</p>
      <div className={styles.LandingPage}>
        {currentTab === 'login' ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Register setIsAuthenticated={setIsAuthenticated} />}
      </div>
      <div className={styles.TabContainer}>
          <button
            className={currentTab === 'login' ? styles.ActiveTab : ''}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button
            className={currentTab === 'register' ? styles.ActiveTab : ''}
            onClick={() => handleTabChange('register')}
          >
            Register
          </button>
        </div>
    </div>
  );
}

export default LandingPage;
