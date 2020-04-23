const APIKey = "5b0dd2de1698f33a10aab5e7e9eef4d2";
var searchedLocations = [];
let long;
let lat;


$('#fdh').hide();


$(".clear").click(function () {
    $(".list-group").empty();
    $("#5Day").empty();
    $("#current-forecast").empty();
    $('#fdh').hide(); 
    localStorage.clear();
    searchedLocations = [];
});

$(".list-group").on("click", ".weather-btn", (e) =>{
    const city = $(e.target).data("name");
    queryAPIs(city);
})

$("#searched-locations").on("keypress", function (event) {
    if (event.key === "Enter") {
        queryAPIs($("#searched-locations").val());
        $('#fdh').show(); 
        $('#current-forecast').show();
       
    }
});

getCurrentTime = (city) => {
    let time = city.timezone / 3600;
    let d = new Date();
    let utc_offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() + utc_offset);
    let locationTime = time * 60;
    d.setMinutes(d.getMinutes() + locationTime);
    return moment(d).format("dddd, MMMM Do YYYY, h:mm A");
}

getFTemp = (temp) => {
   return `${Math.round((temp - 273) * 1.8 + 32)}${String.fromCharCode(176)}F`
}

getUVHTML = (uv) => {
    let cls = "";
    //Setting UV Color Scheme based on index
    if (uv < 3) {
       cls = "low"
    } else if (uv > 2 && uv < 6) {
       cls="mod"
    } else if (uv > 5 && uv < 8) {
       cls="high"
    } else if (uv > 7 && uv < 11) {
       cls="very_high"
    } else if (uv > 10) {
       cls="extreme"
    }

     return `<div class="uv-index ${cls}" ><strong>UV Index: ${uv}</strong></div>`;
};

loadcity = () => {
    let cityString = localStorage.getItem("Locations");
    searchedLocations = (cityString) ? JSON.parse(cityString) : []; 
    queryAPIs(searchedLocations[0]);
    
}; 

queryAPIs = (place) => {
    if (!place) return;

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${APIKey}`,
        method: "GET",
    }).then((response) => {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`,
            method: "GET",
        }).then((uvResponse) => {
            showCurrentCity(response, uvResponse);
            $.ajax({
                url:`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${APIKey}`,
                method: "GET",
            }).then((response5Day) => {
                show5Day(response5Day);
            });
        });
    });
};

show5Day = (response) => {
    const timeIndex = [2,10, 18, 26, 34];
    let html = '';
    $("#5Day").empty();
    response.list.forEach((day, index) => {
        if (timeIndex.includes(index)){
            html += `<div class="card5Day row">
                <h5>${moment(day.dt_txt).format("MM/D/YYYY")}</h5>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
                <p>Temp: ${getFTemp(day.main.temp)}</p>
                <p>Humidty ${day.main.humidity}%</p>
            </div>`
        }
    });

    $("#5Day").append(html);
    
};

showButtons = () => {
    $(".list-group").empty();

    let html = ""

    searchedLocations.forEach(city => {
        html += `<button class="weather-btn" data-name="${city}">${city}</button>`
    });

    $(".list-group").append(html);
};

showCurrentCity = (city, uv) => {
    $("#current-forecast").empty();

    let currentWeatherIcon = `https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`;
    let html = `<div class="card-body">
            <h5 class="card-title justify-content:center city"><p>${city.name} <img src="${currentWeatherIcon}"/></p></h5>
            <div class="time"><strong>It is currently ${getCurrentTime(city)}</strong></div>
            <div class="temp"><p>Temperature: ${getFTemp(city.main.temp)}</div>
            <div class="wind"><p>The wind speed is ${city.wind.speed} Mph</p></div>
            <div class="humidity"><p>The humidity is ${city.main.humidity + String.fromCharCode(37)}</div>
            ${getUVHTML(uv.value)}
        </div>`;
    
    $("#current-forecast").append(html);

    storeCity(city.name);
};

storeCity = (city) => {
    if (!searchedLocations.includes(city)) {
        searchedLocations.push(city);
        localStorage.setItem("Locations", JSON.stringify(searchedLocations));
    }
    showButtons();
};

loadcity(); 