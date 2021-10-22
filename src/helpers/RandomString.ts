import cryptoRandomString from "crypto-random-string";

class RandomString {
  public random = cryptoRandomString({ length: 10, type: "alphanumeric" });
}

export default new RandomString();
