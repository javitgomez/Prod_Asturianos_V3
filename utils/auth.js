//Middleware para autenticar usuarios en rutas protegidas
let autenticacion = (req, res, next) => {
    if (req.session && req.session.login)
        return next();
    else
        res.render('auth_login');
};

module.exports = autenticacion;