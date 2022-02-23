import React from "react"
import { BrowserRouter, Route } from "react-router-dom"

import StashList from "./StashList"
import AuthResponse from "./AuthResponse";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={AuthResponse} />
        <Route exact path="/oauth" component={StashList} />
      </BrowserRouter>
    </div>
  );
}

export default App;
