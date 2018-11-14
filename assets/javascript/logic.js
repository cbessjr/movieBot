$(document).ready(function () {
    $("#add-movie").on("click", function (event) {

        event.preventDefault();

        var searchInput = $("#movie-input").val().trim();
        //var typeInput = $("#example-input-field").val().trim();

        var url = "http://www.omdbapi.com/";
        url += '?' + $.param({
            //"i": "tt3896198",
            "t": searchInput, //user input search by movie name
            //"type": typeInput, //search by movie, tv show
            "plot": "short", //returns shortened plot
            "apikey": "adaf8b76" //api-key
        });

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (response) {
            console.log(response);
        }).fail(function (err) {
            throw err;
        });

    });
});