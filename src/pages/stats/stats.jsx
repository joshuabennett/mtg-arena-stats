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
      set: this.props.set,
    };
    this.filterCards = this.filterCards.bind(this);
  }

  componentDidMount() {
    this.updateCards(this.state.set);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.set !== this.props.set) {
      this.setState({ set: this.props.set });
      this.updateCards(this.props.set);
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
          });
        });
        this.setState({ cards: newState, filteredCards: newState });
      });
    }
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
    // Sorts the array based on asc or desc and the current selection. Only works for numbers.
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

    // Same as before but works for ALPHA.
    const sortAlphaTable = (e) => {
      const selection = e.target.className;
      this.setState({ activeCol: selection });
      this.setState((prevState) => {
        if (prevState.desc) {
          return {
            filteredCards: prevState.filteredCards.sort((a, b) => {
              var string1 = b[selection];
              var string2 = a[selection];
              return string2.localeCompare(string1);
            }),
            desc: false,
          };
        } else {
          return {
            filteredCards: prevState.filteredCards.sort((a, b) => {
              var string1 = b[selection];
              var string2 = a[selection];
              return string2.localeCompare(string1) * -1;
            }),
            desc: true,
          };
        }
      });
      this.forceUpdate();
    };

    return (
      <div className="stats-page">
        <div className="table">
          <h2 classame="table-header">CARD STATS</h2>
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
              { name: "colors", title: "Color", handler: null },
              { name: "rarity", title: "Rarity", handler: sortAlphaTable },
              { name: "cardName", title: "Card Name", handler: sortAlphaTable },
              { name: "timesDrafted", title: "# Drafted", handler: sortTable },
              { name: "winsWithCard", title: "# Wins", handler: sortTable },
              { name: "lossesWithCard", title: "# Losses", handler: sortTable },
              { name: "winPct", title: "Win %", handler: sortTable },
            ].map((item) => {
              return (
                <TableHeader
                  activeCol={this.state.activeCol}
                  desc={this.state.desc}
                  onClickHandler={item.handler}
                  name={item.name}
                >
                  {item.title}
                </TableHeader>
              );
            })}
          </div>
          {this.state.filteredCards
            .filter((card) => !card.type_line.includes("Basic Land"))
            .map((card) => {
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
