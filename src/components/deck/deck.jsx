import React from "react";
import "./deck.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeckList from "../deck-list/deck-list";

class Deck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
      open: false,
    };
  }

  toggleHidden = (e) => {
    if (!this.state.open) {
      e.target.className = "expanded-info-button clicked";
    } else {
      e.target.className = "expanded-info-button";
    }
    this.setState({ hidden: !this.state.hidden, open: !this.state.open });
  };

  render() {
    var { item, cards } = this.props;
    return (
      <div className="deck-item">
        <div className="lower-deck-item">
          <div className="unexpanded-info">
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
            <span className="record">
              <span className="wl">WL </span> {`${item.wins} - ${item.losses}`}
            </span>
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
          <div className="expanded-info-button" onClick={this.toggleHidden}>
            {!this.state.open ? (
              <FontAwesomeIcon icon="chevron-down" />
            ) : (
              <FontAwesomeIcon icon="chevron-up" />
            )}
          </div>
        </div>
        {!this.state.hidden ? (
          <div className="expanded-info">
            <DeckList deck={item} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Deck;
