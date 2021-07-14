
import React, { useState, useEffect } from 'react';
import logo from "../../img/ape-logo.png";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import {
  BrowserRouter as Router,
  useRouteMatch,
  useHistory,
  useParams
} from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { search,selectSearchToken } from '../../features/searchTokenSlice';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    position: "sticky",   
    top: 0, 
    zIndex: 2
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
  sectionDesktop: {
    // display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));


export default function PrimarySearchAppBar() {
  const tokenAddress = useSelector(selectSearchToken);
  const dispatch = useDispatch();
  const [token, setToken] = useState();
  const classes = useStyles();
  let match = useRouteMatch();
  const history = useHistory();

  function update(event) {
    setToken(event.target.value);
  }
  function keyPress(e){
    if(e.keyCode == 13){
      history.push("/token/" + token);
      // dispatch(search(token));
    }
  }


  return (
    <div className={classes.grow}>
      <AppBar position="static" className = "App-header">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          > */}
          <img src={logo} className="App-logo" alt="logo" />
          {/* </IconButton> */}
          {/* <Typography className={classes.title} variant="h6">
            Material-UI
          </Typography> */}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search for another token…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={update}
                onKeyDown={keyPress}
              />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
