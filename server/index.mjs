"use strict"

import express from 'express';
import cors from 'cors'

// init express
const app = new express();
const port = 3001;


app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

import session from 'express-session'
import passport from './passport.mjs'

app.use(session({
  secret: '0756226fdb18ab1860e2d13209011e11d70d6213b747138c495dc068362a5d80',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.authenticate('session'))

import routes from './routes.mjs'
app.use('/api', routes)
// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});