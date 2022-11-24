import {Request} from "express";

class GetFile {
  index(req: Request, data: any[], path: string, ...key: string[]): any[] {
    return data.map((row: any) => {
      const res: any | string = {};
      for (const a of key.values()) {
        res[a] = row[a]
          ? `${req.protocol}://${req.headers.host}/file/${path}/${row[a]}`
          : null;
        res[a + "_ext"] = row[a]
          ? row[a].split(/[#?]/)[0].split(".").pop().trim()
          : null;
      }
      return { ...row, ...res };
    });
  }
}

export default new GetFile().index;
