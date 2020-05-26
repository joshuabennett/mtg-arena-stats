import React from "react";
import "./magic-card.scss";

import { Link } from "react-router-dom";

class MagicCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: {},
    };
  }

  componentDidMount() {
    this.setState({ card: this.props.card });
  }

  render() {
    const { card } = this.state;
    var rarityClass = `rarity-pip ${card.rarity}`;

    return (
      <div className="magic-card">
        <div className="colors">
          {card.colors
            ? card.colors.map((color) => <div className={color}></div>)
            : null}
        </div>
        <div className="rarity">
          <div className={rarityClass}></div>
        </div>
        <div className="card-name">
          <Link to={`/card/${card.cardName}`}>{card.cardName}</Link>
        </div>
        <div className="card-amount">{card.timesDrafted}</div>
        <div className="card-wins">{card.winsWithCard}</div>
        <div className="card-losses">{card.lossesWithCard}</div>
        <div className="win-pct">
          {(
            (card.winsWithCard / (card.winsWithCard + card.lossesWithCard)) *
            100
          ).toPrecision(3)}
        </div>
      </div>
    );
  }
}

export default MagicCard;
