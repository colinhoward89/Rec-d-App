import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as userService from '../../Services/UserService';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Context } from '../../Context';

export default function FriendFormDialog() {
  const { currentUser, refreshUser } = useContext(Context);
  const userId = currentUser.id;
  const [open, setOpen] = useState(true);
  const [newFriend, setNewFriend] = useState(null);
  const [currentSources, setCurrentSources] = useState([]);
  const [currentRequestRecs, setCurrentRequestRecs] = useState([]);
  const [currentRequestSents, setCurrentRequestSents] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSources = async () => {
      const sources = currentUser.sources;
      const sourceNamesArray = await Promise.all(
        sources.map(async (source) => {
          const sourceName = await userService.getSourceName(source);
          return { id: source, email: sourceName.email, type: sourceName.type };
        }))
      const otherSources = sourceNamesArray.filter((source) => source.type === 'user');
      setCurrentSources(otherSources);
      const requestRecs = currentUser.requestRec;
      const requestRecsArray = await Promise.all(
        requestRecs.map(async (requestRec) => {
          const requestRecsEmail = await userService.getSourceName(requestRec);
          return { id: requestRec, email: requestRecsEmail.email };
        }))
      setCurrentRequestRecs(requestRecsArray);
      const requestSents = currentUser.requestSent;
      const requestSentsArray = await Promise.all(
        requestSents.map(async (requestSent) => {
          const requestSentsEmail = await userService.getSourceName(requestSent);
          return { id: requestSent, email: requestSentsEmail.email };
        }))
      setCurrentRequestSents(requestSentsArray);
      setFetchSourcesComplete(true);
    };
    fetchSources();
  }, [fetchSourcesComplete]);

  const handleClose = () => {
    setOpen(false);
    refreshUser();
  };

  const handleChange = (event) => {
    setNewFriend(event.target.value);
    setErrorMessage('');
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleInviteFriend();
    }
  };

  const handleInviteFriend = async () => {
    const sourceExists = currentSources.some((source) => source.email === newFriend);
    const requestRecExists = currentRequestRecs.some((requestRec) => requestRec.email === newFriend);
    const requestSentExists = currentRequestSents.some((requestSent) => requestSent.email === newFriend);
    if (sourceExists) {
      setErrorMessage(`You're already friends!`);
    } else if (requestRecExists) {
      setErrorMessage(`They've added you already!`);
    } else if (requestSentExists) {
      setErrorMessage(`Request already sent!`);
    } else {
      await handleFriendInvitation(newFriend);
    }
  };

  const handleFriendInvitation = async () => {
    if (isValidEmail(newFriend)) {
    const res = await userService.inviteFriend(userId, newFriend);
    if (res.error) {
      if (res.message === 'User not found') {
        setErrorMessage(`User not found. Please get them to sign up! Direct invitations from Rec'd coming soon...`);
      } else {
        setErrorMessage(`Error: ${res.message}`);
      }
    } else {
      setMessage('Invitation sent!');
      setErrorMessage('');
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
    } else {
      setErrorMessage('Please enter a valid email address.');
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <section>
      <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title">Add by Email</DialogTitle>
        <DialogContent>
        <TextField
            id="friend"
            label="Add Friend"
            rows={1}
            value={newFriend}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            fullWidth
            autoFocus
            InputProps={{
              style: { width: '400px' },
              type: 'email',
              'aria-describedby': 'friend-helper-text',
            }}
            helperText={
              errorMessage !== '' ? errorMessage : 'Enter the email address of the friend you want to add.'
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
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
            <Button onClick={handleInviteFriend}>Save</Button>
          </DialogActions>
        )}
      </Dialog>
    </section>
  );
}