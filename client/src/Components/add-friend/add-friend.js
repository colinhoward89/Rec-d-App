import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as userService from '../../Services/UserService';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Context } from '../../Context';

export default function FriendFormDialog() {
  const { currentUser } = useContext(Context);
  const userId = currentUser.id;
  const [open, setOpen] = useState(true);
  const [newFriend, setNewFriend] = useState(null);
  const [currentSources, setCurrentSources] = useState([]);
  // const [currentInvitations, setCurrentInvitations] = useState([]);
  const [fetchSourcesComplete, setFetchSourcesComplete] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
      const sources = currentUser.sources;
      const sourceNamesArray = await Promise.all(
        sources.map(async (source) => {
          const sourceName = await userService.getSourceName(source);
          return { id: source, name: sourceName.name, type: sourceName.type };
        }))
      const otherSources = sourceNamesArray.filter((source) => source.type === 'user');
      setCurrentSources(otherSources);
      setFetchSourcesComplete(true);
    };
    fetchSources();
  }, [fetchSourcesComplete]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setNewFriend(event.target.value);
  }

  const handleInviteFriend = async () => {
    const sourceExists = currentSources.some((source) => source.email === newFriend);
    if (sourceExists) {
      alert(`'You're already friends!`);
    } else {
      await handleFriendInvitation(newFriend);
      handleClose();
    }
  };

  const handleFriendInvitation = async () => {
    const res = await userService.inviteFriend(userId, newFriend);
    if (res.error) {
      if (res.message === 'User not found') {
        alert(`User not found. Please get them to sign up! Direct invitations from Rec'd coming soon...`);
      } else {
        alert(`Error: ${res.message}`);
      }
    } else {
      alert('Invitation sent!');
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add by Email</DialogTitle>
        <DialogContent>
          <TextField
            id="friend"
            label="Add Friend"
            multiline
            rows={1}
            value={newFriend}
            onChange={handleChange}
            fullWidth
            autoFocus
            InputProps={{
              style: { width: '400px' }, // Set the desired width here
            }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleInviteFriend}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
