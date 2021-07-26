import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import "../../App.css";

function LpHolding(props) {
  const util = props.util;
  const tokenAddress = props.token;
  const [lpTokens, setLPTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const dd = setInterval(() => {
      (async () => {
        const isAddressValid = await util.checkAddress(tokenAddress);
        if (!isAddressValid) return;
        const data = await util.getLPTokenList(tokenAddress);
        setLPTokens(data);
        setLoading(false);
      })();
    }, 10000);
    return () => clearInterval(dd);
  }, [tokenAddress]);

  const listItems = lpTokens.map((data, idx) => (
    <div key={idx}>
      <div>
        <a
          className="outLink"
          href={`https://${
            data.pv2 ? "" : "v1"
          }exchange.pancakeswap.finance/#/swap`}
          target="_blank"
        >
          {`Pc ${data.pv2 ? "v2" : "v1"}`}
        </a>
        | {`${data.fromSymbol}/${data.toSymbol}`} LP Holdings:
      </div>
      <div style={{ marginBottom: "10px" }}>
        {`${data.pairBalance} ${data.toSymbol}`}
        <p className="price">({`${data.price}`})</p>|
        <a
          className="outLink"
          href={`https://bscscan.com/token/${data.toTokenAddress}?a=${data.pairTokenAddress}#tokenAnalytics`}
          target="_blank"
        >
          Chart
        </a>
        |
        <a
          className="outLink"
          href={`https://bscscan.com/token/${data.pairTokenAddress}#balances`}
          target="_blank"
        >
          Holders
        </a>
      </div>
    </div>
  ));

  return loading ? (
    <div style={{ textAlign: "center" }}>
      <Spinner animation="border" variant="warning" />
    </div>
  ) : (
    <div className="scrollBox">{listItems}</div>
  );
}

export default LpHolding;
