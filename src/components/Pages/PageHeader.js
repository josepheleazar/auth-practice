import React from "react";

import AdbIcon from '@mui/icons-material/Adb';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";

import { logoutUser } from "api/auth";
import { useAuthContext } from "context/AuthContext";

import styles from './styles.module.scss';

export default function PageHeader() {
  // Context
  const { isAuth, userData, userLogout } = useAuthContext();

  // Local States
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Functions
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutClick = async () => {
    const res = await logoutUser();
    try {
      if(res.status === 200) {
        // customMessage('success', 'User logged out successfully'); // BUG CAN'T SHOW MODAL
        console.log('User logged out successfully');
      } else if (res.response?.status === 403) {
        userLogout();
      } else {
        console.log('User logout failed. Error: ', res.message ?? res.response?.message);
      }
    } catch(err) {
      console.log('PageHeader - handleLogoutClick Error: ', res);
    }
    
    localStorage.clear();
    window.location.reload(false);
  }

  // Renders
  function renderPages() {
    return(
      isAuth ? (
        <div className={styles['header__tabs__container']}>
          <Link to='/'>
            <MenuItem key='Home' onClick={handleCloseNavMenu}>
              <Typography textAlign="center"> Home </Typography>
            </MenuItem>
          </Link>
          <Link to='/dashboard'>
            <MenuItem key='Dashboard' onClick={handleCloseNavMenu}>
              <Typography textAlign="center"> Dashboard </Typography>
            </MenuItem>
          </Link>
        </div>
      ) : (
        <div className={styles['header__tabs__container']}>
          <Link to='/'>
            <MenuItem key='Home' onClick={handleCloseNavMenu}>
              <Typography textAlign="center"> Home </Typography>
            </MenuItem>
          </Link>
        </div>
      )
    );
  }

  function renderUser() {
    return(
      isAuth ? (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={userData.firstName + ' ' + userData.lastName} src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            id="menu-appbar"
            keepMounted
            onClose={handleCloseUserMenu}
            open={Boolean(anchorElUser)}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{ mt: '45px' }}
          >
            <Link to='/settings' style={{ color: 'inherit', textDecoration: 'none' }}>
              <MenuItem key='Settings'>
                <Typography textAlign="center" textDecoration={'none'}> Settings </Typography>
              </MenuItem>
            </Link>
            <MenuItem key='Logout' onClick={handleLogoutClick}>
              <Typography textAlign="center"> Logout </Typography>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 0 }}>
          <div className={styles['header__login__container']}>
            <Link to='/login'>
              <MenuItem key='Login' onClick={handleCloseNavMenu}>
                <Typography textAlign="center"> Login </Typography>
              </MenuItem>
            </Link>
            <Link to='/register'>
              <MenuItem key='Register' onClick={handleCloseNavMenu}>
                <Typography textAlign="center"> Register </Typography>
              </MenuItem>
            </Link>
          </div>
        </Box>
      )
    )
  }
  
  // Main Function
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            component="a"
            href="/"
            noWrap
            sx={{
              color: 'inherit',
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              mr: 2,
              textDecoration: 'none',
            }}
            variant="h6"
          >
            LOGO
          </Typography>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleOpenNavMenu}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              id="menu-appbar"
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handleCloseNavMenu}
              open={Boolean(anchorElNav)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {renderPages()}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            component="a"
            href=""
            noWrap
            sx={{
              color: 'inherit',
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              mr: 2,
              textDecoration: 'none',
            }}
            variant="h5"
          >
            LOGO
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {renderPages()}
          </Box>
          {renderUser()}
        </Toolbar>
      </Container>
    </AppBar>
  );
}