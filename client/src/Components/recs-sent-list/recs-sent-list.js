import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from './recs-sent-list.module.css';
import recService from './../../Services/RecService';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import SendRecFormDialog from '../rec-send/rec-send';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import * as userService from '../../Services/UserService';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookIcon from '@mui/icons-material/Book';
import CasinoIcon from '@mui/icons-material/Tv';
import VideogameAssetIcon from '@mui/icons-material/Book';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Box from '@mui/material/Box';
import { Context } from '../../Context';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'black',
}));

function RecSentList() {
  const { currentUser } = useContext(Context)
  const userId = currentUser.id;
  const [recs, setRecs] = useState([]);
  const [sendRecSeen, setSendRecSeen] = useState(false);
  const [options, setOptions] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);

  useEffect(() => {
    getSentRecommendations(userId)
      .catch((e) => console.log(e));
  }, [userId]);

  useEffect(() => {
    const fetchSources = async () => {
      const to = currentUser.sources;
      if (to) {
        const toNamesArray = await Promise.all(
          to.map(async (to) => {
            const toName = await userService.getSourceName(to);
            return { id: to, name: toName.name };
          })
        );
        setOptions(toNamesArray);
        setFetchSourcesComplete(true);
      } else {
        console.log('No user info found 😞');
      }
    };
    fetchSources();
  }, [fetchSourcesComplete]);

  function getSentRecommendations(userId) {
    return recService.getSentRecs(userId)
      .then((recs) => {
        let filteredRecs = recs.filter((rec) => rec.source === userId);
        setRecs(filteredRecs);
        console.log(filteredRecs)
        return filteredRecs;
      });
  }

  function toggleSendRecPop(rec) {
    setSelectedRec(rec);
    setSendRecSeen(!sendRecSeen);
  }

  return (
    <>
      <TableContainer component={Paper} className={styles.RecList}>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} align="center" ><Box sx={{ color: 'white', width: 1, border: 1, bgcolor: '#1976d2' }}>Recs Sent</Box></TableCell>
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
                  ) : rec.type === 'video' ? (
                    <img src="https://cdn.pixabay.com/photo/2016/06/29/14/17/joystick-1486908_640.png" alt={rec.title} style={{ width: '100px', height: 'auto' }} />
                  ) : rec.type === 'board' ? (
                    <img src="https://www.ageukmobility.co.uk/media/cache/default_530/upload/62/48/624887001a83bfa9e086aab9090cff8c8b51f234.jpeg" alt={rec.title} style={{ width: 'auto', height: '100px' }} />
                  ) : rec.type === 'movie' || rec.type === 'tv' ? (
                    <img src={rec.image} alt={rec.title} style={{ width: 'auto', height: '100px' }} />
                  ) : <img src={rec.image} alt={rec.title} style={{ width: 'auto', height: '100px' }} />}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0} justifyContent="left" alignItems="flex-start">
                    <Item>
                      {rec.type === 'music' && <MusicNoteIcon fontSize="" />}
                      {rec.type === 'movie' && <MovieIcon fontSize="" />}
                      {rec.type === 'tv' && <TvIcon fontSize="" />}
                      {rec.type === 'book' && <BookIcon fontSize="" />}
                      {rec.type === 'video' && <VideogameAssetIcon fontSize="" />}
                      {rec.type === 'board' && <CasinoIcon fontSize="" />}
                    </Item>
                    <Item>{rec.title}</Item>
                    <Item>{rec.author}</Item>
                    <Item>{rec.year}</Item>
                  </Stack>
                  <p></p><Stack direction="row">
                    <Item>
                      {options.find(option => option.id === rec.to)?.name.charAt(0).toUpperCase() + options.find(option => option.id === rec.to)?.name.slice(1)}
                    </Item>
                    <Item>{new Date(rec.recDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Item>
                    {rec.sourceComment && (
                      <Item style={{ display: 'flex', alignItems: 'center', height: '20px' }}>
                        <p>
                          <span className="tooltip">
                            <ChatBubbleOutlineIcon />
                            <span className="tooltiptext">{rec.sourceComment}</span>
                          </span>
                        </p>
                      </Item>)}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Rating
                    value={rec.rating}
                    precision={0.5}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  {rec.ratingComment && (
                    <p>
                      <span className="tooltip">
                        <ChatBubbleOutlineIcon style={{ verticalAlign: 'top', height: '20px' }} />
                        <span className="tooltiptext">{rec.ratingComment}</span>
                      </span>
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        sendRecSeen ? <SendRecFormDialog
          rec={selectedRec}
          open={sendRecSeen}
        /> : null
      }
    </>
  );
};

export default RecSentList;