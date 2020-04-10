// This is our API key. Add your own API key between the ""
const APIKey = "5b0dd2de1698f33a10aab5e7e9eef4d2";
var searchedLocations = [];
let searchedLocation;

let long;
let lat;

$("#searched-locations").on("keypress", function (event) {
    if (event.key === 'Enter') {
        searchedLocation = $("#searched-locations").val()
        searchedLocations.push(searchedLocation);
        
        $(".time").empty();
        $(".city").empty();
        $(".wind").empty();
        $(".humidity").empty();
        $(".temp").empty();
        $(".uv-index").empty();

        const place = searchedLocation

        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&appid=" + APIKey;
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //Calculation for locations time and date 
            console.log(response);
            let time = (response.timezone) / 3600;
            let d = new Date();
            let utc_offset = d.getTimezoneOffset();
            d.setMinutes(d.getMinutes() + utc_offset);
            let locationTime = time * 60;
            d.setMinutes(d.getMinutes() + locationTime);
            time = d;
            time = moment(time).format("dddd, MMMM Do YYYY, h:mm a");

            // weather icon 
            currentIcon = response.weather[0].icon;
            let currentWeatherIcon = "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png"

            //Calculation for location's weather
            let Fahrenheit = Math.round((response.main.temp - 273) * 1.8 + 32);
            Fahrenheit = Fahrenheit += String.fromCharCode(176) + "F";

    
            cityNameIcon = `<p>${place}</p><img src="${currentWeatherIcon}"/>`
            cityTime = $("<strong>").text("It is currently " + time);
            windStat = $("<p>").text("The wind speed is " + response.wind.speed + " " + "Mph");
            humidityStat = $("<p>").text("The humidity is " + response.main.humidity + String.fromCharCode(37));
            tempStat = $("<p>").text("Temperature: " + Fahrenheit);

            
            // $(".city").append(cityNameIcon);
            $(".time").append(cityTime);
            $(".wind").append(windStat);
            $(".humidity").append(humidityStat);
            $(".temp").append(tempStat);

            long = response.coord.lon;
            lat = response.coord.lat;

            //Call for UV index 
            let uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + long;
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (uvResponse) {
                console.log(uvResponse);

                let uv = uvResponse.value;

                //Setting UV Color Scheme 
                if (uv < 3) {
                    $(".uv-index").css({ "background-color": "yellow", "width": "20%" });
                } else if (uv > 2 && uv < 6) {
                    $(".uv-index").css({ "background-color": "yellow", "width": "20%" });
                } else if (uv > 5 && uv < 8) {
                    $(".uv-index").css({ "background-color": "yellow", "width": "20%" });
                } else if (uv > 7 && uv < 11) {
                    $(".uv-index").css({ "background-color": "yellow", "width": "20%" });
                } else if (uv > 10) {
                    $(".uv-index").css({ "background-color": "yellow", "width": "20%" });
                }

                locationUv = $("<strong>").text("UV Index: " + uv);
                $(".uv-index").append(locationUv);
            });

            let queryURLFiveDays = "https://api.openweathermap.org/data/2.5/forecast?q=" + place + "&appid=" + APIKey;


            //Adding 5 Day Forcast Buttons 
            $.ajax({
                url: queryURLFiveDays,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                let day1Date = response.list[5].dt_txt
                day1Date = moment(day1Date).format("MM/D/YYYY")
                day1Temp = response.list[5].main.temp
                day1Humd = response.list[5].main.humidity
                day1Icon = response.list[5].weather[0].icon
                let currentWeatherIcon = "http://openweathermap.org/img/wn/" + day1Icon + "@2x.png"

                let day1TempFah = Math.round((response.list[5].main.temp - 273.15) * 1.8 + 32);
                day1TempFah = day1TempFah += String.fromCharCode(176) + "F";
                cardHtml1 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day1Date}</h5>
                        <img src="${currentWeatherIcon}"/>
                        <p>Temp: ${day1TempFah}</p>
                        <p>Humidty ${day1Humd}%</p>
                  </div>`
                $('#5Day').append(cardHtml1);
                //day 2 
                let day2Date = response.list[6].dt_txt
                day2Date = moment(day2Date).format("MM/D/YYYY")
                day2Temp = response.list[6].main.temp
                day2Humd = response.list[6].main.humidity
                day2Icon = response.list[6].weather[0].icon
                let currentWeatherIcon2 = "http://openweathermap.org/img/wn/" + day2Icon + "@2x.png"

                let day2TempFah = Math.round((response.list[6].main.temp - 273) * 1.8 + 32);
                day2TempFah = day2TempFah += String.fromCharCode(176) + "F";
                cardHtml2 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day2Date}</h5>
                        <img src="${currentWeatherIcon2}"/>
                        <p>Temp: ${day2TempFah}</p>
                        <p>Humidty ${day2Humd}%</p>
                  </div>`
                $('#5Day').append(cardHtml2);
                //Day 3 
                let day3Date = response.list[21].dt_txt
                day3Date = moment(day3Date).format("MM/D/YYYY")
                day3Temp = response.list[21].main.temp
                day3Humd = response.list[21].main.humidity
                day3Icon = response.list[21].weather[0].icon
                let currentWeatherIcon3 = "http://openweathermap.org/img/wn/" + day3Icon + "@2x.png"

                let day3TempFah = Math.round((response.list[21].main.temp - 273) * 1.8 + 32);
                day3TempFah = day3TempFah += String.fromCharCode(176) + "F";
                cardHtml3 = `<div style="width: 125px; background-color: #aacee0; text-align: center; padding: 1em; border-radius: 20px; margin: 10px;">
                        <h5>${day3Date}</h5>
                        <img src="${currentWeatherIcon3}"/>
                        <p>Temp: ${day3TempFah}</p>
                        <p>Humidty ${day3Humd}%</p>
                  </div>`
                $('#5Day').append(cardHtml3);
                
            });



            function previousSearched() {
                $(".list-group").empty();

                for (let i = 0; i < searchedLocations.length; i++) {
                    var a = $("<button>");
                    // Adding a class of movie-btn to our button
                    a.addClass("Prev Searched Button");
                    // Adding a data-attribute
                    a.attr("data-name", searchedLocations[i]);
                    // Providing the initial button text
                    a.text(searchedLocations[i]);
                    // Adding the button to the buttons-view div
                    $(".list-group").append(a);
                }
            }
            previousSearched();
        })
    }
});

