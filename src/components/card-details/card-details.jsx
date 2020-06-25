import React from "react";
import "./card-details.scss";

import { firestore } from "../../firebase/firebase";
import DataBox from "../data-box/data-box";
import { DEFAULT_SET } from "../../App";
import { colorsToString } from "../../utils/helpers";

// Single Card Component showing a picture, logged in user's data for the cards, and all users data for the card.
class CardDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: "",
      allCards: "",
      set: window.sessionStorage.getItem("currentSet") || DEFAULT_SET,
      rarityPosition: 0,
      colorPosition: 0,
      totalCards: 0,
      colorTotalCards: 0,
    };
  }

  componentDidMount() {
    // Loads individual logged in user's data for the card
    if (window.sessionStorage.getItem("currentUser")) {
      const cardsRef = firestore
        .collection("users")
        .doc(window.sessionStorage.getItem("currentUser"))
        .collection("sets")
        .doc(window.sessionStorage.getItem("currentSet"));

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

    // Loads information collected from all users for the card even if never drafted by logged in user.
    const allCardsRef = firestore
      .collection("mergedData")
      .doc(this.state.set)
      .collection("allCards")
      .doc(this.props.match.params.cardName);

    allCardsRef.get().then((snapshot) => {
      if (snapshot.exists) {
        this.setState(
          {
            allCards: snapshot.data(),
          },
          () => {
            this.getExtraData();
          }
        );
      }
    });
  }

  getExtraData() {
    const positionRef = firestore
      .collection("mergedData")
      .doc(this.state.set)
      .collection("allCards");

    // Get the ranking of all cards based on times drafted
    positionRef
      .where("rarity", "==", this.state.allCards.rarity)
      .orderBy("timesDrafted", "desc")
      .get()
      .then((qSnapshot) => {
        let x = 0;
        qSnapshot.forEach((item) => {
          x++;
          if (item.data().cardName === this.state.allCards.cardName) {
            this.setState({ totalPosition: x, totalCards: qSnapshot.size });
          }
        });
      });

    // Position of card based on Times drafted within all cards of the same color.
    positionRef
      .where("colors", "==", this.state.allCards.colors)
      .orderBy("timesDrafted", "desc")
      .get()
      .then((qSnapshot) => {
        let x = 0;
        qSnapshot.forEach((item) => {
          x++;
          if (item.data().cardName === this.state.allCards.cardName) {
            this.setState({
              colorPosition: x,
              colorTotalCards: qSnapshot.size,
            });
          }
        });
      });
  }

  render() {
    const { card, allCards } = this.state;

    return (
      <div className="card-details-page">
        <div className="card-details-container">
          <div className="card-image">
            <img src={allCards.fullimage} alt="Card" />
          </div>
          <div className="card-information">
            <h1 className="details-card-name">{allCards.cardName}</h1>
            <div className="details-card-colors">
              <span className="color-name">
                {allCards.colors
                  ? allCards.colors.map((color) => {
                      return (
                        <img src={`/images/Mana_${color}.png`} alt="color" />
                      );
                    })
                  : null}
              </span>
              <span className={`details-rarity ${allCards.rarity}`}>
                <div className="details-rarity-pip"></div>
                {allCards.rarity}
              </span>
            </div>
            <div className="all-information">
              {card ? (
                <div className="stats-table">
                  <span class="reminder-text">Your Personal Stats</span>
                  <DataBox
                    iconName="hands"
                    label="Amount Drafted"
                    data={card.timesDrafted}
                  />
                  <DataBox
                    iconName="trophy"
                    label="Wins"
                    data={card.winsWithCard}
                  />
                  <DataBox
                    iconName="skull"
                    label="Losses"
                    data={card.lossesWithCard}
                  />
                  <DataBox
                    iconName="calculator"
                    label="Win Rate"
                    data={
                      (
                        (card.winsWithCard /
                          (card.winsWithCard + card.lossesWithCard)) *
                        100
                      ).toPrecision(3) + "%"
                    }
                  />
                  {/* Archetype Information
          Decks Used In and Amount */}
                </div>
              ) : (
                <div className="stats-table">
                  <span class="reminder-text">
                    Import a deck with this card.
                  </span>
                  <DataBox
                    iconName="skull"
                    label={`No Personal Stats`}
                    data={null}
                  />
                </div>
              )}
              <div className="all-stats-table">
                <span class="reminder-text">All Players Combined Stats</span>
                <DataBox
                  iconName="hands"
                  label="Amount Drafted"
                  data={allCards.timesDrafted}
                />
                <DataBox
                  iconName="trophy"
                  label="Wins"
                  data={allCards.winsWithCard}
                />
                <DataBox
                  iconName="skull"
                  label="Losses"
                  data={allCards.lossesWithCard}
                />
                <DataBox
                  iconName="calculator"
                  label="Win Rate"
                  data={
                    (
                      (allCards.winsWithCard /
                        (allCards.winsWithCard + allCards.lossesWithCard)) *
                      100
                    ).toPrecision(3) + "%"
                  }
                />
                {/* Archetype Information
          Decks Used In and Amount */}
              </div>
              <div className="rankings-table">
                <span class="reminder-text">
                  Placements ranked by amount drafted.
                </span>
                <DataBox
                  iconName="star"
                  label={`${allCards.rarity} Cards`}
                  data={`${this.state.totalPosition} / ${this.state.totalCards}`}
                />
                <DataBox
                  iconName="star"
                  label={
                    this.state.allCards.colors
                      ? colorsToString(
                          this.state.allCards.colors,
                          this.state.allCards.type_line
                        ) + " Cards"
                      : null
                  }
                  data={`${this.state.colorPosition} / ${this.state.colorTotalCards}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardDetails;
