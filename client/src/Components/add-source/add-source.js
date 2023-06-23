import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as userService from '../../Services/UserService';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Context } from '../../Context';

export default function SourceFormDialog() {
  const {currentUser, refreshUser} = useContext(Context);
  const userId = currentUser.id;
  const [open, setOpen] = useState(true);
  const [newSource, setNewSource] = useState(null);
  const [currentSources, setCurrentSources] = useState([]);
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
        setCurrentSources(otherSources);
        setFetchSourcesComplete(true);
    };
    fetchSources();
  }, [fetchSourcesComplete]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setNewSource(event.target.value);
  }

  const handleSaveSource = async () => {
    const sourceExists = currentSources.some((source) => source.name === newSource);
    if (sourceExists) {
      alert('Source already exists');
    } else {
      await handleAddToSources({ newSource });
      refreshUser();
      handleClose();
    }
  };

  const handleAddToSources = async () => {
    const newSourceDetails = { name: newSource, type: 'source' }
    const res = await userService.saveSource(userId, newSourceDetails);
    if (res.error) {
      alert(`Error: ${res.message}`);
    } else {
      alert("New source saved")
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add source</DialogTitle>
        <DialogContent>
          <TextField
            id="source"
            label="Add Source"
            multiline
            rows={1}
            value={newSource}
            onChange={handleChange}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveSource}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
