// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  knex('users').where('email', req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash), user];
  }).spread((result, user) => {
    if (result)
      res.status(200).json({
        user: {
          username: user.username,
          name: user.name,
          id: user.id
        }
      });
    else
      res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({
        error
      });
    }
  });
});

app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name)
    return res.status(400).send();
  knex('users').where('email', req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({
      email: req.body.email,
      hash: hash,
      name: req.body.name,
      role: 'user'
    });
  }).then(ids => {
    return knex('users').where('id', ids[0]).first().select('email', 'name', 'id');
  }).then(user => {
    res.status(200).json({
      user: user
    });
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({
        error
      });
    }
  });
});

app.get('/api/users/:id/ideas', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('ideas','users.id','ideas.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('ideas.id', 'img','adj','adjDef', 'noun', 'nounDef', 'created').then(ideas => {
      res.status(200).json({ideas:ideas});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/users/:id/ideas', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').where('id',id).first().then(user => {
    return knex('ideas').insert({user_id: id, img:req.body.img, adj:req.body.adj, adjDef:req.body.adjDef, noun:req.body.noun, nounDef:req.body.nounDef, created: new Date()});
  }).then(ids => {
    return knex('ideas').where('id',ids[0]).first();
  }).then(idea => {
    res.status(200).json({ idea:idea });
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.delete('/api/users/:id/ideas', (req, res) => {
  //let id = parseInt(req.params.id); //not needed
  let ideaID = parseInt(req.body.id);
  knex('ideas').where('id', ideaID).first().then(idea => {
    return knex('ideas').where('id', ideaID).first().del()
  }).then(ids => {
    res.sendStatus(200);
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      error
    });
  });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
