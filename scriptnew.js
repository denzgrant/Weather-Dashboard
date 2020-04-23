
function showCurrent(){
    let time = response.timezone / 3600;
        let d = new Date();
        let utc_offset = d.getTimezoneOffset();
        d.setMinutes(d.getMinutes() + utc_offset);
        let locationTime = time * 60;
        d.setMinutes(d.getMinutes() + locationTime);
        time = d;
        time = moment(time).format("dddd, MMMM Do YYYY, h:mm a");

        // weather icon
        currentIcon = response.weather[0].icon;
        let currentWeatherIcon =
            "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png";

        //Calculation for location's weather
        let Fahrenheit = Math.round((response.main.temp - 273) * 1.8 + 32);
        Fahrenheit = Fahrenheit += String.fromCharCode(176) + "F";

    const html = `<div class="card-body">
            <h5 class="card-title justify-content:center city"><p>${place} <img src="${currentWeatherIcon}"/></p></h5>
            <div class="time"><strong>It is currently ${time}</strong></div>
            <div class="temp"><p>Temperature: ${Fahrenheit}</div>
            <div class="wind"><p>The wind speed is ${response.wind.speed} Mph</p></div>
            <div class="humidity"><p>The humidity is ${
                response.main.humidity + String.fromCharCode(37)
                }</div>
            <div class="uv-index"></div>
        </div>`

}


function getUVData(lat, long) {
    let uvURL =
    "http://api.openweathermap.org/data/2.5/uvi?appid=" +
    APIKey +
    "&lat=" +
    lat +
    "&lon=" +
    long;
$.ajax({
    url: uvURL,
    method: "GET",
}).then(function (uvResponse) {
    let uv = uvResponse.value;
    let cls = "";
    //Setting UV Color Scheme based on index
    if (uv < 3) {
       cls = "low"
    } else if (uv > 2 && uv < 6) {
       cls="med"
    } else if (uv > 5 && uv < 8) {
       cls="med"
    } else if (uv > 7 && uv < 11) {
       cls="med"
    } else if (uv > 10) {
       cls="med"
    }

     return `<div class="uv-index ${cls}" ><strong>UV Index:${uv}</strong></div>`;
});
}

function get5DayData(){
    $.ajax({
        url:`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${APIKey}`,
        method: "GET",
    }).then(function (response) {
        // console.log(response); 
        const timeIndex = [2,10, 18, 26, 34];
        const html = '';
        
        response.list.forEach((day, index) => {
            const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
            const tempFah =  Math.round(
                (day.main.temp - 273.15) * 1.8 + 32
            )
            if (timeIndex.includes(index)){
                html += `<div class="card5Day">
                 <h5>${day.dt_txt}</h5>
                 <img src="${icon}"/>
                 <p>Temp: ${tempFah}${String.fromCharCode(176)}F</p>
                 <p>Humidty ${day.main.humidity}%</p>
                </div>`
            }
        });

        $("#5Day").append(html);
      
})}  