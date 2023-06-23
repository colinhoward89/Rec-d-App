# Rec'd

Rec'd is an app used to track recommendations you receive for movies, music, TV shows and books! Receive recs from your friends, rate them and Rec'd will suggest what to watch, read, listen to next based on how highly you've rated previous recommendations.

## Installation
 
1. Clone this repo and enter!

```bash
git clone https://github.com/colinhoward89/Rec-d-App.git
cd rec-d-app
```

Before moving ahead, you will need to create a [Spotify](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) account and request a free access token. You will be given an API ID and an API Secret.

You will also need to create an account with [OMDB](https://www.omdbapi.com) and retrieve a free API key.

You will also need to create an account with [IGDB](https://www.igdb.com) and retrieve a free API key.

In the `/server` folder, create a file called '.env':

```bash
touch .env
```

In this file, you will need to store your API keys:

```bash
// Spotify API keys
MUSIC_API_ID="xxx"
MUSIC_API_SECRET="xxx"

// OMDB API key:
OMDB_API_KEY="xxx"

// IGDB API key:
IGDB_CLIENT_ID='xxx'
IGDB_ACCESS_TOKEN='xxx'
```

## Running the app

### Back End

From the root folder, change directory into the `/server` folder and run `npm i` in order to install all dependencies.

```bash
cd server
npm i
```

Once this is done, run `npm start` to initiate the server on port 4000.

### Front End

Open another terminal and from the root folder change directory into the `/client` folder and run `npm i` in order to install all dependencies.

```bash
cd client
npm i
```

Once this is done, run `npx nodemon` to run the scripts and connect the front end. Once all of the above steps are taken, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Tech Stack

[React](https://react.dev)
[Express](https://expressjs.com)
[MongoDB](https://www.mongodb.com)

APIs:
[Spotify](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)
[OMDB](https://www.omdbapi.com)
[Open Library](https://openlibrary.org)
[TV Maze](https://www.tvmaze.com)

### Developers

Colin Howard - [Github](https://github.com/colinhoward89) - [LinkedIn](https://www.linkedin.com/in/colin-howard-dev)
