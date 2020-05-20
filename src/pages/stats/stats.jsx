// card stats (current set default)
// -- number drafted
// -- win percentage in deck
// -- number of each archetype in
// -- win percntage in each archetype

// archetype stats
// -- number of times drafted
// -- win percentage

// Objects
// -- Deck
// ---- Set
// ---- Wins
// ---- Losses
// ---- Colors
// ---- Archetype
// ---- Cards

// -- Card
// ---- Total Amount
// ---- Wins
// ---- Losses
// ---- Archetypes
// ------ Amount
// ------ Wins
// ------ Losses

import React from "react";
import "./stats.scss";
import { firestore } from "../../firebase/firebase";

import MagicCard from "../../components/magic-card/magic-card";

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

  componentDidMount() {
    const cardsRef = firestore.collection("cards");
    cardsRef.get().then((snapshot) => {
      var newState = [];
      snapshot.forEach((card) => {
        newState.push({ card: card.data() });
      });
      this.setState({ cards: newState });
    });
  }

  render() {
    return (
      <div className="stats-page">
        <div className="table">
          <h2 classame="table-header">Card Stats</h2>
          <div className="table-header">
            <h3 className="name-header">Card Name</h3>
            <h3># Drafted</h3>
            <h3># Wins</h3>
            <h3># Losses</h3>
            <h3>Win %</h3>
          </div>
          {this.state.cards.map((card) => {
            return (
              <div className="table-row">
                <MagicCard card={card} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Stats;
