import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcryptjs';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes =  Router();




//Login
userRoutes.post('/login', (req: Request, res: Response) => {
	const body = req.body;

	Usuario.findOne({user: body.user}, (err, userDB) => {
		if (err) throw err;

		if (!userDB) {
			return res.json({
				ok: false,
				mensaje: 'Usuario/Contraseña no son correctos ***'
			});
		}

		if (userDB.compararPassword(body.password)) {

			const tokenUser = Token.getJwtToken({
				_id: userDB._id,
				nombre: userDB.nombre,
				user: userDB.user,
				avatar: userDB.avatar
			});

			res.json({
				ok: true,
				token: tokenUser
			});

		}else {

			return res.json({
				ok: false,
				mensaje: 'Usuario/Contraseña no son correctos ***'
			});

		}
	})
})

//Crear usuario
userRoutes.post('/create', (req: Request, res: Response) => {

	const user = {
		nombre: req.body.nombre,
		user: req.body.user,
		password: bcrypt.hashSync(req.body.password, 10),
		avatar:  req.body.avatar
	}

	Usuario.create(user).then( userDB => {

		const tokenUser = Token.getJwtToken({
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
userRoutes.post('/update', verificaToken, (req: any, res: Response ) => {

    const user = {
        nombre: req.body.nombre || req.user.nombre,
        user  : req.body.user   || req.user.user,
        avatar: req.body.avatar || req.user.avatar
    }

    Usuario.findByIdAndUpdate( req.user._id, user, { new: true }, (err, userDB) => {

        if ( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            user  : userDB.user,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });


    });

});

//Verificar token si es correcto del usuario
userRoutes.get('/', [verificaToken], (req: any, res: Response) => {

	const user = req.user;

	res.json({
		ok: true,
		user
	});

});


export default userRoutes;