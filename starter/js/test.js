var lat = 37.7749;
var lon = -122.4194;
var API_KEY = "0e9d4141368e13110e68dda0d815ef90";

city =encodeURIComponent('Milton Keynes')
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
$.ajax({
  url: `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`,
  type: "GET",
  dataType: "json",
  success:dataHandler,
  error: errorHandler
});
// current weather 
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// icon - https://openweathermap.org/img/w/03n.png


function dataHandler(data){      
        console.log($(data)[0].lat);
    
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${$(data)[0].lat}&lon=${$(data)[0].lon}&appid=${API_KEY}`,
            type: "GET",
            dataType: "json",
            success: objectHandler
        });
}

function errorHandler(error) {
    console.error(error);
  }

function objectHandler(params) {
    console.log(params)
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/forecast?id=${params.id}&appid=${API_KEY}`,
        type: "GET",
        dataType: "json",
        success: function(data) {
          console.log("objectHandle: ",data);
        },
        error: function(error) {
          console.error(error);
        }
      });
    
}