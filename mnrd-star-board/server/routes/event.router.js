const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET all visible entries
 */
router.get('/all', rejectUnauthenticated, (req, res) => {
    const queryString = `SELECT "entry"."id", "entry"."date", "entry"."description", "entry"."photo_URL", 
        "user"."name", "user"."pronouns", "team"."color", "team"."name" AS "team_name"
        FROM "entry" 
        JOIN "user" ON "entry"."user_id" = "user"."id" 
        JOIN "team" on "user"."team_id" = "team"."id"
        WHERE "user"."visible" = TRUE;`;

    pool.query(queryString)
    .then((result) => (
      res.send(result.rows)
    ))
    .catch((error) => (
      res.sendStatus(500),
      console.log('error on event get: ', error)
    ))
    
});

/**
 * POST new entry
 */
router.post('/new', rejectUnauthenticated, (req, res) => {
    console.log('in /api/event/new, with ', req.body);

    const postString = `INSERT INTO "entry" ("user_id", "date", "description", "photo_URL") 
        VALUES ($1, $2, $3, $4);`;
    const val = req.body;

    //ONCE AUTH is on this project, replace 1 on the next line with req.user.id!    
    pool.query(postString, [req.user.id, val.date, val.description, val.photoURL])
    .then(() => (
        res.sendStatus(200)
    )).catch((error) => (
        res.sendStatus(500),
        console.log('error on event post: ', error)
    ))
});

module.exports = router;