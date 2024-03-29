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
  const [message, setMessage] = useState(null);

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

  const handleSaveRec = async () => {
    const res = await recService.saveRec(rec, recipient.id, userId, sourceComment);
    if (res.error) {
      setMessage(`Error: ${res.error}`);
    } else {
      setMessage("Rec sent!")
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send rec</DialogTitle>
        <DialogContent>
          {error && <DialogContentText color="error">{`Error: ${error}`}</DialogContentText>}
          <DialogContentText>
          <span style={{ fontStyle: 'italic', fontWeight: 'bolder' }}>{rec.title}</span>
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
            <Button onClick={handleSaveRec}>Save</Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
