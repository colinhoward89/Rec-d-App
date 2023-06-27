import React, { useEffect, useContext } from 'react';
import { Context } from "./Context";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/nav-bar/nav-bar';
import LandingPage from './Components/landing-page/landing-page';
import Profile from './Components/profile/profile';
import RecList from './Components/rec-list/rec-list';
import RatingList from './Components/rating-list/rating-list';
import RecSentList from './Components/recs-sent-list/recs-sent-list';
import FriendList from './Components/friend-list/friend-list';
import { AuthenticationGuard } from './utils/AuthenticationGuard';
import SearchList from './Components/search-list/search-list';
import Logout from './Components/logout/logout';
import FirstVisit from './Components/firstvisit/firstvisit';

function App() {
  const { currentUser, isAuthenticated, isLoading, handleGetUser } = useContext(
    Context)

  useEffect(() => {
    if (isAuthenticated) {
      handleGetUser();
    }
  }, [isAuthenticated]);


  return (
    <Router>
      <div className="App">
        <Navbar />
        {isLoading ? (
          <div className="mt-96">Loading...</div>
        ) : !isAuthenticated ? (
          <LandingPage />
        ) : !currentUser || currentUser.name === '' ? (
          <FirstVisit />
        ) : (
          <Routes>
            <Route path="/" element={<AuthenticationGuard component={LandingPage} />} />
            <Route path="/home" element={<AuthenticationGuard component={RecList} />} />
            <Route path="/profile" element={<AuthenticationGuard component={Profile} />} />
            <Route path="/recs" element={<AuthenticationGuard component={RecList} />} />
            <Route path="/:searchtype/search/:query" element={<AuthenticationGuard component={SearchList} />} />
            <Route path="/ratings" element={<AuthenticationGuard component={RatingList} />} />
            <Route path="/sentrecs" element={<AuthenticationGuard component={RecSentList} />} />
            <Route path="/friends" element={<AuthenticationGuard component={FriendList} />} />
            <Route path="/logout" element={<AuthenticationGuard component={Logout} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;