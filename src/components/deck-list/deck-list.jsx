import React from "react";
import "./deck-list.scss";

import { firestore } from "../../firebase/firebase";

class DeckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
    };
  }

  componentDidMount() {
    this.getCards(this.props.location.state.deck.cards);
  }

  getCards(cards) {
    if (window.sessionStorage.getItem("currentUser")) {
      var newState = [];
      cards.forEach(async (card) => {
        var cardType;
        await firestore
          .collection("users")
          .doc(window.sessionStorage.getItem("currentUser"))
          .collection("sets")
          .doc(window.sessionStorage.getItem("currentSet"))
          .collection("cards")
          .doc(card.cardName)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              cardType = snapshot.data().type_line;
              console.log(cardType);
            }
          });
        newState.push({
          cardAmount: card.amount,
          cardName: card.cardName,
          cardType: cardType,
        });
      });
      this.setState({ cards: newState });
    }
  }

  render() {
    return (
      <div className="deck-list-page">
        <div className="deck-list-container">
          <h1 className="deck-name">Deck Name</h1>
          <div className="deck-list">
            {this.state.cards
              ? this.state.cards.map((card) => {
                  return (
                    <div className="row">
                      <div className="card-amount">{card.cardAmount} x </div>
                      <div className="card-name">{card.cardName}</div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export default DeckList;
