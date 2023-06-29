import React, { useState, useEffect, useContext } from 'react';
import styles from './rating-list.module.css';
import recService from './../../Services/RecService';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Rating, } from '@mui/material';
import Paper from '@mui/material/Paper';
import RatingFormDialog from '../rating-add/rating-add';
import StarIcon from '@mui/icons-material/Star';
import SendRecFormDialog from '../rec-send/rec-send';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import * as userService from '../../Services/UserService';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookIcon from '@mui/icons-material/Book';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import CasinoIcon from '@mui/icons-material/Casino';
import Box from '@mui/material/Box';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Context } from '../../Context';
import { createTheme, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'black',
  fontWeight: 'lighter',
  fontSize: '14px',
  padding: '5px',
  margin: '3px',
}));

const StyledRating = styled(Rating)({
  iconFilled: {
    color: 'currentColor',
  },
  iconEmpty: {
    opacity: 0.55,
  },
});

function RatingList() {
  const { currentUser } = useContext(Context);
  const userId = currentUser.id;
  const [recs, setRecs] = useState([]);
  const [ratingSeen, setRatingSeen] = useState(false);
  const [sendRecSeen, setSendRecSeen] = useState(false);
  const [options, setOptions] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const smallButtonWidth = 50;
  const buttonWidth = 120;
  const theme = createTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getUserRecommendations(userId)
      .catch((e) => console.log(e));
  }, [userId, ratingSeen, sendRecSeen]);

  useEffect(() => {
    const fetchSources = async () => {
      const sources = currentUser.sources;
      const sourceNamesArray = await Promise.all(
        sources.map(async (source) => {
          const sourceName = await userService.getSourceName(source);
          return { id: source, name: sourceName.name };
        })
      );
      setOptions(sourceNamesArray);
      setFetchSourcesComplete(true);
    };
    fetchSources();
  }, [fetchSourcesComplete]);

  function getUserRecommendations(userId) {
    return recService.getUserRecs(userId)
      .then((recs) => {
        let filteredRecs = recs.filter((rec) => rec.to === userId);
        filteredRecs = filteredRecs.filter((rec) => rec.rating && !isNaN(rec.rating));
        filteredRecs.sort((a, b) => a.ratingDate - b.ratingDate);
        setRecs(filteredRecs);
        return filteredRecs;
      });
  }

  function toggleRatingPop(rec) {
    setSelectedRec(rec);
    setRatingSeen(!ratingSeen);
  }

  function toggleSendRecPop(rec) {
    setSelectedRec(rec);
    setSendRecSeen(!sendRecSeen);
  }

  return (
    <>
      {recs.length === 0 ? (
        <p>No ratings added</p>
      ) : (
        <TableContainer component={Paper} className={styles.RecList}>
          <Table sx={{ minWidth: 200, padding: 0 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} align="center" >
                  <Box sx={{ color: 'white', width: 1, border: 1, bgcolor: '#1976d2' }}>My Ratings</Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recs.map((rec) => (
                <TableRow
                  key={rec._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { padding: '0px 0px' } }}
                >
                  <TableCell component="th" scope="row" sx={{ padding: '10px' }}>
                    {rec.type === 'book' ? (
                      rec.image ? (
                        <div style={{ paddingLeft: '10px' }}>
                          <img src={rec.image} alt={rec.title} style={{ width: '100px', height: '100px' }} />
                        </div>
                      ) : (
                        <div style={{ paddingLeft: '10px' }}>
                          <img src="https://st.depositphotos.com/1815808/1437/i/600/depositphotos_14371949-stock-photo-old-books-background.jpg" alt={rec.title} style={{ width: '100px', height: '100px' }} />
                        </div>
                      )
                    ) : rec.type === 'video' ? (
                      <div style={{ paddingLeft: '10px' }}>
                        <img src="https://cdn.pixabay.com/photo/2016/06/29/14/17/joystick-1486908_640.png" alt={rec.title} style={{ width: '100px', height: 'auto' }} />
                      </div>) : rec.type === 'board' ? (
                        <div style={{ paddingLeft: '10px' }}>
                          <img src="https://www.ageukmobility.co.uk/media/cache/default_530/upload/62/48/624887001a83bfa9e086aab9090cff8c8b51f234.jpeg" alt={rec.title} style={{ width: 'auto', height: '100px' }} />
                        </div>) : rec.type === 'movie' || rec.type === 'tv' ? (
                          <div style={{ paddingLeft: '10px' }}>
                            <img src={rec.image} alt={rec.title} style={{ width: 'auto', height: '100px' }} />
                          </div>) : (
                      <div style={{ paddingLeft: '10px' }}>
                        <img src={rec.image} alt={rec.title} style={{ width: 'auto', height: '100px' }} />
                      </div>)}
                  </TableCell>
                  <TableCell sx={{ padding: '0px' }}>
                    {isSmallScreen ? (
                      <>
                        <Stack direction="column" spacing={0} justifyContent="left" alignItems="flex-start">
                          <Item><span style={{ fontStyle: 'italic', fontWeight: 'bolder' }}>{rec.title}</span> ({rec.year})</Item>
                          <Item><span style={{ fontWeight: 'bold' }}>{rec.author}</span></Item>
                        </Stack>
                        {rec.sources.map((source, index) => (
                          <Stack direction="row" key={index}>
                            {source.source && (
                              <Item>
                                {options.find((option) => option.id === source.source)?.name.charAt(0).toUpperCase() +
                                  options.find((option) => option.id === source.source)?.name.slice(1)}
                              </Item>
                            )}
                            {source.sourceComment && (
                              <Item style={{ display: 'flex', alignItems: 'center', height: '20px' }}>
                                <p>
                                  <span className="tooltip">
                                    <ChatBubbleOutlineIcon />
                                    <span className="tooltiptext">{source.sourceComment}</span>
                                  </span>
                                </p>
                              </Item>
                            )}
                          </Stack>
                        ))}
                      </>
                    ) : (
                      <>
                        <Stack direction="row" spacing={0} justifyContent="left" alignItems="flex-start">
                          <Item>
                            {rec.type === 'music' && <MusicNoteIcon fontSize="" />}
                            {rec.type === 'movie' && <MovieIcon fontSize="" />}
                            {rec.type === 'tv' && <TvIcon fontSize="" />}
                            {rec.type === 'book' && <BookIcon fontSize="" />}
                            {rec.type === 'video' && <VideogameAssetIcon fontSize="" />}
                            {rec.type === 'board' && <CasinoIcon fontSize="" />}
                          </Item>
                          <Item><span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{rec.title}</span> ({rec.year})</Item>
                          <Item>{rec.author}</Item>
                        </Stack>
                        <Stack direction="column">
                          {rec.sources.map((source, index) => (
                            <Stack direction="row" key={index}>
                              {source.source && (
                                <Item>
                                  {options.find((option) => option.id === source.source)?.name.charAt(0).toUpperCase() +
                                    options.find((option) => option.id === source.source)?.name.slice(1)}
                                </Item>
                              )}
                              <Item>{new Date(rec.ratingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Item>
                              {source.sourceComment && (
                                <Item style={{ display: 'flex', alignItems: 'center', height: '20px' }}>
                                  <p>
                                    <span className="tooltip">
                                      <ChatBubbleOutlineIcon />
                                      <span className="tooltiptext">{source.sourceComment}</span>
                                    </span>
                                  </p>
                                </Item>
                              )}
                            </Stack>
                          ))}
                        </Stack>
                      </>
                    )}
                  </TableCell>
                  <TableCell sx={{ padding: '0px' }}>
                    <Stack direction="column" alignItems="flex-end" sx={{ paddingRight: '20px' }}>
                      <p>
                        <Button variant="contained" size='small' style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }} onClick={() => toggleSendRecPop(rec)}>Rec{!isSmallScreen && 'ommend'}</Button>
                      </p>
                      <Stack direction="row" justifyContent="flex-end" alignItems="center">
                        {rec.ratingComment && (
                          <p>
                            <span className="tooltip">
                              <ChatBubbleOutlineIcon style={{ verticalAlign: 'top', height: '20px' }} />
                              <span className="tooltiptext">{rec.ratingComment}</span>
                            </span>
                          </p>
                        )}
                        {isSmallScreen && typeof rec.rating === 'number' ? (
                          <p style={{ display: 'flex', alignItems: 'center', margin: '0' }}>{rec.rating} <StarIcon style={{ verticalAlign: 'middle', color: "orange", marginLeft: '6px' }} /></p>
                        ) : (
                          typeof rec.rating === 'number' && (
                            <Rating
                              value={rec.rating}
                              precision={0.5}
                              emptyIcon={<StarIcon fontSize="inherit" />}
                              readOnly
                              style={{ margin: '4px 0' }}
                            />
                          )
                        )}
                      </Stack>
                      <p>
                        <Button variant="contained" size='small' style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }} onClick={() => toggleRatingPop(rec)} startIcon={<EditIcon />}>{!isSmallScreen && 'Edit'}</Button>
                      </p>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {ratingSeen ? (
        <RatingFormDialog
          rec={selectedRec}
          open={ratingSeen}
        />
      ) : null}
      {sendRecSeen ? (
        <SendRecFormDialog
          rec={selectedRec}
          open={sendRecSeen}
        />
      ) : null}
    </>
  );
}

export default RatingList;