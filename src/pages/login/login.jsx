import React from "react";
import "./login.scss";

import SignIn from "../../components/signin/signin";
import SignUp from "../../components/signup/signup";

const Login = () => (
  <div className="login-page">
    <SignIn />
    <SignUp />
  </div>
);

export default Login;
