import React from "react";
import "./magic-card.scss";
import firebase from "../../firebase/firebase";

class MagicCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: {},
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref(`cards/${this.props.card.cardName}`)
      .once("value", (snapshot) => {
        let card = snapshot.val();
        this.setState({ card: card });
      });
  }

  render() {
    const { card } = this.state;
    return (
      <div className="magic-card">
        <div className="card-name">{card.cardName}</div>
        <div className="card-amount">{card.amount}</div>
        <div className="card-wins">{card.wins}</div>
        <div className="card-losses">{card.losses}</div>
      </div>
    );
  }
}

export default MagicCard;
