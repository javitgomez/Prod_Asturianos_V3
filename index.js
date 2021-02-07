//Cargamos las librerías
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

//Cargamos los Enrutadores
const productos = require(__dirname + '/routes/productos');
const publico = require(__dirname + '/routes/publico');
const auth = require(__dirname + '/routes/auth');

// Conectamos con la base de datos (MongoDB)
mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3', { useNewUrlParser: true });

// Se inicia el Servidor Express
let app = express();

// Configuramos el motor de plantillas de Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
}); 
// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Cargar middleware body-parser para peticiones POST y PUT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para procesar otras peticiones (no GET o POST)
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Configuración la autentificacion en las sesiones de la app
//SIEMPRE el middleware antes de cargar los enrutados (app.use)

app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// cargamos la carpeta public para el CSS propio
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/', publico);
app.use('/admin', productos);
app.use('/auth', auth);

//Arrancamos el servidor
app.listen(8080);

