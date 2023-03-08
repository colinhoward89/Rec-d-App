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
import RecFormDialog from '../rec-add/rec-add';
import RatingFormDialog from '../rating-add/rating-add';
import SendRecFormDialog from '../rec-send/rec-send';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'black',
}));

function SearchList() {
  const { searchtype, query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);
  const [recSeen, setRecSeen] = useState(false);
  const [sendRecSeen, setSendRecSeen] = useState(false);
  const [ratingSeen, setRatingSeen] = useState(false);
  const userId = localStorage.getItem('userId');

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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((rec) => (
              <TableRow
                key={rec.mediaId}
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
                <TableCell><Stack direction="column" spacing={1} justifyContent="left" alignItems="flex-start"><Item>{rec.title}</Item><Item>{rec.author}</Item><Item>{rec.year}</Item></Stack></TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => toggleRecPop(rec)}>Add to recs</Button><p></p>
                  <Button variant="contained" onClick={() => toggleRatingPop(rec)}>&nbsp;Add rating&nbsp;</Button><p></p>
                  <Button variant="contained" onClick={() => toggleSendRecPop(rec)}>Recommend</Button>
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
