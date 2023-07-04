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
        <div className={styles.topContainer}>
        <img src="recdlogoround.png" alt="Rec'd Logo" style={{ width: '200px', height: 'auto' }} />
        </div>
        <div className={styles.descriptionContainer}>
          <div className={`${styles.leftContainer} ${styles.containerItem}`}>
            <div className={styles.textLine}>
            Your essential app for tracking your recommendations in music, movies, TV shows, books, and games.
            </div>
            <div className={styles.textLine}>
            Discover and enjoy effortlessly. Rate your recs, and let Rec'd choose your next favourite!
            </div>
          </div>
          <div className={`${styles.rightContainer} ${styles.containerItem}`}>
            <div className={styles.videoContainer}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube-nocookie.com/embed/oOLmiVmtHcM?autoplay=1&loop=1&amp;modestbrading=1&amp;mute=1"
                title="Rec'd in action"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <h1 className={styles.bottomText}>What are you waiting for? Get Rec'd today!</h1>
          <div>
          <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;