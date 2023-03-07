import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import recService from './../../Services/RecService';
import userService from '../../Services/UserService';
import { Autocomplete } from '@mui/material';

export default function SendRecFormDialog({ rec }) {
  const [open, setOpen] = React.useState(true);
  const [sourceComment, setSourceComment] = React.useState('');
  const [recipient, setRecipient] = useState(null);
  const [options, setOptions] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRecipients = async () => {
      const user = await userService.getUserInfo();
      if (user) {
        const sources = user.sources;        
        const sourceNamesArray = await Promise.all(sources.map(async (source) => {
          const sourceName = await userService.getSourceName(source);
          return { id: source, name: sourceName.name };
        }));
        setOptions(sourceNamesArray);
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

  const handleSaveRec = () => {
    handleSendRec({ ...rec });
    handleClose();
  };

  const handleSendRec = async (rec) => {
    const res = await recService.saveRec(rec, recipient.id, userId, sourceComment);
    if (res.error) {
      alert(`Error: ${res.message}`);
    } else {
      alert("saved to recs")
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send rec</DialogTitle>
        <DialogContent>
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
            renderInput={(params) => (
              <TextField {...params} label="Recipient" margin="normal" />
            )}
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
