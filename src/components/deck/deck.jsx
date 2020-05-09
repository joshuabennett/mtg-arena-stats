import React from "react";
import "./deck.scss";

const Deck = props => {
  return (
    <div className="deck-item">
      <h3>{props.item.deckName}</h3>
      {props.item.colors > 0
        ? props.item.colors.map(item => {
            return <span className="color">{item}</span>;
          })
        : null}
      <h3 className="archetype">{props.item.archetype}</h3>
      <h3>{`${props.item.wins} - ${props.item.losses}`}</h3>
    </div>
  );
};

export default Deck;
