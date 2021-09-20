import { Sequelize } from 'sequelize';
import app from './app';

class Connection {
	public connect = new Sequelize(app.DB_NAME, app.DB_USER, app.DB_PASS, {
		host: app.DB_HOST,
		dialect: 'mysql',
		// logging: false
	});

	constructor() {
		this.connection();
	}
	private connection() {
		try {
			this.connect.authenticate();
			console.log('Database running');
		} catch (error) {
			console.log(error)
			throw error;
		}
	}
}

export default new Connection().connect;
