import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";

function addDefaultSrc(ev) {
  ev.target.src = "https://bscscan.com/images/main/empty-token.png";
}

function TokenPrice(props) {
  const util = props.util;
  const tokenInfo = props.tokenInfo;
  const tokenAddress = props.tokenAddress;
  const tokenLogo = props.tokenLogo;
  const [tokenPrice, setTokenPrice] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        const info = await util.getTokenInfo(tokenAddress);
        let tp = await util.getTokenPriceFromPancake(tokenAddress);
        document.title =
        info.tokenName +
          " Price Chart Scam or Legit? ($" +
          Math.round(tp * 10000) / 10000 +
          ") - APE";
        tp = Math.round(tp * 1000000000) / 1000000000;
        setTokenPrice(tp);
      })();
    }, 5000);
    return () => clearInterval(interval);
  }, [tokenAddress]);

  return (
    <Row spacing={1}>
      <Col xs={2}>
        <img
          src={
            tokenLogo === undefined
              ? `https://bscscan.com/images/main/empty-token.png`
              : tokenLogo
              // : `https://assets.coincap.io/assets/icons/${tokenInfo.symbol.toLowerCase()}@2x.png`
          }
          onError={addDefaultSrc}
          className="tokenImg"
          alt="logo"
        />
      </Col>
      <Col xs={10}>
        <div className="tokenName">
          {tokenInfo.tokenName === undefined
            ? ""
            : tokenInfo.tokenName + " - Prices"}
        </div>
        <Container className="tokenPair" justify="flex-start">
          <p style={{ marginBottom: "0px", fontSize:"13px" }}>
            {tokenInfo.symbol === undefined
              ? ""
              : tokenInfo.symbol + "/BNB Pair"}
          </p>
          <p style={{ marginBottom: "0px", color: "green", fontSize:"13px"  }}>{tokenPrice === undefined ? "" : "$" + tokenPrice}</p>
          <p style={{ marginBottom: "0px", fontSize:"13px" }}>{tokenInfo.symbol === undefined ? "" : "BSC (BEP20)"}</p>
        </Container>
      </Col>
    </Row>
  );
}

export default TokenPrice;
