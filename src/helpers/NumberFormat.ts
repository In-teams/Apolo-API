class NumberFormat {
  index(data: any, isMoney: boolean = true, ...key: string[]): any {
    let res: any | string = {};
    if(Array.isArray(data))
    return data.map((row: any) => {
      for (let a of key.values()) {
        res[a + "convert"] = isMoney
          ? Intl.NumberFormat("id").format(row[a]?.toFixed() || 0)
          : Intl.NumberFormat("id", {
              minimumFractionDigits: 2,
            }).format(row[a]) || 0;
      }
      return { ...row, ...res };
    });
    for (let a of key.values()) {
      res[a + "convert"] = isMoney
        ? Intl.NumberFormat("id").format(data[a]?.toFixed() || 0)
        : Intl.NumberFormat("id", {
            minimumFractionDigits: 2,
          }).format(data[a]) || 0;
    }
    return { ...data, ...res };


  }
}

export default new NumberFormat().index;
