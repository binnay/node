/**
 * 常规模块创建
 * 暴露两个方法
 * canadianToUS {function}
 * USToCanadian {function}
 */

const canadianDollar = 0.91;

function roundTwoDecimals(amount) {
    return Math.round(amount * 100) / 100;
}

exports.canadianToUS = function(canadian) {
    return roundTwoDecimals(canadian * canadianDollar);
};

exports.USToCanadian = function(us) {
    return roundTwoDecimals(us / canadianDollar);
};
