import React, { useState, useEffect, useContext } from 'react';
import styles from './rec-list.module.css';
import recService from './../../Services/RecService';
import Paper from '@mui/material/Paper';
import RatingFormDialog from '../rating-add/rating-add';
import SendRecFormDialog from '../rec-send/rec-send';
import * as userService from '../../Services/UserService';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookIcon from '@mui/icons-material/Book';
import Box from '@mui/material/Box';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import CasinoIcon from '@mui/icons-material/Casino';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { Context } from '../../Context';
import { createTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: 'black',
  fontWeight: 'lighter',
  fontSize: '14px',
  padding: '5px',
  margin: '3px',
}));

function RecList() {
  const { currentUser } = useContext(Context)
  const userId = currentUser.id;
  const [recs, setRecs] = useState([]);
  const [ratingSeen, setRatingSeen] = useState(false);
  const [recSeen, setRecSeen] = useState(false);
  const [options, setOptions] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const smallButtonWidth = 50;
  const buttonWidth = 120;
  const theme = createTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getUserRecommendations(currentUser.id)
      .catch((e) => console.log(e));
  }, [currentUser.id]);

  useEffect(() => {
    const fetchSources = async () => {
      const sources = currentUser.sources;
      if (sources) {
        const sourceNamesArray = await Promise.all(
          sources.map(async (source) => {
            const sourceName = await userService.getSourceName(source);
            return { id: source, name: sourceName.name };
          })
        );
        setOptions(sourceNamesArray);
        setFetchSourcesComplete(true);

      } else {
        console.log('No user sources found 😞');
      }
    };
    fetchSources();
  }, [fetchSourcesComplete]);

  function getUserRecommendations(userId) {
    return recService.getUserRecs(userId).then((recs) => {
      let filteredRecs = recs.filter((rec) => rec.to === userId);
      let updatedRecs = filteredRecs.map((rec) => {
        const sources = rec.sources.map((source) => source.source);
        const ratings = recs
          .filter(
            (r) =>
              r.sources.some((source) => sources.includes(source.source)) &&
              r.type === rec.type &&
              typeof r.rating === 'number' &&
              !isNaN(r.rating)
          )
          .map((r) => r.rating);
        if (ratings.length > 0) {
          const maxRating = Math.max(...ratings);
          let avgRating = maxRating;
          if (ratings.length > 1) {
            avgRating += 0.5 * (ratings.length - 2);
          }
          return { ...rec, avgRating };
        } else {
          return { ...rec, avgRating: 0 };
        }
      }).filter((rec) => rec.avgRating !== null);

      // Sort by urgent flag (true first) and then by average rating
      updatedRecs = updatedRecs.filter((rec) => !rec.rating);
      updatedRecs.sort((a, b) => {
        if (a.urgent && !b.urgent) {
          return -1; // a is urgent, b is not urgent
        } else if (!a.urgent && b.urgent) {
          return 1; // a is not urgent, b is urgent
        } else {
          return b.avgRating - a.avgRating; // sort by average rating
        }
      });
      setRecs(updatedRecs);
      return updatedRecs;
    });
  }

  function toggleRatingPop(rec) {
    setSelectedRec(rec);
    setRatingSeen(!ratingSeen);
  }

  async function toggleUrgentPop(rec) {
    setSelectedRec(rec);
    await recService.updateUrgent(rec);
    getUserRecommendations(userId);
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
      {recs.length == 0 ? (
        <p style={{ fontWeight: "bold", color: "white" }}>No recommendations outstanding</p>
      ) : (
        <TableContainer component={Paper} className={styles.RecList}>
          <Table sx={{ minWidth: 200, padding: 0 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Box sx={{ color: 'white', width: 1, border: 1, bgcolor: '#1976d2' }}> Rec'd List</Box>
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
                          <img
                            src="https://st.depositphotos.com/1815808/1437/i/600/depositphotos_14371949-stock-photo-old-books-background.jpg"
                            alt={rec.title}
                            style={{ width: '100px', height: '100px' }}
                          />
                        </div>
                      )
                    ) : rec.type === 'video' ? (
                      <div style={{ paddingLeft: '10px' }}>
                        <img
                          src="https://cdn.pixabay.com/photo/2016/06/29/14/17/joystick-1486908_640.png"
                          alt={rec.title}
                          style={{ width: '100px', height: 'auto' }}
                        />
                      </div>
                    ) : rec.type === 'board' ? (
                      <div style={{ paddingLeft: '10px' }}>
                        <img
                          src="https://www.ageukmobility.co.uk/media/cache/default_530/upload/62/48/624887001a83bfa9e086aab9090cff8c8b51f234.jpeg"
                          alt={rec.title}
                          style={{ width: 'auto', height: '100px' }}
                        />
                      </div>
                    ) : rec.type === 'movie' || rec.type === 'tv' ? (
                      <div style={{ paddingLeft: '10px' }}>
                        <img src={rec.image} alt={rec.title} style={{ width: 'auto', height: '100px' }} />
                      </div>
                    ) : (
                      <div style={{ paddingLeft: '10px' }}>
                        <img src={rec.image} alt={rec.title} style={{ width: 'auto', height: '100px' }} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell sx={{ padding: '0px' }}>
                  {isSmallScreen ? (
                    <>
                      <Stack direction="column" spacing={0} justifyContent="left" alignItems="flex-start">
                        {rec.urgent && (
                          <Item style={{ display: 'flex', alignItems: 'center', height: '20px' }}>
                            <PriorityHighIcon />
                          </Item>
                        )}
                        <Item><span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{rec.title}</span> ({rec.year})</Item>
                        <Item>{rec.author}</Item>
                      </Stack>
                      {rec.sources.map((source, index) => (
                        <Stack direction="row" key={index}>
                          <Item>
                            {options.find((option) => option.id === source.source)?.name.charAt(0).toUpperCase() +
                              options.find((option) => option.id === source.source)?.name.slice(1)}
                          </Item>
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
                      {rec.urgent && (
                        <Item style={{ display: 'flex', alignItems: 'center', height: '20px' }}>
                          <PriorityHighIcon />
                        </Item>
                      )}
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
                          <Item>
                            {options.find((option) => option.id === source.source)?.name.charAt(0).toUpperCase() +
                              options.find((option) => option.id === source.source)?.name.slice(1)}
                          </Item>
                          <Item>
                            {new Date(source.recDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Item>
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
                        <Button variant="contained" size="small" style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }} onClick={() => toggleUrgentPop(rec)}>
                          <PriorityHighIcon />
                        </Button>
                        </p>
                        <Button
                          variant="contained"
                          size="small"
                          style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }}
                          onClick={() => toggleRatingPop(rec)}
                        >
                          {isSmallScreen ? 'Rate' : 'Add Rating'}
                        </Button><p>
                      <Button variant="contained" size="small" style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }} onClick={() => toggleRecPop(rec)}>
                        Rec{!isSmallScreen && 'ommend'}
                      </Button>
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
        <RatingFormDialog rec={selectedRec} open={ratingSeen} onSubmit={handleRatingSubmit} />
      ) : null}
      {recSeen ? <SendRecFormDialog rec={selectedRec} open={recSeen} /> : null}
    </>
  );
}

export default RecList;