const express = require('express');
const jwt = require("jsonwebtoken");
//app va permettre de recupérer tout se qui se trouve au niveau de la BD
const app = express();
const bookRoute = express.Router();
const bcrypt = require('bcrypt')
let Book = require('../model/book');
const authorize= require('../Authentification/auth');
// ajouter un user par la methode post affiche donnée sinon erreur

bookRoute.route('/add-book').post((req, res, next) => {
  console.log(req.body)

    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new Book({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: hash
      
      })
      user.save()
        .then((response) => {
          console.log(response);
          res.status(201).json({
            message: 'Inscription réussie !',
            result: response,
          })
        })
        .catch((error) => {
          res.status(409).json({
            error: error.message.split("email:")[1],
          })
        })
    })
},
)


// Connexion
bookRoute.post('/login', (req, res, next) => {
  let getUser
  Book
    .findOne({
      email: req.body.email,
    })
    // on Verifie si l'utilisateur existe
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Compte non existant !'})
      }
      getUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: 'Le mot de passe est incorrect !',
        })
      }
      console.log(req.body.email);
      let jwtToken = jwt.sign({
          email: req.body.email,
        },
        'longer-secret-is-better',{ expiresIn: '3h'
      })
      console.log(jwtToken);
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
      })
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Authentication failed',
      })
    })
})


// récupérer tout les users
bookRoute.route('/').get(authorize,(req, res) => {
    Book.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// récupérer un seul user
bookRoute.route('/read-book/:id').get(authorize, (req, res) => {
    Book.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// modifier un user
bookRoute.route('/update-book/:id').put(authorize, (req, res, next) => {
    Book.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Book updated successfully!')
    }
  })
})
// supprimer un user
bookRoute.route('/delete-book/:id').delete(authorize, (req, res, next) => {
    Book.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})
module.exports = bookRoute;