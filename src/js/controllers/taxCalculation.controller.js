// Public functions

function autoCalculateHeader(linesArray, taxPercentage, isIncludingTax) {
    var returnObj = {
        taxAmount : 0.00,
        taxableAmount : 0.00,
        taxInclusiveAmount : 0.00
    };


    linesArray.forEach(function (line) {
        var includingTax, excludingTax;
        includingTax = _calculateLineTotalIncludingTax(isIncludingTax, line.quantity, line.price, taxPercentage);
        excludingTax = _calculateLineTotalExcludingTax(isIncludingTax, line.quantity, line.price, taxPercentage);
        returnObj.taxInclusiveAmount += includingTax;
    });

    // Calculate taxes
    returnObj.taxableAmount = (returnObj.taxInclusiveAmount / (1 + (taxPercentage / 100)));
    
    // Hard rounding
    returnObj.taxableAmount = Math.round(returnObj.taxableAmount * 100) / 100;
    returnObj.taxInclusiveAmount = Math.round(returnObj.taxInclusiveAmount * 100) / 100;

    returnObj.taxAmount = Math.round((returnObj.taxInclusiveAmount - returnObj.taxableAmount) * 100) / 100;


    //_roundAmountsOfObject(returnObj);
    return returnObj;
}

function autoCalculateLine(isIncludingTax, quantity, price, taxPercentage) {
    return _calculateLineTotalExcludingTax(isIncludingTax, quantity, price, taxPercentage);
}

// Private functions

function _calculateLineTotalIncludingTax(isIncludingTax, quantity, price, taxPercentage) {
    var result;

    if (isIncludingTax) {
        result = roundTwoDecimals(quantity * price);
    } else {
        result = roundTwoDecimals(quantity * price * getTaxRatio(taxPercentage));
    }

    return result;
}

function _calculateLineTotalExcludingTax(isIncludingTax, quantity, price, taxPercentage) {
    var result;
    if (isIncludingTax) {
        result = roundTwoDecimals((quantity * price) / getTaxRatio(taxPercentage));
    } else {
        result = roundTwoDecimals(quantity * price);
    }
    return result;
}

function _roundAmountsOfObject (obj) {
    Object.entries(obj).forEach(([key, value]) => {
        value = Math.round(value * 100) / 100; // "a 5", "b 7", "c 9"
      });
}