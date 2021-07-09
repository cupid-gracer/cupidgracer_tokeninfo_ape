import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import Web3 from 'web3';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CellWifi } from '@material-ui/icons';

import { selectTokenPair } from '../../features/tokenPairSlice';
import { selectSearchToken } from '../../features/searchTokenSlice';

import useGetContract from "../../hooks/useGetContract";

const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.defibit.io'));


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight:"bold"
  },
  body: {
    fontSize:12,
    color:theme.palette.common.white,
    borderColor:theme.palette.common.black,
    
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      backgroundColor: "#0e1119",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
    table: {
      minWidth: 550,
      backgroundColor:"#141722",
    },
    scrollBox: {
      maxHeight: "450px",
      overflow: "auto",
      width: "100%",
      fontSize: "13px",
    },
    txTH:{
      position: "sticky",   
      top: 0, 
      zIndex: 1
    }
  });
  


function createCell(top, bottom)
{
  return {top, bottom};
}

function createData(side, tokens, price, pt, time, tx) {
    return { side, tokens, price, pt, time, tx};
}

function cellElement(element)
{
  return(
    <div style={{textAlign:element.bottom=="Track"? "left":"right",  fontSize:"12px"}}>
      {
        element.bottom=="Track"?
        <a target="_blank" href={`https://bscscan.com/tx/${element.top}`}>{element.top.substring(0,6)}...</a>
        :<p style={{margin:"0"}}>{element.top}</p>
      }
      <p style={{margin:"0"}}>{element.bottom}</p>
    </div>
  );
}





  
function TransactionList(props)
{ 
  const util = props.util;
  const tokenAddress = useSelector(selectSearchToken);

  const [transactions, setTransactions] = useState([]);
  const [trxHashes, setTrxHashes] = useState([]);
  const {contract, getContract } = useGetContract();

  let tokenPriceList = [];

  

  let txRows = [];
  // createData('sell', createCell(3.2546, "BTC"), createCell("$18.55", "17.155497 BUSD"), createCell("$46.15", "PcancakeSwap"), createCell("6:15:54", "AM"), createCell("0xc95c", "Track")),




  useEffect(() => {
    if(contract === undefined) return;
    // console.log("contract", contract);
    web3.eth.getBlockNumber().then(currentBlock => {
      contract.getPastEvents({
        filter: {},
        fromBlock: currentBlock * 1.0 - 1000,
        toBlock: currentBlock * 1.0,
        topics: [
          // "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        ]
        }, function (error, events) {
          console.log("events", events);
        }
      )
    });
  }, [])













  useEffect(() => {
    function getTime(time) {
      const timeArray = time.toString().split(":");
      if(Number(timeArray[0]) > 12) {
        timeArray[0] = (Number(timeArray[0]) % 12).toString();
      }
      return timeArray.join(":");
    }
  
    function getAMPM(time) {
      const timeArray = time.toString().split(":");
      let ampm = "AM";
      if(Number(timeArray[0]) > 12) {
        ampm = "PM";
      }
      return ampm;
  
    }

    async function getTokenPrice(tokenAddress)
    {
      let pricetoken = 0;
      tokenPriceList.map((item)=>{
        if(item.address = tokenAddress)
        {
          pricetoken = item.price;
        }
      });
      if(pricetoken == 0){
        pricetoken = await util.getTokenPriceFromPancake(tokenAddress);
        tokenPriceList = [...tokenPriceList, {address:tokenAddress, price:pricetoken}];
      }
      return pricetoken;
    }

    (async () => {
      const isAddressValid = await util.checkAddress(tokenAddress);
      if(!isAddressValid) return; 
      const data = await util.getLast50Transactions(tokenAddress);

  
      if(data.status === 200){
        const _transactions = data.data;
        for(let i = 0; i < _transactions.length; i ++)
        {
          let each = _transactions[i];
            const tokenPrice = await getTokenPrice(each.tokenAddress2);
            const tokens = each.amount1.toLocaleString();
            let pr = (each.amount2/each.amount1 * tokenPrice);
            if(pr <= 0.01 && pr >= 0.000001) pr = pr.toFixed(6);
            else if(pr > 0.01 ) pr = pr.toFixed(2).toLocaleString();
            else if(pr < 0.000001 ) pr = pr;
            let amout2price = (tokenPrice * each.amount2);
            if(amout2price <= 0.0001) amout2price = amout2price.toFixed(6);
            else if(amout2price > 0.0001 && amout2price < 0.01)amout2price = amout2price.toFixed(4);
            else if( amout2price >= 0.01)amout2price = amout2price.toFixed(2).toLocaleString();
            console.log("tokenPrice", tokenPrice);
            txRows.push(createData(
              each.side, 
              createCell(tokens, each.token1), 
              createCell(amout2price, each.amount2.toString().slice(0,8)+ " " + each.token2), 
              createCell(pr, each.protocol), 
              createCell(getTime(each.time), getAMPM(each.time)), 
              createCell(each.hash, "Track")
            ));
          }
        setTrxHashes(_transactions.map(each => each.transactionHash));
        setTransactions(txRows);
        getContract(tokenAddress);

      }
    })();
  },[tokenAddress]);


  const classes = useStyles();
  return(
      <TableContainer component={Paper} className={classes.scrollBox}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead className={classes.txTH}>
          <StyledTableRow>
            <StyledTableCell width="10%">Side</StyledTableCell>
            <StyledTableCell width="22%" align="right">Tokens</StyledTableCell>
            <StyledTableCell width="22%" align="right">Price</StyledTableCell>
            <StyledTableCell width="20%" align="right">Price/Token</StyledTableCell>
            <StyledTableCell width="13%" align="right">Time&nbsp;</StyledTableCell>
            <StyledTableCell width="13%" >Tx&nbsp;</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => {
            const cellColor = row.side=="BUY"?"#12B886":"#c72323";
            return(
            <StyledTableRow>
              <StyledTableCell style={{color:cellColor}}>{row.side.toUpperCase()}</StyledTableCell>
              <StyledTableCell style={{color:cellColor}} align="right">{cellElement(row.tokens)}</StyledTableCell>
              <StyledTableCell style={{color:cellColor}} align="right">{cellElement(row.price)}</StyledTableCell>
              <StyledTableCell style={{color:cellColor}} align="right">{cellElement(row.pt)}</StyledTableCell>
              <StyledTableCell style={{color:cellColor}} align="right">{cellElement(row.time)}</StyledTableCell>
              <StyledTableCell style={{color:"#3eb8ff"}}>{cellElement(row.tx)}</StyledTableCell>
            </StyledTableRow >
          )}
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionList;
