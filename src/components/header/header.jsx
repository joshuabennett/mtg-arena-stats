import React from "react";
import "./header.scss";

import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebase";

const Header = props => (
  <div className="header">
    <Link className="link-container" to="/"></Link>
    <div className="options">
      <Link className="option" to="/stats">
        STATS
      </Link>
      <Link className="option" to="/import">
        IMPORT
      </Link>
      <Link className="option" to="/profile">
        PROFILE
      </Link>
      {props.user ? (
        <div className="option" onClick={() => auth.signOut()}>
          LOGOUT
        </div>
      ) : (
        <Link className="option" to="/login">
          LOGIN
        </Link>
      )}
    </div>
  </div>
);

export default Header;
