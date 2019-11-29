import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';


export default class FileSystem {

	constructor() {};

	guardarImagenTemporal(file: FileUpload, userId: string) {

		return new Promise((resolve, reject) => {

				//Crear carpetas por usuario
			const path = this.crearCarpetaUsuario(userId);


			//Nombre de imagen unico
			const nombreImagen = this.generarNombreImagenUnico(file.name);
			
			//Mover imagen del temp a la carpeta que almacenará las magene sde las multas
			file.mv( `${path}/${nombreImagen}`, (err: any) => {

				if (err) {
					reject(err);
				}else{
					resolve();
				}

			});

		});

	}

	private generarNombreImagenUnico(nombreOriginal: string) {

		const nombreArr = nombreOriginal.split('.');
		const extension = nombreArr[ nombreArr.length - 1 ];

		const idUnico = uniqid();

		return `${idUnico}.${extension}`;

	}

	private crearCarpetaUsuario(userId: string) {

		const pathUser = path.resolve(__dirname, '../uploads/', userId);
		const pathUserTemp = pathUser + '/temp';
		//console.log(pathUser);

		const existe = fs.existsSync(pathUser);

		if (!existe) {
			fs.mkdirSync(pathUser);
			fs.mkdirSync(pathUserTemp);
		}

		return pathUserTemp;

	}


	moverImagenesDeTempAMulta(userId: string) {

		const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
		const pathMulta = path.resolve(__dirname, '../uploads/', userId, 'multas');
		
		if (!fs.existsSync(pathTemp)) {
			return [];
		}

		if (!fs.existsSync(pathMulta)) {
			fs.mkdirSync(pathMulta);
		}

		const imagenesTemp = this.obtenerImagenesTemp(userId);
		imagenesTemp.forEach(imagen => {
			fs.renameSync(`${pathTemp}/${imagen}`, `${pathMulta}/${imagen}`)
		})

		return imagenesTemp;

	}

	private obtenerImagenesTemp(userId: string) {

		const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

		return fs.readdirSync(pathTemp) || [];

	}

	getFotoUrl(userId: string, img: string) {

		const pathFoto = path.resolve(__dirname, '../uploads/', userId, 'multas', img);

		const existe = fs.existsSync(pathFoto);
		if (!existe) {
			return path.resolve(__dirname, '../assets/bribe.png');
		}

		return pathFoto;
	}

}