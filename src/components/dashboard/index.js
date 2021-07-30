import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

import { useDispatch } from "react-redux";
import { search } from "../../features/searchTokenSlice";

import TokenInfo from "./TokenInfo";
import TradingView from "./TradingView";
import TransactionList from "./TransactionList";
import "react-notifications/lib/notifications.css";
import "../../App.css";


function Dashboard(props) {
  const util = props.util;
  let { tokenAddress } = useParams();
  const dispatch = useDispatch();
  const [isValid, setIsValid] = useState();

  useEffect(() => {
    (async () => {
      const isAddressValid = await util.checkAddress(tokenAddress);
      if (!isAddressValid) {
        NotificationManager.warning(
          "The token address is invalid. Please input correct!"
        );
        setIsValid(false);
      } else {
        dispatch(search(tokenAddress));
        setIsValid(true);
      }
    })();
  }, [tokenAddress]);

  return isValid === undefined || !isValid ? (
    <div></div>
  ) : (
    <Container className="my-md-4">
      <Row>
        <Col xs={12} md={3}>
          <TokenInfo util={util} />
        </Col>
        <Col className="ps-4" xs={12} md={9}>
          <div className="mb-5">
            <TradingView />
          </div>
          <div>
            <TransactionList util={util} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
