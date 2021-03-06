var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicosSchema = new Schema({
	nombre: {type: String, required: [true, 'El nombre es necesario']},
	img: {type: String, required: false},
	usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
	hospital: {type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es obligatorio']}
});

module.exports = mongoose.model('Medico', medicosSchema);