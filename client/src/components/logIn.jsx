import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { logInUser } from "../Api.js";
import "../App.css";
import { Link } from "react-router-dom";

function LogIn(props) {
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");

  const handleClick = (event) => {
    event.preventDefault();

    props.onHandleLogin({
      username: userEmail,
      password: userPass,
    });
  };

  return (
    <>
      <Form className="loginStyle">
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={userPass}
            onChange={(event) => setUserPass(event.target.value)}
          />
        </Form.Group>
      </Form>
      <div className="commentStyle " style={{ color: "red" }}>
        {props.loggedInMessage}
      </div>
      <div className="btnStyle">
        <Button
          onClick={(e) => handleClick(e)}
          style={{ backgroundColor: "#17a2b8", borderColor: "#17a2b8" }}
        >
          <i className="bi bi-box-arrow-in-right" />{" "}
        </Button>
      </div>

      {props.user && (
        <div className="d-flex justify-content-center">
          <Link to={"/startGame"} className="linkStyle">
            {" "}
            Start Game
          </Link>
          <Link to={"/profile"} className="linkStyle">
            Go to profile
          </Link>
        </div>
      )}
    </>
  );
}

export default LogIn;
