import React, { useState, useEffect } from 'react';
import { Grid, makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { search,selectSearchToken } from '../../features/searchTokenSlice';

import TokenInfo from "./TokenInfo";
import TradingView from "./TradingView";
import TransactionList from "./TransactionList";
import Util from "../../util/util";
import "../../App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }
}));

const util = new Util();

function Dashboard() {
  const classes = useStyles();
  let { tokenAddress } = useParams();
  const dispatch = useDispatch();
  dispatch(search(tokenAddress));

  return (
    <Container style={{marginTop:8}}>
      <Grid  className = "dashboard" container spacing={2}>
        <Grid item xs = {12} md = {4}>
          <TokenInfo util={util}/>
        </Grid>
        <Grid className = "dashboard" item xs = {12} md = {8}>
          <TradingView />
        </Grid>
        <Grid className = "dashboard" item xs = {12} style={{marginBottom:10}} >
          <TransactionList  util={util}/>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
