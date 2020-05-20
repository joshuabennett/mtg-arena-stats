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
import { firestore } from "../../firebase/firebase";
import Deck from "../../components/deck/deck";
import { Link } from "react-router-dom";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decks: [],
    };
  }
  componentDidMount() {
    const itemsRef = firestore.collection("decks");
    itemsRef.get().then((snapshot) => {
      let newState = [];
      snapshot.forEach((snapshot) => {
        let item = snapshot.data();
        newState.push({
          deckName: item.deckName,
          colors: item.colors,
          archetype: item.archetype,
          wins: item.wins,
          losses: item.losses,
          cardstext: item.cardstext,
        });
      });
      this.setState({
        decks: newState,
      });
    });
  }

  render() {
    return (
      <div className="profile-page">
        <div className="deck-container">
          {this.state.decks.length > 0
            ? this.state.decks.map((item) => {
                return (
                  <Link
                    to={{
                      pathname: `/profile/${item.id}`,
                      state: {
                        deck: item,
                      },
                    }}
                  >
                    <Deck key={item.id} item={item} />
                  </Link>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}

export default Profile;
