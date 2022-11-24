class IncNumber {
  index(temp: any): string {
    const inc = temp.split("-")[2];
    let cent = +temp.split("-")[1];
    const format = "0000000";
    let curr = parseInt(inc);
    if (curr === 99999999) cent++;
    const prefix = temp.split("-").splice(0, 1).join("-") + "-" + cent + "-";
    let padd = "";
    curr++;
    padd = (format + curr).slice(-8);

    return prefix + padd;
  }
}

export default new IncNumber().index;
