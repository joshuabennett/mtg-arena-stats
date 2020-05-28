import React from "react";
import "./data-box.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DataBox = (props) => (
  <div className="row">
    <div className="icon">
      <FontAwesomeIcon icon={props.iconName} />
    </div>
    <div className="label">{props.label}</div>
    <div className="data">{props.data}</div>
  </div>
);

export default DataBox;
