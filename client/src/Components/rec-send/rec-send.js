import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import recService from './../../Services/RecService';
import * as userService from '../../Services/UserService';
import { Autocomplete } from '@mui/material';
import { Context } from '../../Context';

export default function SendRecFormDialog({ rec }) {
  const { currentUser } = useContext(Context)
  const userId = currentUser.id;
  const [open, setOpen] = React.useState(true);
  const [sourceComment, setSourceComment] = React.useState('');
  const [recipient, setRecipient] = useState(null);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      const sources = currentUser.sources;
      if (sources) {      
        const sourceNamesArray = await Promise.all(sources.map(async (source) => {
          const sourceName = await userService.getSourceName(source);
          return { id: source, name: sourceName.name, type: sourceName.type };
        }));
        const userSources = sourceNamesArray.filter((source) => source.type === 'user');
        setOptions(userSources);
      } else {
        console.log('No user info found 😞');
      }
    };
    fetchRecipients();
  }, []);
  

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSourceComment(event.target.value)
  }

  const handleRecipientChange = (event, newValue) => {
    setRecipient(newValue);
  };

  // const handleSaveRec = () => {
  //   handleSendRec({ ...rec });
  //   handleClose();
  // };

  // const handleSendRec = async (rec) => {
  //   try {
  //     const res = await recService.saveRec(rec, recipient.id, userId, sourceComment);
  //     if (res && !res.error) {
  //       alert("Saved to recs");
  //     }
  //   } catch (error) {
  //     alert(`Error: ${error.message}`);
  //   }
  // };

  const handleSaveRec = async () => {
    try {
      const res = await recService.saveRec(rec, recipient.id, userId, sourceComment);
      if (res && !res.error) {
        alert('Saved to recs');
        handleClose();
      }
      if (res.error)
      setError(res.error); // Store the error message in state
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send rec</DialogTitle>
        <DialogContent>
        {error && <DialogContentText color="error">{`Error: ${error}`}</DialogContentText>}
          <DialogContentText>
            "{rec.title}" by "{rec.author}".
          </DialogContentText>
          <Autocomplete
            id="recipient"
            options={options}
            getOptionLabel={(option) => option.name}
            fullWidth
            value={recipient}
            onChange={handleRecipientChange}
            renderInput={(params) => <TextField {...params} label="Recipient" margin="normal" />}
          />
          <TextField
            id="comment"
            label="Add Comment"
            multiline
            rows={4}
            value={sourceComment}
            onChange={handleChange}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveRec}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
