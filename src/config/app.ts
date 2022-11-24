class App {
  public pathLogger = "./temp/logger";
  public pathExcel = "./temp/excel";
  public pathRegistration = "temp/file/registration";
  public pathFormRegistration = "public/files/registration";
  public pathRedeem = "temp/file/redeem";
  public deleteLogger = 1; // day
  public jwtKey = "inosis111213"; // JWT_KEY
  public ExpKey = "24h"; // Exp JWT_KEY
  public ExpRefreshKey = "24h"; // Exp JWT_KEY refresh token
  public dataPerPage = 10;
  public DB_HOST: string = process.env.DB_HOST || 'localhost';
  public DB_PORT: number = Number(process.env.DB_PORT) || 3306;
  public DB_NAME: string = process.env.DB_DATABASE || 'database';
  public DB_USER: string = process.env.DB_USERNAME || 'root';
  public DB_PASS: string = process.env.DB_PASSWORD || '';
}

export default new App();
