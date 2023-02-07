//  in order to display particular city's current and forecast weather data  
$(document).ready(function () {
    

    //  find and return user inputs 
    let checkDataPersist = function () {

        try {
            if (localStorage.hasOwnProperty("history")) {

                let rtv = localStorage.getItem("history"); // retrieve data from local store 

                return JSON.parse(rtv);// convert from JSON to object 

            }
            return null;

        } catch (e) {

            throw e;
        }

    }


    let saveToLocalStorage = function (newArray) {
        // debugger;

        try {
            localStorage.setItem("history", JSON.stringify(newArray));

        } catch (e) {
            throw e;
        }

    }
    // retrieved data from localStorage and save to history 
    function retrieveAndSaveToLocalStorage(obj) {

        // debugger;
        try {

            let tmp = new Array(); // create tmp array to store data 

            if (localStorage.hasOwnProperty("history")) { // check if key: schedule exist

                let rtv = localStorage.getItem("history"); // retrieve data from local store         

                let parse_rtv = JSON.parse(rtv); // convert from JSON to object 

                parse_rtv.forEach(element => {
                    // only new city will store 
                    if (obj !== element) {
                        tmp.push(element); // append to tmp array 
                    }

                });

            };
            //  then push new object 
            tmp.push(obj); // append to tmp array 

            saveToLocalStorage(tmp); // save tmp object  

        } catch (e) {
            throw e;
        }
    }

    // in order to create history button using localStorage 
    function historyCitiesButtons(obj, historyElement) {

        if (historyElement.children().length > 0) {
            historyElement.empty();
        }

        obj.forEach(element => {
            $('<button />', {
                type: "submit",
                class: "btn  btn-secondary mt-2 btn-block text-center",
                id: `history-button`,
                'aria-label': "submit search",
                text: element
            }).appendTo(historyElement);

        });

    };

    /*
    @brief:     In order to display weather data as a dynamic page.
                The function takes two arguments: obj and todayElement. In order to create weather
                card using the jQuery library and Bootstrap. It generates a div element with a border, which is then given a class of 'card mb-3 w-100'. 
                
                Then, another div element with  class of 'card-body'. 
                Then h5 element with a class of 'card-title' and displays the city name, date, and weather icon. 
                
                After that, weather data append to arr, property (temperature, wind, and humidity). 
                
                Finally, it loops through the array and generates a p element for each element in the array.

    @params:    obj- Weather parameters and todayElement - the html element 
    @return:    N/A


    */

    function todayWeatherDataToCard(obj, todayElement) {


        let card = $("<div style='border:2px solid black;'/>", {

        });

        card.addClass('card mb-3 w-100');

        let card_body = $('<div/>', {
            class: "card-body",
        }).appendTo(card);

        $('<h5/>', {
            class: 'card-title',
            // obj.icon extract from openweather 
            html: `${obj.city} (${obj.date})<img src="https://openweathermap.org/img/w/${obj.icon}.png">`
        }).appendTo(card_body);

        arr = [`Temp: ${obj.temp} ℃`, `Wind: ${obj.wind} KPH`, `Humidity: ${obj.wind} %`]

        arr.forEach(element => {

            $("<p/>", {
                class: "card-text ",
                text: element,
                style: 'border:none;'

            }).appendTo(card_body);
        });

        todayElement.append(card) // card element append to the #today id

    };



    /*
    @brief:     In order to display 5 days weather forecast. 
                The function takes two arguments: obj and forecastElement. 
                
                The function creates a weather card using the jQuery library and Bootstrap classes.
                
                It generates a div element with class of 'card text-white bg-dark pb-3'.
                
                The div element is then appended to the forecastElement. Next, it creates another div element inside the first div, which has a class of 'card-header mb-auto' and displays the date. 
                
                Then, it creates another div element with a class of 'card-body' and appends it to the first div. Then, it generates a p element with a class of 'card text' and displays the weather icon. 
                
                After that, arr  property (temperature, wind, and humidity) will loop and append to  p element to display in a card. 

    @param: {obj-> weather data Object and htmlElement}

    @return: N/A

    */

    function forecastWeatherDataToCards(obj, forecastElement) {
     
        let divElement = $("<div>")
        divElement.addClass("card text-white bg-dark pb-3")
        
        divElement.css('width', '12rem'); // style="width: 18rem;"

        forecastElement.append(divElement)

        $('<div/>', {
            class: "card-header mb-auto",
            text: obj.date

        }).appendTo(divElement);

        let bodyElementCard = $('<div/>', {
            class: "card-body",

        }).appendTo(divElement);

        $("<p/>", {
            class: "card-text ",
            style: 'font-size: 1.2rem;',
            html: `<img src="https://openweathermap.org/img/w/${obj.icon}.png">`
        }).appendTo(bodyElementCard);

        let arr = new Array();

        arr = [`Temp: ${obj.temp} ℃`, `Wind: ${obj.wind} KPH`, `Humidity: ${obj.wind} %`]

        arr.forEach(element => {
            $("<p/>", {
                class: "card-text pr-3",
                text: element
            }).appendTo(bodyElementCard);
        });

    }


    // error handler function for api, if any error,
    function errorHandler(error) {
        throw error;
    }

    /*

    @brief:     This function will call openweather API in order to find respective lat and lon of the user input.
    
                Takes a city name as its argument. Then, $.ajax() method to make a GET request to the OpenWeatherMap API with the passed city name. 
                
                The city name is first encoded using the encodeURIComponent() function to make sure user input as per the URL format.
                
                The $.ajax() success callback is latLonCityHandler which takes the city latitude and longitude data. 
                
                The error callback is errorHandler. If the API call is successful, the latLonCityHandler function is called with the city latitude and longitude data,
                to pass next function. 

    */

    function openWeatherHandler(city) {
        let cityEncode = encodeURIComponent(city.toLowerCase()) // encode the string 

        $.ajax({
            url: `https://api.openweathermap.org/geo/1.0/direct?q=${cityEncode}&appid=${window.API_KEY}`,
            type: "GET",
            dataType: "json",
            success: latLonCityHandler, // pass city lat and lon data 
            error: errorHandler
        });
    }

    // to get weather data using at and lon
    function latLonCityHandler(data, testStatus, statusData) {


        if ($(data).length > 0 && statusData.status === 200 && testStatus === 'success') {

            // add the city to history - localStorage 
            retrieveAndSaveToLocalStorage(data[0].name)
            displayHistoryCities()

            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?lat=${$(data)[0].lat}&lon=${$(data)[0].lon}&appid=${window.API_KEY}`,
                type: "GET",
                dataType: "json",
                success: forecastHandler,
                error: errorHandler
            });

        }

    }


    // success of lat & lon 
    function forecastHandler(params) {

        // get the current weather 
        let todayElement = $('#today') // display weather data 

        if (todayElement.children().length > 0) {

            todayElement.empty(); // remove previous elements
        }

        obj = {
            icon: params.weather[0].icon, // weather icon 
            //0K − 273.15  kelvin to Cent & fixed to 2 decimals 
            temp: ((Number(params.main.temp) - 273.15)).toFixed(2),
            humidity: params.main.humidity,
            wind: params.wind.speed,
            date: luxon.DateTime.now().toFormat('dd-MMMM-yyyy'),
            city: params.name
        }

        todayWeatherDataToCard(obj, todayElement) // display current weather data 
        // get 5 days weather data 
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?id=${params.id}&appid=${window.API_KEY}`,
            type: "GET",
            dataType: "json",
            success: forecastWeatherDataHandler,
            error: errorHandler
        });
    }

    function forecastWeatherDataHandler(data) {
        // console.log("objectHandle: ", data.list);
        let weatherList = data.list
        let forecastElement = $("#forecast")
        if (forecastElement.children().length > 0) {
            forecastElement.empty();
        }
        weatherList.forEach(element => {

            let filterForecastHour = -1

            let currentHour = Number(luxon.DateTime.now().toFormat('HH'))
            
            let selectForecastHour = Number(((element.dt_txt).split(' '))[1].split(":")[0])
            // openweather API provides data with 3 hours gap, in order to select most suitable 
            // hour to display in each card. 
            // example: if I entered a city, all the forecast will show according to the current time etc..
            switch (selectForecastHour) {

                case 0:
                    if (currentHour >= 0 && currentHour < 3) {
                        filterForecastHour = 0
                    }
                    break;
                case 3:
                    if (currentHour >= 3 && currentHour < 6) {
                        filterForecastHour = 3
                    }
                    break;
                case 6:
                    if (currentHour >= 6 && currentHour < 9) {
                        filterForecastHour = 6
                    }
                    break;
                case 9:
                    if (currentHour >= 9 && currentHour < 12) {
                        filterForecastHour = 9
                    }
                    break;
                case 12:
                    if (currentHour >= 12 && currentHour < 15) {
                        filterForecastHour = 12
                    }
                    break;
                case 15:
                    if (currentHour >= 15 && currentHour < 18) {
                        filterForecastHour = 15
                    }
                    break;
                case 18:
                    if (currentHour >= 18 && currentHour < 21) {
                        filterForecastHour = 18
                    }
                    break;
                case 21:
                    if (currentHour >= 21 && currentHour < 0) {
                        filterForecastHour = 21
                    }
                    break;
                default:
                    filterForecastHour = 0
                    break;

            }

            if (selectForecastHour === filterForecastHour) {
                obj = {
                    icon: element.weather[0].icon, // weather icon 
                    //0K − 273.15  kelvin to Cent & fixed to 2 decimals 
                    temp: ((Number(element.main.temp) - 273.15)).toFixed(2),
                    humidity: element.main.humidity,
                    wind: element.wind.speed,
                    date: ((element.dt_txt).split(' '))[0]
                }
                
                forecastWeatherDataToCards(obj, forecastElement)

            }


        

        })
    }
    // get localStorage data and pass to the function to creates history button 
    function displayHistoryCities() {
        let historyCity = checkDataPersist() // get old data from localStorage 
        if (historyCity !== null) {
            let historyDivElement = $("#history")
            // creates buttons
            historyCitiesButtons(historyCity, historyDivElement)

        }

    }


    displayHistoryCities() // at initial stage display history buttons. 

    // get the search city data and pass to openweather API 
    $('#search-form').submit(function (e) {
        e.preventDefault();
        let city = $("#search-input").val().trim();


        openWeatherHandler(city);
        $("#search-input").val('');

    });

    $("#history").on('click', "button[id='history-button']", function (e) {

        e.preventDefault();
       
        let historyCity = ($(this).text().trim()) // get the clicked button city name. 
        
        openWeatherHandler(historyCity);

    })

})