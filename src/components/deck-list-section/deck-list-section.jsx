import React from "react";
import "./deck-list-section.scss";

import { Link } from "react-router-dom";

const DeckSection = (props) => (
  <div className="deck-section">
    {props.section.length > 0 ? (
      <h3>
        {props.sectionName} (
        {props.section.reduce(
          (accumalator, currentVal) =>
            accumalator + parseInt(currentVal.cardAmount),
          0
        )}
        )
      </h3>
    ) : null}
    {props.section
      ? props.section.map((card) => {
          return (
            <div className="card-row">
              <div className="card-amount">{card.cardAmount}x</div>
              <div className={`card-name ${card.cardRarity}`}>
                <Link to={`/card/${card.cardName}`}>
                  {card.cardName} <span className="shade"></span>
                </Link>
              </div>
            </div>
          );
        })
      : null}
  </div>
);

export default DeckSection;
