import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/nav-bar/nav-bar';
import LandingPage from './Components/landing-page/landing-page';
import Login from './Components/login/login';
import Register from './Components/register/register';
import Profile from './Components/profile/profile';
import RecList from './Components/rec-list/rec-list';
import RatingList from './Components/rating-list/rating-list';
import RecSentList from './Components/recs-sent-list/recs-sent-list';
import FriendList from './Components/friend-list/friend-list';
import auth from './utils/auth';
import SearchList from './Components/search-list/search-list';
import Logout from './Components/logout/logout';

function App() {
  const initialState = auth.isAuthenticated();
  const [isAuthenticated, setIsAuthenticated] = useState(initialState);

  return (
    <div className="App">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          {isAuthenticated && (
            <Route path="/user/:userId/profile" element={<Profile />} />
          )}
          {isAuthenticated && (
            <Route path="/user/:userId/recs" element={<RecList />} />
          )}
          {isAuthenticated && (
            <Route path="/:searchtype/search/:query" element={<SearchList setIsAuthenticated={setIsAuthenticated} />} />
          )}
          {isAuthenticated && (
            <Route path="/user/:userId/ratings" element={<RatingList />} />
          )}
            {isAuthenticated && (
            <Route path="/user/:userId/sentrecs" element={<RecSentList />} />
          )}
            {isAuthenticated && (
            <Route path="/user/:userId/friends" element={<FriendList />} />
          )}
          {isAuthenticated && (
            <Route path="/logout" element={<Logout />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;