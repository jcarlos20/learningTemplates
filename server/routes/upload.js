var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res)=>{

	var tipo = req.params.tipo;
	var id = req.params.id;

	//Tipo de colleciones válidas
	var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
	if (tiposValidos.indexOf(tipo)<0) {
		return res.status(400).json({
			ok: false,
			mensaje: 'Tipo de colección no válida',
			errors: {message: 'Tipo de colección no válida'}
		});
	}

	if (!req.files) {
		return res.status(400).json({
			ok: false,
			mensaje: 'Error seleccionaste nada',
			errors: {message: 'Debe de seleccionar una imagen'}
		});
	}

	//Obtener nombre del archivo
	var archivo = req.files.imagen;
	var archivoSplit = archivo.name.split('.');
	var extension = archivoSplit[archivoSplit.length -1];

	//Validacion de extensiones
	var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

	if (extensionesValidas.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			mensaje: 'Extensión no válida',
			errors: {message: 'Debes de seleccionar una imagen ' + extensionesValidas.join(', ')}
		});
	}

	//Nombre de archivo personalizado
	var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

	//Mover el archivo
	var path = `./uploads/${ tipo }/${ nombreArchivo }`;
	archivo.mv(path, err =>{
		if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error al mover el archivo',
				errors: err
			});
		}

		subirPorTipo(tipo, id, nombreArchivo, res);
	});
});

function subirPorTipo(tipo, id, nombreArchivo, res){
	
	var Modelos = {
		usuarios: Usuario,
		medicos: Medico,
		hospitales: Hospital
	}

	if (Modelos.hasOwnProperty(tipo)) {
		Modelos[tipo].findById(id, (err, modelo)=>{
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'No se encontro el Id',
					errors: err
				});
			}

			if (!modelo) {
				return res.status(404).json({
					ok: true,
					mensaje: {message: 'Modelo no encontrado'}
				});
			}

			var pathViejo = `./uploads/${tipo}/` + modelo.img;

			if (fs.existsSync(pathViejo)) {
				fs.unlinkSync(pathViejo);
			}

			modelo.img = nombreArchivo;
			modelo.save((err, modeloActualizado)=>{
				return res.status(200).json({
					ok: true,
					mensaje: 'Imagen actualizada',
					[tipo]: modeloActualizado
				});
			});

		});
	}


	/*
	if (tipo === 'usuarios') {
		Usuario.findById(id, (err, usuario)=>{
			var pathViejo = './uploads/usuarios/' + usuario.img;
			
			//Si existe una imagen anterior, eliminala
			if (fs.existsSync(pathViejo)) {
				fs.unlinkSync(pathViejo);
			}

			usuario.img = nombreArchivo;
			usuario.save((err, usuarioActualizado)=>{
				return res.status(200).json({
					ok: true,
					mensaje: 'Imagen actualizada',
					usuario: usuarioActualizado
				});
			});
		});
	}

	if (tipo === 'medicos') {
		
	}
	if (tipo === 'hospitales') {
		
	}
	*/
}



module.exports = app;