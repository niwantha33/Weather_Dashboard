$(document).ready(function () {

    function historyCities(obj, historyElement) {

        $('<button />', {
            type: "submit",
            class: "btn  btn-secondary mt-2 btn-block",
            id: `search-button-${obj.location}`,
            'aria-label': "submit search",
            text: obj.location
        }).appendTo(historyElement);
    };

    /*


    */

    function todayWeatherDataToCard(obj, todayElement) {

        let card = $("<div style='max-width: 10rem; max-height: auto;'/>", {
            class: "card mb-3 w-100"
        });

        let card_body = $('<div/>', {
            class: "card-body",
        }).appendTo(card);

        $('<h5/>', {
            class: 'card-title',
            html: `${obj.city} (${obj.date})<i class="fa ${obj.icon}"></i>`
        }).appendTo(card_body);

        arr = [`Temp: ${obj.temp} ℃`, `Wind: ${obj.wind} KPH`, `Humidity: ${obj.wind} %`]

        arr.forEach(element => {
            $("<p/>", {
                class: "card text",
                text: element

            }).appendTo(card_body);
        });

        todayElement.appendTo(card)

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

    $('#search-form').submit(function (e) {
        e.preventDefault();

        let v = $("#search-input").val()

        console.log(v)


    });
    r = [1, 2, 3, 4, 5, 6]
    $("button[id='history-button'").click(function (e) {
        e.preventDefault();
        console.log($(this).text().trim())
        console.log($(r))
        console.log(r)

    })

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent("london")}&appid=0e9d4141368e13110e68dda0d815ef90`
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Language': 'en-uk'            
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response Error")
            }
        })
        .then(data => {
            handleResponse(data);
        })
        .catch(error => {
            console.log("Error:", error);
        })

    function handleResponse(data) {
        console.log("data:", data)
    }
})