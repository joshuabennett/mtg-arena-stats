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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      desc: false,
      activeCol: "",
    };
  }

  componentDidMount() {
    const cardsRef = firestore.collection("cards");
    cardsRef.get().then((snapshot) => {
      var newState = [];
      snapshot.forEach((snapshot) => {
        let card = snapshot.data();
        newState.push({
          cardName: card.cardName,
          timesDrafted: card.timesDrafted,
          winsWithCard: card.winsWithCard,
          lossesWithCard: card.lossesWithCard,
        });
      });
      this.setState({ cards: newState });
    });
  }

  render() {
    const sortTable = (e) => {
      const selection = e.target.className;
      this.setState({ activeCol: selection });
      this.setState((prevState) => {
        if (prevState.desc) {
          return {
            cards: prevState.cards.sort((a, b) => b[selection] - a[selection]),
            desc: false,
          };
        } else {
          return {
            cards: prevState.cards.sort((a, b) => a[selection] - b[selection]),
            desc: true,
          };
        }
      });
      this.forceUpdate();
    };

    return (
      <div className="stats-page">
        <div className="table">
          <h2 classame="table-header">Card Stats</h2>
          <div className="table-header">
            <h3 className="cardName" onClick={sortTable}>
              Card Name
              {this.state.activeCol === "cardName" ? (
                this.state.desc ? (
                  <FontAwesomeIcon icon="sort-down"></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon icon="sort-up"></FontAwesomeIcon>
                )
              ) : null}
            </h3>
            <h3 className="timesDrafted" onClick={sortTable}>
              # Drafted
              {this.state.activeCol === "timesDrafted" ? (
                this.state.desc ? (
                  <FontAwesomeIcon icon="sort-down"></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon icon="sort-up"></FontAwesomeIcon>
                )
              ) : null}
            </h3>
            <h3 className="winsWithCard" onClick={sortTable}>
              # Wins
              {this.state.activeCol === "winsWithCard" ? (
                this.state.desc ? (
                  <FontAwesomeIcon icon="sort-down"></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon icon="sort-up"></FontAwesomeIcon>
                )
              ) : null}
            </h3>
            <h3 className="lossesWithCard" onClick={sortTable}>
              # Losses
              {this.state.activeCol === "lossesWithCard" ? (
                this.state.desc ? (
                  <FontAwesomeIcon icon="sort-down"></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon icon="sort-up"></FontAwesomeIcon>
                )
              ) : null}
            </h3>
            <h3>Win %</h3>
          </div>
          {this.state.cards.map((card) => {
            return (
              <div key={card.cardName} className="table-row">
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
