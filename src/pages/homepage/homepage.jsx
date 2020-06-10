// Overall Stats (current set only)
// Top 10 commons, top 10 uncommon, top 5 rares
// Archetype winrates
// Top Players??
// Recent 7-0 decks?

import React from "react";
import "./homepage.scss";

import { firestore } from "../../firebase/firebase";
import StatsBox from "../../components/stats-box/stats-box";
import { DEFAULT_SET } from "../../App";

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      commonCards: [],
      uncommonCards: [],
      decks: [],
      set: window.sessionStorage.getItem("currentSet")
        ? window.sessionStorage.getItem("currentSet")
        : DEFAULT_SET,
    };
  }

  componentDidMount() {
    const setRef = firestore.collection("mergedData").doc(this.state.set);
    setRef
      .collection("allDecks")
      .orderBy("date")
      .limit(5)
      .get()
      .then((snapshot) => {
        var topDecks = [];
        snapshot.forEach((doc) => {
          doc = doc.data();
          topDecks.push({
            image: null,
            middleTopData: doc.deckName,
            middleBottomData: `Drafted by ${doc.owner}`,
            rightData: doc.date.toDate().toDateString(),
          });
        });
        this.setState({ decks: topDecks });
      });
    setRef
      .collection("allCards")
      .where("rarity", "==", "common")
      .orderBy("timesDrafted", "desc")
      .limit(5)
      .get()
      .then((snapshot) => {
        var topCommons = [];
        snapshot.forEach((doc) => {
          doc = doc.data();
          topCommons.push({
            image: doc.image,
            rightData: `${doc.timesDrafted}x`,
            middleTopData: doc.cardName,
            middleBottomData: `WL ${doc.winsWithCard} - ${doc.lossesWithCard}`,
          });
        });
        this.setState({ commonCards: topCommons });
      });
    setRef
      .collection("allCards")
      .where("rarity", "==", "uncommon")
      .orderBy("timesDrafted", "desc")
      .limit(5)
      .get()
      .then((snapshot) => {
        var topUncommons = [];
        snapshot.forEach((doc) => {
          doc = doc.data();
          topUncommons.push({
            image: doc.image,
            rightData: `${doc.timesDrafted}x`,
            middleTopData: doc.cardName,
            middleBottomData: `WL ${doc.winsWithCard} - ${doc.lossesWithCard}`,
          });
        });
        this.setState({ uncommonCards: topUncommons });
      });
    setRef
      .collection("allUsers")
      .where("numDrafts", ">=", 1)
      .orderBy("numDrafts")
      .orderBy("winRate")
      .limit(3)
      .get()
      .then((snapshot) => {
        var topPlayers = [];
        snapshot.forEach((doc) => {
          doc = doc.data();
          console.log(doc);
          topPlayers.push({
            middleTopData: doc.displayName,
            image: null,
            rightData: `AVG Wins ${doc.wins / doc.numDrafts}`,
            middleBottomData: `WL ${doc.wins} - ${doc.losses}`,
          });
        });
        this.setState({ players: topPlayers });
      });
  }

  componentDidUpdate() {}

  render() {
    return (
      <div className="homepage">
        <h1>
          MTG<span>ARENA</span> LIMITED STATS
        </h1>
        <div className="news-section">
          <div className="banner">
            <img
              src="https://media.wizards.com/2020/images/magic/m21/arena_ad/NSLx4ngxLj_en.jpg"
              alt="banner"
            />
          </div>
        </div>
        <div className="stats-section">
          <div className="top-players">
            <StatsBox
              title="Top Players"
              amount={5}
              data={this.state.players}
            />
          </div>
          <div className="top-cards">
            <StatsBox
              title="Top 5 Commons"
              amount={5}
              data={this.state.commonCards}
            />
          </div>
          <div className="top-cards">
            <StatsBox
              title="Top 5 Uncommons"
              amount={5}
              data={this.state.uncommonCards}
            />
          </div>
          <div className="top-decks">
            <StatsBox
              title="Recent 7-0 Decks"
              amount={5}
              data={this.state.decks}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
