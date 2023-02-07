$(document).ready(function () {
    // openWeather API KEY
    const API_KEY = "0e9d4141368e13110e68dda0d815ef90";

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

    function retrieveAndSaveToLocalStorage(obj) {

        // debugger;
        try {

            let tmp = new Array(); // create tmp array to store data 

            if (localStorage.hasOwnProperty("history")) { // check if key: schedule exist

                let rtv = localStorage.getItem("history"); // retrieve data from local store         

                let parse_rtv = JSON.parse(rtv); // convert from JSON to object 

                parse_rtv.forEach(element => {
                    tmp.push(element); // append to tmp array     
                });

            };
            //  then push new object 
            tmp.push(obj); // append to tmp array 

            saveToLocalStorage(tmp); // save tmp object  

        } catch (e) {
            throw e;
        }
    }


    function historyCitiesButtons(obj, historyElement) {

        console.log(obj, historyElement)
        obj.forEach(element => {
            $('<button />', {
                type: "submit",
                class: "btn  btn-secondary mt-2 btn-block",
                id: `search-button-${element}`,
                'aria-label': "submit search",
                text: element
            }).appendTo(historyElement);
            
        });
        
    };

    /*


    */

    function todayWeatherDataToCard(obj, todayElement) {
        console.log("today:", obj, todayElement)

        let card = $("<div style='border:2px solid black;'/>", {

        });

        card.addClass('card mb-3 w-100');

        let card_body = $('<div/>', {
            class: "card-body",
        }).appendTo(card);

        $('<h5/>', {
            class: 'card-title',
            html: `${obj.city} (${obj.date})<img src="https://openweathermap.org/img/w/${obj.icon}.png">`
        }).appendTo(card_body);

        arr = [`Temp: ${obj.temp} ℃`, `Wind: ${obj.wind} KPH`, `Humidity: ${obj.wind} %`]

        arr.forEach(element => {
            console.log(element)
            $("<p/>", {
                class: "card text",
                text: element,
                style: 'border:none;'

            }).appendTo(card_body);
        });
        // console.log(card)
        todayElement.append(card)

    };



    /*

    @param: obj-> weather data Object and htmlElement


    */

    function forecastWeatherDataToCards(obj, forecastElement) {

        let div = $("<div style='max-width: 10rem; max-height: auto;'/>", {
            class: "card text-white bg-dark mb-3"
        });

        let header = $('<div/>', {
            class: "card-header mb-auto",

        }).appendTo(div);

        $('<h5/>', {
            text: "date"
        }).appendTo(header);

        let body = $('<div/>', {
            class: "card-body mb-auto",
        }).appendTo(div);

        $("<p style='font-size: 2.5rem;'/>", {
            class: "card text",
            html: `<i class="fa ${icon}"></i>`
        }).appendTo(body);

        let arr = new Array();

        arr = [`Temp: ${obj.temp} ℃`, `Wind: ${obj.wind} KPH`, `Humidity: ${obj.wind} %`]

        arr.forEach(element => {
            $("<p/>", {
                class: "card text",
                text: element

            }).appendTo(body);
        });

        forecastElement.appendTo(div)

    }

    function errorHandler(error) {
        console.error(error);
    }

    function openWeatherHandler(city) {
        let cityEncode = encodeURIComponent(city.toLowerCase()) // encode the string 
        console.log(cityEncode)
        $.ajax({
            url: `http://api.openweathermap.org/geo/1.0/direct?q=${cityEncode}&appid=${API_KEY}`,
            type: "GET",
            dataType: "json",
            success: latLonCityHandler, // pass city lat and lon data 
            error: errorHandler
        });
    }

    function latLonCityHandler(data, testStatus, statusData) {
        console.log(testStatus)

        if ($(data).length > 0 && statusData.status === 200 && testStatus === 'success') {

            // add the city to history 
            retrieveAndSaveToLocalStorage(data[0].name)

            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?lat=${$(data)[0].lat}&lon=${$(data)[0].lon}&appid=${API_KEY}`,
                type: "GET",
                dataType: "json",
                success: forecastHandler,
                error: errorHandler
            });

        }

    }



    function forecastHandler(params) {

        // get the current weather 

        let todayElement = $('#today')

        console.log(todayElement.children().length)

        if (todayElement.children().length > 0) {


            todayElement.empty();
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

        todayWeatherDataToCard(obj, todayElement)

        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/forecast?id=${params.id}&appid=${API_KEY}`,
            type: "GET",
            dataType: "json",
            success: forecastWeatherDataHandler,
            error: errorHandler
        });
    }

    function forecastWeatherDataHandler(data) {
        console.log("objectHandle: ", data.list);
        let weatherList = data.list
        weatherList.forEach(element => {
            obj = {
                icon: element.weather[0].icon, // weather icon 
                //0K − 273.15  kelvin to Cent & fixed to 2 decimals 
                temp: ((Number(element.main.temp) - 273.15)).toFixed(2),
                humidity: element.main.humidity,
                wind: element.wind.speed
            }
            console.log(obj)

        })
    }

    let historyCity = checkDataPersist()
    if (historyCity !== null) {
        let historyDivElement = $("#history")
        historyCitiesButtons(historyCity,historyDivElement)

    }


    // get the search city data and pass to openweather API 
    $('#search-form').submit(function (e) {
        e.preventDefault();
        let city = $("#search-input").val().trim();
        openWeatherHandler(city);
    });

    $("button[id='history-button'").click(function (e) {
        e.preventDefault();
        let historyCity = ($(this).text().trim())
        openWeatherHandler(historyCity);


    })

})