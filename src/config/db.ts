import {Sequelize} from 'sequelize';
import app from './app';

// import tunnel from 'tunnel-ssh'

class Connection {
	public connect = new Sequelize(app.DB_NAME, app.DB_USER, app.DB_PASS, {
		host: app.DB_HOST,
		dialect: 'mysql',
		logging: true
	});

	constructor() {
		this.connection();
	}
	private async connection() {
		try {
			// await tunnel({username:'root', password: 'inosis111213', port: 22, host: 'inosis.id', dstPort: 3306})
			this.connect.authenticate();
			console.log('Database running');
		} catch (error) {
			console.log(error)
			throw error;
		}
	}
}

export default new Connection().connect;
