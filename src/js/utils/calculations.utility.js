function roundTwoDecimals(num)  {
    return (Math.round(100 * num) / 100);
}

function getTaxRatio(taxPercentage) {
    return (1 + (taxPercentage / 100));
}