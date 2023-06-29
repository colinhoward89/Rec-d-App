import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import recService from './../../Services/RecService';
import * as userService from '../../Services/UserService';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Rating, TextField, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Context } from '../../Context';

const labels = {
  0.5: 'Awful',
  1: 'Dire',
  1.5: 'Bad',
  2: 'Poor',
  2.5: 'Okay',
  3: 'Alright',
  3.5: 'Good',
  4: 'Great',
  4.5: 'Brilliant',
  5: 'Perfect',
};

export default function RatingFormDialog({ rec }) {
  const {currentUser} = useContext(Context)
  const userId = currentUser.id;
  const [open, setOpen] = React.useState(true);
  const [ratingComment, setRatingComment] = React.useState('');
  const [source, setSource] = useState(null);
  const [existingSource, setExistingSource] = useState('');
  const [existingRecId, setExistingRecId] = useState(null);
  const [options, setOptions] = useState([]);
  const [recExists, setRecExists] = useState(false);
  const [fetchRecipientsComplete, setFetchRecipientsComplete] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      const sources = currentUser.sources;
      if (sources) {
        const sourceNamesArray = await Promise.all(
          sources.map(async (source) => {
            const sourceName = await userService.getSourceName(source);
            return { id: source, name: sourceName.name, type: sourceName.type };
          })
        );
        const otherSources = sourceNamesArray.filter((source) => source.type === 'source');
        setOptions(otherSources);
        setFetchRecipientsComplete(true);
      } else {
        console.log('No user sources found 😞');
      }
    };
    fetchRecipients();
  
    const checkRecExists = async () => {
      if (!fetchRecipientsComplete) {
        return;
      }
      const userRecs = await recService.getUserRecs(userId);
      const recMediaIds = userRecs.map((userRec) => userRec.mediaId);
      const selectedRecIndex = recMediaIds.indexOf(rec.mediaId);
      if (recMediaIds.includes(rec.mediaId)) {
        const matchingSource = userRecs[selectedRecIndex].sources[0].source;
        const match = options.find((option) => option.id === matchingSource)?.name;
        if (match) {
          console.log(match)
          setExistingSource(match);
        }
        setExistingRecId(userRecs[selectedRecIndex]._id);
        setRecExists(true);
      }
    };
    checkRecExists();
  }, [fetchRecipientsComplete]);
  

  const handleClose = () => {
    setExistingSource(null);
    setExistingRecId(null);
    setRecExists(false);
    setOpen(false);
  };

  const handleChange = (event) => {
    setRatingComment(event.target.value)
  }

  const handleSourceChange = (event, newValue) => {
    setSource(newValue);
  };

  const handleSaveRating = () => {
    if (recExists) {
      handleAddRatingToRec({ ...rec });
    } else {
      handleAddRating({ ...rec });
    }
  };

  const handleAddRating = async (rec) => {
    const sourceId = source ? source.id : null; // Use null if source doesn't exist
    const res = await recService.saveRating(rec, userId, sourceId, value, ratingComment);
    if (res.error) {
      setMessage(`Error: ${res.message}`);
    } else {
      setMessage("Rating saved!")
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  const handleAddRatingToRec = async (rec) => {
    const res = await recService.updateRating(userId, rec._id, value, ratingComment);
    if (res.error) {
      setMessage(`Error: ${res.message}`);
    } else {
      setMessage("Rating saved!")
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }

  const [value, setValue] = React.useState(5);
  const [hover, setHover] = React.useState(-1);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add rating</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{ fontStyle: 'italic', fontWeight: 'bolder' }}>{rec.title}</span>
          </DialogContentText>
          {recExists ? (
            <Typography variant="body1">
              Rec'd by {existingSource}.
            </Typography>
          ) : (
            <Autocomplete
              id="source"
              options={options}
              getOptionLabel={(option) => option.name}
              fullWidth
              value={source}
              onChange={handleSourceChange}
              renderInput={(params) => (
                <TextField {...params} label="Source" margin="normal" />
              )}
            />
          )}
          <Box
            sx={{
              width: 200,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Rating
              name="hover-feedback"
              value={value}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {value !== null && (
              <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
          </Box>
          <TextField
            id="comment"
            label="Add Rating Comment"
            multiline
            rows={4}
            value={ratingComment}
            onChange={handleChange}
            fullWidth
            autoFocus
          />
        </DialogContent>
        {message ? (
          <>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>{message}</p>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        ) : (
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSaveRating}>Save</Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );  
}  
