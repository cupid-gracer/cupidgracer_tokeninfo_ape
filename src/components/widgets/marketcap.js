import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";

function MarketCap(props) {
  const util = props.util;
  const tokenAddress = props.token;
  const totalSupply = props.totalSupply;
  const burntNum = props.burntNum;
  const price = props.price;
  const [mc, setMc] = useState(price);

  useEffect(() => {
    setMc(price);
    const dd = setInterval(() => {
      (async () => {
        const isAddressValid = await util.checkAddress(tokenAddress);
        
        if(!isAddressValid) return;
        const data = await util.getMarketCap(
          totalSupply,
          burntNum,
          tokenAddress
        );
        // const data = await util.getTotalSupply(tokenAddress);
        setMc(data);
        console.log("data", data);
      })();
    }, 4000);
    return () => clearInterval(dd);
  },[totalSupply]);

  return (
    <div>
      <p className="fw-bold m-0">
        Market Cap :  (Includes locked, excludes burned)
      </p>
      <p style={{ color: "green", textAlign:"end" }}>{ price.includes('N') ? "" : mc}</p>
    </div>
  );
}

export default MarketCap;
