import * as React from "react";
// import { Link } from "react-router-dom";
import "../../style/SearchBox.css";
// import { search, handleKey, setQuery } from "../actions/index";
import glass from "../../img/glass.svg";

function SearchBox() {
  return (
    <div>
      {/* <Link className="about" to="/about">
        About
      </Link> */}

      <div className="">
        <img
          //   onClick={search}
          className="glass"
          alt="magnifying glass"
          src={glass}
        />
        <input
          //   onChange={(e) => setQuery(e)}
          //   onKeyPress={(e) => handleKey(e)}
          placeholder="Search for another token..."
          autoFocus={true}
        />
      </div>
    </div>
  );
}

export default SearchBox;
