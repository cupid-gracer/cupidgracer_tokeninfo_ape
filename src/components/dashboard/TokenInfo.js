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
      let data = await util.getTotalSupply(tokenAddress);
      setTotalSupply(data);
      setInfo(info);
      if (_cmcInfo == 0) _cmcInfo = {};
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
        util={util}
        tokenAddress={tokenAddress}
        tokenInfo={info}
        tokenLogo={CMCInfo.logo}
      />

      <Container className="mt-md__custom rounded tokenprice">
        <p className="fw-bold m-0">Total supply:</p>
        <p style={{ textAlign: "end" }}>
          {totalSupply.totalSupply === undefined ? "" : totalSupply.totalSupply}
        </p>
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
        <p className="m-0 fw-bold">Token Type:</p>
        <p style={{ textAlign: "end" }}>
          <span className="badge rounded-pill bg-light text-dark">
            {info.tokenType}
          </span>
        </p>

        <SocialList tokenInfo={info} tokenAddress={tokenAddress} />
        {CMCInfo.twitter_username != undefined ? (
          <div>
            <p className="fw-bold m-0">Twitter User Name:</p>
            <p style={{ textAlign: "end" }}>@{CMCInfo.twitter_username}</p>
          </div>
        ) : (
          ""
        )}

        <p className="fw-bold m-0">Token Decimals:</p>
        <p style={{ textAlign: "end" }}>
          <span className="badge rounded-pill bg-light text-dark">
            {info.divisor}
          </span>
        </p>
        <div className="mt-4">
          <a
            href={`https://bscscan.com/token/${tokenAddress}#balances`}
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            View holders on BscScan
          </a>
        </div>
        <div className="my-4">
          <a
            href={`https://bscscan.com/token/${tokenAddress}`}
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            View Tx on BscScan
          </a>
        </div>
        <div className="mt-4">
          <LpHolding util={util} token={tokenAddress} />
        </div>
      </Container>
      <NotificationContainer />
    </div>
  );
}

export default TokenInfo;
