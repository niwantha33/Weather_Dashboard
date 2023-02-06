$(document).ready(function () {

    function historyCities(param) {

    };

    function todayWeatherDataToCard(obj) {

    };

    

    /*

    @param: obj-> weather data Object and htmlElement


    */

    function forecastWeatherDataToCards(obj, htmlElement) {

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

    }
})