class App {
	public pathLogger: string = './temp/logger';
	public pathExcel: string = './temp/excel';
	public pathRegistration: string = 'temp/file/registration';
	public pathRedeem: string = 'temp/file/redeem';
	public deleteLogger: number = 1; // day
	public jwtKey: string = 'inosis111213'; // JWT_KEY
	public ExpKey = '24h'; // Exp JWT_KEY
	public ExpRefreshKey: string = '24h'; // Exp JWT_KEY refresh token
	public dataPerPage: number = 10;
	public DB_HOST: string = 'localhost';
	public DB_NAME: string = 'apolo';
	public DB_USER: string = 'root';
	public DB_PASS: string = '';
}

export default new App();
