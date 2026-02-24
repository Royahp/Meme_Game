import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import Header from "./header";
import "../App.css";

import React from "react";

function FirstPage(props) {
  return (
    <>
      <div className="body">
        <h1>Welcome to Meme Game</h1>
      </div>
      {props.user ? (
        <div className="d-flex justify-content-center">
          <Link to={"/startGame"} className="linkStyle">
            Start Game
          </Link>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <Link to={"/oneRound"} className="linkStyle">
            Start Game without Log in
          </Link>
          <Link to={"/login"} className="linkStyle">
            Log in
          </Link>
        </div>
      )}
    </>
  );
}
export default FirstPage;
