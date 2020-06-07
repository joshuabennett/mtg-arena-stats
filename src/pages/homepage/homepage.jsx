// Overall Stats (current set only)
// Top 10 commons, top 10 uncommon, top 5 rares
// Archetype winrates
// Top Players??
// Recent 7-0 decks?

import React from "react";
import "./homepage.scss";

const Homepage = () => (
  <div className="homepage">
    <div className="news-section">
      <div className="banner"></div>
    </div>
    <div className="stats-section">
      <div className="top-players"></div>
      <div className="top-cards"></div>
      <div className="top-decks"></div>
    </div>
  </div>
);

export default Homepage;
