"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuarioSchema = new mongoose_1.Schema({
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
usuarioSchema.method('compararPassword', function (password = '') {
    if (bcryptjs_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
