import React from "react";
import "./homepage.scss";

import { firestore } from "../../firebase/firebase";
import StatsBox from "../../components/stats-box/stats-box";
import SearchBar from "../../components/search-bar/search-bar";
import { DEFAULT_SET } from "../../App";
import { withRouter } from "react-router-dom";

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      commonCards: [],
      uncommonCards: [],
      decks: [],
      set: DEFAULT_SET,
      colorData: [],
      factionData: [],
    };
  }

  componentDidMount() {
    // Query for 5 most recent 7-0 decks.
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

    // Query for 5 most drafted Commons
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

    // Query for 5 most drafted uncommons
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

    // Query for top 3 users with more than 3 or more drafts ordered by Win Rate.
    setRef
      .collection("allUsers")
      .where("numDrafts", ">=", 3)
      .orderBy("numDrafts")
      .orderBy("winRate")
      .limit(3)
      .get()
      .then((snapshot) => {
        var topPlayers = [];
        snapshot.forEach((doc) => {
          doc = doc.data();
          topPlayers.push({
            middleTopData: doc.displayName,
            image: null,
            rightData: `AVG Wins ${(doc.wins / doc.numDrafts).toPrecision(3)}`,
            middleBottomData: `WL ${doc.wins} - ${doc.losses}`,
          });
        });
        this.setState({ players: topPlayers });
      });

    // Query for all colors and factions data
    setRef
      .collection("allColors")
      .get()
      .then((snapshot) => {
        console.log(snapshot);
        var colorData = [];
        var factionData = [];
        snapshot.forEach((doc) => {
          doc = doc.data();
          console.log(doc);
          if (doc.mono === true) {
            colorData.push({
              middleTopData: null,
              image: `images/Mana_${doc.string.toUpperCase()}.png`,
              rightData: `WR ${(
                (doc.wins / (doc.wins + doc.losses)) *
                100
              ).toPrecision(3)}`,
              middleBottomData: `WL ${doc.wins} - ${doc.losses}`,
            });
          } else {
            factionData.push({
              middleTopData: doc.string,
              image: null,
              rightData: `WR ${(
                (doc.wins / (doc.wins + doc.losses)) *
                100
              ).toPrecision(3)}`,
              middleBottomData: `WL ${doc.wins} - ${doc.losses}`,
            });
          }
        });
        console.log(colorData);
        this.setState({ factionData: factionData, colorData: colorData });
      });
  }

  componentDidUpdate(prevProps) {
    // re-render component if set changes
    if (prevProps.set !== this.props.set) {
      this.setState({ set: this.props.set }, () => {
        this.componentDidMount();
      });
    }
  }

  searchHandler = (searchText) => {
    this.props.history.push(`/profile/${searchText}`);
  };

  render() {
    return (
      <div className="homepage">
        <h1>
          MTG<span>ARENA</span> LIMITED STATS
        </h1>
        <SearchBar searchHandler={this.searchHandler} />
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
              isPlayer
              title="Top Players"
              amount={3}
              data={this.state.players}
            />
            <StatsBox
              hasMana
              title="Color Winrates"
              amount={5}
              data={this.state.colorData}
            />
          </div>
          <div className="top-cards">
            <StatsBox
              isCard
              title="Most Drafted Commons"
              amount={5}
              data={this.state.commonCards}
            />
          </div>
          <div className="top-cards">
            <StatsBox
              isCard
              title="Most Drafted Uncommons"
              amount={5}
              data={this.state.uncommonCards}
            />
          </div>
          <div className="top-decks">
            <StatsBox
              isDeck
              title="Recent 7-0 Decks"
              amount={3}
              data={this.state.decks}
            />
            <StatsBox
              title="Faction Winrates"
              amount={10}
              data={this.state.factionData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Homepage);
