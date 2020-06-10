import React from "react";
import "./stats-box.scss";

const StatsBox = (props) => (
  <div className="stats-box">
    <div className="stats-title">
      <h3>{props.title}</h3>
    </div>
    {props.data.slice(0, props.amount).map((item) => {
      return (
        <div className="stats-row">
          {item.image ? <img src={item.image} alt="card" /> : null}
          <div className="stats-info">
            <div className="stats-front-col">
              <h4>{item.middleTopData}</h4>
              <span>{item.rightData}</span>
            </div>
            <div className="stats-right-col">
              <span>{item.middleBottomData}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default StatsBox;
