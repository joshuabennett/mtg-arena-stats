import React from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";

import Header from "./components/header/header";
import Homepage from "./pages/homepage/homepage";
import Import from "./pages/import/import";
import Stats from "./pages/stats/stats";
import Profile from "./pages/profile/profile";
import Login from "./pages/login/login";
import CardDetails from "./components/card-details/card-details";
import { auth, createUserProfileDocument } from "./firebase/firebase";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faSearch,
  faHands,
  faTrophy,
  faSkull,
  faCalculator,
  faUser,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSortUp,
  faSortDown,
  faSearch,
  faHands,
  faTrophy,
  faSkull,
  faCalculator,
  faUser,
  faChevronUp,
  faChevronDown
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      id: null,
      currentSet: "IKO",
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        window.sessionStorage.setItem("currentUser", userAuth.uid);
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapshot) => {
          this.setState({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });
      }
      this.setState({ currentUser: userAuth });
      window.sessionStorage.setItem("currentSet", "IKO");
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  setChangeHandler = (e) => {
    const newSet = e.target.value;
    this.setState({ currentSet: newSet });
    window.sessionStorage.setItem("currentSet", newSet);
  };

  render() {
    return (
      <div className="App">
        <Header
          user={this.state.currentUser}
          setChangeHandler={this.setChangeHandler}
        />
        <Route component={Homepage} path="/" exact />
        <Route
          path="/import"
          exact
          render={() => (
            <Import user={this.state.currentUser} set={this.state.currentSet} />
          )}
        />
        <Route
          path="/stats"
          exact
          render={() => (
            <Stats user={this.state.currentUser} set={this.state.currentSet} />
          )}
        />
        <Route
          path="/profile"
          exact
          render={() => (
            <Profile
              user={this.state.currentUser}
              set={this.state.currentSet}
            />
          )}
        />
        <Route path={`/profile/:name`} component={Profile} exact />
        <Route
          render={() =>
            this.state.currentUser ? <Redirect to="/" /> : <Login />
          }
          path="/login"
          exact
        />
        <Route path={`/card/:cardName`} component={CardDetails} exact />
      </div>
    );
  }
}

export default App;
