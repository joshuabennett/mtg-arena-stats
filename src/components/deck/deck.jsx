import React from "react";
import "./deck.scss";

const Deck = (props) => {
  var { item } = props;

  return (
    <div className="deck-item">
      <h3>{item.deckName}</h3>
      <div className="colors">
        {item.colors.length > 0
          ? item.colors.map((item) => {
              return <span className="color">{item}</span>;
            })
          : null}
      </div>
      <h3 className="archetype">{item.archetype}</h3>
      <h3>{`${item.wins} - ${item.losses}`}</h3>
    </div>
  );
};

export default Deck;
