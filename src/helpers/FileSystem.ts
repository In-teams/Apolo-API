import {readFile, unlink, writeFile} from "fs";
import Jimp from "jimp";

class FileSystem {
  WriteFile(path: string, row: string, buffer = false, ext?: string) {
    return new Promise<boolean>((resolve, reject) => {
      writeFile(path, row, { ...(buffer && { encoding: "base64" }) }, (err) => {
        if (err) reject(err);
        if (ext !== ".pdf") {
          Jimp.read(path)
            .then((img) => {
              return img
                .quality(20) // set JPEG quality
                .write(path); // save
            })
            .catch((err) => {
              console.error(err);
            });
        }
        // sharp(Buffer.from(row, "base64"))
        //   .toFormat("png")
        //   .png({ quality: 1 })
        //   .toFile(path)
        //   .then((res) => console.log(res))
        //   .catch((err) => console.log(err));
        resolve(true);
      });
    });
  }
  DeleteFile(path: string) {
    return new Promise<boolean>((resolve, reject) => {
      unlink(path, (err) => {
        if (err) reject({ msg: err, type: "DELETE_FILE" });
        resolve(true);
      });
    });
  }

  ReadFile(path: string): Promise<string[] | undefined> {
    return new Promise((resolve, reject) => {
      readFile(path, function read(err, data) {
        if (err) {
          reject({ msg: err, type: "GET_FILE" });
        }

        data && data.toString().length > 0
          ? resolve(data.toString().split("\n"))
          : resolve([]);
      });
    });
  }
  async ReadExcelFile(path: string): Promise<any> {
    try {
    } catch (error) {
      return error;
    }
  }
}

export default new FileSystem();
