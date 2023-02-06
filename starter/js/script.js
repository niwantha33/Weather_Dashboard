$(document).ready(function () {

    function historyCities(param) {

    };

    function todayWeatherDataToCard(obj) {

    };

    /*
    <div class="card text-white bg-dark mb-3" style="max-width: 10rem;">
        <div class="card-header">Header
        
        </div>

            <div class="card-body">
              
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
    </div>

    */


    function forecastWeatherDataToCards(obj) {

        $("<div style='max-width: 10rem;'/>", {
            class: "card text-white bg-dark mb-3",
           
            text: `${time_[i]}`

        }).appendTo(row);

    };

})