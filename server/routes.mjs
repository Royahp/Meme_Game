import express from "express";
import dao from "./dao.mjs";
import passport from "./passport.mjs";
import getImage from "./dao.mjs";
import InsertAnswers from "./dao.mjs";

const router = express.Router();

const isLoggin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: "Not authorized" });
};

router.delete("/sessions/current", (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

router.get("/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.post("/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: info });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json(req.user);
    });
  })(req, res, next);
});

router.get("/image&captions", async function (req, res, next) {
  const result = await dao.getImagesAndCaptions(req.query.preImageIds);
  return res.json(result);
});

router.post("/verify-caption", (req, res) => {
  // console.log(req.body)

  dao
    .checkAnswer(
      req.user ? req.user.id : null,
      req.body.captionId,
      req.body.text,
      req.body.imageId
    )
    .then((item) => res.json(item))
    .catch((err) => console.log(err));
});
router.post("/savingInfo", isLoggin, (req, res) => {
  // console.log(req.body)

  dao
    .InsertInfo(req.body.data, req.user)
    .then((item) => res.json(item))
    .catch((err) => console.log(err));
});
router.get("/history", isLoggin, async (req, res, next) => {
  // console.log(req.user);
  const result = await dao.sendHistory(req.user);
  return res.json(result);
});

export default router;
