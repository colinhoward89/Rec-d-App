import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as userService from '../../Services/UserService';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Context } from '../../Context';

export default function SourceFormDialog() {
  const { currentUser, refreshUser } = useContext(Context);
  const userId = currentUser.id;
  const [open, setOpen] = useState(true);
  const [newSource, setNewSource] = useState(null);
  const [currentSources, setCurrentSources] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [message, setMessage] = useState(null);

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
    refreshUser();
  };

  const handleChange = (event) => {
    setNewSource(event.target.value);
  }

  const handleSaveSource = async () => {
    const sourceExists = currentSources.some((source) => source.name === newSource);
    if (sourceExists) {
      setMessage(`Source already exists!`);
    } else {
      await handleAddToSources({ newSource });
    }
  };

  const handleAddToSources = async () => {
    const newSourceDetails = { name: newSource, type: 'source' }
    const res = await userService.saveSource(userId, newSourceDetails);
    if (res.error) {
      setMessage(`Error: ${res.message}`);
    } else {
      setMessage("New source saved!")
      setTimeout(() => {
        handleClose();
      }, 1500);
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
            <Button onClick={handleSaveSource}>Save</Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
