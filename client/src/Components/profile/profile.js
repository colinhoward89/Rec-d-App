import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';
import userService from './../../Services/UserService';
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
const initialState = {
  name: '',
};

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'black',
}));

const Profile = () => {
  const [state, setState] = useState(initialState);
  const userId = localStorage.getItem('userId');
  const name = state.name || 'Missing';

  useEffect(() => {
    const getProfile = async () => {
      const userInfo = await userService.getUserInfo();
      if (userInfo) {
        const { name } = userInfo;
        setState((prevState) => {
          return {
            ...prevState,
            name
          };
        });
      } else {
        console.log('No user info found 😞');
      }
    };
    getProfile();
  }, []);

  return (
    <TableContainer component={Paper} className={styles.RecList}>
    <Table sx={{ minWidth: 200 }} aria-label="simple table">
      <TableHead>
        <TableRow>
        <TableCell colSpan={2} align="center" ><Box sx={{ color: 'white', width: 1, border: 1, bgcolor: '#1976d2'}}>My Profile</Box></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      <TableRow>
            <TableCell component="th" scope="row" align="center">Username
            </TableCell>
              <TableCell component="th" scope="row" align="center">
              <Button variant="contained" startIcon={<EditIcon />}>Edit Username</Button>
            </TableCell>
          </TableRow>
      <TableRow>
            <TableCell component="th" scope="row" align="center">Photo
            </TableCell>
              <TableCell component="th" scope="row" align="center">
              <Button variant="contained" startIcon={<EditIcon />}>Edit Photo</Button>
            </TableCell>
          </TableRow>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >  <TableCell component="th" scope="row" align="center">E-mail Address
            </TableCell>
            <TableCell component="th" scope="row" align="center">
            <Button variant="contained" startIcon={<EditIcon />}>Edit E-mail</Button>
            </TableCell>
            </TableRow>
            <TableRow>
            <TableCell component="th" scope="row" align="center">Password
            </TableCell>
              <TableCell component="th" scope="row" align="center">
              <Button variant="contained" startIcon={<EditIcon />}>Edit Password</Button>
            </TableCell>
          </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
  );
};

export default Profile;
