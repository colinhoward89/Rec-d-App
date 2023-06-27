const router = require('express').Router();
const userController = require('./controllers/user');
const recsController = require('./controllers/recs');
const spotifyApi = require('./controllers/music-search');
const omdb = require('./controllers/movie-search');
const tvmaze = require('./controllers/tv-search');
const openLibrary = require('./controllers/book-search');
const boardGameGeek = require('./controllers/boardgame-search');
const videoGameSearch = require('./controllers/videogame-search');

router.post('/register', userController.create);
router.post('/login', userController.login);
router.get('/user/:email', userController.getUser);
router.get('/userID/:id', userController.getUserInfo);
router.get('/user/:userId/profile', userController.profile);
// router.post('/logout', userController.logout);
router.get('/user/:source', userController.getSources);
router.get('/username/:source', userController.getSourceName);
router.post('/newsource', userController.newSource);
router.put('/invitefriend', userController.inviteFriend);
router.get('/friendrequests', userController.friendRequests);

router.get('/recs', recsController.getRecs);
router.get('/user/:userId/sentrecs', recsController.getSentRecs);
router.post('/user/:userId/recs', recsController.saveRec);
router.post('/user/:userId/rating', recsController.saveRating);
router.put('/user/:userId/recs', recsController.updateRec);

router.get('/music/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const results = await spotifyApi.getSearchResults(query);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching music search results: ${error.message}`);
    res.status(500).json({ error: 'Error fetching music search results' });
  }
});

router.get('/movie/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const results = await omdb.getSearchResults(query);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching movie search results: ${error.message}`);
    res.status(500).json({ error: 'Error fetching movie search results' });
  }
});

router.get('/tv/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const results = await tvmaze.getSearchResults(query);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching TV search results: ${error.message}`);
    res.status(500).json({ error: 'Error fetching TV search results' });
  }
});

router.get('/book/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const results = await openLibrary.getSearchResults(query);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching book results: ${error.message}`);
    res.status(500).json({ error: 'Error fetching book results' });
  }
});

router.get('/boardgame/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const results = await boardGameGeek.getSearchResults(query);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching board game results: ${error.message}`);
    res.status(500).json({ error: 'Error fetching board game results' });
  }
});

router.post('/videogame/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const results = await videoGameSearch.getSearchResults(query);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching video game results: ${error.message}`);
    res.status(500).json({ error: 'Error fetching video game results' });
  }
});

module.exports = router;

