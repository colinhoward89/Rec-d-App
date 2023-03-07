const router = require('express').Router();
const userController = require('./controllers/user');
const recsController = require('./controllers/recs');
const authMiddleware = require('./middlewares/auth');
const spotifyApi = require('./controllers/music-search');

router.post('/register', userController.create);
router.post('/login', userController.login);
router.get('/user/info', authMiddleware, userController.profile);
router.post('/logout', authMiddleware, userController.logout);
router.get('/user/:source', userController.getSources);
router.get('/username/:source', userController.getSourceName);

router.get('/user/:userId/recs', authMiddleware, recsController.getRecs);
router.post('/user/:userId/recs', authMiddleware, recsController.saveRec);
router.post('/user/:userId/rating', authMiddleware, recsController.saveRating);
router.put('/user/:userId/recs', authMiddleware, recsController.updateRec);

router.get('/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const results = await spotifyApi.getSearchResults(query);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching search results: ${error.message}`);
    res.status(500).json({ error: 'Error fetching search results' });
  }
});

// router.get('/search/:query', authMiddleware, spotifyApi.getSearchResults);

module.exports = router;

