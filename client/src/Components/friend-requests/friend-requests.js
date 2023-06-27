import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as userService from '../../Services/UserService';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Context } from '../../Context';

export default function FriendRequestsFormDialog() {
  const { currentUser } = useContext(Context);
  const [open, setOpen] = useState(true);
  const [requestsSent, setRequestsSent] = useState({});
  const [requestsRec, setRequestsRec] = useState({});

  useEffect(() => {
    const fetchRequestSentNames = async () => {
      const sourceNamesArray = [];
      for (const id of [...currentUser.requestSent]) {
        const sourceName = await userService.getUserInfo(id);
        sourceNamesArray.push({
          id,
          name: sourceName[0].name,
          email: sourceName[0].email,
        });
      }
      setRequestsSent(sourceNamesArray);
    };

    const fetchRequestRecNames = async () => {
      const sourceNamesArray = [];
      for (const id of [...currentUser.requestRec]) {
        const sourceName = await userService.getUserInfo(id);
        sourceNamesArray.push({
          id,
          name: sourceName.name,
          email: sourceName.email,
        });
      }
      setRequestsRec(sourceNamesArray);
    };

    fetchRequestSentNames();
    fetchRequestRecNames();
  }, [currentUser.requestSent, currentUser.requestRec]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleReject = (request) => {
    // Handle reject logic here
  };

  const handleAccept = (request) => {
    // Handle accept logic here
  };

  const handleDelete = (request) => {
    // Handle delete logic here
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Friend Requests</DialogTitle>
        <DialogContent>
          <DialogTitle>Received</DialogTitle>
          {requestsRec.length > 0 ? (
            requestsRec.map((request) => (
              <div key={request.id}>
                <DialogContentText>
                  {request.name} <br />
                  {request.email}
                </DialogContentText>
                <DialogActions>
                  <Button onClick={() => handleReject(request)}>Reject</Button>
                  <Button onClick={() => handleAccept(request)}>Accept</Button>
                </DialogActions>
              </div>
            ))
          ) : (
            <DialogContentText>No requests received</DialogContentText>
          )}
        </DialogContent>
        <DialogContent>
          <DialogTitle>Sent</DialogTitle>
          {requestsSent.length > 0 ? (
            requestsSent.map((request) => (
              <div key={request.id}>
                <DialogContentText>
                  {request.email}
                </DialogContentText>
                <DialogActions>
                  <Button onClick={() => handleDelete(request)}>Delete</Button>
                </DialogActions>
              </div>
            ))
          ) : (
            <DialogContentText>No requests sent</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
