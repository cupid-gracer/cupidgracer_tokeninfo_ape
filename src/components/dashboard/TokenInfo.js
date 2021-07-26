import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchToken } from "../../features/searchTokenSlice";
import { change } from "../../features/tokenPairSlice";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import { Container, Row, Col } from "react-bootstrap";
import MarketCap from "../widgets/marketcap";
import LpHolding from "../widgets/lpholding";
import TokenPrice from "../widgets/tokenprice";
import SocialList from "../widgets/socialList";
import "../../App.css";

function TokenInfo(props) {
  const util = props.util;
  const dispatch = useDispatch();
  const tokenAddress = useSelector(selectSearchToken);
  const [totalSupply, setTotalSupply] = useState({});
  const [CMCInfo, setCMCInfo] = useState({});
  const [tokenInfo, setTokenInfo] = useState({
    totalSupply: "",
    total: "",
    burntNum: "",
    marketCap: "",
  });
  const [info, setInfo] = useState({});

  useEffect(() => {
    (async () => {
      const isAddressValid = await util.checkAddress(tokenAddress);
      if (!isAddressValid) {
        NotificationManager.warning(
          "The token address is invalid. Please input correct!"
          );
          return;
        }
        let _cmcInfo = await util.getCryptoCurrencyInfo(tokenAddress);
      // const holders = await util.getCurrentHolders(tokenAddress);
      // console.log("holders", holders);

      const info = await util.getTokenInfo(tokenAddress);
      console.log("info", info);
      let data = await util.getTotalSupply(tokenAddress);
      setTotalSupply(data);
      setInfo(info);
      if( _cmcInfo == 0 ) _cmcInfo = {};
      setCMCInfo(_cmcInfo);
    })();
  }, [tokenAddress]);

  useEffect(() => {
    (async () => {
      const isAddressValid = await util.checkAddress(tokenAddress);
      if (!isAddressValid) return;
      let data = await util.getTokenName(tokenAddress);
      dispatch(change(data.symbol + "/BNB"));
      setTokenInfo(data);
    })();
  }, [totalSupply]);



  return totalSupply === undefined ? (
    <div></div>
  ) : (
    <div>
      <TokenPrice
        util = {util}
        tokenAddress = {tokenAddress}
        tokenInfo = {info}
        tokenLogo = {CMCInfo.logo}
      />

      <Container style={{ padding: "0px" }}>
        <Row>Total Supply :</Row>
        <Row>
          {totalSupply.totalSupply === undefined ? "" : totalSupply.totalSupply}
        </Row>
        {totalSupply.total === undefined ? (
          ""
        ) : (
          <MarketCap
            util={util}
            token={tokenAddress}
            totalSupply={totalSupply.total}
            burntNum={totalSupply.burntNum}
            price={totalSupply.marketCap}
          />
        )}
        <Row style={{ marginTop: "10px" }}>Token Type: {info.tokenType}</Row>
        <SocialList tokenInfo = {info} tokenAddress = {tokenAddress}/>
        {
        CMCInfo.twitter_username != undefined ? 
        <Row style={{ marginTop: "10px", display:"inline-flex"}}>
          <p style={{padding:"0px", margin:"0px"}}>Twitter User Name:</p> 
          <p style={{color:"yellow", padding:"0px", marginRight:"20px", textAlign:"end"}}>@{CMCInfo.twitter_username}</p>
        </Row>
        :
        ""
        }

        <Row style={{ marginTop: "10px" }}>Token Decimals: {info.divisor}</Row>
        <Row style={{ marginTop: "10px" }}>
          <a
            href={`https://bscscan.com/token/${tokenAddress}#balances`}
            style={{ padding: "0px" }}
            target="_blank"
          >
            {" "}
            View holders on BacScan
          </a>
        </Row>
        <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
          <a
            href={`https://bscscan.com/token/${tokenAddress}`}
            style={{ padding: "0px" }}
            target="_blank"
          >
            {" "}
            View Tx on BscScan
          </a>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          <LpHolding util={util} token={tokenAddress} />
        </Row>
      </Container>
      <NotificationContainer />
    </div>
  );
}

export default TokenInfo;
