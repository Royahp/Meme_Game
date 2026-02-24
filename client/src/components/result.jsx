import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../App.css";
import { Link } from "react-router-dom";

function Result({ gameRes }) {
  if (!gameRes || !gameRes.gameResults) {
    return (
      <div className="alert alert-warning">Game data not available...</div>
    );
  }

  return (
    <>
      <div className="game-summary"> Summary of your Game</div>
      <div className="container mt-4">
        <div className="row">
          {gameRes.gameResults.map((result, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card">
                <img
                  src={result.imagePath}
                  alt={`Correct Meme ${index}`}
                  className="card-img-top"
                  style={{ height: "400px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">Selected Caption</h5>
                  <ul className="list-group list-group-flush">
                    {result.correctCaptions}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ResultScore">
          <h5>Game Score: {gameRes.score}</h5>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <Link to={"/startGame"} className="linkStyle">
          {" "}
          Re-start a new Game
        </Link>
      </div>
    </>
  );
}

export default Result;
