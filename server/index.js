const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const SECRET = process.env.SECRET || 'this is not very secure';
const router = require('./router');
const dbConnection = require('./db');

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const config = {
  server: {
      port: PORT
  }
};

app.get('/', (req, res) => {
  return res.send('Express on Vercel');
});

app.get('/ping', (req, res) => {
  return res.send('pong 🏓')
});

(async () => {
  try {
    await dbConnection;

    console.log('Connected to DB');

    app.listen(PORT, () => {
      console.log(`Server running at ${config.server.port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
})();

app.use(cors(corsConfig));
app.use(express.json());
app.use(
  session({
    // the store property, if not specified, defaults to the in-memory store
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1hr
      sameSite: true,
      httpOnly: false,
      // we would want to set secure=true in a production environment
      secure: false,
    },
  })
);
app.use(router);
app.get('*', (req, res) => {
  res.status(404).send('Sorry, not found 😞');
});

// const server = app.listen(SERVER_PORT, (err) => {
//   if (err) {
//     console.log(`😞 Sorry, something went wrong! ${err}`); // eslint-disable-line no-console
//   } else {
//     console.log(`🚀 Server (sessions) is listening on port ${SERVER_PORT}!`); // eslint-disable-line no-console
//   }
// });
