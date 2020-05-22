import React from "react";
import "./header.scss";

import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebase";

const Header = (props) => (
  <div className="header">
    <Link className="link-container" to="/"></Link>
    <div className="set-selection">
      <label for="sets">CURRENT SET</label>
      <select name="sets" id="sets" onChange={props.setChangeHandler}>
        <option value="IKO">IKO</option>
        <option value="THB">THB</option>
        <option value="ELD">ELD</option>
      </select>
    </div>
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
