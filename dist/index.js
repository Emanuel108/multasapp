"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const multa_1 = __importDefault(require("./routes/multa"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//Fileupload
server.app.use(express_fileupload_1.default());
//Configurar CORS para el intecambio de informacion
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Rutas de app
server.app.use('/user', usuario_1.default);
server.app.use('/multa', multa_1.default);
//Conectar con MongoDB
mongoose_1.default.connect('mongodb+srv://ecordovamontiel:warker$789@clustermultasapp-tb9v0.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos online');
});
//Levntar express
server.start(() => {
    console.log(`servidor corriendo en puerto ${server.port}`);
});
