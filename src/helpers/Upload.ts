import cryptoRandomString from "crypto-random-string";
import { Request } from "express";
import multer from "multer";
import config from "../config/app";

const allowedFileType = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

class Upload {
  index(type: string) {
    // type registration or redeem
    const path =
      type === "registration" ? config.pathRegistration : config.pathRedeem;
    const storage = multer.diskStorage({
      destination: (req: Request, file: any, cb: any) => {
        cb(null, path);
      },
      filename: (req: Request, file: any, cb: any) => {
        const ext = file.originalname.split(".").pop();
        cb(
          null,
          cryptoRandomString({ length: 10, type: "alphanumeric" }) + "." + ext,
          req.validated
        );
      },
    });

    const filter = (req: Request, file: any, cb: any) => {
      if (allowedFileType.includes(file.mimetype)) {
        cb(null, true);
      } else {
        req.fileValidationError = "Only .jpeg, .png and .jpg images allowed!";
        cb(null, false, req.fileValidationError);
      }
    };
    return multer({
      storage,
      // limits: {
      //     fileSize: 1024 * 1024 * 5
      // },
      fileFilter: filter,
    }).array("files");
  }
}

export default new Upload().index;
