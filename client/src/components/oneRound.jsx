import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Header from "./header";
import { getMemeAndCaptions, verifyCaption, sendGameInfo } from "../Api";
import Timer from "./timer";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Result from "./result";
import "../App.css";
import { Link } from "react-router-dom";

function oneRound(props) {
  const navigate = useNavigate();
  const [images, setImages] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [selectedCaptionText, setSelectedCaptionText] = useState("");
  const [selectedCaptionId, setSelectedCaptionId] = useState();
  const [isCorrect, setIsCorrect] = useState();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const [caption, setCaption] = useState();
  const [step, setStep] = useState();
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [stepResponse, setStepResponse] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [gameResults, setGameResults] = useState([]);

  useEffect(() => {
    const fetchImagesAndCaptions = async () => {
      try {
        const data = await getMemeAndCaptions();
        if (data && data.images && data.captions) {
          setAllImages([data.images]);
          setTimer(30);
          setImages(data.images);
          setCaptions(data.captions);

          setStep(1);
          //console.log("in namayesh mide?", data);
        }
      } catch (error) {
        console.error("Error fetching images and captions:", error);
      }
    };
    if (!step) fetchImagesAndCaptions();
  }, []);

  const handleCaption = async (caption) => {
    if (timer !== 0) {
      setCaption(caption);
      setSelectedCaptionText(caption.text);
      setSelectedCaptionId(caption.captionId);
      // console.log("image:", images);
    }
  };

  const handleSubmit = async () => {
    if (isTimerActive) {
      setIsTimerActive(false);

      try {
        const result = await verifyCaption(
          caption ? caption.captionId : null,
          caption ? caption.text : null,
          images.id
        );
        //console.log("result:", result);

        setIsCorrect(result.isCorrectAnswer);
        let mycorrectcaptiontext = [];

        captions.map((item) => {
          if (result.correctCaptionIds.includes(item.captionId)) {
            mycorrectcaptiontext.push(item.text);
          }
        });
        if (timer === 0) {
          setResult(<span style={{ color: "red" }}>Time's up, score: 0 </span>);
        } else if (result.isCorrectAnswer) {
          console.log("correctcaps:", mycorrectcaptiontext);
          setGameResults((prevResults) => [
            ...prevResults,
            { imagePath: images.path, correctCaptions: mycorrectcaptiontext },
          ]);
          setScore((prevScore) => prevScore + 5);
          setResult(
            <>
              <span style={{ color: "green" }}>
                {` round over`} <br /> {` 5 score for this round`}
              </span>
            </>
          );
        } else {
          setResult(
            <>
              <span style={{ color: "red" }}>{` you chose wrong answer`}</span>
              <br />
              {"0 score for this round"} <br />
              {
                <>
                  <span style={{ color: "green" }}>
                    {`the correct answers : `}
                    <br />
                    {`1:${mycorrectcaptiontext[0]}`}
                    <br />
                    {`2:${mycorrectcaptiontext[1]}`}
                  </span>
                </>
              }
            </>
          );
        }

        return result;
      } catch (error) {
        console.error("Error processing caption:", error);
      }
    }
  };

  const handleTimeChange = (newTime) => {
    setTimer(newTime);
  };

  useEffect(() => {
    if (timer === 0) {
      handleSubmit();
      setScore(score + 0);
    }
  }, [timer]);

  return (
    <>
      <div>
        <span className="score-display" style={{ float: "left" }}>
          <Timer
            initialTime={timer}
            onTimeChange={handleTimeChange}
            isActive={isTimerActive}
          />
          Step : {step} Total Score:{score}
        </span>
        <span
          className="d-flex justify-content-center"
          style={{ margin: " 20px" }}
        >
          <h5>
            {step == 1
              ? " Choose the most relevant caption for the picture and make it meme"
              : ""}
          </h5>
        </span>
      </div>
      <div className="d-flex justify-content-center" style={{ margin: 50 }}>
        <Row className="row-flex">
          <Col>
            {images && images.path && (
              <img
                src={images.path}
                alt={`Meme ${images.path}`}
                style={{ width: "400px", height: "400px" }}
              />
            )}
          </Col>
          <Col>
            {captions.map((caption, index) => (
              <div key={index}>
                <Button
                  className={
                    selectedCaptionId == caption.captionId
                      ? ""
                      : "btn btn-light"
                  }
                  style={{ width: "400px", height: 400 / 7 }}
                  onClick={() => handleCaption(caption)}
                  disabled={isCorrect != null}
                  color={
                    selectedCaptionId == caption.captionId ? "primary" : ""
                  }
                >
                  {caption.text}
                </Button>
              </div>
            ))}
          </Col>
        </Row>
      </div>
      <div className="d-flex justify-content-center" style={{ margin: "20px" }}>
        <Button
          className="btn btn-primary"
          onClick={() => {
            handleSubmit();
          }}
          disabled={timer === 0}
        >
          submit
        </Button>
      </div>
      <div className="d-flex justify-content-center">
        {result && (
          <div>
            {result}
            <div style={{ color: "red" }}></div>{" "}
            <div style={{ margin: 15 }}>
              <Link
                to={"/logIn"}
                className=" d-flex justify-content-center linkStylejustify-content-center linkStyle"
              >
                {" "}
                For playing more, click here
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default oneRound;
