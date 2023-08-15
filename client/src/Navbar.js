import {useNavigate, NavLink, Outlet } from "react-router-dom";
import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("currentUser")).username;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("myMessagesList");
    localStorage.removeItem("myFilterBooksList");
    localStorage.removeItem("myCategoriesList");
    navigate(`/login`);

  };

  const pages = [
    { path: 'info', label: 'Info' },
    { path: 'findBook', label: 'Find the book' },
    { path: 'orderBasket', label: 'Order basket' },
    { path: 'addNewBook', label: 'Add New Book' },
    { path: 'myBooks', label: 'My books' },
    { path: 'messages', label: 'Messages' },
  ];

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                    <NavLink to={`/users/${username}/${page.path}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {page.label}
                    </NavLink>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <NavLink
                  key={page.path}
                  to={`/users/${username}/${page.path}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', margin: '8px 0' }}
                  // sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={handleCloseNavMenu}
                >
                  <Button variant="text" fullWidth style={{ color: 'white' }}>
                    {page.label}
                  </Button>
                </NavLink>
              ))}

            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={handleLogout}>
              <LogoutIcon>exit_to_app</LogoutIcon> {/* Add the icon */}
              {/* Logout */}
            </Button>
          </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </div>
  );
}

export default Navbar;
