import React, { useState, useEffect } from "react";
import { showHistory } from "../Api";
import { Table } from "react-bootstrap";
import "../App.css";
import "../index.css";
import { Link } from "react-router-dom";

function Profile() {
  const [historyData, setHistoryData] = useState([]);
  const [totalScore, setTotalScore] = useState();

  useEffect(() => {
    const fetchSendHistory = async () => {
      try {
        const history = await showHistory();
        console.log(history);
        setHistoryData(history.results);
        setTotalScore(history.score);
      } catch (error) {
        console.error("Error fetching history", error);
      }
    };
    fetchSendHistory();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {" "}
        <span className="score-display">Total Score: {totalScore}</span>
        <span>
          <Link to={"/startGame"} className="linkStyle">
            Start Game
          </Link>
        </span>
      </div>
      <Table
        className="table-responsive"
        style={{
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan="2"
              style={{
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              Date of Game
            </th>
            <th
              style={{
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              Round
            </th>
            <th
              style={{
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              Image
            </th>
            <th
              style={{
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              Your Answer
            </th>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((item, index) => (
            <tr key={index}>
              {index % 3 === 0 && (
                <td
                  colSpan="2"
                  rowSpan="3"
                  style={{
                    borderRight: "1px solid #ccc",
                    borderBottom: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  {item.createdAt}
                </td>
              )}
              <td
                style={{
                  borderRight: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                  textAlign: "center",
                }}
              >
                {item.roundNo}
              </td>
              <td
                style={{
                  borderRight: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                  textAlign: "center",
                }}
              >
                <img
                  src={item.imagePath}
                  alt="Game"
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "1px solid #ccc",
                  }}
                />
              </td>
              <td
                style={{
                  borderRight: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                  textAlign: "center",
                }}
              >
                {item.isCorrect ? "Correct(score:5)" : "Incorrect(score:0)"}
              </td>
              {index % 3 === 0 && (
                <td
                  rowSpan="3"
                  style={{
                    borderBottom: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  {item.gameScore}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Profile;
