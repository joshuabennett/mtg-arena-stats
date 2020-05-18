// Deck Name
// Colors
// Deck Archetype (Dropdown with option for new)
// Wins
// Losses
// Decklist from Arena
import React from "react";
import "./import-form.scss";

import firebase from "../../firebase/firebase";

class ImportForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getInitialState = () => ({
    deckName: "",
    colors: [],
    wins: "",
    losses: "",
    archetype: "",
    cardstext: "",
  });

  resetState = () => {
    this.setState(this.getInitialState());
    document
      .querySelectorAll(".color-boxes input")
      .forEach((item) => (item.checked = false));
  };

  handleSubmit(e) {
    e.preventDefault();
    const decksRef = firebase.database().ref("decks");
    const deck = {
      ...this.state,
    };
    decksRef.push(deck);

    const cards = this.parseDeck(this.state.cardstext);
    for (let card of cards) {
      this.addCardToDB(card, deck);
    }

    this.resetState();
  }

  handleChange(e) {
    if (e.target.type === "text" || e.target.type === "textarea") {
      this.setState({
        [e.target.name]: e.target.value,
      });
    } else if (e.target.type === "checkbox") {
      var val = e.target.value;
      if (e.target.checked) {
        this.setState((state) => {
          const colors = [...state.colors, val];
          return { colors };
        });
      } else {
        this.setState((state) => {
          const colors = state.colors.filter((item) => item !== val);
          return { colors };
        });
      }
    }
  }

  parseDeck(plainText) {
    if (!plainText) return;
    var deckListObject = {};
    var cards = plainText.split("\n");

    var reducedCards = cards.filter((item) => {
      return item !== "[Deck]" && item !== "[Sideboard]" && item !== "";
    });

    for (const card of reducedCards) {
      deckListObject["cardName"] = card.slice(card.indexOf(" "));
      deckListObject["amount"] = card.slice(0, card.indexOf(" "));
    }
    return deckListObject;
  }

  addCardToDB(newCard, deck) {
    const cardsRef = firebase.database.ref("cards");
    firebase
      .database()
      .ref(`cards/${newCard.cardName}`)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          var card = snapshot.val();
          let updatedInfo = {
            timesDrafted: card.timesDrafted + newCard.amount,
            winsWithCard: card.winsWithCard + deck.wins,
            lossesWithCard: card.lossesWithCard + deck.losses,
          };
          cardsRef.child(newCard.cardName).update(updatedInfo);
        } else {
          cardsRef.child(newCard.cardName).push({
            timesDrafted: 0 + newCard.amount,
            winsWithCard: 0 + deck.wins,
            lossesWithCard: 0 + deck.losses,
          });
        }
      });
  }

  render() {
    return (
      <div className="import-form">
        <h1>Import Deck</h1>
        <div className="container">
          <form className="deck-form" onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="deckName"
              placeholder="Deck Name"
              onChange={this.handleChange}
              value={this.state.deckName}
            />
            <h3>Colors</h3>
            <div className="color-boxes">
              <input
                type="checkbox"
                name="blue"
                value="u"
                onChange={this.handleChange}
              />
              <label for="u">U</label>
              <input
                type="checkbox"
                name="green"
                value="g"
                onChange={this.handleChange}
              />
              <label for="g">G</label>
              <input
                type="checkbox"
                name="black"
                value="b"
                onChange={this.handleChange}
              />
              <label for="b">B</label>
              <input
                type="checkbox"
                name="red"
                value="r"
                onChange={this.handleChange}
              />
              <label for="r">R</label>
              <input
                type="checkbox"
                name="white"
                value="w"
                onChange={this.handleChange}
              />
              <label for="w">W</label>
            </div>
            <input
              type="text"
              name="wins"
              placeholder="# of Wins"
              onChange={this.handleChange}
              value={this.state.wins}
            />
            <input
              type="text"
              name="losses"
              placeholder="# of Losses"
              onChange={this.handleChange}
              value={this.state.losses}
            />
            <input
              type="text"
              name="archetype"
              placeholder="Archetype"
              onChange={this.handleChange}
              value={this.state.archetype}
            />
            <textarea
              name="cardstext"
              rows="30"
              cols="50"
              placeholder="Paste Decklist Here"
              onChange={this.handleChange}
              value={this.state.cardstext}
            ></textarea>
            <button>Add Deck</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ImportForm;
