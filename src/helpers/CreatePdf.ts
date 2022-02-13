// import puppeteer from 'puppeteer'
// import handlebars from 'handlebars'
// import path from 'path'
// import util from 'util'
// import fs from 'fs'
// import app from '../config/app'

// const ReadFile = util.promisify(fs.readFile);

// const renderHtml = async (data: any, path: string) => {
//     try {

//         // const templatePath = path.resolve('path', 'to', 'invoice.html');
//         const content = await ReadFile(path, 'utf8');

//         // compile and render the template with handlebars
//         const template = handlebars.compile(content);

//         return template(data);
//     } catch (error) {
//         console.log(error);
//         throw new Error('Cannot create invoice HTML template.');
//     }
// }

// class CreatePdf {
// 	async pdf(data: any, path: string) {
// 		const html = await renderHtml(data, path)

// 		const browser = await puppeteer.launch();
// 		const page = await browser.newPage();
// 		await page.setContent(html);

// 		await page.pdf({ path: `${app.pathFormRegistration}/${data.outlet_id}.pdf`, format: 'a4' });

// 		return await browser.close();
// 	}
// }

// export default CreatePdf