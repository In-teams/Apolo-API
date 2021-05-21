class NumberFormat {
  index(data: [], ...key: string[]): any[] {
    return data.map((row: any) => {
      let res: any | string = {};
      for (let a of key.values()) {
        res[a] = Intl.NumberFormat("id").format(row[a].toFixed());
      }
      return { ...row, ...res };
    });
  }
}

export default new NumberFormat().index;
