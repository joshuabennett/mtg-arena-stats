// Deck Name
// Colors
// Deck Archetype (Dropdown with option for new)
// Wins
// Losses
// Decklist from Arena
import React from "react";
import "./import-form.scss";

import { firestore } from "../../firebase/firebase";
import Axios from "axios";

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
    loading: { status: false, current: 0, total: 0 },
  });

  resetState = () => {
    this.setState(this.getInitialState());
    document
      .querySelectorAll(".color-boxes input")
      .forEach((item) => (item.checked = false));
  };

  handleSubmit(e) {
    e.preventDefault();
    const decksRef = firestore
      .collection("users")
      .doc(this.props.user.uid)
      .collection("sets")
      .doc(this.props.set)
      .collection("decks");
    const deck = {
      ...this.state,
    };
    decksRef.add(deck);

    const cards = this.parseDeck(this.state.cardstext);
    this.setState({ loading: { status: true, total: cards.length } });
    cards.forEach((card) => {
      this.setState({ loading: { current: this.state.loading.current + 1 } });
      this.addCardToDB(card, deck);
    });

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
    var deckListObject = [];
    var cards = plainText.split("\n");

    var reducedCards = cards.filter((item) => {
      return (
        item !== "[Deck]" &&
        item !== "[Sideboard]" &&
        item !== "" &&
        item !== "Deck" &&
        item !== "Sideboard"
      );
    });

    for (const card of reducedCards) {
      var cardName = card.slice(card.indexOf(" ") + 1, card.indexOf("(") - 1);
      var amount = card.slice(0, card.indexOf(" "));
      if (amount !== "0") {
        deckListObject.push({
          cardName,
          amount,
        });
      }
    }
    return deckListObject;
  }

  async wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async addCardToDB(newCard, deck) {
    var cardQuery = newCard.cardName.replace(" ", "+");
    const data = await Axios.get(
      `https://api.scryfall.com/cards/named?fuzzy=${cardQuery}`
    );
    await this.wait(100);

    if (data.data.type_line !== "Land") {
      const cardsRef = firestore
        .collection("users")
        .doc(this.props.user.uid)
        .collection("sets")
        .doc(this.props.set)
        .collection("cards");
      cardsRef
        .doc(newCard.cardName)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            var card = snapshot.data();
            let updatedInfo = {
              timesDrafted: card.timesDrafted + parseInt(newCard.amount),
              winsWithCard: card.winsWithCard + parseInt(deck.wins),
              lossesWithCard: card.lossesWithCard + parseInt(deck.losses),
            };
            cardsRef.doc(newCard.cardName).update(updatedInfo);
          } else {
            cardsRef.doc(newCard.cardName).set({
              cardName: newCard.cardName,
              timesDrafted: 0 + parseInt(newCard.amount),
              winsWithCard: 0 + parseInt(deck.wins),
              lossesWithCard: 0 + parseInt(deck.losses),
              colors: data.data.colors,
              rarity: data.data.rarity,
              image_url: data.data.image_uris.normal,
            });
          }
        });
    }
  }

  render() {
    return (
      <div className="import-form">
        {this.state.loading.status ? (
          <div className="loading-container">
            <span>
              {this.loading.current} / {this.loading.total}
            </span>
          </div>
        ) : (
          <div className="container">
            <h1>IMPORT DECK</h1>
            <form className="deck-form" onSubmit={this.handleSubmit}>
              <label for="deckName">Deck Name</label>
              <input
                type="text"
                name="deckName"
                className="text-input"
                onChange={this.handleChange}
                value={this.state.deckName}
              />
              <label for="color-boxes">Colors</label>
              <div className="color-boxes">
                <input
                  type="checkbox"
                  name="blue"
                  value="u"
                  id="blue"
                  onChange={this.handleChange}
                />
                <label for="blue"></label>
                <input
                  type="checkbox"
                  name="green"
                  value="g"
                  id="green"
                  onChange={this.handleChange}
                />
                <label for="green"></label>
                <input
                  type="checkbox"
                  name="black"
                  value="b"
                  id="black"
                  onChange={this.handleChange}
                />
                <label for="black"></label>
                <input
                  type="checkbox"
                  name="red"
                  value="r"
                  id="red"
                  onChange={this.handleChange}
                />
                <label for="red"></label>
                <input
                  type="checkbox"
                  name="white"
                  value="w"
                  id="white"
                  onChange={this.handleChange}
                />
                <label for="white"></label>
              </div>
              <div className="wins-and-losses">
                <div className="wins-container">
                  <label for="wins">Wins</label>
                  <input
                    type="text"
                    name="wins"
                    placeholder="# of Wins"
                    className="text-input"
                    onChange={this.handleChange}
                    value={this.state.wins}
                  />
                </div>
                <div className="losses-container">
                  <label for="losses">Losses</label>
                  <input
                    type="text"
                    name="losses"
                    placeholder="# of Losses"
                    className="text-input"
                    onChange={this.handleChange}
                    value={this.state.losses}
                  />
                </div>
              </div>
              <label for="archetype">Archetype</label>
              <input
                type="text"
                name="archetype"
                className="text-input"
                onChange={this.handleChange}
                value={this.state.archetype}
              />
              <label for="deck-text">Deck List</label>
              <div className="deck-text">
                <textarea
                  name="cardstext"
                  rows="30"
                  placeholder="[Paste Decklist Here]"
                  onChange={this.handleChange}
                  value={this.state.cardstext}
                ></textarea>
              </div>
              <button>Add Deck</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default ImportForm;
