var express = require('express');
var mongoose = require('mongoose');
var app = express();
var PORT = process.env.PORT || 3000;

//Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true}, (err, res) => {
	if (err) throw err;
	console.log('Base de datos online');
});

//Rutas
app.get('/', (req, res, next)=>{
	res.status(200).json({
		ok: true,
		mensaje: 'Petición realizada correctamente'
	});
});

//Escuchar petición
app.listen(PORT, ()=> {
	console.log('Express server escuchando en el puerto 3000');
})
