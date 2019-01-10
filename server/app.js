var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

//Inicializar variables
var app = express();

//Body-Parser - parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true}, (err, res) => {
	if (err) throw err;
	console.log('Base de datos online');
});

//Rutas
app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);

//Escuchar petición
app.listen(PORT, ()=> {
	console.log('Express server escuchando en el puerto 3000');
})
