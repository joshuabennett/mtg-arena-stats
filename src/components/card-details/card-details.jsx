import React from "react";
import "./card-details.scss";

const CardDetails = ({ card }) => (
  <div className="card-details-container">
    <div className="card-image"></div>
    <div className="card-information">
      <div className="details-card-name">{card.cardName}</div>
      <div className="details-card-colors">{card.colors}</div>
      <div className="details-card-rarity">{card.rarity}</div>
      <div className="stats-table">
        <div className="details-times-drafted">
          # Drafted: {card.timesDrafted}
        </div>
        <div className="details-wins"># Wins: {card.winsWithCard}</div>
        <div className="details-losses"># Losses: {card.lossesWithCard}</div>
        <div className="details-winpct">Win Percentage: </div>
        {/* Archetype Information
        Decks Used In and Amount */}
      </div>
    </div>
  </div>
);

export default CardDetails;
