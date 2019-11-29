"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const multasSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia al usuario']
    }
});
multasSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Multa = mongoose_1.model('Multa', multasSchema);
