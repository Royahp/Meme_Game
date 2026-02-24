import crypto from "crypto";
import db from "./db.mjs";
import { log } from "console";
import dayjs from "dayjs";

const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      return reject(new Error("Email and password are required"));
    }
    const sql = "SELECT * FROM users WHERE email=?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, username: row.email, name: row.name };
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.hash, "hex"),
              hashedPassword
            )
          ) {
            resolve(false);
          } else {
            resolve(user);
          }
        });
      }
    });
  });
};

const getImagesAndCaptions = (preImageIds) => {
  return new Promise((resolve, reject) => {
    const toArray =
      preImageIds != "undefined" ? preImageIds.split(",").map(Number) : [];
    const placeholder = toArray.map(() => "?").join(",");
    const sqlImages = `SELECT * FROM memes where id not in (${placeholder}) ORDER BY RANDOM() LIMIT 1`;
    //console.log(toArray);
    db.get(sqlImages, toArray, (err, image) => {
      if (err) {
        reject(err);
      } else {
        let best_captions = JSON.parse(image.captionId)
          .map(() => "?")
          .join(",");
        const sqlCaptions = `SELECT * FROM captions WHERE captionId NOT IN (${best_captions}) ORDER BY RANDOM() LIMIT 5`;
        db.all(
          sqlCaptions,
          JSON.parse(image.captionId),
          (err, randomCaptions) => {
            if (err) {
              reject(err);
            } else {
              const correctCaptionSql = `SELECT * FROM captions WHERE captionId IN (${best_captions}) ORDER BY RANDOM() LIMIT 2`;
              db.all(
                correctCaptionSql,
                JSON.parse(image.captionId),
                (err, correctCaptions) => {
                  if (err) {
                    reject(err);
                  } else {
                    const captions = [
                      ...correctCaptions,
                      ...randomCaptions,
                    ].sort(() => Math.random() - 0.5);

                    resolve({
                      images: { id: image.id, path: image.image },
                      captions: captions,
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  });
};

const checkAnswer = (user_id = null, answerId, answerText, imageId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * from memes where id = ?";
    db.get(sql, [imageId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        const isCorrectAnswer = JSON.parse(row.captionId).includes(answerId);
        resolve({
          userId: user_id ? user_id : "anonymous",
          answerId: answerId,
          answerText: answerText,
          isCorrectAnswer: isCorrectAnswer,
          correctCaptionIds: JSON.parse(row.captionId),
        });
      }
    });
  });
};

const InsertInfo = (data, user) => {
  return new Promise((resolve, reject) => {
    if (!data || !user) {
      return reject(new Error("Data and user are required"));
    }
    const now = dayjs().format("YYYY-MM-DD");
    const sql =
      "INSERT INTO game (rounds,score,userId,created_at) VALUES (?,?,?,?)";
    db.run(
      sql,
      [JSON.stringify(data.stepResponse), data.score, user.id, now],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

const sendHistory = (user) => {
  return new Promise((resolve, reject) => {
    if (!user || !user.id) {
      return reject(new Error("User and user ID are required"));
    }
    const sql = "SELECT * FROM game WHERE userId=?";
    db.all(sql, [user.id], (err, rows) => {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        // console.log(
        //   "***************rows",
        //   rows
        // );
        const promises = [];
        let overallScore = 0;
        // console.log(`Data retrieved for userId=${user.id}:`, rows);

        rows.forEach((item) => {
          overallScore += item.score;

          const rounds = JSON.parse(item.rounds);

          rounds.forEach((round, index) => {
            const roundNo = index + 1;
            const isCorrect = round.isCorrect;
            const imageId = round.imageId;
            const imageSql = "SELECT * FROM memes WHERE id=?";

            const promise = new Promise((resolve, reject) => {
              db.get(imageSql, [imageId], (err, image) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({
                    roundNo: roundNo,
                    isCorrect: isCorrect,
                    imagePath: image.image,
                    gameScore: item.score,
                    createdAt: item.created_at,
                  });
                }
              });
            });

            promises.push(promise);
          });
        });

        Promise.all(promises)
          .then((results) => {
            // console.log("Complete results of game rounds:", {
            //   results: results,
            //   score: overallScore,
            // });
            resolve({ results: results, score: overallScore });
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }
    });
  });
};
sendHistory({ id: 1 });

export default {
  loginUser,
  getImagesAndCaptions,
  checkAnswer,
  InsertInfo,
  sendHistory,
};
