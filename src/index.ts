import { addMilliseconds } from 'date-fns';

window.onload = () =>
{
    dispTime()
}

window.setInterval(dispTime, 999)

//gives the date of the specified Sunday in the specified month (January = 0)
function getSunday(month:number, which:number):number
{
    let day:number = 1
    let checkDate = new Date(new Date().getFullYear(),month,day)
    let loop:number = 0
    while(loop < which)
    {
        while(checkDate.getDay() != 0)
        {
            day++
            checkDate.setDate(day)
        }
        loop++
    }
    return day
}

//checks if the timezone in question follows daylight savings
function doesDaylight(d:Date):boolean
{
    let jan:number = new Date(d.getFullYear(), 0, 1).getTimezoneOffset()
    let jul:number = new Date(d.getFullYear(), 6, 1).getTimezoneOffset()

    return Math.max(jan, jul) != d.getTimezoneOffset(); 
}

function dispTime():void
{
    var current:Date = new Date()
    var offset:number = 0
    var month:number = current.getMonth()
    let daylightBegin:Date = new Date(current.getFullYear()+1,2,getSunday(2,2),2)
    let daylightEnd:Date = new Date(current.getFullYear(),10,getSunday(10,1),2)

    //calculate the offset here
    //fall back
    if(current > daylightBegin && current < daylightEnd)
    {
        let endDate:Date = new Date(current.getFullYear()+1,2,getSunday(2,2),2)
        let startDate:Date = new Date(current.getFullYear(),10,getSunday(10,1),2)
        let totalMillis:number = (endDate.getTime() - startDate.getTime())
        let currentMillis:number = (current.getTime() - startDate.getTime())
        let milliVal:number = (totalMillis - 60*60*1000)/totalMillis
        offset = Math.round(currentMillis * milliVal)
        current = startDate    

        //if daylight savings is not practiced, apply the effect manually for calculations
        if(!doesDaylight(new Date()))
        {
            offset += 1000 * 60 * 60
        }
    }

    //spring forward
    else 
    {
        let endDate:Date = new Date(current.getFullYear(),10,getSunday(10,1),2)
        let startDate:Date = new Date(current.getFullYear(),2,getSunday(2,2),2)
        let totalMillis:number = (endDate.getTime() - startDate.getTime())
        let currentMillis:number = (current.getTime() - startDate.getTime())
        let milliVal:number = (totalMillis + 60*60*1000)/totalMillis
        offset = Math.round(currentMillis * milliVal)
        current = startDate
        
    }
    var newDate = addMilliseconds(current, offset)
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    var formatter = new Intl.DateTimeFormat('en-US', options).format;

    document.getElementById("time").innerHTML = formatter(newDate)
}