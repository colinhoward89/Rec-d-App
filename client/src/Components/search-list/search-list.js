import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './search-list.module.css';
import musicService from '../../Services/MusicService';
import movieService from '../../Services/MovieService';
import tvService from '../../Services/TVService';
import bookService from '../../Services/BookService';
import boardGameService from '../../Services/BoardGameService';
import videoGameService from '../../Services/VideoGameService';
import RecFormDialog from '../rec-add/rec-add';
import RatingFormDialog from '../rating-add/rating-add';
import SendRecFormDialog from '../rec-send/rec-send';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
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

function SearchList() {
  const { searchtype, query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);
  const [recSeen, setRecSeen] = useState(false);
  const [sendRecSeen, setSendRecSeen] = useState(false);
  const [ratingSeen, setRatingSeen] = useState(false);
  const smallButtonWidth = 50;
  const buttonWidth = 120;
  const theme = createTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (searchtype === 'music') {
      musicService.getSearchResults(query)
        .then(results => {
          const modifiedResults = results.map(item => ({
            mediaId: item.id,
            author: item.artist,
            title: item.name,
            year: item.year,
            image: item.image,
            type: 'music'
          }));
          setSearchResults([...modifiedResults]);
        })
        .catch(e => console.log(e));
    } else if (searchtype === 'movie') {
      movieService.getSearchResults(query)
        .then(results => {
          const modifiedResults = results.map(item => ({
            mediaId: item.imdbID,
            author: item.Director,
            title: item.Title,
            year: item.Year,
            image: item.Poster,
            type: 'movie'
          }));
          setSearchResults([...modifiedResults])
        })
    } else if (searchtype === 'tv') {
      tvService.getSearchResults(query)
        .then(results => {
          const modifiedResults = results.map(item => ({
            mediaId: item.id,
            author: item.network,
            title: item.name,
            year: item.premiered.substring(0, 4),
            image: item.imageUrl,
            type: 'tv'
          }));
          setSearchResults([...modifiedResults])
        })
    } else if (searchtype === 'book') {
      bookService.getSearchResults(query)
        .then(results => {
          const modifiedResults = results.map(item => ({
            mediaId: item._version_,
            author: item.author,
            title: item.title,
            year: item.first_publish_year,
            image: item.imageUrl,
            type: 'book'
          }));
          setSearchResults([...modifiedResults])
        })
    } else if (searchtype === 'video') {
      videoGameService.getSearchResults(query)
        .then(results => {
          const modifiedResults = results.map(item => ({
            mediaId: item.id,
            author: item.author,
            title: item.name,
            year: item.first_publish_year,
            image: item.imageUrl,
            type: 'video'
          }));
          setSearchResults([...modifiedResults])
        })
    } else if (searchtype === 'board') {
      boardGameService.getSearchResults(query)
        .then(results => {
          const modifiedResults = results.map(item => ({
            mediaId: item.id,
            author: item.author,
            title: item.name,
            year: item.year,
            image: item.imageUrl,
            type: 'board'
          }));
          setSearchResults([...modifiedResults])
        })
    }
  }, [query, searchtype]);

  function toggleRecPop(rec) {
    setSelectedRec(rec);
    setRecSeen(!recSeen);
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
      <TableContainer component={Paper} className={styles.SearchList}>
        <Table sx={{ minWidth: 200, padding: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Box sx={{ color: 'white', width: 1, border: 1, bgcolor: '#1976d2' }}> Search Results</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((rec) => (
              <TableRow
                key={rec.mediaId}
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
                        <Item>
                          <span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{rec.title}</span>
                          {rec.year && `(${rec.year})`}
                        </Item>
                        {rec.author && <Item>{rec.author}</Item>}
                      </Stack>
                    </>
                  ) : (
                    <>
                      <Stack direction="column" spacing={0} justifyContent="left" alignItems="flex-start">
                        <Item>
                          <span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{rec.title}</span>
                          {rec.year && ` (${rec.year})`}
                        </Item>
                        {rec.author && <Item>{rec.author}</Item>}
                      </Stack>
                    </>
                  )}
                </TableCell>

                <TableCell sx={{ padding: '0px' }}>
                  <Stack direction="column" alignItems="flex-end" sx={{ paddingRight: '20px' }}>
                    <p>
                      <Button variant="contained" size="small" style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }} onClick={() => toggleRecPop(rec)}>
                        Add{!isSmallScreen && ' to Recs'}
                      </Button>
                    </p>
                    <Button
                      variant="contained"
                      size="small"
                      style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }}
                      onClick={() => toggleRatingPop(rec)}
                    >
                      {isSmallScreen ? 'Rate' : 'Add Rating'}
                    </Button>
                    <p>
                      <Button variant="contained" size='small' style={{ width: isSmallScreen ? smallButtonWidth : buttonWidth }} onClick={() => toggleSendRecPop(rec)}>Rec{!isSmallScreen && 'ommend'}</Button>
                    </p>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {recSeen ? <RecFormDialog
        rec={selectedRec}
        open={recSeen}
      /> : null}
      {ratingSeen ? <RatingFormDialog
        rec={selectedRec}
        open={ratingSeen}
      /> : null}
      {sendRecSeen ? <SendRecFormDialog
        rec={selectedRec}
        open={sendRecSeen}
      /> : null}
    </>
  );
};

export default SearchList;
