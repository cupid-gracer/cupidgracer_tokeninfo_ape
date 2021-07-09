import React, { useState, useEffect } from "react";
import { Box, Grid } from "@material-ui/core";

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
      <Box textAlign="justify">
        Market Cap:(Includes locked, excludes burned)
      </Box>
      <Box m={1} />
      <Grid style={{ color: "green" }}>{price === undefined || price.includes('N')   ? "" : mc}</Grid>
    </div>
  );
}

export default MarketCap;
