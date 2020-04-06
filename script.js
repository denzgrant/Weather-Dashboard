 // This is our API key. Add your own API key between the ""
 const APIKey = "5b0dd2de1698f33a10aab5e7e9eef4d2";
 const place = "Minneapolis, MN, US"

 let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&appid=" + APIKey;

      // We then created an AJAX call
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {

        // Create CODE HERE to Log the queryURL
       
        // Create CODE HERE to log the resulting object
        console.log(response);


        //For converting timezones ----> https://www.youtube.com/watch?v=UT2dP447roo
        let time = (response.timezone)/3600;
        let Fahrenheit = Math.round((response.main.temp - 273) * 1.8 + 32);
        Fahrenheit = Fahrenheit += String.fromCharCode(176) + "F";
        console.log(Fahrenheit)
      


        cityTime = $("<strong>").text("And the time is " + time);
        cityName = $("<p>").text("It's Always Sunny In " + place);
        windStat = $("<p>").text("The wind speed is " + response.wind.speed + " " + "Mph");
        humidityStat = $("<p>").text("The humidity is " + response.main.humidity + String.fromCharCode(37));
        tempStat = $("<p>").text("Temperature: " + Fahrenheit);

        $(".time").append(cityTime); 
        $(".city").append(cityName); 
        $(".wind").append(windStat);
        $(".humidity").append(humidityStat);
        $(".temp").append(tempStat); 

      });

 let queryURLFiveDays = "https://api.openweathermap.org/data/2.5/forecast?q=" + place + "&appid=" + APIKey;

 // We then created an AJAX call
 $.ajax({
   url: queryURLFiveDays,
   method: "GET"
 }).then(function(response) {

   // Create CODE HERE to Log the queryURL
   // Create CODE HERE to log the resulting object
   console.log(response);
   // Create CODE HERE to calculate the temperature (converted from Kelvin)
//    console.log(response.main.temp)
//    var Fahrenheit = (response.main.temp - 273.15) * 1.80 + 32;
//    console.log(Fahrenheit)
//    // Create CODE HERE to transfer content to HTML

//    // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
//    // Create CODE HERE to dump the temperature content into HTML
//    cityName = $("<p>").text("It's Always Sunny In " + place);
// //    windStat = $("<p>").text("The wind speed is " + response.wind.speed);
// // //    humidityStat = $("<p>").text("The humidity is " + response.main.humidity);
// //    tempStat = $("<p>").text("The temperature in Fahrenheit is " + Fahrenheit);

//    $(".city").append(cityName); 
// //    $(".wind").append(windStat);
// //    $(".humidity").append(humidityStat);
// //    $(".temp").append(tempStat); 

 });