var express = require('express');
var app = express();
var Medico = require('../models/medico');
var mdAuthentication = require('../middleware/authentication');

//=============================
// Obtener todos los medicos
//=============================

app.get('/:page?', (req, res)=>{
	if (req.params.page) {
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;

	Medico.find({})
		.populate('usuario', 'nombre email')
		.populate('hospital') 
		.paginate(page, itemsPerPage, (err, medicos, total)=>{
		if (err) {
			return res.status(500).json({
			ok: false,
			mensaje: 'Error obteniendo medicos',
			errors: err
			});
		}
		res.status(200).json({
			ok: true,
			total_medicos: total, 
			medicos: medicos
		});
	});
});

//=========================
// Crear un nuevo medico
//=========================

app.post('/', mdAuthentication.verificaToken, (req, res)=>{
	var body = req.body;
	var medico = new Medico({
		nombre: body.nombre,
		img: body.img,
		usuario: req.usuario._id,
		hospital: body.hospital
	});
	medico.save((err, medicoGuardado)=>{
		if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error guardando medico',
				errors: err
			});
		}

		res.status(201).json({
			ok: true,
			medico : medicoGuardado
		});
	});

});

//=========================
// Actualizar un medico
//=========================

app.put('/:id', mdAuthentication.verificaToken, (req, res)=>{
	var id = req.params.id;
	var body = req.body;

	Medico.findById(id, (err, medico)=>{
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar el medico',
				errors: err
			});
		}

		if (!medico) {
			return res.status(500).json({
				ok: false,
				mensaje: 'El medico con el id ' + id + ' no existe',
				errors: {message : 'No existe un medico con ese ID'}
			});
		}

		medico.nombre = body.nombre;
		medico.usuario = req.usuario._id;
		medico.hospital = body.hospital;

		medico.save((err, medicoActualizado)=>{
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error actualizando el medico',
					errors: err
				});
			}
			res.status(200).json({
				ok: true,
				medico : medicoActualizado
			});
		});
	});
});


//=========================
// Borrar un medico
//=========================

app.delete('/:id', mdAuthentication.verificaToken, (req, res)=>{
	var id = req.params.id;
	Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error borrando el medico',
				errors: err
			});
		}

		if (!medicoBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe un medico con ese id',
				errors: err
			});
		}

		res.status(200).json({
			ok: true,
			medico : medicoBorrado
		});
	});	
});

module.exports = app;