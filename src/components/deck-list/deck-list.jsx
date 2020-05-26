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
            <DeckSection
              sectionName="Creatures"
              section={this.state.creatures}
            />
            <DeckSection
              sectionName="Artifacts"
              section={this.state.artifacts}
            />
            <DeckSection
              sectionName="Enchantments"
              section={this.state.enchantments}
            />
            <DeckSection sectionName="Spells" section={this.state.spells} />
            <DeckSection sectionName="Lands" section={this.state.lands} />
          </div>
        </div>
      </div>
    );
  }
}

export default DeckList;
