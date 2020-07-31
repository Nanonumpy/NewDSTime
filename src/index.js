"use strict";
exports.__esModule = true;
var date_fns_1 = require("date-fns");
window.onload = function () {
    dispTime();
};
window.setInterval(dispTime, 1000);
//gives the date of the specified Sunday in the specified month (January = 0)
function getSunday(year, month, which) {
    var day = 1;
    var checkDate = new Date(year, month, day);
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
//checks if the timezone in question follows daylight savings
function doesDaylight(d) {
    var jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    var jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) != d.getTimezoneOffset();
}
function dispTime() {
    var current = new Date();
    var offset = 0;
    var month = current.getMonth();
    var year = current.getFullYear();
    var daylightBegin = new Date(year, 2, getSunday(year, 2, 2), 2);
    var daylightEnd = new Date(year, 10, getSunday(year, 10, 1), 2);
    //calculate the offset here
    //fall back
    if (current >= daylightBegin && current < daylightEnd) {
        var startDate = new Date(year, 2, getSunday(year, 2, 2), 2);
        var endDate = new Date(year, 10, getSunday(year, 10, 1), 2);
        var totalMillis = (endDate.getTime() - startDate.getTime());
        var currentMillis = (current.getTime() - startDate.getTime());
        var milliVal = (totalMillis - 60 * 60 * 1000) / totalMillis;
        offset = Math.round(currentMillis * milliVal);
        current = startDate;
        //if daylight savings is not practiced, apply the effect manually for calculations
        if (!doesDaylight(new Date())) {
            offset += 1000 * 60 * 60;
        }
    }
    //spring forward
    else if (current >= daylightEnd) {
        var startDate = new Date(year, 10, getSunday(year, 10, 1), 2);
        var endDate = new Date(year + 1, 2, getSunday(year + 1, 2, 2), 2);
        var totalMillis = (endDate.getTime() - startDate.getTime());
        var currentMillis = (current.getTime() - startDate.getTime());
        var milliVal = (totalMillis + 60 * 60 * 1000) / totalMillis;
        offset = Math.round(currentMillis * milliVal);
        current = startDate;
    }
    else if (current < daylightBegin) {
        var startDate = new Date(year - 1, 10, getSunday(year - 1, 10, 1), 2);
        var endDate = new Date(year, 2, getSunday(year, 2, 2), 2);
        var totalMillis = (endDate.getTime() - startDate.getTime());
        var currentMillis = (current.getTime() - startDate.getTime());
        var milliVal = (totalMillis + 60 * 60 * 1000) / totalMillis;
        offset = Math.round(currentMillis * milliVal);
        current = startDate;
    }
    var newDate = date_fns_1.addMilliseconds(current, offset);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    var formatter = new Intl.DateTimeFormat('en-US', options).format;
    document.getElementById("time").innerHTML = formatter(newDate);
}
