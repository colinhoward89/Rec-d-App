import React, { useState, useEffect } from 'react';
import styles from './landing-page.module.css';
import Login from './../login/login';
import Register from '../register/register';
import { Button } from '@mui/material';

const LandingPage = ({ setIsAuthenticated }) => {
  const [currentTab, setCurrentTab] = useState('login');
  const [text, setText] = useState(['band', 'music', 'Listen to'])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setText((prevText) =>
        prevText.join(',') === 'band,music,Listen to'
          ? ['movie', 'movie', 'Watch']
          : prevText.join(',') === 'movie,movie,Watch'
            ? ['TV show', 'TV', 'Watch']
            : prevText.join(',') === 'TV show,TV,Watch'
              ? ['book', 'book', 'Read']
              : prevText.join(',') === 'book,book,Read'
              ? ['video game', 'video game', 'Play']
                : prevText.join(',') === 'video game,video game,Play'
                ? ['board game', 'board game', 'Play']
                : ['band', 'music', 'Listen to']
      );
    }, 3000);
  
    return () => clearInterval(intervalId);
  }, []);  

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className={styles.LandingPage}>
      <h2>Find your next favourite <span style={{ color: 'red' }}>{text[0]}</span> faster!</h2>
      <h2>Receive <span style={{ color: 'red' }}>{text[1]}</span> recommendations from friends</h2>
      <h2><span style={{ color: 'red' }}>{text[2]}</span> to your rec and give it a rating</h2>
      {/* <h2>See it in action</h2>
      <p>embedded YouTube video</p> */}
      <h1>What are you waiting for? Get Rec'd today!</h1>
      <div className={styles.LandingPage}>
        {currentTab === 'login' ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Register setIsAuthenticated={setIsAuthenticated} />}
      </div>
      <div className={styles.TabContainer}>
          <Button variant="contained"
            className={currentTab === 'login' ? styles.ActiveTab : ''}
            onClick={() => handleTabChange('login')}
          >
            Login
          </Button>
          <Button variant="contained"
            className={currentTab === 'register' ? styles.ActiveTab : ''}
            onClick={() => handleTabChange('register')}
          >
            Register
          </Button>
        </div>
    </div>
  );
}

export default LandingPage;
