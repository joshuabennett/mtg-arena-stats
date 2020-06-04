// Archetype win rates
// Top 3 commons drafted
// Top 3 uncommons drafted
// Top 3 rares drafted
// Favorite Card?

// Need to update so that user is pulled from URL to load profile instead of from props.

import React from "react";
import "./profile.scss";
import { firestore } from "../../firebase/firebase";
import Deck from "../../components/deck/deck";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataBox from "../../components/data-box/data-box";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decks: [],
      set: this.props.set,
      cards: [],
      colors: [],
    };
  }
  componentDidMount() {
    this.updateDecks(this.state.set);
    this.updateCards(this.state.set);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.set !== this.props.set) {
      this.setState({ set: this.props.set });
      this.updateDecks(this.props.set);
      this.updateCards(this.props.set);
    }
  }

  updateDecks(set) {
    if (this.props.user != null) {
      const itemsRef = firestore
        .collection("users")
        .doc(this.props.user.uid)
        .collection("sets")
        .doc(set)
        .collection("decks");
      itemsRef.get().then((snapshot) => {
        let newState = [];
        let colorsData = [];
        snapshot.forEach((snapshot) => {
          let item = snapshot.data();
          newState.push({
            deckName: item.deckName,
            colors: item.colors,
            archetype: item.archetype,
            wins: item.wins,
            losses: item.losses,
            cardstext: item.cardstext,
            cards: item.cards,
          });
          colorsData = ["u", "g", "w", "r", "b"].map((color) => {
            var amountWins = 0;
            var amountLosses = 0;
            newState.forEach((deck) => {
              if (deck.colors.includes(color)) {
                amountWins += parseInt(deck.wins);
                amountLosses += parseInt(deck.losses);
              }
            });
            return { color: color, wins: amountWins, losses: amountLosses };
          });
        });
        this.setState({
          decks: newState,
          colors: colorsData,
        });
      });
    }
  }

  updateCards(set) {
    if (this.props.user != null) {
      const cardsRef = firestore
        .collection("users")
        .doc(this.props.user.uid)
        .collection("sets")
        .doc(set)
        .collection("cards");
      cardsRef.get().then((snapshot) => {
        var newState = [];
        snapshot.forEach((snapshot) => {
          let card = snapshot.data();
          newState.push({
            cardName: card.cardName,
            timesDrafted: card.timesDrafted,
            winsWithCard: card.winsWithCard,
            lossesWithCard: card.lossesWithCard,
            rarity: card.rarity,
            image_url: card.image_url,
            colors: card.colors,
            type_line: card.type_line,
            cmc: card.cmc,
            crop: card.image_crop,
          });
        });
        newState = newState.sort((a, b) => b.timesDrafted - a.timesDrafted);
        this.setState({ cards: newState });
      });
    }
  }

  render() {
    var totalWins = this.state.decks.reduce(
      (accumaltor, currentVal) => accumaltor + parseInt(currentVal.wins),
      0
    );
    var totalLosses = this.state.decks.reduce(
      (accumaltor, currentVal) => accumaltor + parseInt(currentVal.losses),
      0
    );
    return (
      <div className="profile-page">
        {this.props.user ? (
          <div className="player-container">
            <div className="avatar">
              <img src="images/Avatar_Mu.png" alt="avatar" />
            </div>
            <div className="player-info-container">
              <div className="username">
                <FontAwesomeIcon icon="user" />
                <h2>{this.props.user.displayName}</h2>
              </div>
              {this.state.decks ? (
                <div className="player-stats">
                  <DataBox
                    iconName="trophy"
                    label="Total Wins"
                    data={totalWins}
                  />
                  <DataBox
                    iconName="skull"
                    label="Total Losses"
                    data={totalLosses}
                  />
                  <DataBox
                    iconName="calculator"
                    label="Win Percentage"
                    data={(
                      (totalWins / (totalWins + totalLosses)) *
                      100
                    ).toPrecision(3)}
                  />
                  <DataBox
                    iconName="hands"
                    label="Drafts Played"
                    data={this.state.decks.length}
                  />
                  <DataBox
                    iconName="trophy"
                    label="7 Win Drafts"
                    data={this.state.decks.reduce(
                      (accum, currentVal) =>
                        currentVal.wins > 6 ? accum + 1 : accum,
                      0
                    )}
                  />
                  <DataBox
                    iconName="calculator"
                    label="Average Wins"
                    data={(totalWins / this.state.decks.length).toPrecision(3)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="profile-details-container">
          <div className="sidebar-container">
            <div className="favorite-cards-box">
              <div className="favorite-title">
                <h3>Most Drafted Cards</h3>
              </div>
              {this.state.cards.slice(0, 3).map((card) => {
                return (
                  <div className="favorite-row">
                    <img src={card.crop} alt="card icon" />
                    <div className="favorite-info">
                      <div className="top-row">
                        <h4>
                          <Link to={`/card/${card.cardName}`}>
                            {card.cardName}
                          </Link>
                        </h4>
                        <span>{card.timesDrafted}x</span>
                      </div>
                      <div className="card-data">
                        <span>
                          <span className="win-loss-text">WL</span>
                          {"  "}
                          {card.winsWithCard} - {card.lossesWithCard}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="colors-data-box">
              <div className="color-title">
                <h3>Win Rates by Color</h3>
              </div>
              {this.state.colors.map((color) => {
                return (
                  <div className="color-row">
                    <img
                      src={`/images/Mana_${color.color.toUpperCase()}.png`}
                      alt="color-pip"
                    />
                    <div className="color-info">
                      <div className="color-data">
                        <span className="win-loss-text">WL</span>
                        {color.wins} - {color.losses}
                      </div>
                      <div className="color-win-pct">
                        <span className="win-rate-text">WR </span>
                        {(
                          (color.wins / (color.wins + color.losses)) *
                          100
                        ).toPrecision(3)}
                        %
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="deck-container">
            <h2>DECK BOX</h2>
            <div className="deck-box">
              {this.state.decks
                ? this.state.decks.slice(0, 3).map((item) => {
                    return (
                      <Deck
                        key={item.deckName}
                        item={item}
                        cards={this.state.cards}
                      />
                    );
                  })
                : null}
            </div>
            <button>View All Decks</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
