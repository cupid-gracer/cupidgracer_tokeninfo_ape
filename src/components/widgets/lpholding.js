import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    scrollBox: {
        maxHeight: "150px",
        overflow: "auto",
        width: "100%",
        fontSize: "13px",
    },
    outLink: {
        padding: "0 5px 0 5px",
        color: "#11a0cc",
    },
    price: {
        display: "inline-block",
        padding: "0 5px 0 5px",
        color: "green",
    },
}));

function LpHolding(props) {
    const classes = useStyles();
    const util = props.util;
    const tokenAddress = props.token;
    const [lpTokens, setLPTokens] = useState([]);

    useEffect(() => {
        const dd = setInterval(() => {
            (async () => {
                const isAddressValid = await util.checkAddress(tokenAddress);
                if(!isAddressValid) return;
                const data = await util.getLPTokenList(tokenAddress);
                setLPTokens(data);
                console.log("data", data);
            })();
        }, 10000);
        return () => clearInterval(dd);
    }, [tokenAddress])

    const listItems = lpTokens.map((data) => 
        <div>
            <Box m={1} />
            <Grid>
            <a
                className={classes.outLink}
                href={`https://${data.pv2?"":"v1"}exchange.pancakeswap.finance/#/swap`}
                target="_blank"
            >
                {`Pc ${data.pv2?"v2":"v1"}`}
            </a>
            | {`${data.fromSymbol}/${data.toSymbol}`} LP Holdings:
            </Grid>
            <Box m={0.5} />
            <Grid>
                {`${data.pairBalance} ${data.toSymbol}`}
                <p className={classes.price}>({`${data.price}`})</p>|
                <a
                    className={classes.outLink}
                    href={`https://bscscan.com/token/${data.toTokenAddress}?a=${data.pairTokenAddress}#tokenAnalytics`}
                    target="_blank"
                >
                    Chart
                </a>
                |
                <a
                    className={classes.outLink}
                    href={`https://bscscan.com/token/${data.pairTokenAddress}#balances`}
                    target="_blank"
                >
                    Holders
                </a>
            </Grid>
        </div>
    );

    return (
        <div className={classes.scrollBox}>
            {listItems}
        </div>
    );
}

export default LpHolding;
