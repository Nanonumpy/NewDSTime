"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
window.onload = function () {
    dispTime();
};
window.setInterval(dispTime, 999);
function dispTime() {
    var current = new Date();
    var offset = 0;
    var month = current.getMonth();
    //calculate the offset here
    //spring forward
    if (month >= 11 || month < 2) {
        var endDate = new Date(current.getFullYear() + 1, 2, 1);
        var startDate = new Date(current.getFullYear(), 10, 1);
        var totalMillis = (endDate.getTime() - startDate.getTime());
        var currentMillis = (current.getTime() - startDate.getTime());
        var milliVal = (totalMillis + 60 * 60 * 1000) / totalMillis;
        offset = Math.round(currentMillis * milliVal);
        current = startDate;
    }
    //fall back
    else if (month >= 2 && month < 11) {
        var endDate = new Date(current.getFullYear(), 10, 1);
        var startDate = new Date(current.getFullYear(), 2, 1);
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
