// card stats (current set default)
// -- number drafted
// -- win percentage in deck
// -- number of each archetype in
// -- win percntage in each archetype

// archetype stats
// -- number of times drafted
// -- win percentage

// Objects
// -- Deck
// ---- Set
// ---- Wins
// ---- Losses
// ---- Colors
// ---- Archetype
// ---- Cards

// -- Card
// ---- Total Amount
// ---- Wins
// ---- Losses
// ---- Archetypes
// ------ Amount
// ------ Wins
// ------ Losses

import React from "react";
import "./stats.scss";
import { firestore } from "../../firebase/firebase";

import MagicCard from "../../components/magic-card/magic-card";
import TableHeader from "../../components/table-header/table-header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      filteredCards: [],
      searchText: "",
      desc: false,
      activeCol: "",
    };
    this.filterCards = this.filterCards.bind(this);
  }

  componentDidMount() {
    const cardsRef = firestore.collection("cards");
    cardsRef.get().then((snapshot) => {
      var newState = [];
      snapshot.forEach((snapshot) => {
        let card = snapshot.data();
        newState.push({
          cardName: card.cardName,
          timesDrafted: card.timesDrafted,
          winsWithCard: card.winsWithCard,
          lossesWithCard: card.lossesWithCard,
        });
      });
      this.setState({ cards: newState, filteredCards: newState });
    });
  }

  filterCards(e) {
    const text = e.target.value;
    this.setState({ searchText: text });
    this.setState({
      filteredCards: this.state.cards.filter((card) => {
        return card.cardName.indexOf(text) !== -1;
      }),
    });
  }

  render() {
    const sortTable = (e) => {
      const selection = e.target.className;
      this.setState({ activeCol: selection });
      this.setState((prevState) => {
        if (prevState.desc) {
          return {
            filteredCards: prevState.filteredCards.sort(
              (a, b) => b[selection] - a[selection]
            ),
            desc: false,
          };
        } else {
          return {
            filteredCards: prevState.filteredCards.sort(
              (a, b) => a[selection] - b[selection]
            ),
            desc: true,
          };
        }
      });
      this.forceUpdate();
    };

    return (
      <div className="stats-page">
        <div className="table">
          <h2 classame="table-header">Card Stats</h2>
          <input
            type="text"
            placeholder="Search Card"
            value={this.state.searchText}
            onChange={this.filterCards}
          />
          <span className="search-icon">
            <FontAwesomeIcon icon="search" style={{ color: "lightgray" }} />
          </span>
          <div className="table-header">
            {[
              { name: "cardName", title: "Card Name" },
              { name: "timesDrafted", title: "# Drafted" },
              { name: "winsWithCard", title: "# Wins" },
              { name: "lossesWithCard", title: "# Losses" },
              { name: "winPct", title: "Win %" },
            ].map((item) => {
              return (
                <TableHeader
                  activeCol={this.state.activeCol}
                  desc={this.state.desc}
                  onClickHandler={sortTable}
                  name={item.name}
                >
                  {item.title}
                </TableHeader>
              );
            })}
            }
          </div>
          {this.state.filteredCards.map((card) => {
            return (
              <div key={card.cardName} className="table-row">
                <MagicCard card={card} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Stats;
