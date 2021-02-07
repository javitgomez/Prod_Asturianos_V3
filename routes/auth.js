const express = require('express');
let router = express.Router();
let Usuario = require(__dirname + '/../models/usuario.js');
//Encriptador
const SHA256 = require("crypto-js/sha256"); 

//Servicio renderizar el login
router.get('/login', (req, res) => {
    res.render('auth_login');
});

//Servicio recibe los datos del login
router.post('/login', (req, res) => {
    Usuario.find({ login: req.body.login, password: SHA256(req.body.password).toString() }).then(resultado => {
        if (resultado.length > 0) {
            req.session.login = resultado;
            res.redirect('/admin');
        } else {
            res.render('auth_login', { error: "Usuario incorrecto" });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

//Servicio destruye la sesion del usuario actual
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;