import React, {useContext} from 'react';
import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ForwardIcon from '@mui/icons-material/Forward';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import StarIcon from '@mui/icons-material/Star';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookIcon from '@mui/icons-material/Book';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import CasinoIcon from '@mui/icons-material/Casino';
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from '../../Context';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar(handleShowRated) {
  const { currentUser } = useContext(Context)
  const userId = currentUser?.id;
  const [typeEl, setTypeEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('music');
  const navigate = useNavigate();
  const navigateTo = (url, state) => {
    navigate(url, state);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTypeClick = (event) => {
    setTypeEl(event.currentTarget);
  };

  const handleClose = () => {
    setTypeEl(null);
  };

  const handleMenuItemClick = (event, index) => {
    if (index === 0) {
      setSearchType('music');
    } else if (index === 1) {
      setSearchType('movie');
    } else if (index === 2) {
      setSearchType('tv');
    } else if (index === 3) {
      setSearchType('book');
    } else if (index === 4) {
      setSearchType('video');
    } else if (index === 5) {
      setSearchType('board');
    }
    handleClose();
  };

  const handleSubmit = async (e) => {
    const url = `/${encodeURIComponent(searchType)}/search/${encodeURIComponent(searchQuery)}`;
    const state = {
      searchType: searchType,
      searchQuery: searchQuery
    };
    navigateTo(url, state);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <NavLink to={`/profile`}>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            style={{color:'white'}}
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </NavLink>
      <NavLink to='/friends'>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="friends"
            style={{color:'white'}}
          >
            <Diversity1Icon />
          </IconButton>
          <p>Friends</p>
        </MenuItem>
      </NavLink>
      <NavLink to='/recs'>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="my-recs"
            style={{color:'white'}}
          >
            <CallReceivedIcon />
          </IconButton>
          <p>My Recs</p>
        </MenuItem>
      </NavLink>
      <NavLink to={`/ratings`}>
        <MenuItem>
          <IconButton
            size="medium"
            aria-label="my-ratings"
            style={{color:'white'}}
          >
            <StarIcon />
          </IconButton>
          <p>My Ratings</p>
        </MenuItem>
      </NavLink>
      <NavLink to={`/sentrecs`}>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="sent-recs"
            style={{color:'white'}}
          >
            <ForwardIcon />
          </IconButton>
          <p>Sent Recs</p>
        </MenuItem>
      </NavLink>
      <NavLink to='/logout'>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="logout"
            style={{color:'white'}}
          >
            <LogoutIcon />
          </IconButton>
          <p>Logout</p>
        </MenuItem>
      </NavLink>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Rec'd
          </Typography>
          <Search onSubmit={handleSubmit}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton
              size="large"
              edge="start"
              aria-label="type"
              style={{color:'white'}}
              onClick={handleTypeClick}
            >
              {searchType === 'music' ? <MusicNoteIcon /> : searchType === 'movie' ? <MovieIcon /> : searchType === 'tv' ? <TvIcon /> : searchType === 'book' ? <BookIcon /> : searchType === 'video' ? <VideogameAssetIcon /> : <CasinoIcon />}
            </IconButton>
            <Menu
              anchorEl={typeEl}
              open={Boolean(typeEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={(e) => handleMenuItemClick(e, 0)}><MusicNoteIcon />&nbsp;&nbsp;Music</MenuItem>
              <MenuItem onClick={(e) => handleMenuItemClick(e, 1)}><MovieIcon />&nbsp;&nbsp;Movies</MenuItem>
              <MenuItem onClick={(e) => handleMenuItemClick(e, 2)}><TvIcon />&nbsp;&nbsp;TV</MenuItem>
              <MenuItem onClick={(e) => handleMenuItemClick(e, 3)}><BookIcon />&nbsp;&nbsp;Books</MenuItem>
              <MenuItem onClick={(e) => handleMenuItemClick(e, 4)}><VideogameAssetIcon />&nbsp;&nbsp;Video Games</MenuItem>
              <MenuItem onClick={(e) => handleMenuItemClick(e, 5)}><CasinoIcon />&nbsp;&nbsp;Board Games</MenuItem>
            </Menu>
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <NavLink to="/profile">
              <IconButton
                style={{ marginRight: '0', color:'white'}}
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
              >
                <AccountCircle />
              </IconButton>
            </NavLink>
            <NavLink to='/friends'>
              <IconButton
                size="large"
                aria-label="friends"
                style={{color:'white'}}
              >
                <Diversity1Icon />
              </IconButton>
            </NavLink>
            <NavLink to='/recs'>
              <IconButton
                size="large"
                aria-label="my-recs"
                style={{color:'white'}}
              >
                <CallReceivedIcon />
              </IconButton>
            </NavLink>
            <NavLink to={`/ratings`}>
              <IconButton
                size="medium"
                aria-label="my-ratings"
                style={{ marginTop: '3px', color:'white'}}
              >
                <StarIcon />
              </IconButton>
            </NavLink>
            <NavLink to={`/sentrecs`}>
              <IconButton
                style={{ marginLeft: '5px', marginTop: '3px', color:'white'}}
                size="medium"
                aria-label="sent-recs"
              >
                <ForwardIcon />
              </IconButton>
            </NavLink>
            <NavLink to='/logout'>
              <IconButton
                size="large"
                aria-label="logout"
                style={{color:'white'}}
              >
                <LogoutIcon />
              </IconButton>
            </NavLink>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box >
  );
}
