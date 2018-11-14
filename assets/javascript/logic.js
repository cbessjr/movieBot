$(document).ready(function () {

    function appendMovie(response) {
        $(".display").empty();
        var movieTitle = $("<p>").text(response.Title);
        var movieRated = $("<p>").text(response.Rated);
        var movieActors = $("<p>").text(response.Actors);
        var movieGenre = $("<p>").text(response.Genre);
        var moviePlot = $("<p>").text(response.Plot);
        var movieCritic = $("<p>").text(response.Ratings[2].Source);
        var movieCriticRating = $("<p>").text(response.Ratings[2].Value);
        var moviePosterUrl = response.Poster;
        // console.log(movieTitle, movieRated, movieActors, movieCritic, movieCriticRating, moviePlot, moviePosterUrl, movieGenre);
        $("#movie-title").append(movieTitle);
        $("#movie-rated").append(movieRated);
        $("#movie-actors").append(movieActors);
        $("#movie-genre").append(movieGenre);
        $("#movie-plot").append(moviePlot);
        $("#movie-critic").append(movieCritic);
        $("#movie-rating").append(movieCriticRating);
        $("#movie-poster").attr("src", moviePosterUrl);
    };

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
            appendMovie(response);

        }).fail(function (err) {
            throw err;
        });

    });
});