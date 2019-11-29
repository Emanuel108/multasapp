import { Schema, Document, model } from 'mongoose';

const multasSchema = new Schema({

	created: {
		type: Date
	},
	nombre: {
		type: String,
		required: [true, 'Nombre es requerido']
	},
	direccion: {
		type: String,
		required: [true, 'Direccion es requerido']
	},
	email: {
		type: String,
		required: [true, 'Email es requerido']
	},
	matricula: {
		type: String,
		required: [true, 'Matricula es requerido']
	},
	img: [{
		type: String
	}],
	tipoinfraccion: {
		type: String,
		required: [true, 'Tipo de infraccion es requerido']
	},
	monto: {
		type: String,
		required: [true, 'Monto es requerido']
	},
	coords: {
		type: String,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: [true, 'Debe existir una referencia al usuario']
	}
});

multasSchema.pre<IMulta>('save', function(next) {
	this.created = new Date();
	next();
});

interface IMulta extends Document {
	created: Date;
	nombre: string;
	direccion: string;
	email: string;
	matricula: string;
	img: string[];
	tipoinfraccion: string;
	monto: string;
	coords: string;
	user: string;
}

export const Multa = model<IMulta>('Multa', multasSchema);

