class ArrayOfObjToObj {
  index(arr: any[], key: string, ...key2: any) {
    return arr.reduce((obj: any, item: any) => {
      obj[item[key]] = {};
      for (const i of key2.values()) {
        obj[item[key]][i] = item[i];
      }
      return obj;
    }, {});
  }
}

export default new ArrayOfObjToObj().index;
