import React, { useState, useEffect } from 'react';
import styles from './landing-page.module.css';
import Login from './../login/login';

const LandingPage = () => {
  const [text, setText] = useState(['band', 'music', 'Listen to']);

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


  return (
    <div className={styles.LandingPage}>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.textLine}>
            <h2>Find your next favourite <span style={{ color: 'red' }}>{text[0]}</span> faster!</h2>
          </div>
          <div className={styles.textLine}>
            <h2>Receive <span style={{ color: 'red' }}>{text[1]}</span> recs from friends</h2>
          </div>
          <div className={styles.textLine}>
            <h2><span style={{ color: 'red' }}>{text[2]}</span> your rec and give it a rating</h2>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.videoContainer}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/RecdvideoID"
              title="Rec'd in action"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <h1>What are you waiting for? Get Rec'd today!</h1>
        <Login />
      </div>
    </div>
  );
};

export default LandingPage;