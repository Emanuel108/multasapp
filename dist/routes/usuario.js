"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
//Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ user: body.user }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos ***'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                user: userDB.user,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos ***'
            });
        }
    });
});
//Crear usuario
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        user: req.body.user,
        password: bcryptjs_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            user: userDB.user,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// Actualizar usuario
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.user.nombre,
        user: req.body.user || req.user.user,
        avatar: req.body.avatar || req.user.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            user: userDB.user,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//Verificar token si es correcto del usuario
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const user = req.user;
    res.json({
        ok: true,
        user
    });
});
exports.default = userRoutes;
