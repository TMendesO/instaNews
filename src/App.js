import React from "react";
import Feed from "./components/Feed";
import "./App.scss";

const App = () => {
  return (
    <div className="app">
      <h1>InstaNews</h1>
      <Feed />
    </div>
  );
};

export default App;
