import React from "react";
import "./deck-list.scss";

import { firestore } from "../../firebase/firebase";

class DeckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      lands: [],
      creatures: [],
      spells: [],
      artifacts: [],
      enchantments: [],
    };
  }

  componentDidMount() {
    this.getCards(this.props.location.state.deck.cards);
  }

  // This is the only way I can get the cards to go into the for loop of sort cards.
  // I'm still not sure what's happening. But this works for now until I find a better way.
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.sortCards();
    }
  }

  async getCards(cards) {
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

  sortCards() {
    var creatures = [];
    var enchantments = [];
    var artifacts = [];
    var lands = [];
    var spells = [];
    console.log(this.state.cards);
    this.state.cards.forEach((card) => {
      if (card.cardType) {
        console.log(card);
        if (card.cardType.includes("Land")) {
          lands.push(card);
        } else if (card.cardType.includes("Creature")) {
          creatures.push(card);
        } else if (card.cardType.includes("Enchantment")) {
          enchantments.push(card);
        } else if (card.cardType.includes("Artifact")) {
          artifacts.push(card);
        } else if (
          card.cardType.includes("Sorcery") ||
          card.cardType.includes("Instant")
        ) {
          spells.push(card);
        }
      }
    });
    console.log(creatures);
    this.setState({ creatures, enchantments, artifacts, lands, spells });
  }

  render() {
    return (
      <div className="deck-list-page">
        <div className="deck-list-container">
          <h1 className="deck-name">Deck Name</h1>
          <div className="deck-list">
            <h3>
              Creatures (
              {this.state.creatures.reduce(
                (accumalator, currentVal) =>
                  accumalator + parseInt(currentVal.cardAmount),
                0
              )}
              )
            </h3>
            {this.state.creatures
              ? this.state.creatures.map((card) => {
                  return (
                    <div className="row">
                      <div className="card-amount">{card.cardAmount} x </div>
                      <div className="card-name">{card.cardName}</div>
                    </div>
                  );
                })
              : null}
            <h3>
              Artifacts (
              {this.state.artifacts.reduce(
                (accumalator, currentVal) =>
                  accumalator + parseInt(currentVal.cardAmount),
                0
              )}
              )
            </h3>
            {this.state.artifacts
              ? this.state.artifacts.map((card) => {
                  return (
                    <div className="row">
                      <div className="card-amount">{card.cardAmount} x </div>
                      <div className="card-name">{card.cardName}</div>
                    </div>
                  );
                })
              : null}
            <h3>
              Spells (
              {this.state.spells.reduce(
                (accumalator, currentVal) =>
                  accumalator + parseInt(currentVal.cardAmount),
                0
              )}
              )
            </h3>
            {this.state.spells
              ? this.state.spells.map((card) => {
                  return (
                    <div className="row">
                      <div className="card-amount">{card.cardAmount} x </div>
                      <div className="card-name">{card.cardName}</div>
                    </div>
                  );
                })
              : null}

            <h3>
              Enchantments (
              {this.state.enchantments.reduce(
                (accumalator, currentVal) =>
                  accumalator + parseInt(currentVal.cardAmount),
                0
              )}
              )
            </h3>
            {this.state.enchantments
              ? this.state.enchantments.map((card) => {
                  return (
                    <div className="row">
                      <div className="card-amount">{card.cardAmount} x </div>
                      <div className="card-name">{card.cardName}</div>
                    </div>
                  );
                })
              : null}
            <h3>
              Lands (
              {this.state.lands.reduce(
                (accumalator, currentVal) =>
                  accumalator + parseInt(currentVal.cardAmount),
                0
              )}
              )
            </h3>
            {this.state.lands
              ? this.state.lands.map((card) => {
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
