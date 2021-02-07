const express = require('express');
let router = express.Router();
let Producto = require(__dirname + '/../models/producto.js');

// Servicio de listado general
router.get('/', (req, res) => {
    Producto.find().then(resultado => {
        res.render('publico_index');
    }).catch(error => {
        res.render('publico_error');
    });
});

// Servicio renderiza la vista de los productos buscados
router.get('/buscar', (req, res) => {
    if (req.query.buscar.length > 0) {
        Producto.find({ nombre: new RegExp(req.query.buscar, 'i') }).then(resultado => {
            if (resultado.length > 0)
                res.render('publico_index', { productos: resultado });
            else
                res.render('publico_index', { error: "No se encontraron productos" });
        }).catch(error => {
            res.render('publico_error');
        });
    }
    else
        res.redirect('/');
});

//Servicio que muestra un producto
router.get('/producto/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('publico_producto', { producto: resultado });
        else
            res.render('publico_error', { error: 'Producto no encontrado' });
    }).catch(error => {
        res.render('publico_error');
    });
});

//Añade los comentarios
router.post('/comentarios/:idProducto', (req, res) => {
    Producto.findById(req.params.idProducto).then(resultado => {

        resultado.comentarios.push({
            nombreUsuario: req.body.nombreUsuario,
            comentario: req.body.comentario
        });
        resultado.save().then(resultado => {
            res.render('publico_producto', { producto: resultado });
        });
    }).catch(error => {
        res.render('publico_error');
    });
});

module.exports = router;