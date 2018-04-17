// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

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
    if (result) {
      let token = jwt.sign({
        id: user.id
      }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({
        user: {
          username: user.username,
          name: user.name,
          id: user.id
        },
        token: token
      });
    } else {
      res.status(403).send("Invalid credentials");
    }
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
    let token = jwt.sign({
      id: user.id
    }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({
      user: user,
      token: token
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

app.get('/api/users/:id/ideas', verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  console.log("id", id);
  console.log("req.userID", req.userID);
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }
  knex('users').join('ideas', 'users.id', 'ideas.user_id')
    .where('users.id', id)
    .orderBy('created', 'desc')
    .select('ideas.id', 'img', 'adj', 'adjDef', 'noun', 'nounDef', 'created').then(ideas => {
      res.status(200).json({
        ideas: ideas
      });
    }).catch(error => {
      res.status(500).json({
        error
      });
    });
});

app.post('/api/users/:id/ideas', verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }
  knex('users').where('id', id).first().then(user => {
    return knex('ideas').insert({
      user_id: id,
      img: req.body.img,
      adj: req.body.adj,
      adjDef: req.body.adjDef,
      noun: req.body.noun,
      nounDef: req.body.nounDef,
      created: new Date()
    });
  }).then(ids => {
    return knex('ideas').where('id', ids[0]).first();
  }).then(idea => {
    res.status(200).json({
      idea: idea
    });
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      error
    });
  });
});

app.delete('/api/users/:id/ideas/:ideaID', verifyToken, (req, res) => {
  let id = parseInt(req.params.id); //not needed
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }

  let ideaID = parseInt(req.params.ideaID);
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

// Get my account
app.get('/api/me', verifyToken, (req,res) => {
  console.log("req.userID in api/me", req.userID);
  knex('users').where('id',req.userID).first().select('email','name','id').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
