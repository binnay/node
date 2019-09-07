/**
 * 微调模块创建
 * 暴露一个方法
 * @param canadianDollar
 */

// 从代码规范上来说，这种面相对象的方法，方法名最好大写
function Currency(canadianDollar) {
    this.canadianDollar = canadianDollar;
}

Currency.prototype.canadianToUS = function(canadian) {
    return roundTwoDecimals(canadian * this.canadianDollar);
};

Currency.prototype.USToCanadian = function(us) {
    return roundTwoDecimals(us / this.canadianDollar);
};

module.exports = Currency;
