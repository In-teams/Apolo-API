class IncrementCustom {
  index(str: string, key: string) {
    let increasedNum = Number(str.replace(key, "")) + 1;
    let kmsStr = str.substr(0, 3);
    for (let i = 0; i < 5 - increasedNum.toString().length; i++) {
      kmsStr = kmsStr + "0";
    }
    kmsStr = kmsStr + increasedNum.toString();
    return kmsStr
  }
}

export default new IncrementCustom().index
