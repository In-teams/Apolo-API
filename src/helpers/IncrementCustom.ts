class IncrementCustom {
  index(str: string, key: string, number: number) {
    let increasedNum = Number(str.replace(key, "")) + 1;
    let kmsStr = str.substr(0, key.length);
    for (let i = 0; i < number - increasedNum.toString().length; i++) {
      kmsStr = kmsStr + "0";
    }
    kmsStr = kmsStr + increasedNum.toString();
    return kmsStr
  }
}

export default new IncrementCustom().index
