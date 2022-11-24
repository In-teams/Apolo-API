class NumberFormat {
  index(data: any, isMoney = true, ...key: string[]): any {
    const res: any | string = {};
    if (Array.isArray(data))
      return data.map((row: any) => {
        for (const a of key.values()) {
          res[a + "convert"] = isMoney
            ? Intl.NumberFormat("id").format(parseInt(row[a]) || 0)
            : Intl.NumberFormat("id").format(row[a]) || 0;
        }
        return { ...row, ...res };
      });
    for (const a of key.values()) {
      res[a + "convert"] = isMoney
        ? Intl.NumberFormat("id").format(parseInt(data[a]) || 0)
        : Intl.NumberFormat("id").format(data[a]) || 0;
    }
    return { ...data, ...res };
  }
}

export default new NumberFormat().index;
