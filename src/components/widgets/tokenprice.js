import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";
import { CashCoin } from "react-bootstrap-icons";
function addDefaultSrc(ev) {
  ev.target.src = "😞";
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
          " Price Chart — Scam or Legit? ($" +
          Math.round(tp * 10000) / 10000 +
          ") &mdash; APE";
        tp = Math.round(tp * 1000000000) / 1000000000;
        setTokenPrice(tp);
      })();
    }, 5000);
    return () => clearInterval(interval);
  }, [tokenAddress]);

  return (
    <Container className="rounded tokenprice">
    <Row>
      <Col xs={12} className="text-center mx-auto pe-md-4">
        <img
          src={
            tokenLogo === undefined
              ? `https://bscscan.com/images/main/empty-token.png`
              : tokenLogo
            // : `https://assets.coincap.io/assets/icons/${tokenInfo.symbol.toLowerCase()}@2x.png`
          }
          onError={addDefaultSrc}
          className="tokenImg rounded-circle"
          alt="token logo"
        />
        <h2 className="tokenName my-3">
          {tokenInfo.tokenName === undefined ? "" : tokenInfo.tokenName}
        </h2>
        <Container className="tokenPair" justify="flex-start">
          <p className="mb-3 opacity-8 text-sm">
            {tokenInfo.symbol === undefined ? "" : tokenInfo.symbol}
          </p>

          {tokenPrice === undefined ? (
            ""
          ) : (
            <span className="btn btn-sm bg-white rounded-pill shadow  hover-zoom  hover-shadow  btn-icon mx-3 p-2 fw-bold">
              {/* <i className="fa fa-light fa-viacoin me-2"></i>  */}
              <CashCoin className="me-2"/>
              ${tokenPrice}
            </span>
          )}
          <div className="clearfix"></div>
          <span className="mt-3 badge rounded-pill bg-light text-dark">
            {tokenInfo.symbol === undefined ? "" : "BSC (BEP-20)"}
          </span>
        </Container>
      </Col>
    </Row>
    </Container>        
  );
}

export default TokenPrice;
