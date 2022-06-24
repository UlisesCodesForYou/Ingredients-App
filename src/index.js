import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import AuthContextProvider from "./context/auth-context";

ReactDOM.render(
  <AuthContextProvider>
    <App />,
  </AuthContextProvider>,
  document.getElementById("root")
);

// I need to update to REACT 18.  I need to look that up.
