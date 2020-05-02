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
    cards: []
  });

  resetState = () => {
    this.setState(this.getInitialState());
    document
      .querySelectorAll(".color-boxes input")
      .forEach(item => (item.checked = false));
    document.querySelector("textarea").innerHTML = "";
  };

  handleSubmit(e) {
    e.preventDefault();
    const decksRef = firebase.database().ref("decks");
    const deck = {
      ...this.state
    };
    decksRef.push(deck);
    this.resetState();
  }

  handleChange(e) {
    if (e.target.type === "text") {
      this.setState({
        [e.target.name]: e.target.value
      });
    } else if (e.target.type === "checkbox") {
      var val = e.target.value;
      if (e.target.checked) {
        this.setState(state => {
          const colors = [...state.colors, val];
          return { colors };
        });
      } else {
        this.setState(state => {
          const colors = state.colors.filter(item => item !== val);
          return { colors };
        });
      }
    } else if (e.target.type === "textarea") {
      this.parseDeck(e.target.value);
    }
  }

  parseDeck(plainText) {
    // var cards = plainText.split("/n");
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
              name="cards"
              rows="30"
              cols="50"
              placeholder="Paste Decklist Here"
              onChange={this.handleChange}
            ></textarea>
            <button>Add Deck</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ImportForm;
