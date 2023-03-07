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
import RecFormDialog from '../rec-add/rec-add';
import RatingFormDialog from '../rating-add/rating-add';

function SearchList() {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);
  const [recSeen, setRecSeen] = useState(false);
  const [ratingSeen, setRatingSeen] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
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
  }, [query]);

  function toggleRecPop(rec) {
    setSelectedRec(rec);
    setRecSeen(!recSeen);
  }

  function toggleRatingPop(rec) {
    setSelectedRec(rec);
    setRatingSeen(!ratingSeen);
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
                  <img src={rec.image} alt={rec.title} style={{ width: '100px', height: '100px' }} />
                </TableCell>
                <TableCell>{rec.title}<p>{rec.author}</p><p>{rec.year}</p></TableCell>
                <TableCell>
                  <button onClick={() => toggleRecPop(rec)}>Add to recs</button>
                  <button onClick={() => toggleRatingPop(rec)}>Add rating</button>
                  <p>Recommend</p>
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
    </>
  );
};

export default SearchList;
