var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// =========================
// Busqueda por coleccion
// =========================
app.get('/coleccion/:tabla/:busqueda', (req, res)=>{
	var tabla = req.params.tabla;
	var busqueda = req.params.busqueda;
	var termino = new RegExp(busqueda, 'i');
	
	var tablasValidas = {
		values: ['usuarios', 'hospitales', 'medicos'],
		message: '{VALUE} no es una tabla permitida'	
	};

	var promesa;
	switch (tabla){
		case 'usuarios':
			promesa = buscarUsuarios(busqueda, termino);
			break;
		case 'medicos':
			promesa = buscarMedicos(busqueda, termino);
			break;
		case 'hospitales':
			promesa = buscarHospitales(busqueda, termino);
			break;
		default:
			return res.status(400).json({
					ok: false,
					mensaje: 'Esta tabla no es válida',
					err: {message: 'Tabla no válida'}
			});
	}

	promesa
	.then(data=>{
			res.status(200).json({
				ok: true,
				[tabla]: data
			});
		});
});



// =========================
// Busqueda general
// =========================

app.get('/todo/:busqueda', (req, res, next)=>{
	
	var busqueda = req.params.busqueda;
	var termino = new RegExp(busqueda, 'i');

	Promise.all([
			buscarHospitales(busqueda, termino),
			buscarMedicos(busqueda, termino),
			buscarUsuarios(busqueda, termino)
		])
		.then(respuestas=>{
			res.status(200).json({
				ok: true,
				hospitales: respuestas[0],
				medicos: respuestas[1],
				usuarios: respuestas[2]
			});
		});
});

function buscarHospitales(busqueda, termino){
	
	return new Promise((resolve, reject)=>{
		Hospital.find({nombre: termino})
		.populate('usuario', 'nombre email') 
		.exec((err, hospitales)=>{
			if (err) {
				reject('Error al buscar hospitales', err);
			}else{
				resolve(hospitales)
			}
		});
	});
}

function buscarMedicos(busqueda, termino){
	
	return new Promise((resolve, reject)=>{
		Medico.find({nombre: termino})
		.populate('usuario', 'nombre email')
		.populate('hospital')
		.exec((err, medicos)=>{
			if (err) {
				reject('Error al buscar medicos', err);
			}else{
				resolve(medicos)
			}
		});
	});
}

function buscarUsuarios(busqueda, termino){
	return new Promise((resolve, reject)=>{
		Usuario.find({}, 'nombre email role')
			.or([{'nombre': termino}, {'email': termino}])
			.exec((err, usuarios)=>{
				if (err) {
					reject('Error al buscar usuarios', err);
				}else{
					resolve(usuarios)
				}
		});		
	});
}


module.exports = app;