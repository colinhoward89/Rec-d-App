const recs = require('../models/recs');
const { ObjectId } = require('mongodb');

const getRecs = async (req, res) => {
  try {
    const to = req.params.userId;
    const userRecs = await recs.find({ to });
    return res.status(200).send(userRecs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const saveRec = async (req, res) => {
  try {
    const { to, source, sourceComment, mediaId, type, title, author, image, year, urgent } = req.body;
    const recDate = new Date();
    const userRecs = await recs.create({ to, source, sourceComment, mediaId, type, title, author, image, year, urgent, recDate });
    return res.status(200).send(userRecs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const saveRating = async (req, res) => {
  try {
    const { to, source, rating, ratingComment, mediaId, type, title, author, image, year } = req.body;
    const recDate = new Date();
    const ratingDate = new Date();
    const userRecs = await recs.create({ to, source, rating, ratingComment, mediaId, type, title, author, image, year, ratingDate, recDate });
    return res.status(200).send(userRecs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const updateRec = async (req, res) => {
  try {
    const { _id, rating, ratingComment } = req.body;
    const ratingDate = new Date();
    const userRecs = await recs.updateOne({ _id: new ObjectId(_id) }, { $set: { rating, ratingComment, ratingDate } });
    return res.status(200).send(userRecs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

module.exports = { getRecs, saveRec, updateRec, saveRating };