class FileExt {
  index(base64: string) {
    const signatures: any = {
      JVBERi0: "application/pdf",
      R0lGODdh: "image/gif",
      R0lGODlh: "image/gif",
      iVBORw0KGgo: "image/png",
    };

    const detectMimeType = (b64: string) => {
      for (var s in signatures) {
        if (b64.indexOf(s) === 0) {
          return signatures[s];
        }
      }
    };

    let ext: string = "";
    switch (detectMimeType(base64)) {
      case "application/pdf":
        ext = ".pdf";
        break;
      case "image/png":
        ext = ".png";
        break;

      default:
        break;
    }

    return ext;
  }
}

export default new FileExt().index;
