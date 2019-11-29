"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const multas_model_1 = require("../models/multas.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const multaRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
const express = require('express');
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//Obtener multas paginadas
multaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    //Obtener todas las multas
    const multas = yield multas_model_1.Multa.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.header('Access-Control-Allow-Origin', '*');
    res.json({
        ok: true,
        pagina,
        multas
    });
}));
//Crear multa nueva
multaRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    const imagenes = fileSystem.moverImagenesDeTempAMulta(req.user._id);
    body.img = imagenes;
    multas_model_1.Multa.create(body).then((multaDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield multaDB.populate('user', '-password').execPopulate();
        res.header('Access-Control-Allow-Origin', '*');
        res.json({
            ok: true,
            multa: multaDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//Servicio para subir arhivos
multaRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió archivo'
        });
    }
    const file = req.files.img;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió archivo - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se admite el archivo subido'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.user._id);
    res.header('Access-Control-Allow-Origin', '*');
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
//Mostrar imagen
multaRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.header('Access-Control-Allow-Origin', '*');
    res.sendFile(pathFoto);
});
//Mostrar información de multa
multaRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    const multas = yield multas_model_1.Multa.find({ _id: id })
        .populate('user', '-password')
        .exec();
    res.header('Access-Control-Allow-Origin', '*');
    res.json({
        ok: true,
        id,
        multas
    });
}));
exports.default = multaRoutes;
