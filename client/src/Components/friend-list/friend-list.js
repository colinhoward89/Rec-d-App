import React, { useEffect, useState, useContext } from 'react';
import styles from './friend-list.module.css';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import * as userService from './../../Services/UserService';
import recService from '../../Services/RecService';
import { Context } from '../../Context';
import SourceFormDialog from '../add-source/add-source';
import FriendFormDialog from '../add-friend/add-friend';
import FriendRequestsFormDialog from '../friend-requests/friend-requests';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookIcon from '@mui/icons-material/Book';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import CasinoIcon from '@mui/icons-material/Casino';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'black',
}));

const FriendList = () => {
  const { currentUser } = useContext(Context)
  const userId = currentUser.id;
  const [options, setOptions] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [stats, setStats] = useState({});
  const [requestsSeen, setRequestsSeen] = useState(false);
  const [addFriendSeen, setAddFriendSeen] = useState(false);
  const [addSourceSeen, setAddSourceSeen] = useState(false);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    getUserRecommendations(userId)
      .catch((e) => console.log(e));
  }, [userId]);

  useEffect(() => {
    const fetchSources = async () => {
      const sources = currentUser.sources;
      if (sources) {
        const sourceNamesArray = await Promise.all(
          sources.map(async (source) => {
            const sourceName = await userService.getSourceName(source);
            return { id: source, name: sourceName.name, source: sourceName.type };
          })
        );
        setOptions(sourceNamesArray);

        setFetchSourcesComplete(true);
      } else {
        console.log('No sources found')
      }
    }
    fetchSources();
  }, [fetchSourcesComplete]);

  function getSourceName(sourceId) {
    const option = options.find(option => option.id === sourceId);
    return option ? option.name : 'Unknown';
  }

  function getRecommendationStats(recs) {
    const statsBySourceAndType = {};
  
    recs.forEach((rec) => {
      rec.sources.forEach((source) => {
        const sourceId = source.source;
        const sourceStats = statsBySourceAndType[sourceId];
  
        if (!sourceStats) {
          statsBySourceAndType[sourceId] = {};
        }
  
        const type = rec.type;
        const sourceTypeStats = statsBySourceAndType[sourceId][type];
  
        if (!sourceTypeStats) {
          statsBySourceAndType[sourceId][type] = {
            totalRecs: 0,
            totalRatings: 0,
            totalScore: 0,
            averageScore: 0,
          };
        }
  
        const { totalRecs, totalRatings, totalScore } = statsBySourceAndType[sourceId][type];
  
        statsBySourceAndType[sourceId][type] = {
          totalRecs: totalRecs + 1,
          totalRatings: typeof rec.rating === 'number' && !isNaN(rec.rating) ? totalRatings + 1 : totalRatings,
          totalScore: typeof rec.rating === 'number' && !isNaN(rec.rating) ? totalScore + rec.rating : totalScore,
          averageScore: 0,
        };
      });
    });
  
    Object.keys(statsBySourceAndType).forEach((sourceId) => {
      Object.keys(statsBySourceAndType[sourceId]).forEach((type) => {
        const { totalRatings, totalScore } = statsBySourceAndType[sourceId][type];
        const averageScore = totalRatings > 0 ? totalScore / totalRatings : 0;
        statsBySourceAndType[sourceId][type].averageScore = averageScore;
      });
    });
  
    return statsBySourceAndType;
  }  

