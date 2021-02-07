const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const SHA256 = require("crypto-js/sha256"); //encriptador

mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3');

Usuario.collection.drop();

let usu1 = new Usuario({
    login: 'may',
    password: SHA256('1234')
});

usu1.save();

let usu2 = new Usuario({
    login: 'nacho',
    password: SHA256('5678')
});

usu2.save();