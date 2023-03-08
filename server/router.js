const router = require('express').Router();
const userController = require('./controllers/user');
const recsController = require('./controllers/recs');
const authMiddleware = require('./middlewares/auth');
const spotifyApi = require('./controllers/music-search');
const omdb = require('./controllers/movie-search');
const tvmaze = require('./controllers/tv-search');
const openLibrary = require('./controllers/book-search');

router.post('/register', userController.create);
router.post('/login', userController.login);
router.get('/user/info', authMiddleware, userController.profile);
router.get('/user/:userId/profile', authMiddleware, userController.profile);
router.post('/logout', authMiddleware, userController.logout);
router.get('/user/:source', userController.getSources);
router.get('/username/:source', userController.getSourceName);

router.get('/user/:userId/recs', authMiddleware, recsController.getRecs);
router.get('/user/:userId/sentrecs', authMiddleware, recsController.getSentRecs);
router.post('/user/:userId/recs', authMiddleware, recsController.saveRec);
router.post('/user/:userId/rating', authMiddleware, recsController.saveRating);
router.put('/user/:userId/recs', authMiddleware, recsController.updateRec);

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

module.exports = router;

