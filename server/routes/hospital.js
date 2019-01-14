var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var mdAuthentication = require('../middleware/authentication');

//=============================
// Obtener todos los hospitales
//=============================

app.get('/:page?', (req, res)=>{
	
	if (req.params.page) {
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;

	Hospital.find({}) 
	.populate('usuario', 'nombre email')
	.paginate(page, itemsPerPage, (err, hospitales, total)=>{
		if (err) {
			return res.status(500).json({
			ok: false,
			mensaje: 'Error obteniendo hospitales',
			errors: err
			});
		}
		res.status(200).json({
			ok: true,
			total_hospitales: total,
			hospitales: hospitales
		});
	});
});

//=========================
// Crear un nuevo hospital
//=========================

app.post('/', mdAuthentication.verificaToken, (req, res)=>{
	var body = req.body;
	var hospital = new Hospital({
		nombre: body.nombre,
		img: body.img,
		usuario: req.usuario._id
	});
	hospital.save((err, hospitalGuardado)=>{
		if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error guardando hospital',
				errors: err
			});
		}

		res.status(201).json({
			ok: true,
			hospital : hospitalGuardado
		});
	});

});

//=========================
// Actualizar un hospital
//=========================

app.put('/:id', mdAuthentication.verificaToken, (req, res)=>{
	var id = req.params.id;
	var body = req.body;

	Hospital.findById(id, (err, hospital)=>{
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar el hospital',
				errors: err
			});
		}

		if (!hospital) {
			return res.status(500).json({
				ok: false,
				mensaje: 'El hospital con el id ' + id + ' no existe',
				errors: {message : 'No existe un hospital con ese ID'}
			});
		}

		hospital.nombre = body.nombre;
		hospital.usuario = req.usuario._id;

		hospital.save((err, hospitalActualizado)=>{
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error actualizando el hospital',
					errors: err
				});
			}
			res.status(200).json({
				ok: true,
				hospital : hospitalActualizado
			});
		});
	});
});

//=========================
// Borrar un hospital
//=========================

app.delete('/:id', mdAuthentication.verificaToken, (req, res)=>{
	var id = req.params.id;
	Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=>{
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error borrando el hospital',
				errors: err
			});
		}

		if (!hospitalBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe un hospital con ese id',
				errors: err
			});
		}

		res.status(200).json({
			ok: true,
			hospital : hospitalBorrado
		});
	});	
});

module.exports = app;