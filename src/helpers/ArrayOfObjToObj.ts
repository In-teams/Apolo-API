class ArrayOfObjToObj {
  index(arr: any[], key: string, key2: string) {
    return arr.reduce((obj: any, item: any) => {
      obj[item[key]] = item[key2];
      return obj;
    }, {});
  }
}

export default new ArrayOfObjToObj().index
