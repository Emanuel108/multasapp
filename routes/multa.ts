import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Multa } from '../models/multas.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';
import cors from 'cors';

const multaRoutes = Router();
const fileSystem = new FileSystem();

const express = require('express');
const app = express();
     
app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Obtener multas paginadas
multaRoutes.get('/', async (req: any, res: Response) => {

	let pagina = Number(req.query.pagina) || 1;
	let skip = pagina - 1;
	skip = skip * 10;

	//Obtener todas las multas
	const multas = await Multa.find()
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

});


//Crear multa nueva
multaRoutes.post('/', [verificaToken], (req: any, res: Response) => {

	const body = req.body;
	body.user = req.user._id;

	const imagenes = fileSystem.moverImagenesDeTempAMulta(req.user._id);

	body.img = imagenes;

	Multa.create(body).then(async multaDB => {

		await multaDB.populate('user', '-password').execPopulate();

		res.header('Access-Control-Allow-Origin', '*');

		res.json({
			ok: true,
			multa: multaDB
		});

	}).catch(err => {
		res.json(err)
	});

});


//Servicio para subir arhivos
multaRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {

	if (!req.files) {
		return res.status(400).json({
			ok: false,
			mensaje: 'No se subió archivo'
		});
	}

	const file: FileUpload = req.files.img;

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

	await fileSystem.guardarImagenTemporal(file, req.user._id);

	res.header('Access-Control-Allow-Origin', '*');

	res.json({
		ok: true,
		file: file.mimetype
	});

});

//Mostrar imagen
multaRoutes.get('/imagen/:userid/:img', (req: any, res: Response)=> {
	
	const userId = req.params.userid;
	const img = req.params.img;

	const pathFoto = fileSystem.getFotoUrl(userId, img);

	res.header('Access-Control-Allow-Origin', '*');

	res.sendFile(pathFoto);

});

//Mostrar información de multa
multaRoutes.get('/:id', async (req: any, res: Response) => {
    let id             = req.params.id;
 
    const multas = await Multa.find({_id: id})
    						.populate('user', '-password')
                            .exec();

    res.header('Access-Control-Allow-Origin', '*');
 
    res.json({
        ok: true,
        id,
        multas
       
    });
 
 
});

export default multaRoutes;