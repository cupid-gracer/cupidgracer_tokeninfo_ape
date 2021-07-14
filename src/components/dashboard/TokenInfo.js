import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchToken } from '../../features/searchTokenSlice';
import { selectTokenPair, change } from '../../features/tokenPairSlice';
import { Box, Grid, makeStyles , Typography } from "@material-ui/core";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import testImg from "../../img/ape-logo.png";
import MarketCap from "../widgets/marketcap";
import LpHolding from "../widgets/lpholding";
import 'react-notifications/lib/notifications.css';
  
const useStyles = makeStyles((theme) => ({
  tokenImg: {
    marginLeft: "1vw",
    width: "60px",
    height: "60px",
  },
  tokenName: {
    fontSize: 20,
    textAlign:"center"
  },
  tokenPair: {
    // marginLeft:50,
    textAlign:"center",
    fontSize: 13,
  },
  price:{
    color:"green"
  },
  outLink:{
    paddingLeft:"5px",
    paddingRight:"5px",
    color:"#11a0cc"
  }
}));



function TokenInfo(props){
  const util = props.util;
  const classes = useStyles();
  const dispatch = useDispatch();
  const tokenAddress = useSelector(selectSearchToken);
  const [totalSupply, setTotalSupply] = useState({});
  const [tokenInfo, setTokenInfo] = useState({totalSupply:"", total:"", burntNum:"", marketCap:"" });
  const [info, setInfo] = useState({});

  useEffect(() => {
    (async () => {
      const isAddressValid = await util.checkAddress(tokenAddress);
      if(!isAddressValid){
        NotificationManager.warning('The token address is invalid. Please input correct!');
        return;
      } 
      const info = await util.getTokenInfo(tokenAddress);
      console.log("info", info);
      let data = await util.getTotalSupply(tokenAddress);
      setTotalSupply(data);
      setInfo(info);
    })();
  },[tokenAddress]);
  
  useEffect(() => {
    (async () => {
      const isAddressValid = await util.checkAddress(tokenAddress);
      if(!isAddressValid) return;
      let data = await util.getTokenName(tokenAddress);
      dispatch(change(data.symbol+"/BNB"));
      setTokenInfo(data);
    })();
  }, [totalSupply])

  function addDefaultSrc(ev){
    ev.target.src = 'https://bscscan.com/images/main/empty-token.png';
  }

    return(
      <div>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <img src={tokenInfo.symbol === undefined? `https://bscscan.com/images/main/empty-token.png` : `https://assets.coincap.io/assets/icons/${tokenInfo.symbol.toLowerCase()}@2x.png`} onError={addDefaultSrc} className={classes.tokenImg} alt="logo" />
          </Grid>
          <Grid item xs={10}>
            <div className={classes.tokenName}>{tokenInfo.name === undefined? "" : tokenInfo.name + " - Prices"}</div>
            <Grid
              container
              direction="column"
              className={classes.tokenPair}
              // justify="flex-start"
            >
              <Grid item>{tokenInfo.symbol === undefined? "" : tokenInfo.symbol+"/BNB Pair"}</Grid>
              <Grid item>{tokenInfo.symbol === undefined? "" :"BSC (BEP20)"}</Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box m={1} />

        <Grid container direction="column" alignItems="flex-start">
          <Grid>Total Supply:</Grid>
          <Grid>{totalSupply.totalSupply}</Grid>
          <Box m={1} />
          {totalSupply.total === undefined? "":
            <MarketCap util = {util} token = {tokenAddress} totalSupply = {totalSupply.total} burntNum = {totalSupply.burntNum} price = {totalSupply.marketCap}/>
          }
          <Box m={1} />
          <Grid>Token Type:  {info.tokenType}</Grid>
          {info.website == ""? "" :
          <div>
          <Box m={1} />
          <a href={info.website} target="_blank"> {tokenInfo.name} Website</a>
          </div>
          }
          <Box m={1} />
          <Grid>Token Decimals:  {info.divisor}</Grid>
          <Box m={1} />
          <a href={`https://bscscan.com/token/${tokenAddress}#balances`} target="_blank"> View holders on BacScan</a>
          <Box m={.5} />
          <a href={`https://bscscan.com/token/${tokenAddress}`} target="_blank"> View Tx on BscScan</a>
          <Box m={1} />
          
          <LpHolding  util = {util} token = {tokenAddress}/>

        </Grid>
        <NotificationContainer/>
      </div>
    );
}

export default TokenInfo;
