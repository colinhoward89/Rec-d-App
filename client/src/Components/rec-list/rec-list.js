import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './rec-list.module.css';
import recService from './../../Services/RecService';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RatingFormDialog from '../rating-add/rating-add';
import SendRecFormDialog from '../rec-send/rec-send';
import userService from '../../Services/UserService';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookIcon from '@mui/icons-material/Book';
import Box from '@mui/material/Box';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'black',
}));

function RecList() {
  const { userId } = useParams();
  const [recs, setRecs] = useState([]);
  const [ratingSeen, setRatingSeen] = useState(false);
  const [recSeen, setRecSeen] = useState(false);
  const [options, setOptions] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);

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
            return { id: source, name: sourceName.name };
          })
        );
        setOptions(sourceNamesArray);
        setFetchSourcesComplete(true);
      } else {
        console.log('No user info found ????');
      }
    };
    fetchSources();
  }, [fetchSourcesComplete]);

  function getUserRecommendations(userId) {
    return recService.getUserRecs(userId)
      .then((recs) => {
        let filteredRecs = recs.filter((rec) => rec.to === userId);
        filteredRecs = filteredRecs.filter((rec) => !rec.rating);
        const updatedRecs = filteredRecs.map((rec) => {
          const ratings = recs.filter((r) => r.source === rec.source && r.type === rec.type && typeof r.rating === 'number' && !isNaN(r.rating)).map((r) => r.rating);
          if (ratings.length > 0) {
            const avgRating = ratings.reduce((acc, val) => acc + val) / ratings.length;
            return {...rec, avgRating }; // Create new object with updated field
          } else {
            return {...rec, avgRating: 0 };
          }
        }).filter((rec) => typeof rec.avgRating === 'number');
        updatedRecs.sort((a, b) => b.avgRating - a.avgRating);
        setRecs(updatedRecs);
        return updatedRecs;
      });
  }

  function toggleRatingPop(rec) {
    setSelectedRec(rec);
    setRatingSeen(!ratingSeen);
  }

  function toggleRecPop(rec) {
    setSelectedRec(rec);
    setRecSeen(!recSeen);
  }

  function handleRatingSubmit(rating) {
    const updatedRecs = recs.filter((rec) => rec._id !== selectedRec._id);
    setRecs(updatedRecs);
    setSelectedRec(null);
    setRatingSeen(false);
  }

  return (
    <>
      <TableContainer component={Paper} className={styles.RecList}>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} align="center" ><Box sx={{ color: 'white', width: 1, border: 1, bgcolor: '#1976d2'}}> Rec'd List</Box></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recs.map((rec) => (
              <TableRow
                key={rec._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                {rec.type === 'book' ? (
                    rec.image ? (
                      <img src={rec.image} alt={rec.title} style={{ width: '100px', height: '100px' }} />
                    ) : (
                      <img src="https://st.depositphotos.com/1815808/1437/i/600/depositphotos_14371949-stock-photo-old-books-background.jpg" alt={rec.title} style={{ width: '100px', height: '100px' }} />
                    )
                  ) : (
                    <img src={rec.image} alt={rec.title} style={{ width: '100px', height: '100px' }} />
                  )}
                </TableCell>
                <TableCell><Stack direction="row" spacing={0} justifyContent="left" alignItems="flex-start">
                <Item>
                      {rec.type === 'music' && <MusicNoteIcon fontSize="" />}
                      {rec.type === 'movie' && <MovieIcon fontSize=""/>}
                      {rec.type === 'tv' && <TvIcon fontSize=""/>}
                      {rec.type === 'book' && <BookIcon fontSize=""/>}
                    </Item>
                    <Item>{rec.title}</Item><Item>{rec.author}</Item><Item>{rec.year}</Item></Stack>
                <p></p><Stack direction="row"><Item>{options.find(option => option.id === rec.source)?.name.charAt(0).toUpperCase() + options.find(option => option.id === rec.source)?.name.slice(1)}</Item><Item>{new Date(rec.recDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Item></Stack></TableCell>
                  <TableCell>
                    <Button variant='contained' onClick={() => toggleRatingPop(rec)}>&nbsp;Add rating&nbsp;</Button>
                    <p><Button variant='contained' onClick={() => toggleRecPop(rec)}>Recommend</Button></p>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {ratingSeen ? <RatingFormDialog
        rec={selectedRec}
        open={ratingSeen}
        onSubmit={handleRatingSubmit}
      /> : null}
      {recSeen ? <SendRecFormDialog
        rec={selectedRec}
        open={recSeen}
      /> : null}
    </>
  );
};


export default RecList;