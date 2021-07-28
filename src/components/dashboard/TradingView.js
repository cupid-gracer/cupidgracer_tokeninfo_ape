import React from "react";
import { useSelector } from "react-redux";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { selectTokenPair } from "../../features/tokenPairSlice";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";

function TradingView() {
  const tokenPair = useSelector(selectTokenPair);

  return (
    <Row
      className="dashboard rounded text-white font-weight-bold pe-md-4"
      spacing={2}
    >
      <div className="card card-fluid border-0 tradingview-bg">
        <div className="card-header">
          <h6 className="mb-0 text-white fw-bold">Trading View Chart</h6>
        </div>
        <div className="card-body  position-relative">
          <TradingViewWidget
            symbol={`${tokenPair}`}
            theme={Themes.DARK}
            withdateranges
            hide_side_toolbar={false}
            details={false}
            autosize
          />
        </div>
      </div>
    </Row>
  );
}

export default TradingView;
