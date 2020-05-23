import React from "react";
import "./deck-list.scss";

class DeckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: {},
    };
  }

  componentDidMount() {
    this.parseDeck(this.props.location.state.deck.cardstext);
  }

  parseDeck(plainText) {
    if (!plainText) return;
    var deckListObject = {};
    var cards = plainText.split("\n");

    var reducedCards = cards.filter((item) => {
      return item !== "[Deck]" && item !== "[Sideboard]" && item !== "";
    });

    for (const card of reducedCards) {
      deckListObject[card.slice(card.indexOf(" "))] = card.slice(
        0,
        card.indexOf(" ")
      );
    }
    this.setState((state) => {
      const cards = { ...state.cards, ...deckListObject };
      return { cards };
    });
  }

  render() {
    return (
      <div className="deck-list-page">
        <div className="deck-list-container">
          <h1 className="deck-name">Deck Name</h1>
          <div className="deck-list">
            {Object.keys(this.state.cards).map((key) => {
              return (
                <div className="row">
                  <span className="card-amount">{this.state.cards[key]}</span>
                  <span className="card-name">{key}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default DeckList;
