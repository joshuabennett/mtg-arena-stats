import React from "react";
import "./magic-card.scss";

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
    return (
      <div className="magic-card">
        <div className="card-name">{card.cardName}</div>
        <div className="card-amount">{card.timesDrafted}</div>
        <div className="card-wins">{card.winsWithCard}</div>
        <div className="card-losses">{card.lossesWithCard}</div>
        <div className="win-pct">
          {(
            card.winsWithCard /
            (card.winsWithCard + card.lossesWithCard)
          ).toPrecision(3) * 100}
        </div>
      </div>
    );
  }
}

export default MagicCard;
