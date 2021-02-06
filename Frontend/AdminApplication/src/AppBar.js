import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import MultilineChartIcon from "@material-ui/icons/MultilineChart";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToApp";
import MapRoundedIcon from "@material-ui/icons/MapRounded";
import "./AppBar.css";
import routeConstants from "./shared/constants/routes";

const { LOGIN, ANALYTICS, MAP, MAPCLUSTER, HOME } = routeConstants;
const productWebsiteUrl = "http://localhost:3000/";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  async function handleLogOut() {
    setAnchorEl(null);
    setError("");

    try {
      await logout();
      history.push(LOGIN.route);
    } catch {
      setError("Failed to log out");
    }
  }
  const handleAnalytics = () => {
    setAnchorEl(null);
    history.push(ANALYTICS.route);
  };
  const handleMap = () => {
    history.push(MAP.route);
  };
  const handleMapCluster = () => {
    history.push(MAPCLUSTER.route);
  };
  const handleHome = () => {
    history.push(HOME.route);
  };
  const openProductWebsite = () => {
    window.open(productWebsiteUrl, "_blank");
  };

  return (
    <div className={classes.root}>
      <FormGroup></FormGroup>

      <AppBar position="static" style={{ background: "gold" }}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleHome}
          >
            <HomeRoundedIcon />
          </IconButton>
          <Typography
            variant="h6"
            className={classes.title}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            I-BZ
          </Typography>
          <tooltip title="Open the Website">
            <button
              style={{
                backgroundColor: "gold",
                border: "none",
                textDecoration: "none",
                borderRadius: "20px",
                color: "white",
                cursor: "pointer",
              }}
              onClick={openProductWebsite}
            >
              <h4>(InsuranceBazaar) </h4>
            </button>
          </tooltip>
          <Typography
            variant="h5"
            className={classes.title}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {"   "}Admin
          </Typography>

          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem> */}
                <MenuItem onClick={handleAnalytics}>
                  <MultilineChartIcon />
                  Analytics
                </MenuItem>
                <MenuItem onClick={handleMap}>
                  <img
                    src="map.gif"
                    style={{ width: "30px", height: "25px" }}
                  />{" "}
                  <span>Live Map</span>
                </MenuItem>
                <MenuItem onClick={handleMapCluster}>
                  <img
                    src="connect.gif"
                    style={{ width: "30px", height: "30px" }}
                  />{" "}
                  View Map Cluster
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                  <ExitToAppRoundedIcon />
                  Log Out
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
