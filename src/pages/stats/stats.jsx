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

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  render() {
    return null;
  }
}

export default Stats;
