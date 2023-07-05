const mongoose = require('mongoose');
require('dotenv').config()
// const DB_PORT = process.env.DB_PORT || 27017;
// const DB_NAME = process.env.DB_NAME || 'rec-d';

const dbName = process.env.DB_TEST || 'rec-d';
const dbURL = process.env.MONGODB_URI || `mongodb://localhost:27017`;

const dbConnection = mongoose.connect(`${dbURL}/${dbName}`, {});

// mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log(`🦆 Database (sessions) connected @ port ${DB_PORT}!`); // eslint-disable-line no-console
//   })
//   .catch((err) => {
//     console.log(`😞 Sorry, something went wrong! ${err}`); // eslint-disable-line no-console
//   });

module.exports = {
  mongoose,
  dbConnection
};