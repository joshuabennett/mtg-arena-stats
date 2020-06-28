import React from "react";
import "./deck.scss";
import Axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeckList from "../deck-list/deck-list";
import { FadeIn } from "animate-components";

const COLOR_MAP = {
  u: "blue",
  r: "red",
  w: "white",
  b: "black",
  g: "green",
};

class Deck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
      open: false,
      imageUrl: "",
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

  async wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async componentDidMount() {
    // Build the string for the API call based on colors after converting them to their names
    // %3A is =, c is creature
    var colorString = "";
    this.props.item.colors.forEach((color) => {
      colorString += `c%3A${COLOR_MAP[color]}+`;
    });
    // Need to remove the final '+'
    colorString.substring(0, colorString.length - 1);
    const data = await Axios.get(
      `https://api.scryfall.com/cards/random?q=${colorString}`
    );
    await this.wait(100);
    // Some cards don't have images or art-crops
    if (data.data.image_uris) {
      this.setState({ imageUrl: data.data.image_uris.art_crop });
    }
  }

  render() {
    var { item, cards } = this.props;
    // Only way I can think of having a dynamic background-image is doing this through Javascript.
    var imageStyle = {
      backgroundImage: `url(${this.state.imageUrl})`,
      backgroundPosition: "center center",
      backgroundSize: "100%",
      borderRadius: "5px",
    };

    return (
      <div className="deck-item">
        <div className="lower-deck-item" style={imageStyle}>
          <div className="unexpanded-info">
            <div className="deck-title-information col">
              <div className="date">{item.date}</div>
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
            <span className="record col">
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
            <div className="rare-mythic-cards col">
              {parseInt(item.wins) > 6 ? (
                <div className="seven-wins-icon">
                  <FontAwesomeIcon icon="star" />
                </div>
              ) : null}
              <div className="rare-cards">
                {/* Only display the rare and mythic cards */}
                {cards
                  ? item.cards
                      .filter((card) => {
                        var value = false;
                        cards.forEach((otherCard) => {
                          if (card.cardName === otherCard.cardName) {
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
          <FadeIn className="expanded-info" as="div" duration="1.5s">
            <DeckList deck={item} />
          </FadeIn>
        ) : null}
      </div>
    );
  }
}

export default Deck;
