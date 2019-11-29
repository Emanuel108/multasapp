"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            //Crear carpetas por usuario
            const path = this.crearCarpetaUsuario(userId);
            //Nombre de imagen unico
            const nombreImagen = this.generarNombreImagenUnico(file.name);
            //Mover imagen del temp a la carpeta que almacenará las magene sde las multas
            file.mv(`${path}/${nombreImagen}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreImagenUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        //console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    moverImagenesDeTempAMulta(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathMulta = path_1.default.resolve(__dirname, '../uploads/', userId, 'multas');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathMulta)) {
            fs_1.default.mkdirSync(pathMulta);
        }
        const imagenesTemp = this.obtenerImagenesTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathMulta}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'multas', img);
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/bribe.png');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
