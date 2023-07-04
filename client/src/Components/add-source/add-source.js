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
  const [error, setError] = useState(false);
  const maxLength = 40;
  const [currentSources, setCurrentSources] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
    const inputValue = event.target.value;
    setNewSource(inputValue);
    if (inputValue.length > maxLength) {
      setErrorMessage(`Max ${maxLength} charactrers`);
    } else {
      setErrorMessage('');
    }
  };

  const handleSaveSource = async () => {
    if (newSource.length > maxLength) {
      setErrorMessage('Too many characters!')
    } else {
      const sourceExists = currentSources.some((source) => source.name === newSource);
      if (sourceExists) {
        setErrorMessage(`Source already exists!`);
      } else {
        await handleAddToSources({ newSource });
      }
    }
  };

  const handleAddToSources = async () => {
    const newSourceDetails = { name: newSource, type: 'source' }
    const res = await userService.saveSource(userId, newSourceDetails);
    if (res.error) {
      setErrorMessage(`Error: ${res.message}`);
    } else {
      setMessage("New source saved!")
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveSource();
    }
  };

  return (
    <section>
      <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">Add source</DialogTitle>
      <DialogContent>
        <TextField
          id="source"
          label="Add Source"
          rows={1}
          value={newSource}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          fullWidth
          autoFocus
          autoComplete='off'
          InputProps={{
            style: { width: '400px' },
            'aria-describedby': 'source-helper-text',
          }}
          helperText={
            errorMessage !== '' ? errorMessage : 'Enter the name of the source you want to add.'
          }
          error={errorMessage !== ''}
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
          <Button onClick={handleClose} autoFocus>Cancel</Button>
          <Button onClick={handleSaveSource}>Save</Button>
        </DialogActions>
      )}
    </Dialog>
    </section>
  );
}
