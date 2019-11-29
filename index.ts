const express = require('express');
const app = express();
app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

import Server from './classes/server';
import PDFDocument from 'pdfkit';

import userRoutes from './routes/usuario';
import { Router, Response} from 'express';
import multaRoutes from './routes/multa';

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
 
const server = new Server();


     


//Body parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//Fileupload
server.app.use(fileUpload());


//Configurar CORS para el intecambio de informacion
server.app.use(cors({origin: true, credentials: true}));


//Rutas de app
server.app.use('/user', userRoutes);
server.app.use('/multa', multaRoutes);



//Conectar con MongoDB
mongoose.connect('mongodb+srv://ecordovamontiel:warker$789@clustermultasapp-tb9v0.mongodb.net/test?retryWrites=true&w=majority', 
				{useNewUrlParser: true, useCreateIndex: true }, (err) => {
	if (err) throw err; 
	console.log('Base de datos online');
})


//Levntar express
server.start(() => {
	console.log(`servidor corriendo en puerto ${server.port}`);
});
