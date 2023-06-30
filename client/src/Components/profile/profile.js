import React, { useEffect, useState, useContext } from 'react';
import styles from './profile.module.css';
import * as userService from './../../Services/UserService';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useAuth0 } from "@auth0/auth0-react";
import { Context } from '../../Context';
import { createTheme, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { currentUser, setCurrentUser } = useContext(Context);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser.name);

  const theme = createTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditUsername = () => {
    setEditingUsername(true);
  };

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleSaveUsername = async () => {
    await userService.editName(currentUser.id, newUsername)
    setCurrentUser({ ...currentUser, name: newUsername });
    setEditingUsername(false);
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      {isAuthenticated && (
        <div>
          {/* <img src={user.picture} alt={user.name} /> */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {editingUsername ? (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={handleUsernameChange}
                />
                <Button onClick={handleSaveUsername}>Save</Button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ marginRight: '10px' }}>{currentUser.name}</h2>
                <Button variant="outlined" onClick={handleEditUsername}>
                  Edit Username
                </Button>
              </div>
            )}
          </div>
          {/* <p>Friend Requests: {currentUser.requestRec.length}</p> */}
        </div>
      )}
    </ThemeProvider>
  );
};

export default Profile;
