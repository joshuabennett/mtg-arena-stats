import React from "react";
import "./search-bar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
    };
  }

  handleChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.searchHandler(this.state.searchText);
    this.setState({ searchText: "" });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleSubmit(e);
    }
  };

  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Username"
          value={this.state.searchText}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
        />
        <button className="search-button" onClick={this.handleSubmit}>
          <span className="search-icon">
            <FontAwesomeIcon icon="search" style={{ color: "lightgray" }} />
          </span>
        </button>
      </div>
    );
  }
}

export default SearchBar;
