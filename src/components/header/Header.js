import React, { useState } from "react";
import logo from "../../img/ape-logo.png";
import {
  Navbar,
  Container,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { Search as SearchI } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";

export default function PrimarySearchAppBar() {
  const [token, setToken] = useState();
  const history = useHistory();
  function update(event) {
    setToken(event.target.value);
  }
  function keyPress(e) {
    if (e.keyCode === 13) {
      history.push("/token/" + token);
    }
  }

  function searchBtnPress() {
    history.push("/token/" + token);
  }

  return (
    <Navbar position="static" className="App-header" style={{position: "sticky", top: 0, zIndex: 1}}>
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
            </InputGroup>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
