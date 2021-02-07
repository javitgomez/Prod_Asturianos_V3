const express = require('express');
const multer = require('multer');

let autenticacion= require(__dirname + '/../utils/auth.js');
let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

// Middleware para la subida de las fotos en el servidor
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

let upload = multer({ storage: storage });

// Servicio renderizar lista de productos
router.get('/', autenticacion, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { productos: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});

// Servicio renderizar vista para el formulario de añadir productos
router.get('/nuevo', autenticacion, (req, res) => {
    res.render('admin_productos_form');
});

//Servicio renderizar vista para el formulario de editar un producto
router.get('/editar/:id', autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('admin_productos_form', { producto: resultado });
        else
            res.render('admin_error', { error: 'Producto no encontrado' });
    }).catch(error => {
        res.render('admin_error');
    });
});



// Servicio recibe los datos del produto y los guarda
router.post('/', autenticacion, upload.single('imagen'), (req, res) => {
    let nuevoProducto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
    });
    if (typeof req.file === 'undefined')
        nuevoProducto.imagen = "producto.jpg";
    else
        nuevoProducto.imagen = req.file.filename;
    nuevoProducto.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

// Servicio recibe los datos de un producto para modificarlos y los actualiza
router.post('/:id', autenticacion, upload.single('imagen'), (req, res) => {
    if (typeof req.file !== 'undefined') {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                imagen: req.file.filename
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error');
        });
    } else {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error');
        });
    }
});

// Servicio para borrar productos
router.delete('/:id', autenticacion, (req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        if (resultado)
            res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

module.exports = router;