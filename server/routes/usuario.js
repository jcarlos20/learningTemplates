var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var pagination = require('mongoose-pagination');
var app = express();
var Usuario = require('../models/usuario');
var mdAuthentication = require('../middleware/authentication');

//=============================
// Obtener todos los usuarios
//=============================

app.get('/:page?', (req, res)=>{
	if (req.params.page) {
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;

	Usuario.find({}, 'nombre email img role')
		.paginate(page, itemsPerPage, (err, usuarios, total)=>{
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error cargando usuarios',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				total_usuarios : total,
				usuarios : usuarios
			});
		})
});


//=========================
// Crear un nuevo usuario
//=========================

app.post('/', mdAuthentication.verificaToken, (req, res)=>{
	var body = req.body;
	var usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		img: body.img,
		role: body.role
	});

	usuario.save((err, usuarioGuardado)=>{
		if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error guardando usuario',
				errors: err
			});
		}
		res.status(201).json({
			ok: true,
			usuario : usuarioGuardado,
			usuarioToken: req.usuario
		});
	});
});

//======================
// Actualizar usuario
//======================

app.put('/:id', mdAuthentication.verificaToken, (req, res)=>{
	var id = req.params.id;
	var body = req.body;

	Usuario.findById(id, (err, usuario)=>{
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar usuario',
				errors: err
			});
		}

		if (!usuario) {
			return res.status(500).json({
				ok: false,
				mensaje: 'El usuario con el id ' + id + ' no existe',
				errors: {message : 'No existe un usuario con ese ID'}
			});
		}


		usuario.nombre = body.nombre;
		usuario.email = body.email;
		usuario.role = body.role;

		usuario.save((err, usuarioActualizado)=>{
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error actualizando el usuario',
					errors: err
				});
			}
			res.status(200).json({
				ok: true,
				usuario : usuarioActualizado
			});
		});
	});
});


// =======================
// Borrar usuario
// =======================

app.delete('/:id', mdAuthentication.verificaToken, (req, res)=>{
	var id = req.params.id;

	Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error borrando el usuario',
				errors: err
			});
		}

		if (!usuarioBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe un usuario con ese id',
				errors: err
			});
		}

		res.status(200).json({
			ok: true,
			usuario : usuarioBorrado
		});
	});
});


module.exports = app;