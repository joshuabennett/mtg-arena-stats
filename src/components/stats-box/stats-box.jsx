import React from "react";
import "./stats-box.scss";
import { Link } from "react-router-dom";

const StatsBox = (props) => (
  <div className="stats-box">
    <div className="stats-title">
      <h3>{props.title}</h3>
    </div>
    {props.data.slice(0, props.amount).map((item) => {
      return (
        <div className={props.hasMana ? "stats-row has-mana" : "stats-row"}>
          {item.image ? <img src={item.image} alt="card" /> : null}
          <div className="stats-info">
            <div className="stats-front-col">
              {props.isPlayer ? (
                <Link to={`/profile/${item.middleTopData}`}>
                  <h4>{item.middleTopData}</h4>
                </Link>
              ) : props.isDeck ? (
                <Link
                  to={`/profile/${item.middleBottomData.slice(
                    item.middleBottomData.indexOf("by ") + 3
                  )}`}
                >
                  <h4>{item.middleTopData}</h4>
                </Link>
              ) : props.isCard ? (
                <Link to={`/card/${item.middleTopData}`}>
                  <h4>{item.middleTopData}</h4>
                </Link>
              ) : props.hasMana ? (
                <h4>{item.middleBottomData}</h4>
              ) : (
                <h4>{item.middleTopData}</h4>
              )}
              <span>{item.rightData}</span>
            </div>
            {props.hasMana ? null : (
              <div className="stats-right-col">
                <span>{item.middleBottomData}</span>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default StatsBox;
