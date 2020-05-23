import React from "react";
import "./deck.scss";

const Deck = (props) => {
  var { item } = props;

  return (
    <div className="deck-item">
      <h2>{item.deckName}</h2>
      <div className="colors">
        {item.colors.length > 0
          ? item.colors.map((item) => {
              return (
                <span className="color">
                  <img
                    src={`/images/Mana_${item.toUpperCase()}.png`}
                    alt="color-symbol"
                  />
                </span>
              );
            })
          : null}
      </div>
      <h3 className="archetype">{item.archetype}</h3>
      <span className="record">{`${item.wins} - ${item.losses}`}</span>
    </div>
  );
};

export default Deck;
