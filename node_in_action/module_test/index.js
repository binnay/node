const currency = require("./currency.js");
const Currency1 = require("./currentcy_other");

const result = currency.canadianToUS(200);
console.log(result);

const result1 = new Currency1(0.91);
console.log(result1.canadianToUS(200));
