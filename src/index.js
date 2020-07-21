"use strict";
exports.__esModule = true;
var date_fns_1 = require("date-fns");
window.onload = function () {
    dispTime();
};
window.setInterval(dispTime, 999);
//gives the date of the specified Sunday in the specified month (January = 0)
function getSunday(month, which) {
    var day = 1;
    var checkDate = new Date(new Date().getFullYear(), month, day);
    var loop = 0;
    while (loop < which) {
        while (checkDate.getDay() != 0) {
            day++;
            checkDate.setDate(day);
        }
        loop++;
    }
    return day;
}
function dispTime() {
    var current = new Date();
    var offset = 0;
    var month = current.getMonth();
    //calculate the offset here
    //spring forward
    if (month >= 10 || month < 2) {
        var endDate = new Date(current.getFullYear() + 1, 2, getSunday(2, 2), 2);
        var startDate = new Date(current.getFullYear(), 10, getSunday(10, 1), 2);
        var totalMillis = (endDate.getTime() - startDate.getTime());
        var currentMillis = (current.getTime() - startDate.getTime());
        var milliVal = (totalMillis + 60 * 60 * 1000) / totalMillis;
        offset = Math.round(currentMillis * milliVal);
        current = startDate;
    }
    //fall back
    else if (month >= 2 && month < 10) {
        var endDate = new Date(current.getFullYear(), 10, getSunday(10, 1));
        var startDate = new Date(current.getFullYear(), 2, getSunday(2, 2));
        var totalMillis = (endDate.getTime() - startDate.getTime());
        var currentMillis = (current.getTime() - startDate.getTime());
        var milliVal = (totalMillis - 60 * 60 * 1000) / totalMillis;
        offset = Math.round(currentMillis * milliVal);
        current = startDate;
    }
    var newDate = date_fns_1.addMilliseconds(current, offset);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    var formatter = new Intl.DateTimeFormat('en-US', options).format;
    document.getElementById("time").innerHTML = formatter(newDate);
}
