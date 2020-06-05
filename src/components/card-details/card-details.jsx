import React from "react";
import "./card-details.scss";

import { firestore } from "../../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataBox from "../data-box/data-box";

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
                {card.colors
                  ? card.colors.map((color) => {
                      return (
                        <img src={`/images/Mana_${color}.png`} alt="color" />
                      );
                    })
                  : null}
              </span>
              <span className={`details-rarity ${card.rarity}`}>
                <div className="details-rarity-pip"></div>
                {card.rarity}
              </span>
            </div>
            <div className="stats-table">
              <DataBox
                iconName="hands"
                label="Total Drafted"
                data={card.timesDrafted}
              />
              <DataBox
                iconName="trophy"
                label="Total Wins"
                data={card.winsWithCard}
              />
              <DataBox
                iconName="skull"
                label="Total Losses"
                data={card.lossesWithCard}
              />
              <DataBox
                iconName="calculator"
                label="Win Percentage"
                data={
                  (
                    (card.winsWithCard /
                      (card.winsWithCard + card.lossesWithCard)) *
                    100
                  ).toPrecision(2) + "%"
                }
              />
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
