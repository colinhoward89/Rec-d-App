import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as userService from '../../Services/UserService';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Context } from '../../Context';

export default function FriendRequestsFormDialog() {
  const { currentUser } = useContext(Context);
  const userId = currentUser.id;
  const [open, setOpen] = useState(true);
  const [currentSources, setCurrentSources] = useState([]);
  const [requestsSent, setRequestsSent] = useState([]);
  const [requestsRec, setRequestsRec] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceNamesArray, setSourceNamesArray] = useState([]);

console.log(sourceNamesArray)

  useEffect(() => {
    const retrieveFriendRequests = async () => {
      try {
        const res = await userService.friendRequests(userId);
        if (Array.isArray(res.requestSent)) {
          const sentRequests = res.requestSent.map((request) => request.toString());
          setRequestsSent((prevRequestsSent) => [...prevRequestsSent, ...sentRequests]);
        }
        if (Array.isArray(res.requestRec)) {
          setRequestsRec((prevRequestsRec) => [...prevRequestsRec, ...res.requestRec]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    const fetchSources = async () => {
      const sources = currentUser.sources;
      const sourceNamesArray = await Promise.all(
        sources.map(async (source) => {
          const sourceName = await userService.getUserInfo(source);
          return {
            id: source,
            name: sourceName.name,
            type: sourceName.type,
            email: sourceName.email,
          };
        })
      );
      const otherSources = sourceNamesArray.filter((source) => source.type === 'user');
      setCurrentSources((prevSources) => [...prevSources, ...otherSources]);
      return sourceNamesArray;
    };

    const fetchData = async () => {
      await Promise.all([retrieveFriendRequests(), fetchSources()]);
      setIsLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleReject = () => {};

  const handleAccept = () => {};

  const handleDelete = () => {};

  const getSourceNameById = (id) => {
    const source = sourceNamesArray.find((source) => source.id === id);
    return source ? source.name : '';
  };

  const getSourceEmailById = (id) => {
    const source = sourceNamesArray.find((source) => source.id === id);
    return source ? source.email : '';
  };

  if (isLoading) {
    // Render a loading state while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Friend Requests</DialogTitle>
        <DialogContent>
          <DialogTitle>Requests Received</DialogTitle>
          {requestsRec.length > 0 ? (
            requestsRec.map((request) => (
              <DialogContentText key={request._id}>
                {getSourceNameById(request)}
                <br />
                {getSourceEmailById(request)}
              </DialogContentText>
            ))
          ) : (
            <DialogContentText>No requests received</DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleReject}>Reject</Button>
          <Button onClick={handleAccept}>Accept</Button>
        </DialogActions>
        <DialogContent>
          <DialogTitle>Requests Sent</DialogTitle>
          {requestsSent.length > 0 ? (
            requestsSent.map((request) => (
              <DialogContentText key={request._id}>
                {getSourceEmailById(request)}
              </DialogContentText>
            ))
          ) : (
            <DialogContentText>No requests sent</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}