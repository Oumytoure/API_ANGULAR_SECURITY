const mongoose = require('mongoose');
//base de donnee
const Schema = mongoose.Schema;

let Book = new Schema({
  nom: {
    type: String
  },
  prenom: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
}, {
  collection: 'books'
})
//exporter le model
module.exports = mongoose.model('Book', Book)