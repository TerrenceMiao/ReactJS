import * as React from "react";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../authConfig";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

export const NavigationBar = () => {
  const { instance } = useMsal();

  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginPopup = () => {
    /**
     * When using popup and silent APIs, we recommend setting the redirectUri to a blank page or a page
     * that does not implement MSAL. Keep in mind that all redirect routes must be registered with the application
     * For more information, please follow this link: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations
     */
    instance
      .loginPopup({
        ...loginRequest,
        redirectUri: "/redirect",
      })
      .catch((error) => console.log(error));
  };

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const handleLogoutPopup = () => {
    instance
      .logoutPopup({
        mainWindowRedirectUri: "/", // redirects the top level app after logout
        account: instance.getActiveAccount(),
      })
      .catch((error) => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance.logoutRedirect().catch((error) => console.log(error));
  };

  //
  const signInOptions = ["Sign in using Popup", "Sign in using Redirect"];
  const signOutOptions = ["Sign out using Popup", "Sign out using Redirect"];

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleSignInClick = () => {
    console.info(`You clicked ${signInOptions[selectedIndex]}`);

    switch (signInOptions[selectedIndex]) {
      case "Sign in using Popup":
        handleLoginPopup();
        break;
      case "Sign in using Redirect":
        handleLoginRedirect();
        break;
      default:
        break;
    }
  };

  const handleSignOutClick = () => {
    console.info(`You clicked ${signOutOptions[selectedIndex]}`);

    switch (signOutOptions[selectedIndex]) {
      case "Sign out using Popup":
        handleLogoutPopup();
        break;
      case "Sign out using Redirect":
        handleLogoutRedirect();
        break;
      default:
        break;
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  /**
   * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
   * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
   * only render their children if a user is authenticated or unauthenticated, respectively.
   */
  return (
    <div sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography
            sx={{ flexGrow: 1 }}
            className="navbar-brand"
            variant="h5"
          >
            Microsoft Identity Platform
          </Typography>
          <AuthenticatedTemplate>
            <React.Fragment>
              <Typography variant="h6" className="navbar-brand user">
                {activeAccount ? activeAccount.name : "Unknown"}
              </Typography>
              <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="split button"
              >
                <Button onClick={handleSignOutClick}>
                  {signOutOptions[selectedIndex]}
                </Button>
                <Button
                  size="small"
                  aria-controls={open ? "split-button-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-label="Sign out"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                sx={{
                  zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                          {signInOptions.map((option, index) => (
                            <MenuItem
                              key={option}
                              selected={index === selectedIndex}
                              onClick={(event) =>
                                handleMenuItemClick(event, index)
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </React.Fragment>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <React.Fragment>
              <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="split button"
              >
                <Button onClick={handleSignInClick}>
                  {signInOptions[selectedIndex]}
                </Button>
                <Button
                  size="small"
                  aria-controls={open ? "split-button-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-label="Sign in"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                sx={{
                  zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                          {signInOptions.map((option, index) => (
                            <MenuItem
                              key={option}
                              selected={index === selectedIndex}
                              onClick={(event) =>
                                handleMenuItemClick(event, index)
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </React.Fragment>
          </UnauthenticatedTemplate>
        </Toolbar>
      </AppBar>
    </div>
  );
};
