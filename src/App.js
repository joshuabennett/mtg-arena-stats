import React from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";

import Header from "./components/header/header";
import Homepage from "./pages/homepage/homepage";
import Import from "./pages/import/import";
import Stats from "./pages/stats/stats";
import Profile from "./pages/profile/profile";
import Login from "./pages/login/login";
import DeckList from "./components/deck-list/deck-list";
import { auth, createUserProfileDocument } from "./firebase/firebase";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

library.add(faSortUp, faSortDown, faSearch);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      id: null,
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        console.log("auth");
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapshot) => {
          this.setState({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });
      }
      this.setState({ currentUser: userAuth });
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className="App">
        <Header user={this.state.currentUser} />
        <Route component={Homepage} path="/" exact />
        <Route component={Import} path="/import" exact />
        <Route component={Stats} path="/stats" exact />
        <Route path="/profile" exact component={Profile} />
        <Route path={`/profile/:deckId`} component={DeckList} exact />
        <Route
          render={() =>
            this.state.currentUser ? <Redirect to="/" /> : <Login />
          }
          path="/login"
          exact
        />
      </div>
    );
  }
}

export default App;
