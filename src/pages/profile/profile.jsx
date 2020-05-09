// Username (current set default)
// Current Rank??
// Total Drafts Played
// Total Win Rate
// Archetype win rates
// Top 3 commons drafted
// Top 3 uncommons drafted
// Top 3 rares drafted

// List of decks (recent or not?) with win rates

import React from "react";
import "./profile.scss";
import firebase from "../../firebase/firebase";
import Deck from "../../components/deck/deck";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decks: []
    };
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref("decks");
    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          deckName: items[item].deckName,
          colors: items[item].colors,
          archetype: items[item].archetype,
          wins: items[item].wins,
          losses: items[item].losses,
          cards: items[item].cards
        });
      }
      this.setState({
        decks: newState
      });
    });
  }

  render() {
    return (
      <div className="profile-page">
        <div className="deck-container">
          <div className="deck-items">
            {this.state.decks.length > 0
              ? this.state.decks.map(item => {
                  return <Deck key={item.id} item={item} />;
                })
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
