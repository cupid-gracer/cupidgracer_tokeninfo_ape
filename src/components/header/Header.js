import React, { useState, useEffect } from "react";
import logo from "../../img/ape-logo.png";
import metamask from "../../img/metamask.svg";
import {
  Navbar,
  Container,
  InputGroup,
  FormControl,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Search as SearchI } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { useMetaMask } from "metamask-react";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";
import { setBalance } from "../../features/enoughBalanceSlice";

export default function PrimarySearchAppBar(props) {
  const util = props.util;
  const dispatch = useDispatch();
  const [token, setToken] = useState();
  const [connected, setConnected] = useState(false);
  const { status, connect, account } = useMetaMask();

  useEffect(() => {
    connectMetamask();
  });

  async function connectMetamask() {
    if (status === "initializing") {
      console.log("Synchronisation with MetaMask ongoing...");
    }

    if (status === "unavailable") {
      NotificationManager.warning(
        "Now Metamask is unavailable. Please Confirm whether it is available!"
      );
      console.log("MetaMask not available");
    }

    if (status === "notConnected") {
      connect();
    }

    if (status === "connecting") {
      NotificationManager.info("Metamask Connecting...");
      console.log("Connecting...");
    }

    if (status === "connected") {

      setConnected(true);
      const interval = setInterval(() => {
        (async () => {
          const bal = await util.getBalanceMetamask(account);
          dispatch(setBalance(bal));
        })();
      }, 10000);
      return () => clearInterval(interval);
    }
  }

  const history = useHistory();
  function update(event) {
    setToken(event.target.value);
  }

  async function todo() {
    const bal = await util.getBalanceMetamask(account);
    dispatch(setBalance(bal));
    history.push("/token/" + token);
  }

  function keyPress(e) {
    if (e.keyCode === 13) {
      todo();
    }
  }

  function searchBtnPress() {
    todo();
  }

  return (
    <Navbar
      position="static"
      className="App-header"
      style={{ position: "sticky", top: 0, zIndex: 1 }}
    >
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} className="App-logo" alt="logo" />
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <div style={{ width: "50%" }}>
            <InputGroup className="d-flex">
              <FormControl
                type="search"
                className="mr-3"
                placeholder="Search Token"
                aria-label="Search"
                onChange={update}
                onKeyDown={keyPress}
              />
              <Button variant="outline-warning" onClick={searchBtnPress}>
                <SearchI color="white" />
              </Button>

              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-bottom">
                    {connected ? "Connected to Metamask" : "Connect to Metamask"}
                  </Tooltip>
                }
              >
                <div>
                  <Button
                    className="ms-3"
                    onClick={connectMetamask}
                    disabled={connected}
                  >
                    <img src={metamask} width="30px" alt="logo" />
                  </Button>
                </div>
              </OverlayTrigger>
            </InputGroup>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
