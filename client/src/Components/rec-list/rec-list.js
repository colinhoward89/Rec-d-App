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
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import SendRecFormDialog from '../rec-send/rec-send';

function RecList() {
  const { userId } = useParams();
  const [recs, setRecs] = useState([]);
  const [ratingSeen, setRatingSeen] = useState(false);
  const [recSeen, setRecSeen] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);

  useEffect(() => {
    getUserRecommendations(userId)
      .catch((e) => console.log(e));
  }, [userId]);

  function getUserRecommendations(userId) {
    return recService.getUserRecs(userId)
      .then((recs) => {
        const filteredRecs = recs.filter((rec) => rec.to === userId);
        filteredRecs.forEach((rec) => {
          const ratings = filteredRecs.filter((r) => r.source === rec.source && r.type === rec.type && typeof r.rating === 'number' && !isNaN(r.rating)).map((r) => r.rating);
          if (ratings.length > 0) {
            const avgRating = ratings.reduce((acc, val) => acc + val) / ratings.length;
            rec.avgRating = avgRating;
          }
        });
        filteredRecs.sort((a, b) => b.avgRating - a.avgRating);
        setRecs(filteredRecs);
        return filteredRecs;
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

  return (
    <>
      <TableContainer component={Paper} className={styles.RecList}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recs.sort((a, b) => b.avgRating - a.avgRating).map((rec) => (
              <TableRow
                key={rec._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img src={rec.image} alt={rec.title} style={{ width: '100px', height: '100px' }} />
                </TableCell>
                <TableCell>{rec.title}<p>{rec.author}</p><p>{rec.year}</p><p>{rec.avgRating}</p><p>{rec.recDate}</p></TableCell>
                {rec.rating > 0 ? (
                  <TableCell><Rating
                    value={rec.rating}
                    precision={0.5}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                    <p><button onClick={() => toggleRecPop(rec)}>Recommend</button></p>
                  </TableCell>) : (
                  <TableCell>
                    <button onClick={() => toggleRatingPop(rec)}>Add rating</button>
                    <p><button onClick={() => toggleRecPop(rec)}>Recommend</button></p>
                  </TableCell>)}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {ratingSeen ? <RatingFormDialog
        rec={selectedRec}
        open={ratingSeen}
      /> : null}
      {recSeen ? <SendRecFormDialog
        rec={selectedRec}
        open={recSeen}
      /> : null}
    </>
  );
};

export default RecList;