function getUserRecommendations(userId) {
  return recService.getUserRecs(userId).then((recs) => {
    let filteredRecs = recs.filter((rec) => rec.to === userId);
    const updatedRecs = filteredRecs.map((rec) => {
      const ratings = recs.filter(
        (r) =>
          rec.sources.some((source) => source.source === r.source) &&
          r.type === rec.type &&
          typeof r.rating === 'number' &&
          !isNaN(r.rating)
      ).map((r) => r.rating);
      if (ratings.length > 0) {
        const avgRating = ratings.reduce((acc, val) => acc + val) / ratings.length;
        return { ...rec, avgRating };
      } else {
        return { ...rec, avgRating: 0 };
      }
    }).filter((rec) => typeof rec.avgRating === 'number');
    updatedRecs.sort((a, b) => b.avgRating - a.avgRating);
    setRecs(updatedRecs);
    const statsBySourceAndType = getRecommendationStats(updatedRecs);
    setStats(statsBySourceAndType);
    return updatedRecs;
  });
}

  const sourcesWithRecs = Object.keys(stats).filter((sourceId) => {
    const sourceStats = stats[sourceId];
    return Object.keys(sourceStats).some((type) => sourceStats[type].totalRecs > 0);
  });

  const sourcesWithoutRecs = options.filter((option) => !sourcesWithRecs.includes(option.id));
  
  function toggleRequestsPop() {
    setRequestsSeen(!requestsSeen);
  }

  function toggleAddFriendPop() {
    setAddFriendSeen(!addFriendSeen);
  }

  function toggleAddSourcePop() {
    setAddSourceSeen(!addSourceSeen);
  }

  function handleRequests() {
    setRequestsSeen(false);
  }

  function handleFriendAdd() {
    setAddFriendSeen(false);
  }

  function handleSourceAdd() {
    setAddSourceSeen(false);
  }

  return (
    <div>
      <br></br>
      <Button variant="contained" onClick={() => toggleRequestsPop()}>Requests ({currentUser.requestRec.length})</Button>
      <Button variant="contained" onClick={() => toggleAddFriendPop()}>Add Friend</Button>
      <Button variant="contained" onClick={() => toggleAddSourcePop()}>Add Source</Button>
      <div className={styles.RecList}>
        <TableContainer component={Paper}>
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
                <TableCell align="center"></TableCell>
                <TableCell align="center">Recs</TableCell>
                <TableCell align="center">Ratings</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Average</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sourcesWithRecs.map((sourceId) => {
                const option = options.find((o) => o.id === sourceId);
                if (!option) return null;
                const { id, name } = option;
                const sourceName = name.charAt(0).toUpperCase() + name.slice(1);
                const sourceStats = stats[id];

                return Object.keys(sourceStats).map((type) => {
                  const { totalRecs, totalRatings, totalScore, averageScore } = sourceStats[type];

                  return (
                    <TableRow key={`${id}-${type}`}>
                      <TableCell component="th" scope="row" align="center">
                        {sourceName}
                      </TableCell>
                      <TableCell align="center">
                      {type === 'music' ? <MusicNoteIcon fontSize="small" /> : type === 'movie' ? <MovieIcon fontSize="small" /> : type === 'tv' ? <TvIcon fontSize="small" /> : type === 'book' ? <BookIcon fontSize="small" /> : type === 'video' ? <VideogameAssetIcon fontSize="small" /> : <CasinoIcon fontSize="small" />}
                        {/* {type === 'tv' ? 'TV' : type.charAt(0).toUpperCase() + type.slice(1)} */}
                      </TableCell>
                      <TableCell align="center">{totalRecs}</TableCell>
                      <TableCell align="center">{totalRatings}</TableCell>
                      <TableCell align="center">{totalScore}</TableCell>
                      <TableCell align="center">
                        {averageScore === 0 ? '-' : averageScore}
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
              {sourcesWithoutRecs.map((option) => {
                const { id, name } = option;
                const sourceName = name.charAt(0).toUpperCase() + name.slice(1);

                return (
                  <TableRow key={id}>
                    <TableCell component="th" scope="row" align="center">
                      {sourceName}
                    </TableCell>
                    <TableCell colSpan={5} align="center">
                      No recommendations received
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {requestsSeen ? <FriendRequestsFormDialog
        open={requestsSeen}
        onSubmit={handleRequests}
      /> : null}
      {addFriendSeen ? <FriendFormDialog
        open={addFriendSeen}
        onSubmit={handleFriendAdd}
      /> : null}
      {addSourceSeen ? <SourceFormDialog
        open={addSourceSeen}
        onSubmit={handleSourceAdd}
      /> : null}
    </div>
  );
};

export default FriendList;