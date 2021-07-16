import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";

function MarketCap(props) {
  const util = props.util;
  const tokenAddress = props.token;
  const totalSupply = props.totalSupply;
  const burntNum = props.burntNum;
  const price = props.price;
  const [mc, setMc] = useState();

  useEffect(() => {
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
    }, 2000);
    return () => clearInterval(dd);
  },[totalSupply]);

  return (
    <div>
      <Row style={{marginTop:"10px"}}>
        Market Cap :  (Includes locked, excludes burned)
      </Row>
      <Row style={{ color: "green" }}>{price === undefined || price.includes('N')   ? "" : mc}</Row>
    </div>
  );
}

export default MarketCap;
