import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Header from "./header";
import { getMemeAndCaptions, verifyCaption, sendGameInfo } from "../Api";
import Timer from "./timer";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import "../App.css";

function StartGame(props) {
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
  const [submitClicked, setSubmitClicked] = useState(false);
  //getnewImage
  const getnewImage = () => {
    const fetchImagesAndCaptions = async () => {
      try {
        const data = await getMemeAndCaptions(allImages.map((item) => item.id));
        if (data && data.images && data.captions) {
          setAllImages([...allImages, data.images]);

          setImages(data.images);
          setCaptions(data.captions);
          setResult(" ");
          //console.log("in namayesh mide?", data);
          setIsCorrect(null);
          setTimer(30);
          setIsTimerActive(true);
          setSubmitClicked(false);
          if (step < 3) {
            setStep(step + 1);
          } else {
            navigate("result");
          }
        }
      } catch (error) {
        console.error("Error fetching images and captions:", error);
      }
    };

    fetchImagesAndCaptions();
  };
  //get random image and captions from server
  useEffect(() => {
    const fetchImagesAndCaptions = async () => {
      try {
        const data = await getMemeAndCaptions();
        if (data && data.images && data.captions) {
          setAllImages([data.images]);

          setImages(data.images);
          setCaptions(data.captions);

          setStep(1);
          console.log("in namayesh mide?", data);
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
      //console.log("image:", images);
    }
  };

  const handleSubmit = async () => {
    if (isTimerActive) {
      setIsTimerActive(false); //stop timer after pushing submit
      setSubmitClicked(true);
      checkSubmitOrTimeUp();
      try {
        const result = await verifyCaption(
          //sending to server for checking the correctness
          caption ? caption.captionId : null,
          caption ? caption.text : null,
          images.id
        );
        // console.log("result:", result);

        setIsCorrect(result.isCorrectAnswer); //find correct captions in each rounds for a meme
        let mycorrectcaptiontext = [];

        captions.map((item) => {
          if (result.correctCaptionIds.includes(item.captionId)) {
            mycorrectcaptiontext.push(item.text);
          }
        });
        if (timer === 0) {
          setResult(<span style={{ color: "red" }}>Time's up, score: 0 </span>);
        } else if (result.isCorrectAnswer) {
          //console.log("correctcaps:", mycorrectcaptiontext);
          setGameResults((prevResults) => [
            ...prevResults,
            { imagePath: images.path, correctCaptions: caption.text },
          ]);
          setScore((prevScore) => prevScore + 5);
          setResult(
            <>
              <span style={{ color: "green" }}>
                {`${step}th round over`} <br /> {` 5 score for this round`}
              </span>
            </>
          );
        } else {
          setResult(
            <>
              <span style={{ color: "red" }}>{` you chose wrong answer`}</span>
              <br />
              {"0 score for this round"} <br />
              <br />{" "}
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
        setStepResponse((prevStepResponse) => [
          //adding each round's data in an array for sending to server at the end of the game
          ...prevStepResponse,
          {
            isCorrect: result.isCorrectAnswer,
            imageId: images.id,
          },
        ]);

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
      checkSubmitOrTimeUp();
      //setResult("");
      handleSubmit();
      setScore(score + 0);
    }
  }, [timer]);
  const checkSubmitOrTimeUp = () => {
    if (!isTimerActive || timer === 0) {
      setSubmitClicked(true);
    }
  };
  //sending 3 rounds' data to server after pushing finish
  const handleFinish = async () => {
    const now = new Date();
    try {
      const SendInfo = {
        stepResponse: stepResponse,
        score: score,
        date: dayjs(now).format("YYYY-MM-DD"),
      };
      //inja ye variable pass dadi be sendGameInfo
      const response = await sendGameInfo(SendInfo);
      //console.log("Data sent to server:", response);
      showFinish();
    } catch (error) {
      console.error("Error sending step response to server:", error);
    } finally {
      navigate("/result");
    }
  };

  //sending current game result to app.jsx for showing at the end of the game
  const showFinish = () => {
    props.onGameFinish({
      score: score,
      gameResults: gameResults,
    });
  };

  return (
    <>
      <div>
        <span className="score-display" style={{ float: "left" }}>
          <Timer
            initialTime={timer}
            onTimeChange={handleTimeChange}
            isActive={isTimerActive}
          />
          Step : {step} <br />
          Total Score:{score}
        </span>
        <span
          className="d-flex justify-content-center"
          style={{ margin: " 20px" }}
        >
          <h5>
            {" "}
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
          className="  btn btn-primary"
          onClick={() => {
            handleSubmit();
          }}
          disabled={timer === 0}
        >
          submit
        </Button>
        <Button
          onClick={step === 3 ? handleFinish : getnewImage}
          className=" btn btn-danger"
          disabled={!submitClicked}
        >
          {step === 3 ? "Finish" : "Next"}
        </Button>
      </div>
      <div className="d-flex justify-content-center" style={{ margin: 30 }}>
        <div>{result}</div>
        <div style={{ color: "red" }}></div>
      </div>
    </>
  );
}

export default StartGame;
