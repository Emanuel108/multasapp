import express from 'express';

export default class Server {

	public app: express.Application;
	//public port: number = 3000 ;
	public port = process.env.PORT || 3000;


	callback: any;

	constructor() {
		this.app = express();
	}

    start(callback: Function) {
		this.app.listen(this.port);
	}
		
}