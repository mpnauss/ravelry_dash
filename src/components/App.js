import React from "react"
import { BrowserRouter, Route } from "react-router-dom"

import NewStashList from "./NewStashList"
import AuthResponse from "./AuthResponse";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={AuthResponse} />
        <Route exact path="/oauth" component={NewStashList} />
      </BrowserRouter>
    </div>
  );
}

export default App;
