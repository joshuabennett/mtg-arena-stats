import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TableHeader = ({ children, name, activeCol, desc, onClickHandler }) => (
  <h3 className={name} onClick={onClickHandler}>
    {children}
    {activeCol === name ? (
      desc ? (
        <FontAwesomeIcon icon="sort-down"></FontAwesomeIcon>
      ) : (
        <FontAwesomeIcon icon="sort-up"></FontAwesomeIcon>
      )
    ) : null}
  </h3>
);

export default TableHeader;
