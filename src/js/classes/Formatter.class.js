"use strict";
class Formatter {

    static formatCurrency (num) {
        switch (typeof num) {
            case "string":
                num = parseFloat(num);
                num = num.toFixed(2);
                break;
            case "number":
                num = num.toFixed(2);
            default:
                break;
        }
    
        return num;
    }
    
    static formatDate(date) {
        var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
        if (month < 10) {
            month = `0${month}`;
        }
        if (day < 10) {
            day = `0${day}`;
        }
        var d = `${year}-${month}-${day}`;
        return d;
    }
}