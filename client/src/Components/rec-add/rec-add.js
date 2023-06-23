import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import recService from './../../Services/RecService';
import * as userService from '../../Services/UserService';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Context } from '../../Context';

export default function RecFormDialog({ rec }) {
  const {currentUser} = useContext(Context);
  const userId = currentUser.id;
  const [urgent, setUrgent] = useState(false);
  const [open, setOpen] = useState(true);
  const [sourceComment, setSourceComment] = useState('');
  const [source, setSource] = useState(null);
  const [options, setOptions] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
        const sources = currentUser.sources;
        const sourceNamesArray = await Promise.all(
          sources.map(async (source) => {
            const sourceName = await userService.getSourceName(source);
            return { id: source, name: sourceName.name, type: sourceName.type };
          }))
        const otherSources = sourceNamesArray.filter((source) => source.type === 'source');
        setOptions(otherSources);
        setFetchSourcesComplete(true);
    };
    fetchSources();
  }, [fetchSourcesComplete]);

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
    const res = await recService.saveRec(rec, userId, source.id, sourceComment, urgent);
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
            getOptionLabel={(option) => option.name.charAt(0).toUpperCase() + option.name.slice(1)}
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
            InputProps={{
              disableUnderline: true,
              style: { textDecoration: 'none' }}}
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
