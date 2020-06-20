import React from "react";
import "./deck-list.scss";

import { firestore } from "../../firebase/firebase";
import DeckSection from "../deck-list-section/deck-list-section";

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
    this.getCards(this.props.deck.cards);
  }

  async getCards(cards) {
    var newState = [];
    var cardType = "";
    var cardRarity = "";
    await Promise.all(
      cards.map(async (card) => {
        var snapshot = await firestore
          .collection("mergedData")
          .doc(window.sessionStorage.getItem("currentSet"))
          .collection("allCards")
          .doc(card.cardName)
          .get();
        if (snapshot.exists) {
          cardType = snapshot.data().type_line;
          cardRarity = snapshot.data().rarity;
        } else {
          cardType = "Basic Land";
          cardRarity = "Common";
        }
        newState.push({
          cardAmount: card.amount,
          cardName: card.cardName,
          cardType: cardType,
          cardRarity: cardRarity,
        });
      })
    );
    this.setState({ cards: newState }, () => this.sortCards());
  }

  sortCards() {
    var creatures = [];
    var enchantments = [];
    var artifacts = [];
    var lands = [];
    var spells = [];
    this.state.cards.forEach((card) => {
      if (card.cardType) {
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
    this.setState({ creatures, enchantments, artifacts, lands, spells });
  }

  render() {
    return (
      <div className="deck-list-page">
        <div className="deck-list-container">
          <h1 className="deck-name">Deck Name</h1>
          <div className="deck-list">
            {["creatures", "artifacts", "enchantments", "spells", "lands"].map(
              (type) => {
                return this.state[type].length > 0 ? (
                  <DeckSection sectionName={type} section={this.state[type]} />
                ) : null;
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DeckList;
