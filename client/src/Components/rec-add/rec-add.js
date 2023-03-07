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

export default function RecFormDialog({ rec }) {
  const [urgent, setUrgent] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [sourceComment, setSourceComment] = React.useState('');
  const [source, setSource] = useState(null);
  const [options, setOptions] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSources = async () => {
      const user = await userService.getUserInfo();
      if (user) {
        const source = user.sources;
        const sourceNames = await userService.getSourcesNames(source);
        const sourceNamesArray = [];
        sourceNamesArray.push({ id: source, name: sourceNames.name });
        setOptions(sourceNamesArray)
      } else {
        console.log('No user info found 😞');
      }
    };
    fetchSources();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSourceComment(event.target.value)
  }

  const handleSourceChange = (event, newValue) => {
    setSource(newValue);
  };

  const handleUrgentChange = (event) => {
    setUrgent(event.target.checked);
  };

  const handleSaveRec = () => {
    handleAddToRecs({ ...rec });
    handleClose();
  };

  const handleAddToRecs = async (rec) => {
    const res = await recService.saveRec(rec, userId, source.id[0], sourceComment, urgent);
    if (res.error) {
      alert(`Error: ${res.message}`);
    } else {
      alert("saved to recs")
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add to recs</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{rec.title}" by "{rec.author}".
          </DialogContentText>
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
          <TextField
            margin="dense"
            id="urgent"
            label="Urgent?"
            type="checkbox"
            fullWidth
            variant="standard"
            checked={urgent}
            onChange={handleUrgentChange}
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
