import React, { useState, useEffect } from 'react';
import { Box, Grid, makeStyles , Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
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
  },
}));

const util = new Util();


function Dashboard() {
  const classes = useStyles();

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
