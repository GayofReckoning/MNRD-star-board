const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
//add rejectUnauthenticated after url on the next line once auth
router.get('/', (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
  //uncomment the above, and remove below once auth is added
  // const queryText = `SELECT * FROM "user" WHERE "id" = 1;`;
  // pool.query(queryText)
  // .then((result) => (
  //   res.send(result.rows[0])
  // ))
  // .catch((error) => (
  //   res.sendStatus(500),
  //   console.log("error on user get: ", error)
  // ))
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {  
  const name = req.body.name;
  const password = encryptLib.encryptPassword(req.body.password);
  const pronouns = req.body.pronouns;
  const team_id = req.body.team_id;

  const queryText = `INSERT INTO "user" ("name", "password", "pronouns", "team_id", "level") 
  VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
  pool.query(queryText, [name, password, pronouns, team_id, 1])
    .then(() => res.sendStatus(201))
    .catch((error) => (res.sendStatus(500), console.log(error)));
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

//check if an email exists within the db
router.post('/email', (req, res) => {
  const queryText = `SELECT exists (SELECT 1 FROM "user" WHERE email = $1 LIMIT 1);`
  pool.query(queryText, [req.body.email])
    .then((result) => (
      res.send(result.rows) 
    ))
    .catch((error) => (
      res.sendStatus(500),
      console.log(error)
    ))
})

//Check if a token has not timed out yet
router.get('/timeout/:id', (req, res) => {
  const queryText = `SELECT timeout FROM "user" where token = $1;`
  pool.query(queryText, [req.params.id])
    .then((result) => (
      res.send(result.rows[0])
    ))
    .catch((error) => (
      res.sendStatus(500),
      console.log(error)
    ))
})

//Reset password! 
router.put('/password', (req, res) => {
  const password = encryptLib.encryptPassword(req.body.password);
  const token = req.body.token;
  const updateQuery = 
  `UPDATE "user"
  SET 
    "token" = Null, 
    "password" = $1
  WHERE 
    "token" = $2;`;

  pool.query(updateQuery, [password, token])
  .then(() => (
    res.sendStatus(200)
  ))
  .catch((error) => (
    res.sendStatus(500),
    console.log(error)
  ))
})

//reset token if login
router.put('/reset', rejectUnauthenticated, (req, res) =>{
  const queryText = `UPDATE "user" SET token = null where id = $1`
  pool.query(queryText, [req.user.id])
  .then(() => (
    res.sendStatus(200)
  ))
  .catch((error) => (
    res.sendStatus(500),
    console.log(error)
  ))
})

//update the pronouns associated with a User
router.put('/pronouns', (req, res) => {
  const queryText = `UPDATE "user" SET "pronouns" = $1 WHERE "id" = $2`
  //once AUTH is on this project, replace 1 with req.user.id on the next line:
  const inputValues = [req.body.pronouns, 1]

  pool.query(queryText, inputValues)
  .then(() => (
    res.sendStatus(200)
  ))
  .catch((error) => (
    res.sendStatus(500),
    console.log(error)
  ))
})


//update the pronouns associated with a User
router.put('/visible', (req, res) => {
  const queryText = `UPDATE "user" SET "visible" = NOT "visible" WHERE "id" = $1;`;
  //once AUTH is on this project, replace 1 with req.user.id on the next line:
  const inputValues = [1]

  pool.query(queryText, inputValues)
  .then(() => (
    res.sendStatus(200)
  ))
  .catch((error) => (
    res.sendStatus(500),
    console.log(error)
  ))
})


module.exports = router;
