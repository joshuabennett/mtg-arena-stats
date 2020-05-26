import React from "react";
import "./card-details.scss";

import { firestore } from "../../firebase/firebase";

class CardDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: "",
    };
  }

  componentDidMount() {
    const cardsRef = firestore
      .collection("users")
      .doc(window.sessionStorage.getItem("currentUser"))
      .collection("sets")
      .doc(window.sessionStorage.getItem("currentSet"));

    var card;

    cardsRef
      .collection("cards")
      .doc(this.props.match.params.cardName)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.setState({
            card: snapshot.data(),
          });
        }
      });
  }

  render() {
    const { card } = this.state;

    return (
      <div className="card-details-page">
        <div className="card-details-container">
          <div className="card-image">
            <img src={card.image_url} alt="Card" />
          </div>
          <div className="card-information">
            <h1 className="details-card-name">{card.cardName}</h1>
            <div className="details-card-colors">
              <span className="color-name">
                <img src={`/images/Mana_${card.colors}.png`} alt="color" />
              </span>
              <span className="details-rarity">
                <div className="details-rarity-pip"></div>
                {card.rarity}
              </span>
            </div>
            <div className="stats-table">
              <div className="details-times-drafted">
                # Drafted: {card.timesDrafted}
              </div>
              <div className="details-wins"># Wins: {card.winsWithCard}</div>
              <div className="details-losses">
                # Losses: {card.lossesWithCard}
              </div>
              <div className="details-winpct">Win Percentage: </div>
              {/* Archetype Information
          Decks Used In and Amount */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardDetails;
