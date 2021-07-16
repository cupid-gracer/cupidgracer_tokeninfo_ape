import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { useDispatch } from "react-redux";
import { search } from "../../features/searchTokenSlice";

import TokenInfo from "./TokenInfo";
import TradingView from "./TradingView";
import TransactionList from "./TransactionList";
import Util from "../../util/util";
import 'react-notifications/lib/notifications.css';
import "../../App.css";

const util = new Util();

function Dashboard() {
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
    <div>
      <NotificationContainer />
    </div>
  ) : (
    <Container style={{ marginTop: 8 }}>
      <Row className="dashboard" spacing={2}>
        <Col xs={12} md={4}>
          <TokenInfo util={util} />
        </Col>
        <Col xs={12} md={8} style={{padding:"0px"}}>
          <TradingView />
        </Col>
      </Row>
      <Row className="dashboard" style={{ marginTop: 10 }}>
        <Col xs={12} style={{ marginBottom: 10 }}>
          <TransactionList util={util} />
        </Col>
      </Row>
      <NotificationContainer />
    </Container>
  );
}

export default Dashboard;
