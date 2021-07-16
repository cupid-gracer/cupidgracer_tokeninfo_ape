import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchToken } from '../../features/searchTokenSlice';
import { change } from '../../features/tokenPairSlice';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Container, Row, Col } from "react-bootstrap";
import MarketCap from "../widgets/marketcap";
import LpHolding from "../widgets/lpholding";
import '../../App.css';

function TokenInfo(props){
  const util = props.util;
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
      // const holders = await util.getCurrentHolders(tokenAddress);
      // console.log("holders", holders);

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
        <Row spacing={1}>
          <Col xs={2}>
            <img src={tokenInfo.symbol === undefined? `https://bscscan.com/images/main/empty-token.png` : `https://assets.coincap.io/assets/icons/${tokenInfo.symbol.toLowerCase()}@2x.png`} onError={addDefaultSrc} className="tokenImg" alt="logo" />
          </Col>
          <Col xs={10}>
            <div className="tokenName">{tokenInfo.name === undefined? "" : tokenInfo.name + " - Prices"}</div>
            <Container
              className="tokenPair"
              justify="flex-start"
            >
              <p style={{marginBottom:"0px"}}>{tokenInfo.symbol === undefined? "" : tokenInfo.symbol+"/BNB Pair"}</p>
              <p>{tokenInfo.symbol === undefined? "" :"BSC (BEP20)"}</p>
            </Container>
          </Col>
        </Row>

        <Container style={{padding:"0px"}}>
          <Row>Total Supply :</Row>
          <Row>{totalSupply.totalSupply}</Row>
          {totalSupply.total === undefined? "":
            <MarketCap util = {util} token = {tokenAddress} totalSupply = {totalSupply.total} burntNum = {totalSupply.burntNum} price = {totalSupply.marketCap}/>
          }
          <Row style={{marginTop:"10px"}}>Token Type:  {info.tokenType}</Row>
            {info.website == ""? "" :
              <Row style={{marginTop:"10px"}}>
                <a href={info.website} target="_blank" style={{padding:"0px"}}> {tokenInfo.name} Website</a>
              </Row>
            }
          <Row style={{marginTop:"10px"}}>Token Decimals:  {info.divisor}</Row>
          <Row style={{marginTop:"10px"}}><a href={`https://bscscan.com/token/${tokenAddress}#balances`} style={{padding:"0px"}} target="_blank"> View holders on BacScan</a></Row>
          <Row style={{marginTop:"10px", marginBottom:"10px"}}><a href={`https://bscscan.com/token/${tokenAddress}`} style={{padding:"0px"}} target="_blank"> View Tx on BscScan</a></Row>
          <Row style={{marginTop:"10px"}}>
            <LpHolding  util = {util} token = {tokenAddress}/>
          </Row>

        </Container>
        <NotificationContainer/>
      </div>
    );
}

export default TokenInfo;
