import React from "react";
import "./deck.scss";

const Deck = (props) => {
  var { item, cards } = props;

  return (
    <div className="lower-deck-item">
      <div className="deck-title-information">
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
      </div>
      <span className="record">WL {`${item.wins} - ${item.losses}`}</span>
      {/* Need to update the database before testing this feature
      <div className="deck-curve">
        {item.cards.reduce((accum, card) => {
          var val = 0;
          cards.forEach((otherCard) => {
            if (card.cardName === otherCard.cardName) {
              val = otherCard.cmc;
            }
          });
          return accum + val;
        }, 0)}
      </div> */}
      <div className="rare-mythic-cards">
        {cards
          ? item.cards
              .filter((card) => {
                var value = false;
                cards.forEach((otherCard) => {
                  if (card.cardName === otherCard.cardName) {
                    console.log(otherCard.rarity);
                    value =
                      otherCard.rarity === "rare" ||
                      otherCard.rarity === "mythic";
                  }
                });
                return value;
              })
              .map((card) => (
                <div className="rare-mythic-card">{card.cardName}</div>
              ))
          : null}
      </div>
    </div>
  );
};

export default Deck;
