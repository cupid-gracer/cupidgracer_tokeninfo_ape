import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Web3 from "web3";
import {
  Table,
  Container,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
  Spinner,
} from "react-bootstrap";

import { selectTokenPair } from "../../features/tokenPairSlice";
import { selectSearchToken } from "../../features/searchTokenSlice";

import useGetContract from "../../hooks/useGetContract";

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io")
);

function createCell(top, bottom) {
  return { top, bottom };
}

function createData(side, tokens, price, from, to, time, tx, tooltip) {
  return { side, tokens, price, from, to, time, tx, tooltip };
}

function cellElement(element) {
  return (
    <div
      style={{
        textAlign: element.bottom == "Track" ? "left" : "right",
        fontSize: "12px",
      }}
    >
      {element.bottom == "Track" ? (
        <a
          target="_blank"
          href={`https://bscscan.com/tx/${element.top}`}
          style={{ color: "rgb(62 184 255)", textDecoration: "none" }}
        >
          {element.top.substring(0, 20)}...
        </a>
      ) : (
        <p style={{ margin: "0" }}>{element.top}</p>
      )}
      <p style={{ margin: "0" }}>{element.bottom}</p>
    </div>
  );
}

function tokenRender(basicToken, renderToken) {
  return (
    <div>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-top">{renderToken}</Tooltip>}
      >
          <a
            target="_blank"
            href={`https://bscscan.com/token/${basicToken}?a=${renderToken}`}
            style={{ color: "rgb(62 184 255)", textDecoration: "none" }}
          >
            {renderToken.substring(0, 20)}...
          </a>
      </OverlayTrigger>
    </div>
  );
}

function TransactionList(props) {
  const util = props.util;
  const tokenAddress = useSelector(selectSearchToken);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [trxHashes, setTrxHashes] = useState([]);
  const { contract, getContract } = useGetContract();

  let tokenPriceList = [];

  let txRows = [];

  useEffect(() => {
    if (contract === undefined) return;
    // console.log("contract", contract);
    web3.eth.getBlockNumber().then((currentBlock) => {
      contract.getPastEvents(
        {
          filter: {},
          fromBlock: currentBlock * 1.0 - 1000,
          toBlock: currentBlock * 1.0,
          topics: [
            // "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          ],
        },
        function (error, events) {
          console.log("events", events);
        }
      );
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    async function getTokenPrice(tokenAddress) {
      let pricetoken = 0;
      tokenPriceList.map((item) => {
        if ((item.address = tokenAddress)) {
          pricetoken = item.price;
        }
      });
      if (pricetoken == 0) {
        pricetoken = await util.getTokenPriceFromPancake(tokenAddress);
        tokenPriceList = [
          ...tokenPriceList,
          { address: tokenAddress, price: pricetoken },
        ];
      }
      return pricetoken;
    }

    (async () => {
      const isAddressValid = await util.checkAddress(tokenAddress);
      if (!isAddressValid) return;
      const data = await util.getLast50Transactions(tokenAddress);

      if (data.status === 200) {
        const _transactions = data.data;
        for (let i = 0; i < _transactions.length; i++) {
          let each = _transactions[i];
          const tokenPrice = await getTokenPrice(each.tokenAddress2);
          const tokens = each.amount1.toLocaleString();
          let pr = (each.amount2 / each.amount1) * tokenPrice;
          if (pr <= 0.01 && pr >= 0.000001) pr = pr.toFixed(6);
          else if (pr > 0.01) pr = pr.toFixed(2).toLocaleString();
          else if (pr < 0.000001) pr = pr;

          let amout2price = tokenPrice * each.amount2;
          if (amout2price <= 0.0001) amout2price = amout2price.toFixed(6);
          else if (amout2price > 0.0001 && amout2price < 0.01)
            amout2price = amout2price.toFixed(4);
          else if (amout2price >= 0.01)
            amout2price = amout2price.toFixed(2).toLocaleString();

          console.log("tokenPrice", tokenPrice);
          txRows.push(
            createData(
              each.side,
              createCell(tokens, each.token1),
              createCell(
                amout2price,
                each.amount2.toString().slice(0, 8) + " " + each.token2
              ),
              each.from,
              each.to,
              createCell(each.agoTime, ""),
              createCell(each.hash, "Track"),
              each.time
            )
          );
        }
        setTrxHashes(_transactions.map((each) => each.transactionHash));
        setTransactions(txRows);
        getContract(tokenAddress);
      }
    })();
    setLoading(false);
  }, [tokenAddress]);

  return loading ? (
    <div style={{ textAlign: "center" }}>
      <Spinner animation="border" variant="danger" />
    </div>
  ) : (
    <div
      style={{
        maxHeight: "450px",
        overflow: "auto",
        width: "100%",
        fontSize: "13px",
      }}
    >
      <Table variant="dark">
        <thead style={{ position: "sticky", top: 0 }}>
          <tr>
            <th width="9%">Side</th>
            <th width="18%">From</th>
            <th width="18%">To</th>
            <th width="10%" style={{ textAlign: "right" }}>
              Tokens
            </th>
            <th width="15%" style={{ textAlign: "right" }}>
              Price
            </th>
            <th width="15%" style={{ textAlign: "right" }}>
              Age&nbsp;
            </th>
            <th width="15%">Tx&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((row, idx) => {
            const cellColor = row.side == "BUY" ? "#12B886" : "#c72323";
            return (
              <tr key={idx}>
                <td style={{ color: cellColor }}>{row.side.toUpperCase()}</td>
                <td style={{ color: cellColor }}>
                  {tokenRender(tokenAddress, row.from)}
                </td>
                <td style={{ color: cellColor }}>
                  {tokenRender(tokenAddress, row.to)}
                </td>
                <td style={{ color: cellColor }}>{cellElement(row.tokens)}</td>
                <td style={{ color: cellColor }}>{cellElement(row.price)}</td>
                <td style={{ color: cellColor }}>
                  <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={<Tooltip id="tooltip-top">{row.tooltip}</Tooltip>}
                  >
                    {cellElement(row.time)}
                  </OverlayTrigger>
                </td>
                <td style={{ color: "rgb(62 184 255)" }}>
                  {cellElement(row.tx)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default TransactionList;
