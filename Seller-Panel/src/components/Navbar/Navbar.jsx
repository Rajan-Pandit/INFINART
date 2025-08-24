import React from 'react';
import './Navbar.css';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosNotificationsOutline } from "react-icons/io";
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useNavigate } from 'react-router-dom';   // ✅ import navigation hook

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const navigate = useNavigate(); // ✅ initialize router navigation

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      setOpen(false);
    }
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">Aestheticommerce</span>
      </div>

      <ul className="navbar-links">
        <li><a href="/">Dashboard</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Shop</a></li>
        <li><a href="#">Blogs</a></li>
        <li><a href="#">Contact</a></li>
      </ul>

      <div className="navbar-right">
        <IconButton aria-label="notifications">
          <StyledBadge badgeContent={4} color="secondary">
            <IoIosNotificationsOutline size={24} />
          </StyledBadge>
        </IconButton>

        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <StyledBadge badgeContent={0} color="secondary">
            <FaUserCircle size={24} />
          </StyledBadge>
        </IconButton>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-end"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-end' ? 'right top' : 'right bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="profile-menu"
                    aria-labelledby="profile-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {/* ✅ navigate to seller profile */}
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/seller/profile'); 
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose}>My Account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </nav>
  );
};

export default Navbar;
