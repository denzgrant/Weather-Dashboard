// This is our API key. Add your own API key between the ""
const APIKey = "5b0dd2de1698f33a10aab5e7e9eef4d2";
var searchedLocations = [];

let long;
let lat;

$("#searched-locations").on("keypress", function (event) {
    if (event.key === "Enter") {
        searchedLocation = $("#searched-locations").val();

        //Clearing display when there's a new search
        function clear() {
            $(".time").empty();
            $(".city").empty();
            $(".wind").empty();
            $(".humidity").empty();
            $(".temp").empty();
            $(".uv-index").empty();
            $("#5Day").empty();
            $("#searched-locations").empty();
        }
        clear();
        displayCurrentWeather(searchedLocation);

        function displayCurrentWeather(place) {
            place = searchedLocation;
            let queryURL =
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                place +
                "&appid=" +
                APIKey;

            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function (response) {
                if ((response.cod = !"200")) {
                    return;
                }
                //Calculation for locations time and date
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

                //Arranging data
                cityNameIcon = `<p>${place} <img src="${currentWeatherIcon}"/></p>`;
                cityTime = `<strong>It is currently ${time}</strong>`;
                windStat = `<p>The wind speed is ${response.wind.speed} Mph`;
                humidityStat = `<p>The humidity is ${
                    response.main.humidity + String.fromCharCode(37)
                    }`;
                tempStat = `<p>Temperature: ${Fahrenheit}`;

                $(".city").append(cityNameIcon);
                $(".time").append(cityTime);
                $(".wind").append(windStat);
                $(".humidity").append(humidityStat);
                $(".temp").append(tempStat);

                function cityStorage(key, value) {
                    localStorage.setItem(key, value);
                }
                cityStorage("city", cityNameIcon);
                cityStorage("time", cityTime);
                cityStorage("wind", windStat);
                cityStorage("humidity", humidityStat);
                cityStorage("temp", tempStat);

                long = response.coord.lon;
                lat = response.coord.lat;

                //Call for UV index
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

                    //Setting UV Color Scheme based on index
                    if (uv < 3) {
                        $(".uv-index").css({ "background-color": "yellow", width: "30%" });
                    } else if (uv > 2 && uv < 6) {
                        $(".uv-index").css({ "background-color": "yellow", width: "30%" });
                    } else if (uv > 5 && uv < 8) {
                        $(".uv-index").css({ "background-color": "yellow", width: "30%" });
                    } else if (uv > 7 && uv < 11) {
                        $(".uv-index").css({ "background-color": "yellow", width: "30%" });
                    } else if (uv > 10) {
                        $(".uv-index").css({ "background-color": "yellow", width: "30%" });
                    }

                    locationUv = $("<strong>").text("UV Index: " + uv);
                    $(".uv-index").append(locationUv);
                });

                let queryURLFiveDays =
                    "https://api.openweathermap.org/data/2.5/forecast?q=" +
                    place +
                    "&appid=" +
                    APIKey;

                //Adding 5 Day Forcast Buttons
                $.ajax({
                    url: queryURLFiveDays,
                    method: "GET",
                }).then(function (response) {
                    let day1Date = response.list[2].dt_txt;
                    day1Date = moment(day1Date).format("MM/D/YYYY");
                    day1Temp = response.list[2].main.temp;
                    day1Humd = response.list[2].main.humidity;
                    day1Icon = response.list[6].weather[0].icon;
                    let currentWeatherIcon =
                        "http://openweathermap.org/img/wn/" + day1Icon + "@2x.png";

                    let day1TempFah = Math.round(
                        (response.list[2].main.temp - 273.15) * 1.8 + 32
                    );
                    day1TempFah = day1TempFah += String.fromCharCode(176) + "F";
                    cardHtml1 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day1Date}</h5>
                        <img src="${currentWeatherIcon}"/>
                        <p>Temp: ${day1TempFah}</p>
                        <p>Humidty ${day1Humd}%</p>
                  </div>`;
                    $("#5Day").append(cardHtml1);
                    // Day 2
                    let day2Date = response.list[10].dt_txt;
                    day2Date = moment(day2Date).format("MM/D/YYYY");
                    day2Temp = response.list[10].main.temp;
                    day2Humd = response.list[10].main.humidity;
                    day2Icon = response.list[14].weather[0].icon;
                    let currentWeatherIcon2 =
                        "http://openweathermap.org/img/wn/" + day2Icon + "@2x.png";

                    let day2TempFah = Math.round(
                        (response.list[10].main.temp - 273) * 1.8 + 32
                    );
                    day2TempFah = day2TempFah += String.fromCharCode(176) + "F";
                    cardHtml2 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day2Date}</h5>
                        <img src="${currentWeatherIcon2}"/>
                        <p>Temp: ${day2TempFah}</p>
                        <p>Humidty ${day2Humd}%</p>
                  </div>`;
                    $("#5Day").append(cardHtml2);
                    //Day 3
                    let day3Date = response.list[18].dt_txt;
                    day3Date = moment(day3Date).format("MM/D/YYYY");
                    day3Temp = response.list[18].main.temp;
                    day3Humd = response.list[18].main.humidity;
                    day3Icon = response.list[22].weather[0].icon;
                    let currentWeatherIcon3 =
                        "http://openweathermap.org/img/wn/" + day3Icon + "@2x.png";

                    let day3TempFah = Math.round(
                        (response.list[18].main.temp - 273) * 1.8 + 32
                    );
                    day3TempFah = day3TempFah += String.fromCharCode(176) + "F";
                    cardHtml3 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day3Date}</h5>
                        <img src="${currentWeatherIcon3}"/>
                        <p>Temp: ${day3TempFah}</p>
                        <p>Humidty ${day3Humd}%</p>
                  </div>`;
                    $("#5Day").append(cardHtml3);

                    //Day 4
                    let day4Date = response.list[26].dt_txt;
                    day4Date = moment(day4Date).format("MM/D/YYYY");
                    day4Temp = response.list[26].main.temp;
                    day4Humd = response.list[26].main.humidity;
                    day4Icon = response.list[30].weather[0].icon;
                    let currentWeatherIcon4 =
                        "http://openweathermap.org/img/wn/" + day4Icon + "@2x.png";

                    let day4TempFah = Math.round(
                        (response.list[26].main.temp - 273) * 1.8 + 32
                    );
                    day4TempFah = day4TempFah += String.fromCharCode(176) + "F";
                    cardHtml4 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day4Date}</h5>
                        <img src="${currentWeatherIcon4}"/>
                        <p>Temp: ${day4TempFah}</p>
                        <p>Humidty ${day4Humd}%</p>
                  </div>`;

                    $("#5Day").append(cardHtml4);
                    //Day 5
                    let day5Date = response.list[34].dt_txt;
                    day5Date = moment(day5Date).format("MM/D/YYYY");
                    day5Temp = response.list[34].main.temp;
                    day5Humd = response.list[34].main.humidity;
                    day5Icon = response.list[38].weather[0].icon;
                    let currentWeatherIcon5 =
                        "http://openweathermap.org/img/wn/" + day5Icon + "@2x.png";

                    let day5TempFah = Math.round(
                        (response.list[34].main.temp - 273) * 1.8 + 32
                    );
                    day5TempFah = day5TempFah += String.fromCharCode(176) + "F";
                    cardHtml5 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day5Date}</h5>
                        <img src="${currentWeatherIcon5}"/>
                        <p>Temp: ${day5TempFah}</p>
                        <p>Humidty ${day5Humd}%</p>
                  </div>`;
                    $("#5Day").append(cardHtml5);
                });

                //Creating Buttons from Searched Locations
                function previousSearched() {
                    $(".list-group").empty();

                    for (let i = 0; i < searchedLocations.length; i++) {
                        var a = $("<button>");
                        a.addClass("weather-btn");
                        a.attr("data-name", searchedLocations[i]);
                        a.text(searchedLocations[i]);
                        $(".list-group").append(a);
                        a.on("click", function () {
                            displayCurrentWeather(searchedLocations);
                        });
                    }
                }
                var weatherBtn = $("#searched-locations").val();
                searchedLocations.push(weatherBtn);
                previousSearched();
            });
        }
    }
});
