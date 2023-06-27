const recs = require('../models/recs');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const getRecs = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRecs = await recs.find({ to: userId });
    console.log(userRecs)
    return res.status(200).send(userRecs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const getSentRecs = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRecs = await recs.find({ 'sources.source': userId });
    return res.status(200).send(userRecs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const saveRec = async (req, res) => {
  try {
    const { to, source, sourceComment, mediaId, type, title, author, image, year, urgent } = req.body;
    // Check if the user has already rated the mediaId
    const existingRec = await recs.findOne({ to, mediaId });
    if (existingRec && existingRec.rating) {
      return res.status(200).json({error: "User has already rated."});
    }
    // Convert source to ObjectId
    const sourceObjectId = new mongoose.Types.ObjectId(source);

    // Check if the source has already recommended the mediaId
    const existingSourceRec = existingRec && existingRec.sources.find((rec) => rec.source.equals(sourceObjectId));
    if (existingSourceRec) {
      return res.status(400).json({error: "You have already recommended this." });
    }

    const recDate = new Date();
    let userRecs;
    if (existingRec) {
      // Update the existing recommendation by pushing the new source, sourceComment, and recDate
      userRecs = await recs.findByIdAndUpdate(
        existingRec._id,
        {
          $push: {
            sources: {
              source,
              sourceComment,
              recDate,
            },
          },
        },
        { new: true }
      );
    } else {
      // Create a new recommendation with all the fields
      userRecs = await recs.create({
        to,
        sources: [{ source, sourceComment, recDate }],
        mediaId,
        type,
        title,
        author,
        image,
        year,
        urgent,
        recDate,
      });
    }
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
    const userRecs = await recs.create({ to, sources: [{ source, recDate }], rating, ratingComment, mediaId, type, title, author, image, year, ratingDate, recDate });
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

const urgentRec = async (req, res) => {
  try {
    const { rec } = req.body;
    const updatedRec = await recs.updateOne(
      { _id: rec._id },
      {
        $set: {
          urgent: rec.urgent === true ? false : true,
        },
      }
    );
    return res.status(200).send(updatedRec);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

module.exports = { getRecs, saveRec, updateRec, saveRating, getSentRecs, urgentRec };