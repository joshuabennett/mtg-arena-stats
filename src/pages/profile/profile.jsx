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
      set: this.props.set,
    };
  }
  componentDidMount() {
    this.updateDecks(this.state.set);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.set !== this.props.set) {
      this.setState({ set: this.props.set });
      this.updateDecks(this.props.set);
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
        });
        this.setState({
          decks: newState,
        });
      });
    }
  }

  render() {
    return (
      <div className="profile-page">
        <div className="deck-container">
          <h2>DECK BOX</h2>
          <div className="deck-box">
            {this.state.decks
              ? this.state.decks.map((item) => {
                  return (
                    <Link
                      to={{
                        pathname: `/profile/${item.deckName}`,
                        state: {
                          deck: item,
                        },
                      }}
                    >
                      <Deck key={item.deckName} item={item} />
                    </Link>
                  );
                })
              : null}
          </div>
          <button>View All Decks</button>
        </div>
      </div>
    );
  }
}

export default Profile;
