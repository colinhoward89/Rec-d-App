import React, { useEffect, useState } from 'react';
import styles from './friend-list.module.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import userService from './../../Services/UserService';
import recService from '../../Services/RecService';

const initialState = {
  name: '',
  sources: ''
};

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'black',
}));

const FriendList = () => {
  const [options, setOptions] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [state, setState] = useState(initialState);
  console.log(state)
  const [stats, setStats] = useState({});
  const [recs, setRecs] = useState([]);
  const userId = localStorage.getItem('userId');
  const name = state.name || 'Missing';
  const sources = state.sources || 'Missing';

  useEffect(() => {
    getUserRecommendations(userId)
      .catch((e) => console.log(e));
  }, [userId]);

  useEffect(() => {
    const fetchSources = async () => {
      const user = await userService.getUserInfo();
      if (user) {
        const sources = user.sources;
        const sourceNamesArray = await Promise.all(
          sources.map(async (source) => {
            const sourceName = await userService.getSourceName(source);
            return { id: source, name: sourceName.name, source: sourceName.type };
          })
        );
        setOptions(sourceNamesArray);
        setFetchSourcesComplete(true);
      } else {
        console.log('No user info found 😞');
      }
    };
    fetchSources();
  }, [fetchSourcesComplete]);


  function getSourceName(sourceId) {
    const option = options.find(option => option.id === sourceId);
    return option ? option.name : 'Unknown';
  }

  function getRecommendationStats(recs) {
    const statsBySourceAndType = {};

    recs.forEach((rec) => {
      if (!statsBySourceAndType[rec.source]) {
        statsBySourceAndType[rec.source] = {};
      }
      if (!statsBySourceAndType[rec.source][rec.type]) {
        statsBySourceAndType[rec.source][rec.type] = {
          totalRecs: 0,
          totalRatings: 0,
          totalScore: 0,
          averageScore: 0,
        };
      }
      statsBySourceAndType[rec.source][rec.type].totalRecs++;
      if (typeof rec.rating === 'number' && !isNaN(rec.rating)) {
        statsBySourceAndType[rec.source][rec.type].totalRatings++;
        statsBySourceAndType[rec.source][rec.type].totalScore += rec.rating;
        statsBySourceAndType[rec.source][rec.type].averageScore = (statsBySourceAndType[rec.source][rec.type].totalScore / statsBySourceAndType[rec.source][rec.type].totalRatings);
      }
    });
    return statsBySourceAndType;
  }


  function getUserRecommendations(userId) {
    return recService.getUserRecs(userId)
      .then((recs) => {
        let filteredRecs = recs.filter((rec) => rec.to === userId);
        const updatedRecs = filteredRecs.map((rec) => {
          const ratings = recs.filter((r) => r.source === rec.source && r.type === rec.type && typeof r.rating === 'number' && !isNaN(r.rating)).map((r) => r.rating);
          if (ratings.length > 0) {
            const avgRating = ratings.reduce((acc, val) => acc + val) / ratings.length;
            return { ...rec, avgRating }; // Create new object with updated field
          } else {
            return { ...rec, avgRating: 0 };
          }
        }).filter((rec) => typeof rec.avgRating === 'number');
        updatedRecs.sort((a, b) => b.avgRating - a.avgRating);
        setRecs(updatedRecs);
        const statsBySourceAndType = getRecommendationStats(updatedRecs);
        setStats(statsBySourceAndType); // Output the stats object
        console.log(stats)

        return updatedRecs;
      });
  }

  return (
    <TableContainer component={Paper} className={styles.RecList}>
      <Table sx={{ minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={6} align="center">
              <Box sx={{ color: 'white', width: 1, border: 1, bgcolor: '#1976d2' }}>
                Friends and Sources Stats
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">Source</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Recs</TableCell>
            <TableCell align="center">Ratings</TableCell>
            <TableCell align="center">Total</TableCell>
            <TableCell align="center">Average</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(stats)
            .sort()
            .flatMap((source) =>
              Object.keys(stats[source]).map((type) => (
                <TableRow key={`${source}-${type}`}>
                  <TableCell component="th" scope="row" align="center">
                    {getSourceName(source).charAt(0).toUpperCase() +
                      getSourceName(source).slice(1)}
                  </TableCell>
                  <TableCell align="center">
                    {type === "tv"
                      ? "TV"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </TableCell>
                  <TableCell align="center">
                    {stats[source][type].totalRecs}
                  </TableCell>
                  <TableCell align="center">
                    {stats[source][type].totalRatings}
                  </TableCell>
                  <TableCell align="center">
                    {stats[source][type].totalScore}
                  </TableCell>
                  <TableCell align="center">
                    {stats[source][type].averageScore === 0
                      ? '-'
                      : stats[source][type].averageScore}
                  </TableCell>
                </TableRow>
              ))
            )}
        </TableBody>

      </Table>
    </TableContainer>

  );
}

export default FriendList;