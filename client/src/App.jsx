import reactLogo from "./assets/react.svg";
//import viteLogo from '/vite.svg'
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import LogIn from "./components/logIn";
import LogOut from "./components/logIn";
import FirstPage from "./components/FirstPage";
import OneRound from "./components/oneRound";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import StartGame from "./components/StartGame";
import Result from "./components/result";
import Profile from "./components/profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceLaugh } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./components/header";
import { getCurrentUser, logInUser, logoutUser } from "./Api";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [gameRes, setGameRes] = useState();
  const [user, setUser] = useState();
  const [loggedInMessage, setLoggedInMessage] = useState();

  const handleGame = (gameResult) => {
    console.log("Game Result Received in App:", gameResult);
    setGameRes(gameResult);
  };
  const getUser = async () => {
    const userResponse = await getCurrentUser();
    setUser(userResponse.name);
  };
  useEffect(() => {
    getUser();
  }, []);
  const onHandleLogin = async (userData) => {
    const response = await logInUser(userData);
    if (response && response.error) {
      setLoggedInMessage(response.error);
    } else {
      setLoggedInMessage("");
      getUser();
    }
  };
  const onHandleLogout = () => {
    logoutUser().then(() => {
      setUser(null);
      navigate("/");
    });
  };

  return (
    <>
      <Header user={user} onHandleLogout={onHandleLogout} />
      <Routes>
        <Route path="/" element={<FirstPage user={user} />} />
        <Route path="/oneRound" element={<OneRound />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/logIn"
          element={
            <LogIn
              onHandleLogin={onHandleLogin}
              user={user}
              loggedInMessage={loggedInMessage}
            />
          }
        />
        <Route path="/logOut" element={<LogOut />} />
        <Route
          path="/startGame"
          element={<StartGame onGameFinish={handleGame} />}
        />
        <Route path="/result" element={<Result gameRes={gameRes} />} />
      </Routes>
    </>
  );
}

export default App;
