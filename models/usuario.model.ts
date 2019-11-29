import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';


const usuarioSchema = new Schema({

	nombre: {
		type: String,
		required: [true, 'Nombre es requerido']
	},
	avatar: {
		type: String,
		default: 'av-1.png'
	},
	user: {
		type: String,
		unique: true,
		required: [true, 'Usuario es requerido']
	},
	password: {
		type: String,
		required: [true, 'Contraseña es requerida']
	}

});

//Función para verificar si la contraseña coincide con la BD
usuarioSchema.method('compararPassword', function(password: string = ''): boolean {

	if (bcrypt.compareSync(password, this.password)) {
		return true;
	}else {
		return false;
	}

});

interface IUsuario extends Document {
	nombre: string;
	user: string;
	password: string;
	avatar: string;

	compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
