class NumberFormat {
  index(data: any[], isMoney: boolean = true, ...key: string[]): any[] {
    return data.map((row: any) => {
      let res: any | string = {};
      for (let a of key.values()) {
        res[a + "convert"] = isMoney
          ? Intl.NumberFormat("id").format(row[a]?.toFixed() || 0)
          : Intl.NumberFormat("id", {
              minimumFractionDigits: 2,
            }).format(row[a]) || 0;
      }
      return { ...row, ...res };
    });
  }
}

export default new NumberFormat().index;
